import {
  Building2,
  Users,
  Clock3,
  CircleCheck,
  ArrowUpRight,
  Plus,
  ClipboardList,
  FileText,
  ShieldCheck,
} from "lucide-react"
import {
  Section,
  StatCard,
  StatGrid,
  Person,
  StatusBadge,
  QueryState,
  EmptyState,
} from "@/components/shared"
import { DistributionChart } from "@/components/charts"
import { useResource } from "@/lib/hooks"
import { can } from "@/lib/api"
export default function Dashboard() {
  const members = useResource("members"),
    committees = useResource("committees"),
    tasks = useResource("tasks")
  const pending = tasks.data?.filter((task) => task.status !== "completed").length
  const completed = tasks.data?.filter((task) => task.status === "completed").length
  const nav = window.APP_CONFIG.navigation
  const link = (key: string) => nav.find((item) => item.key === key)?.href || "#"
  const quick = [
    { page: "members", permission: "members.create", label: "Add a member", icon: Users },
    {
      page: "committees",
      permission: "committees.create",
      label: "Create a committee",
      icon: Plus,
    },
    {
      page: "assignments",
      permission: "assignments.create",
      label: "Assign a member",
      icon: ClipboardList,
    },
    { page: "reports", permission: "reports.create", label: "Build a report", icon: FileText },
  ].filter((item) => can(window.APP_CONFIG, item.permission))
  return (
    <>
      <div className="ui-welcome">
        <div>
          <p className="ui-eyebrow">YOUR COMMUNITY, MOVING FORWARD</p>
          <h2>A little clarity. A lot of progress.</h2>
          <p>
            Keep your people, committees, and priorities connected. Here is what is happening across
            your workspace.
          </p>
        </div>
        <ShieldCheck size={70} className="ui-welcome-mark" />
      </div>
      <StatGrid>
        <StatCard
          label="Committees"
          value={committees.data?.length ?? "—"}
          hint="Across your accessible workspace"
          icon={<Building2 size={16} />}
        />
        <StatCard
          label="Team members"
          value={members.data?.length ?? "—"}
          hint="People making things happen"
          icon={<Users size={16} />}
          tone="purple"
        />
        <StatCard
          label="Pending tasks"
          value={pending ?? "—"}
          hint="Ready for your next move"
          icon={<Clock3 size={16} />}
          tone="gold"
        />
        <StatCard
          label="Completed tasks"
          value={completed ?? "—"}
          hint="Progress worth celebrating"
          icon={<CircleCheck size={16} />}
          tone="green"
        />
      </StatGrid>
      <div className="ui-dashboard-split">
        <Section title="Task overview" description="A clear picture of the work in motion.">
          <QueryState queries={[tasks]}>
            {tasks.data ? (
              <DistributionChart
                label="Total tasks"
                segments={[
                  { label: "Completed", value: completed || 0, color: "#3c9c7d" },
                  { label: "Pending", value: pending || 0, color: "#d6a23a" },
                ]}
              />
            ) : (
              <EmptyState
                title="Task data is restricted"
                description="Your role does not include access to tasks."
              />
            )}
          </QueryState>
        </Section>
        <Section
          title="Recent committees"
          description="The teams serving your community."
          action={
            can(window.APP_CONFIG, "committees.view") && (
              <a className="ui-link" href={link("committees")}>
                View all
                <ArrowUpRight size={13} />
              </a>
            )
          }
        >
          <QueryState queries={[committees]}>
            {committees.data?.length ? (
              committees.data.slice(0, 4).map((committee) => (
                <div className="ui-list-row" key={committee.id}>
                  <div>
                    <strong>{committee.name}</strong>
                  </div>
                  <StatusBadge value={committee.type} />
                </div>
              ))
            ) : (
              <EmptyState
                title={
                  can(window.APP_CONFIG, "committees.view")
                    ? "No committees yet"
                    : "Committee data is restricted"
                }
              />
            )}
          </QueryState>
        </Section>
      </div>
      <div className="ui-two-column">
        <Section
          title="Your people"
          description="The members behind the work."
          action={
            can(window.APP_CONFIG, "members.view") && (
              <a className="ui-link" href={link("members")}>
                View all
                <ArrowUpRight size={13} />
              </a>
            )
          }
        >
          <QueryState queries={[members]}>
            {members.data?.length ? (
              members.data.slice(0, 4).map((member) => (
                <div className="ui-list-row" key={member.id}>
                  <Person name={member.full_name} detail={member.position || "Committee member"} />
                  <StatusBadge value={member.availability} />
                </div>
              ))
            ) : (
              <EmptyState
                title={
                  can(window.APP_CONFIG, "members.view")
                    ? "No members yet"
                    : "Member data is restricted"
                }
              />
            )}
          </QueryState>
        </Section>
        <Section
          title="Make your next move"
          description="Useful shortcuts, right where you need them."
        >
          <div className="ui-quick-grid">
            {quick.map((item) => (
              <a key={item.page} href={link(item.page)} className="ui-quick-action">
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
          {!quick.length && (
            <EmptyState
              title="Explore your workspace"
              description="Use the navigation to view the pages available to your role."
            />
          )}
        </Section>
      </div>
    </>
  )
}
