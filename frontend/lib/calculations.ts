import type { Member, Task, PerformanceRecord, Jurisdiction } from "./types"
export function pendingCount(tasks: Task[], memberId: string) {
  return tasks.filter((t) => t.member_id === memberId && t.status !== "completed").length
}
export function workloadStatus(count: number) {
  return count > 5 ? "Overloaded" : count < 2 ? "Underloaded" : "Balanced"
}
export function grade(score: number) {
  return score >= 90
    ? "Excellent"
    : score >= 75
      ? "Good"
      : score >= 60
        ? "Average"
        : "Needs Improvement"
}
export function performanceScores(members: Member[], tasks: Task[], records: PerformanceRecord[]) {
  return members
    .map((member) => {
      const own = tasks.filter((t) => t.member_id === member.id)
      const completed = own.filter((t) => t.status === "completed")
      const onTime = completed.filter((task) => {
        const completedAt = task.completed_at
        if (!task.due_date || !completedAt) return false
        const completionDate = /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?$/.test(completedAt)
          ? completedAt.slice(0, 10)
          : localDate(new Date(completedAt))
        return completionDate <= task.due_date
      })
      const latest = records
        .filter((r) => r.member_id === member.id)
        .sort(
          (a, b) =>
            (/^\d{4}-\d{2}$/.test(b.period || "")
              ? `${b.period}-01`
              : (b.created_at || "").slice(0, 10)
            ).localeCompare(
              /^\d{4}-\d{2}$/.test(a.period || "")
                ? `${a.period}-01`
                : (a.created_at || "").slice(0, 10),
            ) ||
            (b.created_at || "").localeCompare(a.created_at || "") ||
            b.id.localeCompare(a.id),
        )[0]
      const attendance = Number(latest?.attendance_rate || 0)
      const completion = own.length ? Math.round((completed.length / own.length) * 100) : 0
      const punctuality = completed.length
        ? Math.round((onTime.length / completed.length) * 100)
        : 0
      const score = Math.round(completion * 0.5 + attendance * 0.2 + punctuality * 0.3)
      return {
        ...member,
        total_tasks: own.length,
        completed_tasks: completed.length,
        task_completion_rate: completion,
        attendance_rate: attendance,
        on_time_rate: punctuality,
        final_score: score,
        grade: grade(score),
      }
    })
    .sort((a, b) => b.final_score - a.final_score)
}
export function overlappingAreas(rows: Jurisdiction[]) {
  const counts = new Map<string, number>()
  rows.forEach((row) => counts.set(row.area_name, (counts.get(row.area_name) || 0) + 1))
  return [...counts].filter(([, count]) => count > 1).map(([area]) => area)
}
export function dateLabel(value?: string | null) {
  if (!value) return "—"
  // MySQL timestamps are server-local; interpret timezone-less values in Manila.
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00+08:00`
      : /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(value)
        ? `${value.replace(" ", "T")}+08:00`
        : value,
  )
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
}
export function localDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}
export function committeeOpen(committee: { status: string; effective_until?: string | null }) {
  return (
    committee.status === "active" &&
    (!committee.effective_until || committee.effective_until >= localDate())
  )
}
export const taskStatusLabel = (status: string) =>
  ({
    pending: "Open",
    in_progress: "In progress",
    awaiting_approval: "Awaiting approval",
    completed: "Completed",
  })[status] || status
