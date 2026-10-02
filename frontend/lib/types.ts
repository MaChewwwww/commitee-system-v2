export type PageId =
  | "login"
  | "dashboard"
  | "members"
  | "committees"
  | "assignments"
  | "jurisdiction"
  | "workload"
  | "performance"
  | "reports"
  | "users"
  | "forbidden"
export interface NavItem {
  key: PageId
  label: string
  href: string
  group: string
  permission: string
}
export interface AppConfig {
  page: PageId
  title: string
  description: string
  base: string
  pages: string
  api: string
  login: string
  assets: string
  userEmail: string
  role: string
  roleLabel: string
  permissions: string[]
  navigation: NavItem[]
}
declare global {
  interface Window {
    APP_CONFIG: AppConfig
  }
}
export interface Entity {
  id: string
  created_at?: string
}
export interface Member extends Entity {
  full_name: string
  email?: string
  phone?: string
  position?: string
  skills?: string[]
  availability: string
  workload_score?: number | string
}
export interface Committee extends Entity {
  name: string
  type?: string
  purpose?: string
  mandate?: string
  qualification_requirements?: string
  status: string
}
export interface Assignment extends Entity {
  member_id: string
  committee_id: string
  role: string
  assigned_at?: string
}
export interface Jurisdiction extends Entity {
  committee_id: string
  area_name: string
  category: string
}
export interface Task extends Entity {
  member_id: string | null
  committee_id: string | null
  title: string
  status: "pending" | "completed"
  due_date?: string | null
  updated_at?: string
  description?: string
}
export interface PerformanceRecord extends Entity {
  member_id: string
  committee_id?: string | null
  attendance_rate: number | string
  period?: string
}
export interface User extends Entity {
  email: string
  role_code: string
  role_label?: string
  member_id?: string | null
  member_name?: string
  is_active: number | string
}
export interface Role {
  id: string
  code: string
  label: string
}
export interface Report extends Entity {
  title: string
  committee_id?: string | null
  report_type: string
  date_from?: string | null
  date_to?: string | null
}
export interface Resources {
  members: Member
  committees: Committee
  assignments: Assignment
  jurisdictions: Jurisdiction
  tasks: Task
  performance: PerformanceRecord
  users: User
  roles: Role
  reports: Report
}
export type Resource = keyof Resources
export interface ApiResult {
  success: boolean
  message?: string
}
export interface Recommendation {
  member_id: string
  member_name: string
  reason: string
  score: number
  skills_match: string | number
}
export interface RecommendationResult extends ApiResult {
  data: { summary?: string; recommendations: Recommendation[] }
}
export interface WorkloadAnalysis {
  alert_level: string
  summary: string
  recommendations: { from_member: string; to_member: string; reason: string }[]
}
export interface PerformanceInsights {
  top_performer: string
  overall_team_score: number
  team_status: string
  insights: string[]
  recommendations: string[]
  needs_improvement: string[]
}
export interface AiMemberScore {
  member_id: string
  member_name: string
  position?: string
  total_tasks: number
  completed_tasks: number
  task_completion_rate: number
  attendance_rate: number
  on_time_rate: number
  final_score: number
  grade: string
}
