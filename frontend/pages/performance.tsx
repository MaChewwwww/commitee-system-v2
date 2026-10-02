import { useState } from "react"
import { Trophy, ChartNoAxesCombined, Users, TrendingUp, Sparkles, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ActionButton,
  AiPanel,
  DataTable,
  ErrorNotice,
  Field,
  FormDialog,
  Person,
  QueryState,
  ScoreBar,
  Section,
  SelectBox,
  StatCard,
  StatGrid,
  StatusBadge,
  options,
  useNotice,
} from "@/components/shared"
import { DistributionChart } from "@/components/charts"
import { useAction, useResource } from "@/lib/hooks"
import { can, request, save } from "@/lib/api"
import { localDate, performanceScores } from "@/lib/calculations"
import type { ApiResult, PerformanceInsights, AiMemberScore } from "@/lib/types"
export default function Performance() {
  const members = useResource("members"),
    tasks = useResource("tasks"),
    records = useResource("performance"),
    committees = useResource("committees")
  const [gradeFilter, setGradeFilter] = useState("")
  const [open, setOpen] = useState(false),
    [validation, setValidation] = useState<Error | null>(null)
  const [form, setForm] = useState({ member_id: "", committee_id: "", attendance_rate: "" })
  const [insights, setInsights] = useState<PerformanceInsights | null>(null)
  const [serverScores, setServerScores] = useState<ReturnType<typeof performanceScores> | null>(
    null,
  )
  const notice = useNotice()
  const scores =
    serverScores || performanceScores(members.data || [], tasks.data || [], records.data || [])
  const ready = !!members.data && !!tasks.data && !!records.data
  const ai = useAction(() =>
    request<ApiResult & { ai_insights: PerformanceInsights; members?: AiMemberScore[] }>(
      "ai/performance.php",
      "POST",
      {},
    ),
  )
  const attendance = useAction(
    () =>
      save("performance", {
        member_id: form.member_id,
        committee_id: form.committee_id || null,
        attendance_rate: Number(form.attendance_rate),
        task_completion_rate: 0,
        performance_score: 0,
        period: localDate().slice(0, 7),
      }),
    ["performance"],
  )
  async function submit() {
    if (
      !form.member_id ||
      form.attendance_rate === "" ||
      Number(form.attendance_rate) < 0 ||
      Number(form.attendance_rate) > 100 ||
      !Number.isFinite(Number(form.attendance_rate))
    ) {
      setValidation(new Error("Select a member and enter attendance from 0 to 100."))
      return
    }
    setValidation(null)
    try {
      const result = await attendance.run()
      if (result) {
        setOpen(false)
        setServerScores(null)
        setForm({ member_id: "", committee_id: "", attendance_rate: "" })
        notice(result.message || "Attendance saved.")
      }
    } catch {}
  }
  const average = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score.final_score, 0) / scores.length)
    : 0
  const excellent = scores.filter((score) => score.grade === "Excellent").length
  const grades = ["Excellent", "Good", "Average", "Needs Improvement"]
  return (
    <>
      <div className="ui-page-actions">
        <p>Recognize progress and see where support can make a difference.</p>
        <div className="ui-actions">
          {can(window.APP_CONFIG, "ai.use") && (
            <ActionButton
              variant="outline"
              busy={ai.isPending}
              onClick={() => {
                void ai
                  .run()
                  .then((result) => {
                    if (result?.ai_insights) {
                      setInsights(result.ai_insights)
                      if (result.members?.length)
                        setServerScores(
                          result.members.map((score) => ({
                            ...members.data?.find((member) => member.id === score.member_id),
                            ...score,
                            id: score.member_id,
                            full_name: score.member_name,
                            availability:
                              members.data?.find((member) => member.id === score.member_id)
                                ?.availability || "available",
                          })),
                        )
                    } else if (result) notice("AI returned no performance insights.", true)
                  })
                  .catch(() => {})
              }}
            >
              <Sparkles size={15} />
              Analyze performance
            </ActionButton>
          )}
          {can(window.APP_CONFIG, "performance.create") && (
            <Button
              disabled={!members.data}
              onClick={() => {
                attendance.reset()
                setValidation(null)
                setOpen(true)
              }}
            >
              <Plus size={15} />
              Record attendance
            </Button>
          )}
        </div>
      </div>
      <StatGrid>
        <StatCard
          label="Members assessed"
          value={ready ? scores.length : "—"}
          hint="Your accessible team"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Average score"
          value={ready ? `${average}%` : "—"}
          hint="Completion, attendance, and punctuality"
          icon={<ChartNoAxesCombined size={16} />}
          tone="purple"
        />
        <StatCard
          label="Excellent performers"
          value={ready ? excellent : "—"}
          hint="Final score of 90% or higher"
          icon={<Trophy size={16} />}
          tone="gold"
        />
        <StatCard
          label="Top score"
          value={ready ? `${scores[0]?.final_score || 0}%` : "—"}
          hint={scores[0]?.full_name || "Performance at a glance"}
          icon={<TrendingUp size={16} />}
          tone="green"
        />
      </StatGrid>
      <ErrorNotice error={ai.error} />
      {insights && (
        <AiPanel
          title="Insights that move your team forward"
          description="AI-assisted observations and recommendations."
        >
          <div className="ui-actions">
            <StatusBadge value={insights.team_status} />
            <strong className="tw:text-sm">
              Team score: {insights.overall_team_score}% · Top performer: {insights.top_performer}
            </strong>
          </div>
          <div className="ui-ai-result ui-two-column">
            <div>
              <h3>What is working</h3>
              <ul>
                {insights.insights?.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Where to focus next</h3>
              <ul>
                {insights.recommendations?.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
          {insights.needs_improvement?.length > 0 && (
            <div className="ui-actions tw:mt-4">
              {insights.needs_improvement.map((name) => (
                <StatusBadge key={name} value={name} />
              ))}
            </div>
          )}
        </AiPanel>
      )}
      <div className="ui-dashboard-split">
        <Section title="Performance snapshot" description="How your team's grades are distributed.">
          <QueryState queries={[members, tasks, records]}>
            {ready ? (
              <DistributionChart
                label="Members"
                segments={grades.map((grade, index) => ({
                  label: grade,
                  value: scores.filter((score) => score.grade === grade).length,
                  color: ["#3c9c7d", "#7595be", "#d6a23a", "#c77570"][index],
                }))}
              />
            ) : (
              <p className="ui-info">
                Your role cannot access the data needed to calculate this view.
              </p>
            )}
          </QueryState>
        </Section>
        <Section
          title="A fair view of progress"
          description="The current scoring model, made clear."
        >
          <div className="ui-list-row">
            <strong>Task completion</strong>
            <StatusBadge value="50% weight" />
          </div>
          <div className="ui-list-row">
            <strong>Attendance</strong>
            <StatusBadge value="20% weight" />
          </div>
          <div className="ui-list-row">
            <strong>On-time completion</strong>
            <StatusBadge value="30% weight" />
          </div>
        </Section>
      </div>
      <Section
        title="Performance directory"
        description="A detailed view of your team's contributions."
      >
        <QueryState queries={[members, tasks, records]}>
          <DataTable
            data={
              ready ? scores.filter((score) => !gradeFilter || score.grade === gradeFilter) : []
            }
            initialSorting={[{ id: "final_score", desc: true }]}
            filter={
              <SelectBox
                label="Filter grade"
                value={gradeFilter}
                onChange={setGradeFilter}
                items={options(grades)}
                placeholder="All grades"
              />
            }
            columns={[
              {
                id: "rank",
                header: "Rank",
                cell: ({ row }) => scores.findIndex((score) => score.id === row.original.id) + 1,
              },
              {
                accessorKey: "full_name",
                header: "Member",
                cell: ({ row }) => (
                  <Person name={row.original.full_name} detail={row.original.position} />
                ),
              },
              {
                accessorKey: "task_completion_rate",
                header: "Completion",
                cell: ({ row }) => <ScoreBar value={row.original.task_completion_rate} />,
              },
              {
                accessorKey: "attendance_rate",
                header: "Attendance",
                cell: ({ row }) => `${row.original.attendance_rate}%`,
              },
              {
                accessorKey: "on_time_rate",
                header: "On time",
                cell: ({ row }) => `${row.original.on_time_rate}%`,
              },
              {
                accessorKey: "final_score",
                header: "Final score",
                cell: ({ row }) => <strong>{row.original.final_score}%</strong>,
              },
              {
                accessorKey: "grade",
                header: "Grade",
                cell: ({ row }) => <StatusBadge value={row.original.grade} />,
              },
            ]}
          />
        </QueryState>
      </Section>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Record attendance"
        description="Save attendance for the current month. Enter a percentage from 0 to 100."
        busy={attendance.isPending}
        onSubmit={() => void submit()}
        error={validation || attendance.error}
      >
        <Field
          label="Member"
          value={form.member_id}
          onChange={(value) => setForm((previous) => ({ ...previous, member_id: value }))}
          items={(members.data || []).map((member) => ({
            value: member.id,
            label: member.full_name,
          }))}
          required
        />
        <Field
          label="Committee"
          value={form.committee_id}
          onChange={(value) => setForm((previous) => ({ ...previous, committee_id: value }))}
          items={(committees.data || []).map((committee) => ({
            value: committee.id,
            label: committee.name,
          }))}
          placeholder="No committee"
        />
        <Field
          label="Attendance rate (%)"
          type="number"
          min={0}
          max={100}
          value={form.attendance_rate}
          onChange={(value) => setForm((previous) => ({ ...previous, attendance_rate: value }))}
          required
        />
      </FormDialog>
    </>
  )
}
