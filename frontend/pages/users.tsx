import { useState } from "react"
import { ManagementPage } from "@/components/management"
import { options, SelectBox, StatusBadge } from "@/components/shared"
import { useResource } from "@/lib/hooks"
import { can } from "@/lib/api"
import { dateLabel } from "@/lib/calculations"
export default function Users() {
  const roles = useResource("roles", true),
    members = useResource("members")
  const [status, setStatus] = useState("")
  return (
    <ManagementPage
      resource="users"
      singular="User"
      describe="Login accounts, roles, and member associations—all in one place."
      defaults={{ email: "", role_code: "", member_id: "", is_active: "1" }}
      queries={[roles, members]}
      fields={(editing, row) => [
        { name: "email", label: "Email address", type: "email", required: true, disabled: editing },
        {
          name: "role_code",
          label: "Role",
          required: true,
          disabled: editing && !can(window.APP_CONFIG, "roles.manage"),
          items: (roles.data || []).map((role) => ({ value: role.code, label: role.label })),
        },
        {
          name: "member_id",
          label: "Linked member",
          items: (members.data || []).map((member) => ({
            value: member.id,
            label: member.full_name,
          })),
          placeholder: "No linked member",
        },
        {
          name: "is_active",
          label: "Account status",
          onlyEdit: true,
          disabled: row?.email === window.APP_CONFIG.userEmail,
          items: [
            { value: "1", label: "Active" },
            { value: "0", label: "Inactive" },
          ],
        },
      ]}
      transform={(values, editing) => ({
        ...(editing ? { is_active: Number(values.is_active) } : { email: values.email.trim() }),
        ...(!editing || can(window.APP_CONFIG, "roles.manage") ? { role: values.role_code } : {}),
        member_id: values.member_id || null,
      })}
      canDelete={(user) => user.email !== window.APP_CONFIG.userEmail}
      columns={[
        {
          accessorKey: "email",
          header: "Email",
          cell: ({ row }) => (
            <span>
              {row.original.email}
              {row.original.email === window.APP_CONFIG.userEmail && (
                <small className="tw:ml-2 tw:text-muted-foreground">You</small>
              )}
            </span>
          ),
        },
        { accessorFn: (user) => user.role_label || user.role_code, id: "role", header: "Role" },
        {
          accessorFn: (user) =>
            user.member_name ||
            members.data?.find((member) => member.id === user.member_id)?.full_name ||
            "Not linked",
          id: "member",
          header: "Linked member",
        },
        {
          accessorKey: "is_active",
          header: "Status",
          cell: ({ row }) => (
            <StatusBadge value={Number(row.original.is_active) === 1 ? "Active" : "Inactive"} />
          ),
        },
        {
          accessorKey: "created_at",
          header: "Created",
          cell: ({ row }) => dateLabel(row.original.created_at),
        },
      ]}
      filter={
        <SelectBox
          label="Filter account status"
          value={status}
          onChange={setStatus}
          items={options(["Active", "Inactive"])}
          placeholder="All accounts"
        />
      }
      filteredData={(data) =>
        status
          ? data.filter((user) => Number(user.is_active) === (status === "Active" ? 1 : 0))
          : data
      }
    />
  )
}
