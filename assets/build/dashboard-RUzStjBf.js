import { h as e, n as t } from "./api-DVPVP-g0.js";
import { B as n, R as r, _ as i, b as a, c as o, h as s, m as c, n as l, x as u, y as d } from "./hooks-CGjnItOC.js";
import { t as f } from "./clock-3-DqrQmDOW.js";
import { l as p, n as m, o as h, r as g, s as _, u as v } from "./app-4em4_PaO.js";
import { t as y } from "./charts-DSojZOtP.js";
//#region frontend/pages/dashboard.tsx
var b = e();
function x() {
	let e = l("members"), x = l("committees"), S = l("tasks"), C = S.data?.filter((e) => e.status === "pending").length, w = S.data?.filter((e) => e.status === "completed").length, T = window.APP_CONFIG.navigation, E = (e) => T.find((t) => t.key === e)?.href || "#", D = [
		{
			page: "members",
			permission: "members.create",
			label: "Add a member",
			icon: m
		},
		{
			page: "committees",
			permission: "committees.create",
			label: "Create a committee",
			icon: r
		},
		{
			page: "assignments",
			permission: "assignments.create",
			label: "Assign a member",
			icon: _
		},
		{
			page: "reports",
			permission: "reports.create",
			label: "Build a report",
			icon: h
		}
	].filter((e) => t(window.APP_CONFIG, e.permission));
	return /* @__PURE__ */ (0, b.jsxs)(b.Fragment, { children: [
		/* @__PURE__ */ (0, b.jsxs)("div", {
			className: "ui-welcome",
			children: [/* @__PURE__ */ (0, b.jsxs)("div", { children: [
				/* @__PURE__ */ (0, b.jsx)("p", {
					className: "ui-eyebrow",
					children: "YOUR COMMUNITY, MOVING FORWARD"
				}),
				/* @__PURE__ */ (0, b.jsx)("h2", { children: "A little clarity. A lot of progress." }),
				/* @__PURE__ */ (0, b.jsx)("p", { children: "Keep your people, committees, and priorities connected. Here is what is happening across your workspace." })
			] }), /* @__PURE__ */ (0, b.jsx)(g, {
				size: 70,
				className: "ui-welcome-mark"
			})]
		}),
		/* @__PURE__ */ (0, b.jsxs)(a, { children: [
			/* @__PURE__ */ (0, b.jsx)(d, {
				label: "Committees",
				value: x.data?.length ?? "—",
				hint: "Across your accessible workspace",
				icon: /* @__PURE__ */ (0, b.jsx)(p, { size: 16 })
			}),
			/* @__PURE__ */ (0, b.jsx)(d, {
				label: "Team members",
				value: e.data?.length ?? "—",
				hint: "People making things happen",
				icon: /* @__PURE__ */ (0, b.jsx)(m, { size: 16 }),
				tone: "purple"
			}),
			/* @__PURE__ */ (0, b.jsx)(d, {
				label: "Pending tasks",
				value: C ?? "—",
				hint: "Ready for your next move",
				icon: /* @__PURE__ */ (0, b.jsx)(f, { size: 16 }),
				tone: "gold"
			}),
			/* @__PURE__ */ (0, b.jsx)(d, {
				label: "Completed tasks",
				value: w ?? "—",
				hint: "Progress worth celebrating",
				icon: /* @__PURE__ */ (0, b.jsx)(n, { size: 16 }),
				tone: "green"
			})
		] }),
		/* @__PURE__ */ (0, b.jsxs)("div", {
			className: "ui-dashboard-split",
			children: [/* @__PURE__ */ (0, b.jsx)(i, {
				title: "Task overview",
				description: "A clear picture of the work in motion.",
				children: /* @__PURE__ */ (0, b.jsx)(s, {
					queries: [S],
					children: S.data ? /* @__PURE__ */ (0, b.jsx)(y, {
						label: "Total tasks",
						segments: [{
							label: "Completed",
							value: w || 0,
							color: "#3c9c7d"
						}, {
							label: "Pending",
							value: C || 0,
							color: "#d6a23a"
						}]
					}) : /* @__PURE__ */ (0, b.jsx)(o, {
						title: "Task data is restricted",
						description: "Your role does not include access to tasks."
					})
				})
			}), /* @__PURE__ */ (0, b.jsx)(i, {
				title: "Recent committees",
				description: "The teams serving your community.",
				action: t(window.APP_CONFIG, "committees.view") && /* @__PURE__ */ (0, b.jsxs)("a", {
					className: "ui-link",
					href: E("committees"),
					children: ["View all", /* @__PURE__ */ (0, b.jsx)(v, { size: 13 })]
				}),
				children: /* @__PURE__ */ (0, b.jsx)(s, {
					queries: [x],
					children: x.data?.length ? x.data.slice(0, 4).map((e) => /* @__PURE__ */ (0, b.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, b.jsx)("div", { children: /* @__PURE__ */ (0, b.jsx)("strong", { children: e.name }) }), /* @__PURE__ */ (0, b.jsx)(u, { value: e.type })]
					}, e.id)) : /* @__PURE__ */ (0, b.jsx)(o, { title: t(window.APP_CONFIG, "committees.view") ? "No committees yet" : "Committee data is restricted" })
				})
			})]
		}),
		/* @__PURE__ */ (0, b.jsxs)("div", {
			className: "ui-two-column",
			children: [/* @__PURE__ */ (0, b.jsx)(i, {
				title: "Your people",
				description: "The members behind the work.",
				action: t(window.APP_CONFIG, "members.view") && /* @__PURE__ */ (0, b.jsxs)("a", {
					className: "ui-link",
					href: E("members"),
					children: ["View all", /* @__PURE__ */ (0, b.jsx)(v, { size: 13 })]
				}),
				children: /* @__PURE__ */ (0, b.jsx)(s, {
					queries: [e],
					children: e.data?.length ? e.data.slice(0, 4).map((e) => /* @__PURE__ */ (0, b.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, b.jsx)(c, {
							name: e.full_name,
							detail: e.position || "SK member"
						}), /* @__PURE__ */ (0, b.jsx)(u, { value: e.availability })]
					}, e.id)) : /* @__PURE__ */ (0, b.jsx)(o, { title: t(window.APP_CONFIG, "members.view") ? "No members yet" : "Member data is restricted" })
				})
			}), /* @__PURE__ */ (0, b.jsxs)(i, {
				title: "Make your next move",
				description: "Useful shortcuts, right where you need them.",
				children: [/* @__PURE__ */ (0, b.jsx)("div", {
					className: "ui-quick-grid",
					children: D.map((e) => /* @__PURE__ */ (0, b.jsxs)("a", {
						href: E(e.page),
						className: "ui-quick-action",
						children: [/* @__PURE__ */ (0, b.jsx)(e.icon, { size: 20 }), /* @__PURE__ */ (0, b.jsx)("span", { children: e.label })]
					}, e.page))
				}), !D.length && /* @__PURE__ */ (0, b.jsx)(o, {
					title: "Explore your workspace",
					description: "Use the navigation to view the pages available to your role."
				})]
			})]
		})
	] });
}
//#endregion
export { x as default };
