import { useState } from "react"
import { DataTable, QueryState, Section, SelectBox, StatusBadge } from "@/components/shared"
import { Progress } from "@/components/ui/progress"
import { useResource } from "@/lib/hooks"
import { dateLabel, localDate, pendingCount, taskStatusLabel } from "@/lib/calculations"

export default function Workload() {
  const members = useResource("members")
  const committees = useResource("committees")
  const tasks = useResource("tasks")
  const [status, setStatus] = useState("")
  const [committeeId, setCommitteeId] = useState("")
  const [memberId, setMemberId] = useState("")
  const today = localDate()
  const inventory = (tasks.data || []).map((task) => ({
    ...task,
    handled_by:
      members.data?.find((member) => member.id === task.member_id)?.full_name ||
      (task.member_id ? "Member unavailable" : "Unassigned"),
    committee:
      committees.data?.find((committee) => committee.id === task.committee_id)?.name ||
      (task.committee_id ? "Committee unavailable" : "No committee"),
  }))
  return (
    <>
      <div className="ui-page-actions">
        <p>Monitor assigned tasks, deadlines, completion, and member workload.</p>
      </div>
      <Section
        title="Task inventory"
        description="Track who handles each task and its current status."
      >
        <QueryState queries={[tasks, members, committees]}>
          <DataTable
            data={inventory.filter(
              (task) =>
                (!status || task.status === status) &&
                (!committeeId || task.committee_id === committeeId) &&
                (!memberId || task.member_id === memberId),
            )}
            searchLabel="Search tasks…"
            filter={
              <div className="tw:flex tw:flex-wrap tw:gap-2">
                <div className="tw:min-w-36">
                  <SelectBox
                    label="Filter task status"
                    value={status}
                    onChange={setStatus}
                    items={[
                      { value: "pending", label: "Open" },
                      { value: "in_progress", label: "In progress" },
                      { value: "awaiting_approval", label: "Awaiting approval" },
                      { value: "completed", label: "Completed" },
                    ]}
                    placeholder="All statuses"
                  />
                </div>
                <div className="tw:min-w-44">
                  <SelectBox
                    label="Filter task committee"
                    value={committeeId}
                    onChange={setCommitteeId}
                    items={(committees.data || []).map((committee) => ({
                      value: committee.id,
                      label: committee.name,
                    }))}
                    placeholder="All committees"
                  />
                </div>
                <div className="tw:min-w-36">
                  <SelectBox
                    label="Filter task member"
                    value={memberId}
                    onChange={setMemberId}
                    items={(members.data || []).map((member) => ({
                      value: member.id,
                      label: member.full_name,
                    }))}
                    placeholder="Any member"
                  />
                </div>
              </div>
            }
            columns={[
              { accessorKey: "title", header: "Task" },
              { accessorKey: "handled_by", header: "Handled by" },
              { accessorKey: "committee", header: "Committee" },
              {
                accessorKey: "due_date",
                header: "Due",
                cell: ({ row }) => (
                  <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                    <span>{dateLabel(row.original.due_date)}</span>
                    {row.original.status !== "completed" &&
                      row.original.due_date &&
                      row.original.due_date < today && (
                        <span className="tw:text-xs tw:font-medium tw:text-destructive">
                          Overdue
                        </span>
                      )}
                  </div>
                ),
              },
              {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => <StatusBadge value={taskStatusLabel(row.original.status)} />,
              },
              {
                accessorKey: "completed_at",
                header: "Completed",
                cell: ({ row }) => dateLabel(row.original.completed_at),
              },
              {
                accessorKey: "approved_by",
                header: "Approved by",
                cell: ({ row }) => row.original.approved_by || "Not recorded",
              },
            ]}
          />
        </QueryState>
      </Section>
      <Section
        title="Workload per member"
        description="Open tasks against each member’s five-task capacity."
      >
        <QueryState queries={[members, tasks]}>
          {!members.data || !tasks.data ? (
            <p className="ui-info">Permission to view members and tasks is required.</p>
          ) : (
            <div className="tw:space-y-4">
              {(members.data || []).map((member) => {
                const count = pendingCount(tasks.data || [], member.id)
                return (
                  <div key={member.id} className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
                    <span className="tw:w-36 tw:text-sm tw:font-medium">{member.full_name}</span>
                    <Progress
                      className="tw:min-w-24 tw:flex-1"
                      value={Math.min(count * 20, 100)}
                      aria-label={`Open task capacity for ${member.full_name}`}
                    />
                    <span className="tw:w-16 tw:text-right tw:text-xs tw:text-muted-foreground">
                      {count} of 5
                    </span>
                  </div>
                )
              })}
              {members.data?.length === 0 && <p className="ui-info">No members available.</p>}
            </div>
          )}
        </QueryState>
      </Section>
    </>
  )
}
