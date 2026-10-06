import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n, n as r } from "./api-DVPVP-g0.js";
import { S as i, n as a, v as o, x as s } from "./hooks-BlRndFBy.js";
import { t as c } from "./management-Z1Cs2zh-.js";
import { n as l } from "./calculations-ZvWekKcJ.js";
//#region frontend/pages/users.tsx
var u = /* @__PURE__ */ e(t(), 1), d = n();
function f() {
	let e = a("roles", !0), t = a("members"), [n, f] = (0, u.useState)("");
	return /* @__PURE__ */ (0, d.jsx)(c, {
		resource: "users",
		singular: "User",
		describe: "Login accounts, roles, and member associations—all in one place.",
		defaults: {
			email: "",
			role_code: "",
			member_id: "",
			is_active: "1"
		},
		queries: [e, t],
		fields: (n, i) => [
			{
				name: "email",
				label: "Email address",
				type: "email",
				required: !0,
				disabled: n
			},
			{
				name: "role_code",
				label: "Role",
				required: !0,
				disabled: n && !r(window.APP_CONFIG, "roles.manage"),
				items: (e.data || []).map((e) => ({
					value: e.code,
					label: e.label
				}))
			},
			{
				name: "member_id",
				label: "Linked member",
				required: ["sk_member", "committee_chairperson"].includes(i?.role_code || ""),
				items: (t.data || []).map((e) => ({
					value: e.id,
					label: e.full_name
				})),
				placeholder: "No linked member"
			},
			{
				name: "is_active",
				label: "Account status",
				onlyEdit: !0,
				disabled: i?.email === window.APP_CONFIG.userEmail,
				items: [{
					value: "1",
					label: "Active"
				}, {
					value: "0",
					label: "Inactive"
				}]
			}
		],
		transform: (e, t) => ({
			...t ? { is_active: Number(e.is_active) } : { email: e.email.trim() },
			...!t || r(window.APP_CONFIG, "roles.manage") ? { role: e.role_code } : {},
			member_id: e.member_id || null
		}),
		canDelete: (e) => e.email !== window.APP_CONFIG.userEmail,
		columns: [
			{
				accessorKey: "email",
				header: "Email",
				cell: ({ row: e }) => /* @__PURE__ */ (0, d.jsxs)("span", { children: [e.original.email, e.original.email === window.APP_CONFIG.userEmail && /* @__PURE__ */ (0, d.jsx)("small", {
					className: "tw:ml-2 tw:text-muted-foreground",
					children: "You"
				})] })
			},
			{
				accessorFn: (e) => e.role_label || e.role_code,
				id: "role",
				header: "Role"
			},
			{
				accessorFn: (e) => e.member_name || t.data?.find((t) => t.id === e.member_id)?.full_name || "Not linked",
				id: "member",
				header: "Linked member"
			},
			{
				accessorKey: "is_active",
				header: "Status",
				cell: ({ row: e }) => /* @__PURE__ */ (0, d.jsx)(s, { value: Number(e.original.is_active) === 1 ? "Active" : "Inactive" })
			},
			{
				accessorKey: "created_at",
				header: "Created",
				cell: ({ row: e }) => l(e.original.created_at)
			}
		],
		filter: /* @__PURE__ */ (0, d.jsx)(o, {
			label: "Filter account status",
			value: n,
			onChange: f,
			items: i(["Active", "Inactive"]),
			placeholder: "All accounts"
		}),
		filteredData: (e) => n ? e.filter((e) => Number(e.is_active) === +(n === "Active")) : e
	});
}
//#endregion
export { f as default };
