import { useState } from "react"
import { Users, UserCheck, Clock3, UserRound } from "lucide-react"
import { ManagementPage } from "@/components/management"
import { AttendanceRecords } from "@/components/attendance-records"
import { pendingCount } from "@/lib/calculations"
import {
  Person,
  ScoreBar,
  SelectBox,
  StatCard,
  StatGrid,
  StatusBadge,
  options,
} from "@/components/shared"
import { useResource } from "@/lib/hooks"
const positions = options([
  "Presiding Officer",
  "City Councilor",
  "Municipal Councilor",
  "Sanggunian Secretary",
  "Committee Staff",
  "Committee Member",
])
export default function Members() {
  const members = useResource("members")
  const tasks = useResource("tasks")
  const [availability, setAvailability] = useState("")
  return (
    <ManagementPage
      resource="members"
      singular="Member"
      defaults={{
        full_name: "",
        email: "",
        phone: "",
        position: "",
        skills: "",
        availability: "available",
      }}
      fields={(_, values) => [
        { name: "full_name", label: "Full name", required: true },
        { name: "email", label: "Email address", type: "email" },
        { name: "phone", label: "Phone number", type: "tel" },
        {
          name: "position",
          label: "Position",
          items:
            values?.position && !positions.some((p) => p.value === values.position)
              ? [...positions, { value: values.position, label: values.position }]
              : positions,
        },
        { name: "skills", label: "Skills", placeholder: "Leadership, communication…" },
        {
          name: "availability",
          label: "Availability",
          required: true,
          items: options(["available", "busy", "unavailable"]),
        },
      ]}
      transform={(values) => ({
        ...values,
        full_name: values.full_name.trim(),
        skills: values.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      })}
      columns={[
        {
          accessorKey: "full_name",
          header: "Member",
          cell: ({ row }) => <Person name={row.original.full_name} />,
        },
        { accessorKey: "position", header: "Position" },
        {
          accessorFn: (member) => member.email || member.phone || "—",
          id: "contact",
          header: "Contact",
        },
        {
          accessorKey: "availability",
          header: "Availability",
          cell: ({ row }) => <StatusBadge value={row.original.availability} />,
        },
        {
          accessorKey: "workload_score",
          header: "Workload",
          cell: ({ row }) =>
            !tasks.data ? (
              <span>Not available</span>
            ) : (
              <ScoreBar
                value={tasks.data ? pendingCount(tasks.data, row.original.id) * 20 : 0}
                label={`${row.original.full_name} workload`}
              />
            ),
        },
      ]}
      filter={
        <SelectBox
          label="Filter availability"
          value={availability}
          onChange={setAvailability}
          items={options(["available", "busy", "unavailable"])}
          placeholder="All availability"
        />
      }
      filteredData={(data) =>
        availability ? data.filter((member) => member.availability === availability) : data
      }
      before={
        <>
          <StatGrid>
            <StatCard
              label="Team members"
              value={members.data?.length ?? "—"}
              hint="Your community of contributors"
              icon={<Users size={16} />}
            />
            <StatCard
              label="Available"
              value={members.data?.filter((m) => m.availability === "available").length ?? "—"}
              hint="Ready for new opportunities"
              icon={<UserCheck size={16} />}
              tone="green"
            />
            <StatCard
              label="Busy"
              value={members.data?.filter((m) => m.availability === "busy").length ?? "—"}
              hint="Focused on current priorities"
              icon={<Clock3 size={16} />}
              tone="gold"
            />
            <StatCard
              label="Positions"
              value={
                members.data
                  ? new Set(members.data.map((m) => m.position).filter(Boolean)).size
                  : "—"
              }
              hint="Different strengths, shared purpose"
              icon={<UserRound size={16} />}
              tone="purple"
            />
          </StatGrid>
          <AttendanceRecords />
        </>
      }
    />
  )
}
