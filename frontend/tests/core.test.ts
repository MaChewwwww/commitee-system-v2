import { describe, it, expect, vi } from "vitest"
import { can, request, list, apiUrl, ApiError } from "@/lib/api"
import {
  grade,
  overlappingAreas,
  pendingCount,
  workloadStatus,
  performanceScores,
  dateLabel,
  committeeOpen,
} from "@/lib/calculations"
import { buildReport, csvText, printDocument } from "@/lib/reports"
import { config, members, tasks, performance, committees, assignments } from "./fixtures"
describe("existing business rules", () => {
  it("counts all unfinished workflow states and retains completion evidence", () => {
    const all = ["pending", "in_progress", "awaiting_approval", "completed"] as const
    expect(
      pendingCount(
        all.map((status) => ({ ...tasks[0], status })),
        members[0].id,
      ),
    ).toBe(3)
    const unknown = performanceScores(members, [{ ...tasks[1], completed_at: null }], performance)
    expect(unknown[0].on_time_rate).toBe(0)
    expect(unknown[0].final_score).toBe(70)
    expect(committeeOpen({ status: "active", effective_until: "2000-01-01" })).toBe(false)
    expect(committeeOpen({ status: "active", effective_until: "2099-01-01" })).toBe(true)
  })
  it("preserves workload limits and boundaries", () => {
    expect(pendingCount(tasks, members[0].id)).toBe(1)
    expect([0, 1, 2, 5, 6].map(workloadStatus)).toEqual([
      "Underloaded",
      "Underloaded",
      "Balanced",
      "Balanced",
      "Overloaded",
    ])
  })
  it("preserves weighted scores, grades, ranking, and zero-task behavior", () => {
    const scores = performanceScores(members, tasks, performance)
    expect(scores[0]).toMatchObject({
      final_score: 75,
      task_completion_rate: 50,
      attendance_rate: 100,
      on_time_rate: 100,
      grade: "Good",
    })
    expect(scores[1].final_score).toBe(0)
    expect([59, 60, 74, 75, 89, 90].map(grade)).toEqual([
      "Needs Improvement",
      "Average",
      "Average",
      "Good",
      "Good",
      "Excellent",
    ])
  })
  it("finds overlapping areas and formats Manila dates", () => {
    expect(
      overlappingAreas([
        { id: "1", committee_id: "a", area_name: "Poblacion", category: "Education" },
        { id: "2", committee_id: "b", area_name: "Poblacion", category: "Health" },
      ]),
    ).toEqual(["Poblacion"])
    expect(dateLabel("2026-10-02T18:00:00Z")).toContain("Oct 3")
    expect(dateLabel("2026-10-03")).toContain("Oct 3")
  })
  it("uses the recorded completion date and counts the entire due day as on time", () => {
    const scores = performanceScores(
      members,
      [
        {
          ...tasks[1],
          due_date: "2026-10-01",
          completed_at: "2026-10-01 23:59:59",
          updated_at: "2026-10-03 12:00:00",
        },
      ],
      performance,
    )
    expect(scores[0].on_time_rate).toBe(100)
    expect(scores[0].final_score).toBe(100)
  })
})
describe("API compatibility", () => {
  it("uses root or subfolder URLs and same-origin JSON payloads", async () => {
    window.APP_CONFIG = config()
    expect(apiUrl("/members/index.php")).toBe("/committee/backend/api/members/index.php")
    expect(apiUrl("tasks/index.php", config({ api: "/backend/api" }))).toBe(
      "/backend/api/tasks/index.php",
    )
    const fetch = vi
      .spyOn(window, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))
    await request("members/index.php", "PUT", { id: "uuid", full_name: "Name" })
    expect(fetch).toHaveBeenCalledWith(
      "/committee/backend/api/members/index.php",
      expect.objectContaining({
        method: "PUT",
        credentials: "same-origin",
        body: JSON.stringify({ id: "uuid", full_name: "Name" }),
      }),
    )
  })
  it("reads both existing array and wrapped list contracts", async () => {
    window.APP_CONFIG = config()
    vi.spyOn(window, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(members)))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: members })))
    expect(await list("members")).toEqual(members)
    expect(await list("users")).toEqual(members)
  })
  it("rejects application errors, forbidden requests, and unreadable responses", async () => {
    window.APP_CONFIG = config()
    vi.spyOn(window, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: false, message: "Save failed" })),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 }),
      )
      .mockResolvedValueOnce(new Response("<html>Server error</html>", { status: 500 }))
    await expect(request("members/index.php", "POST", {})).rejects.toThrow("Save failed")
    await expect(request("users/index.php")).rejects.toMatchObject({ status: 403 })
    await expect(request("tasks/index.php")).rejects.toBeInstanceOf(ApiError)
  })
  it("treats OTP failures as inline errors without redirecting", async () => {
    window.APP_CONFIG = config({ page: "login" })
    vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false, message: "Invalid OTP" }), { status: 401 }),
    )
    await expect(request("verify_otp.php", "POST", { otp: "000000" })).rejects.toThrow(
      "Invalid OTP",
    )
  })
  it("rejects an expired authenticated session", async () => {
    window.APP_CONFIG = config()
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ authenticated: false }), { status: 401 }),
    )
    await expect(request("members/index.php")).rejects.toMatchObject({
      status: 401,
      message: "Your session expired. Please sign in again.",
    })
  })
  it("preserves super-admin and restricted permission semantics", () => {
    expect(can(config(), "users.delete")).toBe(true)
    const restricted = config({ role: "sk_member", permissions: ["members.view"] })
    expect(can(restricted, "members.view")).toBe(true)
    expect(can(restricted, "members.create")).toBe(false)
  })
})
describe("report compatibility and safe export", () => {
  const data = { members, tasks, committees, assignments }
  it("builds every existing report type and uses the same weighted performance grades", () => {
    expect(buildReport("committee", data, "missing").rows).toHaveLength(0)
    expect(buildReport("member", data).rows[0][4]).toBe("1/5 tasks")
    expect(buildReport("performance", data).rows[0].slice(2)).toEqual([
      2,
      1,
      "55%",
      "Needs Improvement",
    ])
    expect(buildReport("workload", data).rows[0][4]).toBe("Underloaded")
    expect(buildReport("full", data).rows).toHaveLength(7)
  })
  it("quotes commas, quotes, newlines, Unicode, and spreadsheet formulas", () => {
    const csv = csvText({
      title: "Test",
      headers: ["Value"],
      rows: [['A, "B"\nC'], ['=HYPERLINK("bad")'], ["José"]],
    })
    expect(csv).toContain('"A, ""B""\nC"')
    expect(csv).toContain("\"'=HYPERLINK")
    expect(csv).toContain("José")
  })
  it("prints all rows as text without interpreting report content as HTML", () => {
    const print = vi.fn(),
      doc = document.implementation.createHTMLDocument("Print")
    vi.spyOn(window, "open").mockReturnValue({
      document: doc,
      print,
      requestAnimationFrame: (callback: () => void) => {
        callback()
        return 0
      },
      opener: window,
    } as unknown as Window)
    printDocument("Report <safe>", {
      title: "Test",
      headers: ["Name"],
      rows: [["<script>unsafe()</script>"]],
    })
    expect(doc.querySelector("td")?.textContent).toBe("<script>unsafe()</script>")
    expect(doc.querySelector("script")).toBeNull()
    expect(print).toHaveBeenCalledOnce()
  })
})
