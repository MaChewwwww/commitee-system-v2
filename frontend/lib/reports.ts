import type { Assignment, Committee, Member, Task } from "./types"
import { dateLabel, pendingCount, grade, workloadStatus } from "./calculations"
export type ReportType = "committee" | "member" | "performance" | "workload" | "full"
export interface ReportDocument {
  title: string
  headers: string[]
  rows: (string | number)[][]
}
export function buildReport(
  type: ReportType,
  data: { committees: Committee[]; members: Member[]; tasks: Task[]; assignments: Assignment[] },
  committeeId = "",
): ReportDocument {
  const { committees, members, tasks, assignments } = data
  if (type === "committee")
    return {
      title: "Committee Report",
      headers: ["Name", "Committee Type", "Purpose", "Created"],
      rows: committees
        .filter((c) => !committeeId || c.id === committeeId)
        .map((c) => [c.name, c.type || "—", c.purpose || "—", dateLabel(c.created_at)]),
    }
  if (type === "member")
    return {
      title: "Member Report",
      headers: ["Name", "Position", "Email", "Availability", "Workload"],
      rows: members.map((m) => [
        m.full_name,
        m.position || "—",
        m.email || "—",
        m.availability,
        `${pendingCount(tasks, m.id)}/5 tasks`,
      ]),
    }
  if (type === "performance")
    return {
      title: "Performance Report",
      headers: ["Member", "Position", "Total Tasks", "Completed", "Rate", "Grade"],
      rows: members.map((m) => {
        const own = tasks.filter((t) => t.member_id === m.id),
          completed = own.filter((t) => t.status === "completed").length,
          rate = own.length ? Math.round((completed / own.length) * 100) : 0
        return [m.full_name, m.position || "—", own.length, completed, `${rate}%`, grade(rate)]
      }),
    }
  if (type === "workload")
    return {
      title: "Workload Distribution Report",
      headers: ["Member", "Position", "Pending", "Completed", "Status"],
      rows: members.map((m) => {
        const pending = pendingCount(tasks, m.id)
        return [
          m.full_name,
          m.position || "—",
          pending,
          tasks.filter((t) => t.member_id === m.id && t.status === "completed").length,
          workloadStatus(pending),
        ]
      }),
    }
  return {
    title: "Full System Report",
    headers: ["Category", "Details", "Count"],
    rows: [
      ["Total Committees", "Active SK Committees", committees.length],
      ["Total Members", "Registered SK Members", members.length],
      ["Total Tasks", "All Tasks", tasks.length],
      ["Pending Tasks", "Not Yet Completed", tasks.filter((t) => t.status === "pending").length],
      ["Completed Tasks", "Finished Tasks", tasks.filter((t) => t.status === "completed").length],
      ["Total Assignments", "Member-Committee", assignments.length],
      [
        "Available Members",
        "Ready for Assignment",
        members.filter((m) => m.availability === "available").length,
      ],
    ],
  }
}
export function csvText(report: ReportDocument) {
  return (
    "\uFEFF" +
    [report.headers, ...report.rows]
      .map((row) =>
        row
          .map((value) => {
            let text = String(value)
            if (typeof value === "string" && /^[=+@\-\t\r]/.test(text)) text = "'" + text
            return `"${text.replace(/"/g, '""')}"`
          })
          .join(","),
      )
      .join("\r\n")
  )
}
export function downloadCsv(report: ReportDocument, date: string) {
  const url = URL.createObjectURL(new Blob([csvText(report)], { type: "text/csv;charset=utf-8;" }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `${report.title.replace(/[^a-z0-9_-]+/gi, "_")}_${date}.csv`
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function printDocument(title: string, content: ReportDocument | string) {
  const popup = window.open("", "_blank")
  if (!popup) throw new Error("Allow popups for this site to print the report.")
  popup.opener = null
  const doc = popup.document
  doc.title = title
  const style = doc.createElement("style")
  style.textContent =
    "body{font:13px Arial,sans-serif;color:#1e293b;margin:36px}h1{font-size:24px;color:#0b3a6e}table{border-collapse:collapse;width:100%}td,th{padding:10px;border:1px solid #d8e0ea;text-align:left}th{background:#f1f5f9}pre{white-space:pre-wrap;font:inherit;line-height:1.8}@media print{thead{display:table-header-group}tr{break-inside:avoid}}"
  doc.head.appendChild(style)
  const heading = doc.createElement("h1")
  heading.textContent = title
  doc.body.appendChild(heading)
  if (typeof content === "string") {
    const text = doc.createElement("pre")
    text.textContent = content
    doc.body.appendChild(text)
  } else {
    const table = doc.createElement("table"),
      head = doc.createElement("thead"),
      body = doc.createElement("tbody"),
      header = doc.createElement("tr")
    content.headers.forEach((value) => {
      const cell = doc.createElement("th")
      cell.textContent = value
      header.appendChild(cell)
    })
    head.appendChild(header)
    content.rows.forEach((values) => {
      const row = doc.createElement("tr")
      values.forEach((value) => {
        const cell = doc.createElement("td")
        cell.textContent = String(value)
        row.appendChild(cell)
      })
      body.appendChild(row)
    })
    table.append(head, body)
    doc.body.appendChild(table)
  }
  popup.requestAnimationFrame(() => popup.print())
}
