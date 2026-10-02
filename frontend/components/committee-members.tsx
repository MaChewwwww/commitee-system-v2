import { useState } from "react"
import { Check, Loader2, Plus, RotateCcw, Save, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { can, remove, save } from "@/lib/api"
import { useAction, useResource } from "@/lib/hooks"
import type { Assignment } from "@/lib/types"
import {
  ConfirmDialog,
  ErrorNotice,
  Field,
  QueryState,
  SelectBox,
  options,
  useNotice,
} from "./shared"

const roles = options(["Member", "Chairperson", "Vice Chairperson", "Secretary", "Treasurer"])

export function CommitteeMembers({ committeeId }: { committeeId: string }) {
  const assignments = useResource("assignments")
  const members = useResource("members")
  const [member, setMember] = useState("")
  const [role, setRole] = useState("Member")
  const [draftRoles, setDraftRoles] = useState<Record<string, string>>({})
  const [deleting, setDeleting] = useState<Assignment>()
  const notice = useNotice()
  const action = useAction(
    (payload: { method: "POST" | "PUT" | "DELETE"; body: Assignment | object }) =>
      payload.method === "DELETE"
        ? remove("assignments", (payload.body as Assignment).id)
        : save("assignments", payload.body, payload.method === "PUT"),
    ["assignments"],
  )
  const current = (assignments.data || []).filter((a) => a.committee_id === committeeId)
  const available = (members.data || []).filter((m) => !current.some((a) => a.member_id === m.id))
  const config = window.APP_CONFIG
  async function mutate(method: "POST" | "PUT" | "DELETE", body: object) {
    try {
      const result = await action.run({ method, body })
      if (!result) return
      notice(result.message || "Committee membership saved.")
      if (method === "PUT" || method === "DELETE") {
        const id = (body as { id: string }).id
        setDraftRoles((previous) => {
          const next = { ...previous }
          delete next[id]
          return next
        })
      }
      if (method === "POST") {
        setMember("")
        setRole("Member")
      }
      if (method === "DELETE") setDeleting(undefined)
    } catch {
      /* Keep draft values for a retry. */
    }
  }
  return (
    <section
      className="tw:col-span-full tw:border-t tw:pt-5 tw:space-y-4"
      aria-label="Committee members"
    >
      <div>
        <div className="tw:flex tw:items-center tw:gap-2">
          <Users size={18} />
          <h3 className="tw:font-semibold">Committee members</h3>
          <span className="tw:ml-auto tw:rounded-full tw:bg-muted tw:px-3 tw:py-1 tw:text-xs">
            {current.length} / 5 members
          </span>
        </div>
        <p className="tw:text-xs tw:text-muted-foreground">
          Membership changes save immediately, separately from committee details. Maximum five
          members.
        </p>
      </div>
      {!can(config, "assignments.view") || !can(config, "members.view") ? (
        <p>Permission to view members and assignments is required.</p>
      ) : (
        <QueryState queries={[assignments, members]}>
          {current.length === 0 && (
            <p className="tw:text-sm tw:text-muted-foreground">No members assigned yet.</p>
          )}
          {current.map((assignment) => {
            const person = members.data?.find((m) => m.id === assignment.member_id)
            const name =
              members.data?.find((m) => m.id === assignment.member_id)?.full_name ||
              "Unknown member"
            const value = draftRoles[assignment.id] ?? assignment.role
            const changed = value !== assignment.role
            const saving =
              action.isPending &&
              action.variables?.method === "PUT" &&
              (action.variables.body as { id?: string }).id === assignment.id
            return (
              <div
                key={assignment.id}
                className="tw:grid tw:items-center tw:gap-3 tw:rounded-xl tw:border tw:bg-card tw:p-4 tw:sm:grid-cols-[minmax(0,1fr)_180px_auto]"
              >
                <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-3">
                  <span className="ui-avatar" aria-hidden="true">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div className="tw:min-w-0">
                    <strong className="tw:block tw:break-words tw:text-sm">{name}</strong>
                    <span className="tw:text-xs tw:text-muted-foreground">
                      {person?.position || "Committee member"}
                    </span>
                  </div>
                </div>
                <SelectBox
                  label={`Role for ${name}`}
                  value={value}
                  items={roles}
                  disabled={!can(config, "assignments.update") || action.isPending}
                  onChange={(next) =>
                    setDraftRoles((previous) => ({ ...previous, [assignment.id]: next }))
                  }
                />
                <div className="tw:flex tw:items-center tw:justify-end tw:gap-1">
                  {can(config, "assignments.update") && changed && (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        aria-label={`Save role for ${name}`}
                        disabled={action.isPending}
                        onClick={() => void mutate("PUT", { id: assignment.id, role: value })}
                      >
                        {saving ? (
                          <Loader2 size={14} className="tw:animate-spin" />
                        ) : (
                          <Save size={14} />
                        )}
                        {saving ? "Saving" : "Save"}
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Undo role change for ${name}`}
                        disabled={action.isPending}
                        onClick={() =>
                          setDraftRoles((previous) => ({
                            ...previous,
                            [assignment.id]: assignment.role,
                          }))
                        }
                      >
                        <RotateCcw size={14} />
                      </Button>
                    </>
                  )}
                  {!changed && (
                    <span
                      className="tw:flex tw:items-center tw:gap-1 tw:px-2 tw:text-xs tw:text-muted-foreground"
                      role="status"
                    >
                      <Check size={13} /> Saved
                    </span>
                  )}
                  {can(config, "assignments.delete") && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="tw:text-destructive"
                      aria-label={`Remove ${name}`}
                      disabled={action.isPending}
                      onClick={() => {
                        action.reset()
                        setDeleting(assignment)
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
          {can(config, "assignments.create") && (
            <div className="tw:grid tw:items-end tw:gap-3 tw:rounded-xl tw:border tw:border-dashed tw:p-4 tw:sm:grid-cols-[minmax(0,1fr)_180px_auto]">
              <Field
                label="Add committee member"
                value={member}
                items={available.map((m) => ({ value: m.id, label: m.full_name }))}
                onChange={setMember}
                disabled={action.isPending || current.length >= 5}
              />
              <Field
                label="New member role"
                value={role}
                items={roles}
                onChange={setRole}
                disabled={action.isPending || current.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!member || !role || action.isPending || current.length >= 5}
                onClick={() =>
                  void mutate("POST", { committee_id: committeeId, member_id: member, role })
                }
              >
                <Plus size={14} /> Assign member
              </Button>
              {current.length >= 5 && (
                <p className="tw:col-span-full tw:text-xs">
                  This committee has reached its five-member limit.
                </p>
              )}
            </div>
          )}
          <ErrorNotice error={action.error} />
        </QueryState>
      )}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title="Remove this committee member?"
        description={`Remove ${members.data?.find((m) => m.id === deleting?.member_id)?.full_name || "this member"} from this committee? Their member record and assignments to other committees will be retained.`}
        busy={action.isPending}
        error={action.error}
        onConfirm={() => {
          if (deleting) void mutate("DELETE", { id: deleting.id })
        }}
      />
    </section>
  )
}
