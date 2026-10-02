import { useState } from "react"
import {
  Users,
  Scale,
  TriangleAlert,
  Coffee,
  Sparkles,
  Check,
  Trash2,
  Plus,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ActionButton,
  AiPanel,
  ConfirmDialog,
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
import { can, request, save, remove } from "@/lib/api"
import { dateLabel, pendingCount, workloadStatus } from "@/lib/calculations"
import type { Member, Task, ApiResult, WorkloadAnalysis } from "@/lib/types"
export default function Workload() {
  const members = useResource("members"),
    committees = useResource("committees"),
    tasks = useResource("tasks")
  const [form, setForm] = useState({ member_id: "", committee_id: "", title: "", due_date: "" })
  const [open, setOpen] = useState(false),
    [status, setStatus] = useState("")
  const [deleting, setDeleting] = useState<Task | null>(null),
    [detail, setDetail] = useState<Member | null>(null)
  const [analysis, setAnalysis] = useState<WorkloadAnalysis | null>(null),
    [validation, setValidation] = useState<Error | null>(null)
  const notice = useNotice()
  const create = useAction(
    () =>
      save("tasks", {
        ...form,
        title: form.title.trim(),
        committee_id: form.committee_id || null,
        due_date: form.due_date || null,
        status: "pending",
      }),
    ["tasks", "members"],
  )
  const complete = useAction(
    (task: Task) => save("tasks", { id: task.id, status: "completed", title: task.title }, true),
    ["tasks", "members", "performance"],
  )
  const deletion = useAction((id: string) => remove("tasks", id), ["tasks", "members"])
  const ai = useAction(() =>
    request<ApiResult & { ai_analysis: WorkloadAnalysis }>("ai/workload.php", "POST", {}),
  )
  const distribution = (members.data || []).map((member) => ({
    ...member,
    pending: pendingCount(tasks.data || [], member.id),
    workload: workloadStatus(pendingCount(tasks.data || [], member.id)),
  }))
  const balanced = distribution.filter((member) => member.workload === "Balanced").length,
    overloaded = distribution.filter((member) => member.workload === "Overloaded").length,
    underloaded = distribution.filter((member) => member.workload === "Underloaded").length
  const ready = !!members.data && !!tasks.data
  async function submit() {
    if (!form.member_id || !form.title.trim()) {
      setValidation(new Error("Select a member and enter a task title."))
      return
    }
    if (pendingCount(tasks.data || [], form.member_id) >= 5) {
      setValidation(new Error("This member already has five pending tasks. Choose another member."))
      return
    }
    setValidation(null)
    try {
      const result = await create.run()
      if (result) {
        setOpen(false)
        setForm({ member_id: "", committee_id: "", title: "", due_date: "" })
        notice(result.message || "Task created.")
      }
    } catch {}
  }
  function update(name: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [name]: value }))
    setValidation(null)
  }
  const memberOptions = (members.data || []).map((member) => ({
    value: member.id,
    label: member.full_name,
  }))
  const committeeOptions = (committees.data || []).map((committee) => ({
    value: committee.id,
    label: committee.name,
  }))
  return (
    <>
      <div className="ui-page-actions">
        <p>Balance the work. Give every member room to contribute.</p>
        <div className="ui-actions">
          {can(window.APP_CONFIG, "ai.use") && (
            <ActionButton
              variant="outline"
              busy={ai.isPending}
              onClick={() => {
                void ai
                  .run()
                  .then((result) => {
                    if (result?.ai_analysis) setAnalysis(result.ai_analysis)
                    else if (result) notice("AI returned no workload analysis.", true)
                  })
                  .catch(() => {})
              }}
            >
              <Sparkles size={15} />
              Analyze workload
            </ActionButton>
          )}
          {can(window.APP_CONFIG, "tasks.create") && (
            <Button
              disabled={!ready}
              onClick={() => {
                create.reset()
                setValidation(null)
                setOpen(true)
              }}
            >
              <Plus size={15} />
              Add task
            </Button>
          )}
        </div>
      </div>
      <StatGrid>
        <StatCard
          label="Team members"
          value={members.data?.length ?? "—"}
          hint="Across your accessible workspace"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Balanced"
          value={ready ? balanced : "—"}
          hint="Two to five pending tasks"
          icon={<Scale size={16} />}
          tone="green"
        />
        <StatCard
          label="Overloaded"
          value={ready ? overloaded : "—"}
          hint="More than five pending tasks"
          icon={<TriangleAlert size={16} />}
          tone="gold"
        />
        <StatCard
          label="Underloaded"
          value={ready ? underloaded : "—"}
          hint="Fewer than two pending tasks"
          icon={<Coffee size={16} />}
          tone="purple"
        />
      </StatGrid>
      <ErrorNotice error={ai.error} />
      {analysis && (
        <AiPanel
          title="A more balanced team"
          description="AI-assisted observations based on your current workload."
        >
          <div className="ui-actions tw:mb-4">
            <StatusBadge
              value={
                analysis.alert_level === "red"
                  ? "Critical"
                  : analysis.alert_level === "yellow"
                    ? "Warning"
                    : "Good"
              }
            />
          </div>
          <div className="ui-ai-result">
            <p>{analysis.summary}</p>
            {analysis.recommendations?.map((recommendation, index) => (
              <div key={index} className="ui-list-row">
                <div>
                  <strong>
                    {recommendation.from_member} → {recommendation.to_member}
                  </strong>
                  <p>{recommendation.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </AiPanel>
      )}
      <div className="ui-dashboard-split">
        <Section title="Workload distribution" description="A shared picture of capacity.">
          <QueryState queries={[members, tasks]}>
            {ready ? (
              <DistributionChart
                label="Members"
                segments={[
                  { label: "Balanced", value: balanced, color: "#3c9c7d" },
                  { label: "Underloaded", value: underloaded, color: "#7595be" },
                  { label: "Overloaded", value: overloaded, color: "#d6a23a" },
                ]}
              />
            ) : (
              <p className="ui-info">
                Your role cannot access the member and task data needed for this view.
              </p>
            )}
          </QueryState>
        </Section>
        <Section
          title="How capacity is measured"
          description="A simple limit that keeps responsibilities manageable."
        >
          <p className="ui-info">
            Each member can have up to five pending tasks. Completed tasks free up capacity for new
            work.
          </p>
          <p className="tw:mt-4 tw:text-xs tw:leading-7 tw:text-muted-foreground">
            Review the member directory below before assigning work. AI suggestions are advisory;
            task changes remain under your control.
          </p>
        </Section>
      </div>
      <Section title="Member capacity" description="See where your next task fits best.">
        <QueryState queries={[members, tasks]}>
          <DataTable
            data={ready ? distribution : []}
            columns={[
              {
                accessorKey: "full_name",
                header: "Member",
                cell: ({ row }) => (
                  <Person name={row.original.full_name} detail={row.original.position} />
                ),
              },
              { accessorKey: "pending", header: "Pending tasks" },
              {
                accessorKey: "pending",
                id: "capacity",
                header: "Capacity used",
                cell: ({ row }) => (
                  <ScoreBar value={row.original.pending * 20} label="Task capacity used" />
                ),
              },
              {
                accessorKey: "workload",
                header: "Workload",
                cell: ({ row }) => <StatusBadge value={row.original.workload} />,
              },
              {
                id: "details",
                header: "Details",
                cell: ({ row }) => (
                  <Button variant="ghost" size="sm" onClick={() => setDetail(row.original)}>
                    <Eye size={14} />
                    View tasks
                  </Button>
                ),
              },
            ]}
            searchLabel="Search team members…"
          />
        </QueryState>
      </Section>
      <Section title="Task board" description="Track what is pending and what is done.">
        <QueryState queries={[tasks]}>
          <DataTable
            data={(tasks.data || []).filter((task) => !status || task.status === status)}
            filter={
              <SelectBox
                label="Filter task status"
                value={status}
                onChange={setStatus}
                items={options(["pending", "completed"])}
                placeholder="All tasks"
              />
            }
            columns={[
              { accessorKey: "title", header: "Task" },
              {
                accessorFn: (task) =>
                  members.data?.find((member) => member.id === task.member_id)?.full_name ||
                  "Unassigned",
                id: "member",
                header: "Assigned to",
              },
              {
                accessorKey: "due_date",
                header: "Due",
                cell: ({ row }) => dateLabel(row.original.due_date),
              },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => <StatusBadge value={row.original.status} />,
              },
              {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                  <div className="ui-actions">
                    {row.original.status === "pending" &&
                      can(window.APP_CONFIG, "tasks.update") && (
                        <ActionButton
                          variant="ghost"
                          size="sm"
                          busy={complete.isPending}
                          onClick={() => {
                            void complete
                              .run(row.original)
                              .then((result) => {
                                if (result) notice("Task completed.")
                              })
                              .catch((error) => notice(error.message, true))
                          }}
                        >
                          <Check size={13} />
                          Complete
                        </ActionButton>
                      )}
                    {can(window.APP_CONFIG, "tasks.delete") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="tw:text-destructive"
                        onClick={() => {
                          deletion.reset()
                          setDeleting(row.original)
                        }}
                      >
                        <Trash2 size={13} />
                        Remove
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </QueryState>
      </Section>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add a task"
        onSubmit={() => void submit()}
        busy={create.isPending}
        error={validation || create.error}
      >
        <Field
          label="Member"
          value={form.member_id}
          onChange={(value) => update("member_id", value)}
          items={memberOptions}
          required
        />
        <Field
          label="Committee"
          value={form.committee_id}
          onChange={(value) => update("committee_id", value)}
          items={committeeOptions}
          placeholder="No committee"
        />
        <Field
          label="Task title"
          value={form.title}
          onChange={(value) => update("title", value)}
          required
        />
        <Field
          label="Due date"
          type="date"
          value={form.due_date}
          onChange={(value) => update("due_date", value)}
        />
      </FormDialog>
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Remove this task?"
        description={deleting?.title}
        busy={deletion.isPending}
        error={deletion.error}
        onConfirm={() => {
          if (deleting)
            void deletion
              .run(deleting.id)
              .then((result) => {
                if (result) {
                  setDeleting(null)
                  notice("Task removed.")
                }
              })
              .catch(() => {})
        }}
      />
      <FormDialog
        open={!!detail}
        onClose={() => setDetail(null)}
        title={`${detail?.full_name || "Member"} · Tasks`}
        description="Current responsibilities for this member."
        onSubmit={() => setDetail(null)}
        busy={false}
      >
        <div className="tw:col-span-full">
          {(tasks.data || [])
            .filter((task) => task.member_id === detail?.id)
            .map((task) => (
              <div key={task.id} className="ui-list-row">
                <div>
                  <strong>{task.title}</strong>
                  <small>Due {dateLabel(task.due_date)}</small>
                </div>
                <StatusBadge value={task.status} />
              </div>
            ))}
          {!(tasks.data || []).some((task) => task.member_id === detail?.id) && (
            <p className="ui-info">No tasks assigned to this member.</p>
          )}
        </div>
      </FormDialog>
    </>
  )
}
