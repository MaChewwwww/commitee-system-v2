import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n } from "./api-DVPVP-g0.js";
import { F as r, _ as i, h as a, n as o, s, v as c, x as l } from "./hooks-BlRndFBy.js";
import { i as u, n as d, o as f, r as p } from "./calculations-ZvWekKcJ.js";
//#region frontend/pages/workload.tsx
var m = /* @__PURE__ */ e(t(), 1), h = n();
function g() {
	let e = o("members"), t = o("committees"), n = o("tasks"), [g, _] = (0, m.useState)(""), [v, y] = (0, m.useState)(""), [b, x] = (0, m.useState)(""), S = p(), C = (n.data || []).map((n) => ({
		...n,
		handled_by: e.data?.find((e) => e.id === n.member_id)?.full_name || (n.member_id ? "Member unavailable" : "Unassigned"),
		committee: t.data?.find((e) => e.id === n.committee_id)?.name || (n.committee_id ? "Committee unavailable" : "No committee")
	}));
	return /* @__PURE__ */ (0, h.jsxs)(h.Fragment, { children: [
		/* @__PURE__ */ (0, h.jsx)("div", {
			className: "ui-page-actions",
			children: /* @__PURE__ */ (0, h.jsx)("p", { children: "Monitor assigned tasks, deadlines, completion, and member workload." })
		}),
		/* @__PURE__ */ (0, h.jsx)(i, {
			title: "Task inventory",
			description: "Track who handles each task and its current status.",
			children: /* @__PURE__ */ (0, h.jsx)(a, {
				queries: [
					n,
					e,
					t
				],
				children: /* @__PURE__ */ (0, h.jsx)(s, {
					data: C.filter((e) => (!g || e.status === g) && (!v || e.committee_id === v) && (!b || e.member_id === b)),
					searchLabel: "Search tasks…",
					filter: /* @__PURE__ */ (0, h.jsxs)("div", {
						className: "tw:flex tw:flex-wrap tw:gap-2",
						children: [
							/* @__PURE__ */ (0, h.jsx)("div", {
								className: "tw:min-w-36",
								children: /* @__PURE__ */ (0, h.jsx)(c, {
									label: "Filter task status",
									value: g,
									onChange: _,
									items: [
										{
											value: "pending",
											label: "Open"
										},
										{
											value: "in_progress",
											label: "In progress"
										},
										{
											value: "awaiting_approval",
											label: "Awaiting approval"
										},
										{
											value: "completed",
											label: "Completed"
										}
									],
									placeholder: "All statuses"
								})
							}),
							/* @__PURE__ */ (0, h.jsx)("div", {
								className: "tw:min-w-44",
								children: /* @__PURE__ */ (0, h.jsx)(c, {
									label: "Filter task committee",
									value: v,
									onChange: y,
									items: (t.data || []).map((e) => ({
										value: e.id,
										label: e.name
									})),
									placeholder: "All committees"
								})
							}),
							/* @__PURE__ */ (0, h.jsx)("div", {
								className: "tw:min-w-36",
								children: /* @__PURE__ */ (0, h.jsx)(c, {
									label: "Filter task member",
									value: b,
									onChange: x,
									items: (e.data || []).map((e) => ({
										value: e.id,
										label: e.full_name
									})),
									placeholder: "Any member"
								})
							})
						]
					}),
					columns: [
						{
							accessorKey: "title",
							header: "Task"
						},
						{
							accessorKey: "handled_by",
							header: "Handled by"
						},
						{
							accessorKey: "committee",
							header: "Committee"
						},
						{
							accessorKey: "due_date",
							header: "Due",
							cell: ({ row: e }) => /* @__PURE__ */ (0, h.jsxs)("div", {
								className: "tw:flex tw:flex-wrap tw:items-center tw:gap-2",
								children: [/* @__PURE__ */ (0, h.jsx)("span", { children: d(e.original.due_date) }), e.original.status !== "completed" && e.original.due_date && e.original.due_date < S && /* @__PURE__ */ (0, h.jsx)("span", {
									className: "tw:text-xs tw:font-medium tw:text-destructive",
									children: "Overdue"
								})]
							})
						},
						{
							accessorKey: "status",
							header: "Status",
							cell: ({ row: e }) => /* @__PURE__ */ (0, h.jsx)(l, { value: f(e.original.status) })
						},
						{
							accessorKey: "completed_at",
							header: "Completed",
							cell: ({ row: e }) => d(e.original.completed_at)
						},
						{
							accessorKey: "approved_by",
							header: "Approved by",
							cell: ({ row: e }) => e.original.approved_by || "Not recorded"
						}
					]
				})
			})
		}),
		/* @__PURE__ */ (0, h.jsx)(i, {
			title: "Workload per member",
			description: "Open tasks against each member’s five-task capacity.",
			children: /* @__PURE__ */ (0, h.jsx)(a, {
				queries: [e, n],
				children: !e.data || !n.data ? /* @__PURE__ */ (0, h.jsx)("p", {
					className: "ui-info",
					children: "Permission to view members and tasks is required."
				}) : /* @__PURE__ */ (0, h.jsxs)("div", {
					className: "tw:space-y-4",
					children: [(e.data || []).map((e) => {
						let t = u(n.data || [], e.id);
						return /* @__PURE__ */ (0, h.jsxs)("div", {
							className: "tw:flex tw:flex-wrap tw:items-center tw:gap-3",
							children: [
								/* @__PURE__ */ (0, h.jsx)("span", {
									className: "tw:w-36 tw:text-sm tw:font-medium",
									children: e.full_name
								}),
								/* @__PURE__ */ (0, h.jsx)(r, {
									className: "tw:min-w-24 tw:flex-1",
									value: Math.min(t * 20, 100),
									"aria-label": `Open task capacity for ${e.full_name}`
								}),
								/* @__PURE__ */ (0, h.jsxs)("span", {
									className: "tw:w-16 tw:text-right tw:text-xs tw:text-muted-foreground",
									children: [t, " of 5"]
								})
							]
						}, e.id);
					}), e.data?.length === 0 && /* @__PURE__ */ (0, h.jsx)("p", {
						className: "ui-info",
						children: "No members available."
					})]
				})
			})
		})
	] });
}
//#endregion
export { g as default };
