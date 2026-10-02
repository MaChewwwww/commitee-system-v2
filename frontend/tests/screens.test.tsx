import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, within, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NoticeProvider } from "@/components/shared"
import { AppShell } from "@/components/shell"
import Login from "@/pages/login"
import Members from "@/pages/members"
import Committees from "@/pages/committees"
import Assignments from "@/pages/assignments"
import Jurisdiction from "@/pages/jurisdiction"
import Workload from "@/pages/workload"
import Performance from "@/pages/performance"
import Reports from "@/pages/reports"
import Users from "@/pages/users"
import Dashboard from "@/pages/dashboard"
import Forbidden from "@/pages/forbidden"
import { config, resourceData } from "./fixtures"
import type { PageId } from "@/lib/types"

type Handler = (path: string, init?: RequestInit) => Response | Promise<Response> | undefined
function mockApi(handler?: Handler) {
  return vi.spyOn(window, "fetch").mockImplementation(async (url, init) => {
    const path = String(url)
    const custom = handler?.(path, init)
    if (custom) return await custom
    const resource = path.split("/").at(-2) as keyof typeof resourceData
    if (init?.method && init.method !== "GET")
      return new Response(JSON.stringify({ success: true, message: "Saved successfully" }))
    const data = resourceData[resource] || []
    return new Response(
      JSON.stringify(resource === "users" || resource === "roles" ? { success: true, data } : data),
    )
  })
}
function mount(Component: React.ComponentType, page: PageId) {
  window.APP_CONFIG = { ...window.APP_CONFIG, page }
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <NoticeProvider>
          <Component />
        </NoticeProvider>
      </TooltipProvider>
    </QueryClientProvider>,
  )
}
async function choose(label: string, option: string) {
  await userEvent.click(screen.getByRole("combobox", { name: label }))
  await userEvent.click(await screen.findByRole("option", { name: option }))
}
beforeEach(() => {
  window.APP_CONFIG = config()
  document.body.innerHTML = '<div id="ui-portal-root" class="ui-scope"></div>'
})
describe("all redesigned screens", () => {
  const cases: [React.ComponentType, PageId, string][] = [
    [Dashboard, "dashboard", "Task overview"],
    [Members, "members", "Members directory"],
    [Committees, "committees", "Committees directory"],
    [Assignments, "assignments", "Assignments directory"],
    [Jurisdiction, "jurisdiction", "Jurisdiction directory"],
    [Workload, "workload", "Task board"],
    [Performance, "performance", "Performance directory"],
    [Reports, "reports", "Turn your work into a clear report"],
    [Users, "users", "Users directory"],
    [Forbidden, "forbidden", "This space needs permission"],
    [Login, "login", "Welcome back."],
  ]
  it.each(cases)("renders %s with the existing API contracts", async (Component, page, title) => {
    mockApi()
    mount(Component, page)
    expect(await screen.findByText(title)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByLabelText("Loading data")).not.toBeInTheDocument())
  })
})
describe("forms and authorization", () => {
  it("shows committee membership counts and a read-only detail view with icon actions", async () => {
    const fetcher = mockApi()
    mount(Committees, "committees")
    expect(await screen.findByText("1 / 5")).toBeInTheDocument()
    const view = screen.getByRole("button", { name: "View Committee" })
    expect(view.textContent).toBe("")
    expect(screen.getByRole("button", { name: "Edit Committee" }).textContent).toBe("")
    await userEvent.click(view)
    const dialog = screen.getByRole("dialog")
    expect(within(dialog).getByText("Alex Reyes")).toBeInTheDocument()
    expect(within(dialog).getByText("Barangay Poblacion · Education")).toBeInTheDocument()
    expect(within(dialog).queryByRole("button", { name: "Save changes" })).not.toBeInTheDocument()
    expect(fetcher.mock.calls.every(([, init]) => !init?.method || init.method === "GET")).toBe(
      true,
    )
  })

  it("uses jurisdiction-linked committee names and shows their coverage while editing", async () => {
    mockApi()
    mount(Committees, "committees")
    await userEvent.click(await screen.findByRole("button", { name: "Edit Committee" }))
    expect(screen.getByRole("combobox", { name: /Committee name/ })).toHaveTextContent(
      "Youth Development",
    )
    expect(screen.queryByRole("textbox", { name: /Committee name/ })).not.toBeInTheDocument()
    expect(screen.getByText("Barangay Poblacion · Education")).toBeInTheDocument()
    expect(await screen.findByRole("combobox", { name: "Role for Alex Reyes" })).toHaveTextContent(
      "Chairperson",
    )
  })

  it("adds, updates, and confirms removal of members from the committee edit dialog", async () => {
    const records = resourceData.assignments.map((a) => ({ ...a }))
    const calls: { method: string; body: Record<string, string> }[] = []
    mockApi((path, init) => {
      if (!path.endsWith("assignments/index.php")) return
      if (!init?.method || init.method === "GET") return new Response(JSON.stringify(records))
      const body = JSON.parse(String(init.body))
      calls.push({ method: init.method, body })
      if (init.method === "POST") records.push({ ...body, id: "assignment-2" })
      if (init.method === "PUT") records.find((a) => a.id === body.id)!.role = body.role
      if (init.method === "DELETE")
        records.splice(
          records.findIndex((a) => a.id === body.id),
          1,
        )
      return new Response(JSON.stringify({ success: true }))
    })
    mount(Committees, "committees")
    await userEvent.click(await screen.findByRole("button", { name: "Edit Committee" }))
    await screen.findByRole("combobox", { name: "Role for Alex Reyes" })
    await choose("Role for Alex Reyes", "Secretary")
    await userEvent.click(screen.getByRole("button", { name: "Save role for Alex Reyes" }))
    await waitFor(() =>
      expect(calls).toContainEqual({
        method: "PUT",
        body: { id: "assignment-1", role: "Secretary" },
      }),
    )
    await choose("Add committee member", "Sam Cruz")
    await userEvent.click(screen.getByRole("button", { name: "Assign member" }))
    await screen.findByRole("combobox", { name: "Role for Sam Cruz" })
    expect(calls).toContainEqual({
      method: "POST",
      body: { committee_id: "committee-1", member_id: "member-2", role: "Member" },
    })
    await userEvent.click(screen.getByRole("button", { name: "Remove Sam Cruz" }))
    expect(calls.filter((c) => c.method === "DELETE")).toHaveLength(0)
    await userEvent.click(screen.getByRole("button", { name: "Confirm removal" }))
    await waitFor(() =>
      expect(screen.queryByRole("combobox", { name: "Role for Sam Cruz" })).not.toBeInTheDocument(),
    )
    expect(calls).toContainEqual({ method: "DELETE", body: { id: "assignment-2" } })
  })

  it("preserves membership choices after a failed save", async () => {
    mockApi((path, init) =>
      path.endsWith("assignments/index.php") && init?.method === "POST"
        ? new Response(JSON.stringify({ success: false, message: "Assignment unavailable" }), {
            status: 409,
          })
        : undefined,
    )
    mount(Committees, "committees")
    await userEvent.click(await screen.findByRole("button", { name: "Edit Committee" }))
    await screen.findByRole("combobox", { name: "Add committee member" })
    await choose("Add committee member", "Sam Cruz")
    await userEvent.click(screen.getByRole("button", { name: "Assign member" }))
    expect(await screen.findByText("Assignment unavailable")).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Add committee member" })).toHaveTextContent(
      "Sam Cruz",
    )
  })

  it("hides membership mutations when the committee editor has view-only assignment access", async () => {
    window.APP_CONFIG = config({
      role: "administrator",
      permissions: [
        "committees.view",
        "committees.update",
        "jurisdictions.view",
        "members.view",
        "assignments.view",
      ],
    })
    mockApi()
    mount(Committees, "committees")
    await userEvent.click(await screen.findByRole("button", { name: "Edit Committee" }))
    expect(await screen.findByRole("combobox", { name: "Role for Alex Reyes" })).toBeDisabled()
    expect(screen.queryByRole("button", { name: "Assign member" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Remove Alex Reyes" })).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Save role for Alex Reyes" }),
    ).not.toBeInTheDocument()
  })

  it("retains member input on failure and closes only after a successful retry", async () => {
    let fail = true
    mockApi((path, init) =>
      path.endsWith("members/index.php") && init?.method === "POST"
        ? new Response(
            JSON.stringify({
              success: !fail,
              message: fail ? "A member with this email exists" : "Saved",
            }),
            { status: fail ? 409 : 200 },
          )
        : undefined,
    )
    mount(Members, "members")
    await screen.findByText("Alex Reyes")
    await userEvent.click(screen.getByRole("button", { name: "Add member" }))
    await userEvent.type(screen.getByLabelText(/Full name/), "Taylor Santos")
    await userEvent.type(screen.getByLabelText("Email address"), "taylor@example.test")
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }))
    expect(await screen.findByText("A member with this email exists")).toBeInTheDocument()
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Taylor Santos")
    fail = false
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
  it("blocks duplicate submissions while a save is pending", async () => {
    let resolve!: (response: Response) => void
    const pending = new Promise<Response>((done) => {
      resolve = done
    })
    const fetch = mockApi((path, init) =>
      path.endsWith("members/index.php") && init?.method === "POST" ? pending : undefined,
    )
    mount(Members, "members")
    await screen.findByText("Alex Reyes")
    await userEvent.click(screen.getByRole("button", { name: "Add member" }))
    await userEvent.type(screen.getByLabelText(/Full name/), "New member")
    const save = screen.getByRole("button", { name: "Save changes" })
    await userEvent.dblClick(save)
    expect(save).toBeDisabled()
    expect(fetch.mock.calls.filter(([, init]) => init?.method === "POST")).toHaveLength(1)
    await act(async () => resolve(new Response(JSON.stringify({ success: true }))))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
  it("hides mutation controls from read-only members and does not fetch unrelated resources", async () => {
    window.APP_CONFIG = config({ role: "sk_member", permissions: ["members.view"] })
    const fetch = mockApi()
    mount(Members, "members")
    await screen.findByText("Alex Reyes")
    expect(screen.queryByRole("button", { name: "Add member" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Edit Member" })).not.toBeInTheDocument()
    expect(fetch.mock.calls.every(([path]) => String(path).endsWith("members/index.php"))).toBe(
      true,
    )
  })
  it("does not send a role update without roles.manage or allow deleting the current user", async () => {
    window.APP_CONFIG = config({
      role: "administrator",
      permissions: ["users.view", "users.update", "users.delete", "members.view"],
    })
    const fetch = mockApi()
    mount(Users, "users")
    await screen.findByText("admin@example.test")
    const selfRow = screen.getByText("admin@example.test").closest("tr")!
    expect(within(selfRow).queryByRole("button", { name: "Remove User" })).not.toBeInTheDocument()
    await userEvent.click(within(selfRow).getByRole("button", { name: "Edit User" }))
    expect(screen.getByRole("combobox", { name: "Role" })).toBeDisabled()
    expect(screen.getByRole("combobox", { name: "Account status" })).toBeDisabled()
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }))
    await waitFor(() =>
      expect(fetch.mock.calls.some(([, init]) => init?.method === "PUT")).toBe(true),
    )
    const body = JSON.parse(
      String(fetch.mock.calls.find(([, init]) => init?.method === "PUT")![1]?.body),
    )
    expect(body).not.toHaveProperty("role")
    expect(body.id).toBe("user-1")
  })
  it("shows a recoverable access-denied API response", async () => {
    mockApi((path) =>
      path.endsWith("members/index.php")
        ? new Response(JSON.stringify({ message: "Missing permission" }), { status: 403 })
        : undefined,
    )
    mount(Members, "members")
    expect(await screen.findByText("Access restricted")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument()
  })
  it("searches and filters member tables without changing API data", async () => {
    mockApi()
    mount(Members, "members")
    await screen.findByText("Alex Reyes")
    await userEvent.type(screen.getByRole("textbox", { name: "Search members…" }), "Alex")
    expect(screen.queryByText("Sam Cruz")).not.toBeInTheDocument()
    await userEvent.clear(screen.getByRole("textbox", { name: "Search members…" }))
    await choose("Filter availability", "busy")
    expect(screen.getByText("Sam Cruz")).toBeInTheDocument()
    expect(screen.queryByText("Alex Reyes")).not.toBeInTheDocument()
  })
})
describe("OTP and AI workflows", () => {
  it("advances OTP steps and retains the code after invalid verification", async () => {
    mockApi((path, init) =>
      init?.method === "POST" && path.endsWith("verify_otp.php")
        ? new Response(JSON.stringify({ success: false, message: "Invalid or expired OTP" }), {
            status: 401,
          })
        : undefined,
    )
    mount(Login, "login")
    await userEvent.type(screen.getByLabelText(/Email address/), "alex@example.test")
    await userEvent.click(screen.getByRole("button", { name: /Send verification code/ }))
    expect(await screen.findByText("Check your inbox.")).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText("Verification code"), "123456")
    await userEvent.click(screen.getByRole("button", { name: /Verify and sign in/ }))
    expect(await screen.findByText("Invalid or expired OTP")).toBeInTheDocument()
    expect(screen.getByLabelText("Verification code")).toHaveValue("123456")
    await userEvent.click(screen.getByRole("button", { name: /Change email or resend/ }))
    expect(screen.getByLabelText(/Email address/)).toHaveValue("alex@example.test")
  })
  it("confirms AI recommendation acceptance using its original committee context", async () => {
    const fetch = mockApi((path, init) =>
      path.endsWith("ai/recommend.php")
        ? new Response(
            JSON.stringify({
              success: true,
              data: {
                summary: "A good fit",
                recommendations: [
                  {
                    member_id: "member-2",
                    member_name: "Sam Cruz",
                    reason: "Strong communication",
                    score: 90,
                    skills_match: "communication",
                  },
                ],
              },
            }),
          )
        : undefined,
    )
    mount(Assignments, "assignments")
    await screen.findByText("Alex Reyes")
    await choose("Committee", "Youth Development")
    await userEvent.click(screen.getByRole("button", { name: /Find recommended members/ }))
    expect(await screen.findByText("A good fit")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Accept" }))
    await userEvent.click(screen.getByRole("button", { name: "Confirm assignment" }))
    expect(await screen.findByText("Accepted")).toBeInTheDocument()
    const call = fetch.mock.calls.find(
      ([path, init]) => String(path).endsWith("assignments/index.php") && init?.method === "POST",
    )!
    expect(JSON.parse(String(call[1]?.body))).toEqual({
      member_id: "member-2",
      committee_id: "committee-1",
      role: "Member",
    })
  })
  it("keeps previous AI analysis visible when a later request fails", async () => {
    let fail = false
    mockApi((path) =>
      path.endsWith("ai/workload.php")
        ? new Response(
            JSON.stringify(
              fail
                ? { success: false, message: "AI service unavailable" }
                : {
                    success: true,
                    ai_analysis: {
                      alert_level: "green",
                      summary: "Your team has room to grow",
                      recommendations: [],
                    },
                  },
            ),
            { status: fail ? 503 : 200 },
          )
        : undefined,
    )
    mount(Workload, "workload")
    await userEvent.click(screen.getByRole("button", { name: /Analyze workload/ }))
    expect(await screen.findByText("Your team has room to grow")).toBeInTheDocument()
    fail = true
    await userEvent.click(screen.getByRole("button", { name: /Analyze workload/ }))
    expect(await screen.findByText("AI service unavailable")).toBeInTheDocument()
    expect(screen.getByText("Your team has room to grow")).toBeInTheDocument()
  })
})
describe("report and shell workflows", () => {
  it("records generated metadata and uses subfolder-safe archive and session endpoints", async () => {
    const fetch = mockApi()
    mount(Reports, "reports")
    await waitFor(() => expect(screen.queryByLabelText("Loading data")).not.toBeInTheDocument())
    await choose("Report type", "Committee report")
    await userEvent.click(screen.getByRole("button", { name: "Generate report" }))
    await screen.findByText("Youth Development")
    expect(
      fetch.mock.calls.some(
        ([path, init]) => String(path).endsWith("reports/index.php") && init?.method === "POST",
      ),
    ).toBe(true)
    await userEvent.click(screen.getByRole("tab", { name: "Report history" }))
    await userEvent.click(screen.getByRole("button", { name: "Archive" }))
    await userEvent.click(screen.getByRole("button", { name: /Send performance to sessions/ }))
    expect(
      fetch.mock.calls.some(
        ([path]) => path === "/committee/backend/api/reports/export_to_archives.php",
      ),
    ).toBe(true)
    expect(
      fetch.mock.calls.some(
        ([path]) => path === "/committee/backend/api/performance/send_to_session.php",
      ),
    ).toBe(true)
  })
  it("collapses the shell and opens accessible mobile navigation", async () => {
    mockApi()
    function Shell() {
      return (
        <AppShell>
          <p>Workspace content</p>
        </AppShell>
      )
    }
    mount(Shell, "dashboard")
    await userEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }))
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Open navigation" }))
    expect(await screen.findByRole("dialog", { name: "Navigation" })).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
})
