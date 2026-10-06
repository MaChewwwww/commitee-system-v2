import { DataTable, QueryState, Section, StatusBadge } from "@/components/shared"
import { useResource } from "@/lib/hooks"
import { performanceScores } from "@/lib/calculations"

export default function Performance() {
  const members = useResource("members")
  const tasks = useResource("tasks")
  const records = useResource("performance")
  const ready = !!members.data && !!tasks.data && !!records.data
  const scores = ready ? performanceScores(members.data, tasks.data, records.data) : []
  const maximum = Math.max(1, ...scores.map((score) => score.completed_tasks))
  return (
    <>
      <div className="ui-page-actions">
        <p>See task completion, attendance, and on-time scores for each member.</p>
      </div>
      <p className="ui-info tw:mb-5">
        Final score = 50% task completion + 20% attendance + 30% on-time completion.
      </p>
      <QueryState queries={[members, tasks, records]}>
        {!ready ? (
          <p className="ui-info">Permission to view members, tasks, and performance is required.</p>
        ) : (
          <>
            <Section title="Completed tasks per member">
              {scores.length ? (
                <div className="tw:overflow-x-auto">
                  <div
                    role="img"
                    aria-label={`Completed tasks per member: ${scores.map((score) => `${score.full_name} ${score.completed_tasks}`).join(", ")}`}
                    className="tw:flex tw:gap-3 tw:pt-3"
                    style={{ minWidth: Math.max(320, scores.length * 110) }}
                  >
                    <div
                      aria-hidden="true"
                      className="tw:flex tw:h-44 tw:flex-col tw:justify-between tw:pr-2 tw:text-xs tw:text-muted-foreground"
                    >
                      <span>{maximum}</span>
                      <span>0</span>
                    </div>
                    {scores.map((score) => (
                      <div key={score.id} className="tw:min-w-24 tw:flex-1 tw:text-center">
                        <div className="tw:flex tw:h-44 tw:items-end tw:justify-center tw:border-b tw:border-border">
                          <div
                            className="tw:w-8 tw:rounded-t tw:bg-primary"
                            style={{ height: `${(score.completed_tasks / maximum) * 100}%` }}
                            title={`${score.full_name}: ${score.completed_tasks} completed tasks`}
                          />
                        </div>
                        <p className="tw:mt-3 tw:text-xs tw:text-muted-foreground">
                          {score.full_name}
                        </p>
                        <span className="tw:text-xs tw:font-medium">{score.completed_tasks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="ui-info">No members available.</p>
              )}
            </Section>
            <Section
              title="Performance directory"
              description="Member scores calculated from recorded tasks and attendance."
            >
              <DataTable
                data={scores}
                searchLabel="Search member performance…"
                columns={[
                  { accessorKey: "full_name", header: "Member" },
                  { accessorKey: "total_tasks", header: "Assigned" },
                  { accessorKey: "completed_tasks", header: "Completed" },
                  {
                    accessorKey: "attendance_rate",
                    header: "Attendance",
                    cell: ({ row }) => `${row.original.attendance_rate}%`,
                  },
                  {
                    accessorKey: "on_time_rate",
                    header: "On-time",
                    cell: ({ row }) =>
                      row.original.completed_tasks ? `${row.original.on_time_rate}%` : "—",
                  },
                  {
                    accessorKey: "final_score",
                    header: "Final score",
                    cell: ({ row }) => `${row.original.final_score}%`,
                  },
                  {
                    accessorKey: "grade",
                    header: "Grade",
                    cell: ({ row }) => <StatusBadge value={row.original.grade} />,
                  },
                ]}
              />
            </Section>
          </>
        )}
      </QueryState>
    </>
  )
}
