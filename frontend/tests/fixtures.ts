import type {
  AppConfig,
  Member,
  Committee,
  Task,
  Assignment,
  Jurisdiction,
  PerformanceRecord,
  User,
  Report,
} from "@/lib/types"
export const members: Member[] = [
  {
    id: "member-1",
    full_name: "Alex Reyes",
    position: "SK Chairman",
    skills: ["leadership"],
    email: "alex@example.test",
    availability: "available",
    workload_score: 20,
  },
  {
    id: "member-2",
    full_name: "Sam Cruz",
    position: "SK Kagawad",
    skills: ["communication"],
    availability: "busy",
    workload_score: 40,
  },
]
export const committees: Committee[] = [
  {
    id: "committee-1",
    name: "Youth Development",
    type: "Standing",
    purpose: "Support youth programs",
    status: "active",
    created_at: "2026-10-01",
  },
]
export const tasks: Task[] = [
  {
    id: "task-1",
    member_id: "member-1",
    committee_id: "committee-1",
    title: "Organize youth forum",
    status: "pending",
    due_date: "2026-10-10",
  },
  {
    id: "task-2",
    member_id: "member-1",
    committee_id: "committee-1",
    title: "Prepare program brief",
    status: "completed",
    due_date: "2026-10-01",
    updated_at: "2026-09-30",
  },
]
export const assignments: Assignment[] = [
  {
    id: "assignment-1",
    member_id: "member-1",
    committee_id: "committee-1",
    role: "Chairperson",
    assigned_at: "2026-10-01",
  },
]
export const jurisdictions: Jurisdiction[] = [
  {
    id: "jurisdiction-1",
    committee_id: "committee-1",
    area_name: "Barangay Poblacion",
    category: "Education",
  },
]
export const performance: PerformanceRecord[] = [
  { id: "performance-1", member_id: "member-1", attendance_rate: 100 },
]
export const users: User[] = [
  {
    id: "user-1",
    email: "admin@example.test",
    role_code: "super_admin",
    role_label: "Administrator",
    is_active: 1,
  },
  {
    id: "user-2",
    email: "member@example.test",
    role_code: "sk_member",
    role_label: "SK Member",
    is_active: 1,
  },
]
export const reports: Report[] = [
  {
    id: "report-1",
    title: "Committee Report",
    report_type: "committee",
    date_from: "2026-09-01",
    date_to: "2026-10-01",
    created_at: "2026-10-01",
  },
]
export const roles = [
  { id: "role-1", code: "super_admin", label: "Administrator" },
  { id: "role-2", code: "sk_member", label: "SK Member" },
]
export const resourceData = {
  members,
  committees,
  tasks,
  assignments,
  jurisdictions,
  performance,
  users,
  reports,
  roles,
}
export function config(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    page: "dashboard",
    title: "Dashboard",
    description: "Your workspace overview.",
    base: "/committee",
    pages: "/committee/pages",
    api: "/committee/backend/api",
    assets: "/committee/assets",
    login: "/committee/pages/login.php",
    userEmail: "admin@example.test",
    role: "super_admin",
    roleLabel: "Administrator",
    permissions: [],
    navigation: [
      "dashboard",
      "members",
      "committees",
      "assignments",
      "jurisdiction",
      "workload",
      "performance",
      "reports",
      "users",
    ].map((key) => ({
      key: key as AppConfig["page"],
      label: key,
      href: `/committee/pages/${key}.php`,
      group: "Workspace",
      permission: `${key === "jurisdiction" ? "jurisdictions" : key}.view`,
    })),
    ...overrides,
  }
}
