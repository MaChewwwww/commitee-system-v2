import { useState } from "react"
import { Sparkles, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ManagementPage } from "@/components/management"
import {
  ActionButton,
  AiPanel,
  ConfirmDialog,
  ErrorNotice,
  Field,
  Person,
  QueryState,
  StatusBadge,
  options,
  useNotice,
} from "@/components/shared"
import { useResource, useAction } from "@/lib/hooks"
import { can, request, save } from "@/lib/api"
import { dateLabel, pendingCount } from "@/lib/calculations"
import type { Recommendation, RecommendationResult } from "@/lib/types"
export default function Assignments() {
  const members = useResource("members"),
    committees = useResource("committees"),
    tasks = useResource("tasks")
  const [criteria, setCriteria] = useState({
    committee_id: "",
    required_skills: "",
    max_workload: "5",
    preferred_position: "",
  })
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [resultCommittee, setResultCommittee] = useState("")
  const [decision, setDecision] = useState<Record<string, string>>({})
  const [accepting, setAccepting] = useState<Recommendation | null>(null)
  const [validation, setValidation] = useState<Error | null>(null)
  const notice = useNotice()
  const ai = useAction((body: object) =>
    request<RecommendationResult>("ai/recommend.php", "POST", body),
  )
  const accept = useAction(
    (rec: Recommendation) =>
      save("assignments", {
        member_id: rec.member_id,
        committee_id: resultCommittee,
        role: "Member",
      }),
    ["assignments"],
  )
  const committeeItems = (committees.data || []).map((c) => ({ value: c.id, label: c.name }))
  const memberItems = (members.data || []).map((m) => ({ value: m.id, label: m.full_name }))
  function criterion(name: keyof typeof criteria, value: string) {
    setCriteria((previous) => ({ ...previous, [name]: value }))
    setValidation(null)
  }
  async function recommend() {
    if (!criteria.committee_id) {
      setValidation(new Error("Select a committee before requesting recommendations."))
      return
    }
    const committeeId = criteria.committee_id,
      max = Number(criteria.max_workload)
    try {
      const next = await ai.run({
        ...criteria,
        required_skills: criteria.required_skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        max_workload: max,
        availability: "available",
      })
      if (next) {
        const recommendations = tasks.data
          ? next.data.recommendations.filter(
              (rec) => pendingCount(tasks.data!, rec.member_id) < max,
            )
          : next.data.recommendations
        setResult({ ...next, data: { ...next.data, recommendations } })
        setResultCommittee(committeeId)
        setDecision({})
      }
    } catch {
      /* Retain previous successful recommendations. */
    }
  }
  const panel = can(window.APP_CONFIG, "ai.use") && (
    <AiPanel
      title="Put the right strengths together"
      description="Find available members whose skills fit your committee's needs."
    >
      <QueryState queries={[committees, members]}>
        <div className="ui-form-grid">
          <Field
            label="Committee"
            value={criteria.committee_id}
            onChange={(value) => criterion("committee_id", value)}
            items={committeeItems}
            required
          />
          <Field
            label="Required skills"
            value={criteria.required_skills}
            onChange={(value) => criterion("required_skills", value)}
            placeholder="Leadership, communication…"
          />
          <Field
            label="Workload limit"
            value={criteria.max_workload}
            onChange={(value) => criterion("max_workload", value)}
            items={[
              { value: "3", label: "Fewer than 3 pending tasks" },
              { value: "4", label: "Fewer than 4 pending tasks" },
              { value: "5", label: "Fewer than 5 pending tasks" },
            ]}
            disabled={!tasks.data}
          />
          <Field
            label="Preferred position"
            value={criteria.preferred_position}
            onChange={(value) => criterion("preferred_position", value)}
            items={options([
              "SK Chairman",
              "SK Kagawad",
              "SK Secretary",
              "SK Treasurer",
              "SK Member",
            ])}
            placeholder="Any position"
          />
        </div>
        <p className="tw:mt-3 tw:text-xs tw:text-muted-foreground">
          Recommendations consider available members who are not already assigned to this committee.
        </p>
        <ErrorNotice error={validation || ai.error} />
        <ActionButton className="tw:mt-5" busy={ai.isPending} onClick={() => void recommend()}>
          <Sparkles size={15} />
          Find recommended members
        </ActionButton>
      </QueryState>
      {result && (
        <div className="ui-ai-result">
          <h3>
            Recommendations for{" "}
            {committees.data?.find((c) => c.id === resultCommittee)?.name || "your committee"}
          </h3>
          <p>{result.data.summary}</p>
          {!result.data.recommendations.length && (
            <p className="tw:mt-3">
              No members matched these criteria. Try another set of skills or workload limit.
            </p>
          )}
          {result.data.recommendations.map((rec) => (
            <div key={rec.member_id} className="ui-list-row">
              <div>
                <Person name={rec.member_name} detail={rec.reason} />
                <div className="ui-actions tw:mt-3">
                  <StatusBadge value={`${rec.score}/100 match`} />
                  <small className="tw:text-xs tw:text-muted-foreground">
                    Skills: {rec.skills_match}
                  </small>
                </div>
              </div>
              <div className="ui-actions">
                {decision[rec.member_id] ? (
                  <StatusBadge value={decision[rec.member_id]} />
                ) : (
                  <>
                    {can(window.APP_CONFIG, "assignments.create") && (
                      <Button
                        size="sm"
                        onClick={() => {
                          accept.reset()
                          setAccepting(rec)
                        }}
                      >
                        <Check size={13} />
                        Accept
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDecision((previous) => ({ ...previous, [rec.member_id]: "Rejected" }))
                      }
                    >
                      <X size={13} />
                      Dismiss
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!accepting}
        onClose={() => setAccepting(null)}
        title={`Assign ${accepting?.member_name || "this member"}?`}
        description="This will add the member to the committee shown in these recommendations."
        destructive={false}
        busy={accept.isPending}
        error={accept.error}
        onConfirm={() => {
          if (accepting)
            void accept
              .run(accepting)
              .then((response) => {
                if (response) {
                  setDecision((previous) => ({ ...previous, [accepting.member_id]: "Accepted" }))
                  setAccepting(null)
                  notice(response.message || "Member assigned.")
                }
              })
              .catch(() => {})
        }}
      />
    </AiPanel>
  )
  return (
    <ManagementPage
      resource="assignments"
      singular="Assignment"
      defaults={{ member_id: "", committee_id: "", role: "Member" }}
      queries={[members, committees]}
      before={panel}
      fields={() => [
        { name: "member_id", label: "Member", required: true, items: memberItems },
        { name: "committee_id", label: "Committee", required: true, items: committeeItems },
        {
          name: "role",
          label: "Committee role",
          required: true,
          items: options(["Member", "Chairperson", "Vice Chairperson", "Secretary"]),
        },
      ]}
      columns={[
        {
          accessorFn: (row) =>
            members.data?.find((member) => member.id === row.member_id)?.full_name ||
            "Unknown member",
          id: "member",
          header: "Member",
          cell: ({ row }) => {
            const member = members.data?.find((member) => member.id === row.original.member_id)
            return <Person name={member?.full_name || "Unknown member"} detail={member?.position} />
          },
        },
        {
          accessorFn: (row) =>
            committees.data?.find((c) => c.id === row.committee_id)?.name || "Unknown committee",
          id: "committee",
          header: "Committee",
        },
        {
          accessorKey: "role",
          header: "Role",
          cell: ({ row }) => <StatusBadge value={row.original.role} />,
        },
        {
          accessorKey: "assigned_at",
          header: "Assigned",
          cell: ({ row }) => dateLabel(row.original.assigned_at),
        },
      ]}
    />
  )
}
