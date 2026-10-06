import { h as e } from "./api-DVPVP-g0.js";
import { _ as t, h as n, n as r, s as i, x as a } from "./hooks-BlRndFBy.js";
import { a as o } from "./calculations-ZvWekKcJ.js";
//#region frontend/pages/performance.tsx
var s = e();
function c() {
	let e = r("members"), c = r("tasks"), l = r("performance"), u = !!e.data && !!c.data && !!l.data, d = u ? o(e.data, c.data, l.data) : [], f = Math.max(1, ...d.map((e) => e.completed_tasks));
	return /* @__PURE__ */ (0, s.jsxs)(s.Fragment, { children: [
		/* @__PURE__ */ (0, s.jsx)("div", {
			className: "ui-page-actions",
			children: /* @__PURE__ */ (0, s.jsx)("p", { children: "See task completion, attendance, and on-time scores for each member." })
		}),
		/* @__PURE__ */ (0, s.jsx)("p", {
			className: "ui-info tw:mb-5",
			children: "Final score = 50% task completion + 20% attendance + 30% on-time completion."
		}),
		/* @__PURE__ */ (0, s.jsx)(n, {
			queries: [
				e,
				c,
				l
			],
			children: u ? /* @__PURE__ */ (0, s.jsxs)(s.Fragment, { children: [/* @__PURE__ */ (0, s.jsx)(t, {
				title: "Completed tasks per member",
				children: d.length ? /* @__PURE__ */ (0, s.jsx)("div", {
					className: "tw:overflow-x-auto",
					children: /* @__PURE__ */ (0, s.jsxs)("div", {
						role: "img",
						"aria-label": `Completed tasks per member: ${d.map((e) => `${e.full_name} ${e.completed_tasks}`).join(", ")}`,
						className: "tw:flex tw:gap-3 tw:pt-3",
						style: { minWidth: Math.max(320, d.length * 110) },
						children: [/* @__PURE__ */ (0, s.jsxs)("div", {
							"aria-hidden": "true",
							className: "tw:flex tw:h-44 tw:flex-col tw:justify-between tw:pr-2 tw:text-xs tw:text-muted-foreground",
							children: [/* @__PURE__ */ (0, s.jsx)("span", { children: f }), /* @__PURE__ */ (0, s.jsx)("span", { children: "0" })]
						}), d.map((e) => /* @__PURE__ */ (0, s.jsxs)("div", {
							className: "tw:min-w-24 tw:flex-1 tw:text-center",
							children: [
								/* @__PURE__ */ (0, s.jsx)("div", {
									className: "tw:flex tw:h-44 tw:items-end tw:justify-center tw:border-b tw:border-border",
									children: /* @__PURE__ */ (0, s.jsx)("div", {
										className: "tw:w-8 tw:rounded-t tw:bg-primary",
										style: { height: `${e.completed_tasks / f * 100}%` },
										title: `${e.full_name}: ${e.completed_tasks} completed tasks`
									})
								}),
								/* @__PURE__ */ (0, s.jsx)("p", {
									className: "tw:mt-3 tw:text-xs tw:text-muted-foreground",
									children: e.full_name
								}),
								/* @__PURE__ */ (0, s.jsx)("span", {
									className: "tw:text-xs tw:font-medium",
									children: e.completed_tasks
								})
							]
						}, e.id))]
					})
				}) : /* @__PURE__ */ (0, s.jsx)("p", {
					className: "ui-info",
					children: "No members available."
				})
			}), /* @__PURE__ */ (0, s.jsx)(t, {
				title: "Performance directory",
				description: "Member scores calculated from recorded tasks and attendance.",
				children: /* @__PURE__ */ (0, s.jsx)(i, {
					data: d,
					searchLabel: "Search member performance…",
					columns: [
						{
							accessorKey: "full_name",
							header: "Member"
						},
						{
							accessorKey: "total_tasks",
							header: "Assigned"
						},
						{
							accessorKey: "completed_tasks",
							header: "Completed"
						},
						{
							accessorKey: "attendance_rate",
							header: "Attendance",
							cell: ({ row: e }) => `${e.original.attendance_rate}%`
						},
						{
							accessorKey: "on_time_rate",
							header: "On-time",
							cell: ({ row: e }) => e.original.completed_tasks ? `${e.original.on_time_rate}%` : "—"
						},
						{
							accessorKey: "final_score",
							header: "Final score",
							cell: ({ row: e }) => `${e.original.final_score}%`
						},
						{
							accessorKey: "grade",
							header: "Grade",
							cell: ({ row: e }) => /* @__PURE__ */ (0, s.jsx)(a, { value: e.original.grade })
						}
					]
				})
			})] }) : /* @__PURE__ */ (0, s.jsx)("p", {
				className: "ui-info",
				children: "Permission to view members, tasks, and performance is required."
			})
		})
	] });
}
//#endregion
export { c as default };
