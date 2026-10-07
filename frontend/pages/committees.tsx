import { useState } from "react"
import { Building2, CircleCheck, Timer, Lightbulb } from "lucide-react"
import { ManagementPage } from "@/components/management"
import { CommitteeMembers } from "@/components/committee-members"
import { StatusBadge, StatGrid, StatCard, SelectBox, options } from "@/components/shared"
import { useResource } from "@/lib/hooks"
import { dateLabel } from "@/lib/calculations"
import { can } from "@/lib/api"
import type { Committee } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
const committeeTypes = options(["Standing", "Ad Hoc", "Advisory"])

export default function Committees() {
  const committees = useResource("committees")
  const jurisdictions = useResource("jurisdictions")
  const assignments = useResource("assignments")
  const members = useResource("members")
  const [viewing, setViewing] = useState<Committee>()
  const linkedIds = new Set((jurisdictions.data || []).map((j) => j.committee_id))
  const linkedNames = (committees.data || []).filter((c) => linkedIds.has(c.id)).map((c) => c.name)
  const [committeeType, setCommitteeType] = useState("")
  return (
    <>
      <ManagementPage
        resource="committees"
        singular="Committee"
        onView={setViewing}
        dialogClassName="tw:sm:max-w-4xl"
        queries={can(window.APP_CONFIG, "jurisdictions.view") ? [jurisdictions] : []}
        editContent={(row) => (
          <>
            <section
              className="tw:col-span-full tw:rounded-lg tw:bg-muted tw:p-4 tw:space-y-2"
              aria-label="Linked jurisdiction"
            >
              <h3 className="tw:font-semibold">Jurisdiction / ordinance coverage</h3>
              {can(window.APP_CONFIG, "jurisdictions.view") ? (
                <>
                  {(jurisdictions.data || [])
                    .filter((j) => j.committee_id === row.id)
                    .map((j) => (
                      <p key={j.id} className="tw:text-sm">
                        {j.area_name} · {j.category}
                      </p>
                    ))}
                  {!linkedIds.has(row.id) && (
                    <p className="tw:text-sm">No jurisdiction linked to this committee yet.</p>
                  )}
                  <a
                    className="tw:text-sm tw:underline"
                    href={window.APP_CONFIG.navigation.find((n) => n.key === "jurisdiction")?.href}
                  >
                    Manage jurisdiction coverage
                  </a>
                </>
              ) : (
                <p className="tw:text-sm">Permission to view jurisdiction is required.</p>
              )}
            </section>
            <CommitteeMembers key={row.id} committeeId={row.id} />
          </>
        )}
        defaults={{
          name: "",
          type: "Standing",
          issued_date: "",
          issued_by: "",
          purpose: "",
          mandate: "",
          qualification_requirements: "",
        }}
        fields={(_editing, row) => [
          {
            name: "name",
            label: "Committee name",
            fullWidth: true,
            required: true,
            items: [...new Set([...linkedNames, ...(row ? [row.name] : [])])].map((name) => ({
              value: name,
              label: name,
            })),
            disabled: !can(window.APP_CONFIG, "jurisdictions.view"),
            placeholder: "Select a committee linked to Jurisdiction",
          },
          { name: "purpose", label: "Purpose", type: "textarea", fullWidth: true },
          { name: "issued_date", label: "Date issued", type: "date" },
          {
            name: "issued_by",
            label: "Issued by",
            placeholder: "Name of issuing person or authority",
          },
          { name: "mandate", label: "Mandate", type: "textarea" },
          {
            name: "qualification_requirements",
            label: "Qualification requirements",
            type: "textarea",
          },
          {
            name: "type",
            label: "Committee Type",
            required: true,
            items:
              row?.type && !committeeTypes.some((type) => type.value === row.type)
                ? [...committeeTypes, { value: row.type, label: `${row.type} (existing)` }]
                : committeeTypes,
          },
        ]}
        columns={[
          {
            accessorKey: "name",
            header: "Committee",
            cell: ({ row }) => <strong className="tw:font-semibold">{row.original.name}</strong>,
          },
          {
            id: "members",
            header: "Members",
            accessorFn: (row) =>
              can(window.APP_CONFIG, "assignments.view") && assignments.data
                ? assignments.data.filter((a) => a.committee_id === row.id).length
                : undefined,
            cell: ({ row }) =>
              !can(window.APP_CONFIG, "assignments.view") ? (
                "Restricted"
              ) : assignments.error ? (
                "Unavailable"
              ) : !assignments.data ? (
                "Loading…"
              ) : (
                <span className="tw:font-semibold">
                  {assignments.data.filter((a) => a.committee_id === row.original.id).length} / 5
                </span>
              ),
          },
          {
            accessorKey: "purpose",
            header: "Purpose",
            cell: ({ row }) => (
              <span className="tw:line-clamp-2 tw:max-w-64">
                {row.original.purpose || "No purpose defined"}
              </span>
            ),
          },
          {
            accessorKey: "type",
            header: "Committee Type",
            cell: ({ row }) => <StatusBadge value={row.original.type} />,
          },
          {
            accessorKey: "issued_date",
            header: "Date issued",
            cell: ({ row }) => dateLabel(row.original.issued_date),
          },
          {
            accessorKey: "issued_by",
            header: "Issued by",
            cell: ({ row }) => row.original.issued_by || "Not specified",
          },
        ]}
        filter={
          <SelectBox
            label="Filter committee type"
            value={committeeType}
            onChange={setCommitteeType}
            items={committeeTypes}
            placeholder="All committee types"
          />
        }
        filteredData={(rows) =>
          committeeType ? rows.filter((row) => row.type === committeeType) : rows
        }
        before={
          <StatGrid>
            {[
              {
                label: "All committees",
                value: committees.data?.length,
                icon: Building2,
                hint: "Organized around shared goals",
                tone: "blue",
              },
              {
                label: "Standing",
                value: committees.data?.filter((c) => c.type === "Standing").length,
                icon: CircleCheck,
                hint: "Ongoing committee responsibilities",
                tone: "green",
              },
              {
                label: "Ad Hoc",
                value: committees.data?.filter((c) => c.type === "Ad Hoc").length,
                icon: Timer,
                hint: "Formed for a specific purpose",
                tone: "gold",
              },
              {
                label: "Advisory",
                value: committees.data?.filter((c) => c.type === "Advisory").length,
                icon: Lightbulb,
                hint: "Providing guidance and recommendations",
                tone: "purple",
              },
            ].map((item) => (
              <StatCard
                key={item.label}
                {...item}
                value={item.value ?? "—"}
                icon={<item.icon size={16} />}
              />
            ))}
          </StatGrid>
        }
      />
      <Dialog
        open={!!viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(undefined)
        }}
      >
        <DialogContent className="ui-dialog tw:sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="tw:pr-6 tw:break-words">{viewing?.name}</DialogTitle>
            <DialogDescription>
              Committee details, linked jurisdiction, and assigned members.
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <div className="tw:space-y-5">
              <div className="tw:flex tw:gap-3 tw:items-center">
                <span className="tw:text-sm tw:text-muted-foreground">Committee Type</span>
                <StatusBadge value={viewing.type} />
              </div>
              <dl className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
                {[
                  [
                    "Date issued",
                    viewing.issued_date ? dateLabel(viewing.issued_date) : "Not specified",
                  ],
                  ["Issued by", viewing.issued_by],
                  ["Purpose", viewing.purpose],
                  ["Mandate", viewing.mandate],
                  ["Qualification requirements", viewing.qualification_requirements],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="tw:text-xs tw:text-muted-foreground">{label}</dt>
                    <dd className="tw:mt-1 tw:ml-0 tw:whitespace-pre-wrap tw:break-words tw:text-sm">
                      {value || "Not specified"}
                    </dd>
                  </div>
                ))}
              </dl>
              <section className="tw:border-t tw:pt-4 tw:space-y-2">
                <h3 className="tw:font-semibold">Jurisdiction coverage</h3>
                {!can(window.APP_CONFIG, "jurisdictions.view") ? (
                  <p>Permission required.</p>
                ) : jurisdictions.error ? (
                  <p>Coverage unavailable. Please try again.</p>
                ) : !jurisdictions.data ? (
                  <p>Loading coverage…</p>
                ) : (
                  <>
                    {jurisdictions.data
                      .filter((j) => j.committee_id === viewing.id)
                      .map((j) => (
                        <p key={j.id} className="tw:text-sm">
                          {j.area_name} · {j.category}
                        </p>
                      ))}
                    {!linkedIds.has(viewing.id) && <p>No jurisdiction linked yet.</p>}
                  </>
                )}
              </section>
              <section className="tw:border-t tw:pt-4 tw:space-y-3">
                <h3 className="tw:font-semibold">Assigned members</h3>
                {!can(window.APP_CONFIG, "assignments.view") ||
                !can(window.APP_CONFIG, "members.view") ? (
                  <p>Permission required.</p>
                ) : assignments.error || members.error ? (
                  <p>Membership unavailable. Please try again.</p>
                ) : !assignments.data || !members.data ? (
                  <p>Loading members…</p>
                ) : (
                  <>
                    {assignments.data
                      .filter((a) => a.committee_id === viewing.id)
                      .map((a) => (
                        <div
                          key={a.id}
                          className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-2 tw:rounded-lg tw:border tw:p-3"
                        >
                          <strong className="tw:text-sm">
                            {members.data?.find((m) => m.id === a.member_id)?.full_name ||
                              "Unknown member"}
                          </strong>
                          <StatusBadge value={a.role} />
                        </div>
                      ))}
                    {!assignments.data.some((a) => a.committee_id === viewing.id) && (
                      <p>No members assigned yet.</p>
                    )}
                  </>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
