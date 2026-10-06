import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ActionButton,
  DataTable,
  ErrorNotice,
  Field,
  FormDialog,
  QueryState,
  Section,
  StatusBadge,
  useNotice,
} from "./shared"
import { useAction, useResource } from "@/lib/hooks"
import { can, save } from "@/lib/api"
import { committeeOpen, dateLabel, taskStatusLabel } from "@/lib/calculations"
import type { Task } from "@/lib/types"

export function CommitteeTasks() {
  const tasks = useResource("tasks"),
    committees = useResource("committees"),
    members = useResource("members"),
    assignments = useResource("assignments")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ committee_id: "", member_id: "", title: "", due_date: "" })
  const [validation, setValidation] = useState<Error | null>(null)
  const notice = useNotice()
  const create = useAction(
    () => save("tasks", { ...form, due_date: form.due_date || null, status: "pending" }),
    ["tasks", "members", "performance"],
  )
  const progress = useAction(
    (payload: { id: string; status: Task["status"] }) => save("tasks", payload, true),
    ["tasks", "members", "performance"],
  )
  const config = window.APP_CONFIG
  const reviewer = ["super_admin", "sk_chairperson", "secretary", "committee_chairperson"].includes(
    config.role,
  )
  async function change(task: Task, status: Task["status"]) {
    try {
      const result = await progress.run({ id: task.id, status })
      if (result) notice(result.message || "Task progress updated.")
    } catch {}
  }
  async function submit() {
    if (!form.committee_id || !form.member_id || !form.title.trim()) {
      setValidation(new Error("Select a committee, its handler, and a task title."))
      return
    }
    try {
      const result = await create.run()
      if (result) {
        setOpen(false)
        setForm({ committee_id: "", member_id: "", title: "", due_date: "" })
        notice("Task assigned.")
      }
    } catch {}
  }
  return (
    <>
      <Section
        title="Committee tasks"
        description="Assign work here. Start it, submit it for review, and approve completion. Workload remains a monitoring page."
        action={
          can(config, "tasks.create") && (
            <Button
              onClick={() => {
                create.reset()
                setValidation(null)
                setOpen(true)
              }}
            >
              Assign task
            </Button>
          )
        }
      >
        <ErrorNotice error={progress.error} />
        <QueryState queries={[tasks, committees, members, assignments]}>
          <DataTable
            data={tasks.data || []}
            searchLabel="Search assigned tasks…"
            columns={[
              { accessorKey: "title", header: "Task" },
              {
                id: "committee",
                header: "Committee",
                accessorFn: (task) =>
                  committees.data?.find((c) => c.id === task.committee_id)?.name ||
                  "Committee unavailable",
              },
              {
                id: "handler",
                header: "Handled by",
                accessorFn: (task) =>
                  members.data?.find((m) => m.id === task.member_id)?.full_name ||
                  "Member unavailable",
              },
              {
                accessorKey: "due_date",
                header: "Due",
                cell: ({ row }) => dateLabel(row.original.due_date),
              },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => <StatusBadge value={taskStatusLabel(row.original.status)} />,
              },
              {
                id: "actions",
                header: "Progress",
                cell: ({ row }) => {
                  const task = row.original
                  if (!can(config, "tasks.update") || task.status === "completed") return null
                  const self =
                    config.memberId === task.member_id ||
                    members.data?.find((m) => m.id === task.member_id)?.email === config.userEmail
                  return (
                    <div className="ui-actions">
                      {task.status === "pending" && (
                        <ActionButton
                          size="sm"
                          variant="outline"
                          busy={progress.isPending}
                          onClick={() => void change(task, "in_progress")}
                        >
                          Start
                        </ActionButton>
                      )}
                      {task.status === "in_progress" && (
                        <ActionButton
                          size="sm"
                          variant="outline"
                          busy={progress.isPending}
                          onClick={() => void change(task, "awaiting_approval")}
                        >
                          Submit for review
                        </ActionButton>
                      )}
                      {task.status === "awaiting_approval" && reviewer && (
                        <>
                          <ActionButton
                            size="sm"
                            busy={progress.isPending}
                            disabled={self}
                            onClick={() => void change(task, "completed")}
                          >
                            Approve completion
                          </ActionButton>
                          <ActionButton
                            size="sm"
                            variant="outline"
                            busy={progress.isPending}
                            onClick={() => void change(task, "in_progress")}
                          >
                            Return for revision
                          </ActionButton>
                        </>
                      )}
                    </div>
                  )
                },
              },
            ]}
          />
        </QueryState>
      </Section>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Assign committee task"
        busy={create.isPending}
        error={validation || create.error}
        onSubmit={() => void submit()}
      >
        <Field
          label="Task committee"
          required
          value={form.committee_id}
          onChange={(value) => setForm({ ...form, committee_id: value, member_id: "" })}
          items={(committees.data || [])
            .filter(committeeOpen)
            .map((c) => ({ value: c.id, label: c.name }))}
        />
        <Field
          label="Task handler"
          required
          value={form.member_id}
          onChange={(value) => setForm({ ...form, member_id: value })}
          items={(members.data || [])
            .filter((m) =>
              assignments.data?.some(
                (a) => a.committee_id === form.committee_id && a.member_id === m.id,
              ),
            )
            .map((m) => ({ value: m.id, label: m.full_name }))}
        />
        <Field
          label="Task title"
          required
          value={form.title}
          onChange={(value) => setForm({ ...form, title: value })}
        />
        <Field
          label="Due date"
          type="date"
          value={form.due_date}
          onChange={(value) => setForm({ ...form, due_date: value })}
        />
      </FormDialog>
    </>
  )
}
