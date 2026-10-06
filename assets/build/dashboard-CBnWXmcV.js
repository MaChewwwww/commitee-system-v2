import { h as e, n as t } from "./api-DVPVP-g0.js";
import { V as n, _ as r, b as i, c as a, h as o, m as s, n as c, x as l, y as u, z as d } from "./hooks-BlRndFBy.js";
import { t as f } from "./clock-3-DqrQmDOW.js";
import { a as p, i as m, n as h, o as g, r as _, s as v } from "./app-DpC2qKu3.js";
//#region frontend/components/charts.tsx
var y = e();
function b({ segments: e, label: t }) {
	let n = e.reduce((e, t) => e + t.value, 0), r = 0;
	return /* @__PURE__ */ (0, y.jsxs)("div", {
		className: "ui-distribution",
		children: [/* @__PURE__ */ (0, y.jsxs)("div", {
			className: "ui-donut",
			children: [/* @__PURE__ */ (0, y.jsxs)("svg", {
				viewBox: "0 0 120 120",
				role: "img",
				"aria-label": `${t}: ${e.map((e) => `${e.label} ${e.value}`).join(", ")}`,
				children: [/* @__PURE__ */ (0, y.jsx)("circle", {
					cx: "60",
					cy: "60",
					r: "48",
					fill: "none",
					stroke: "#edf1f7",
					strokeWidth: "10"
				}), e.map((e) => {
					let t = n ? e.value / n * 100 : 0, i = r;
					return r += t, /* @__PURE__ */ (0, y.jsx)("circle", {
						cx: "60",
						cy: "60",
						r: "48",
						pathLength: "100",
						fill: "none",
						stroke: e.color,
						strokeWidth: "10",
						strokeDasharray: `${t} ${100 - t}`,
						strokeDashoffset: -i
					}, e.label);
				})]
			}), /* @__PURE__ */ (0, y.jsxs)("div", {
				className: "ui-donut-center",
				children: [/* @__PURE__ */ (0, y.jsx)("strong", { children: n }), /* @__PURE__ */ (0, y.jsx)("small", { children: t })]
			})]
		}), /* @__PURE__ */ (0, y.jsx)("div", {
			className: "ui-chart-legend",
			children: e.map((e) => /* @__PURE__ */ (0, y.jsxs)("div", {
				className: "ui-legend-row",
				children: [
					/* @__PURE__ */ (0, y.jsx)("span", { style: { backgroundColor: e.color } }),
					/* @__PURE__ */ (0, y.jsx)("span", { children: e.label }),
					/* @__PURE__ */ (0, y.jsx)("strong", { children: e.value })
				]
			}, e.label))
		})]
	});
}
//#endregion
//#region frontend/pages/dashboard.tsx
function x() {
	let e = c("members"), x = c("committees"), S = c("tasks"), C = S.data?.filter((e) => e.status !== "completed").length, w = S.data?.filter((e) => e.status === "completed").length, T = window.APP_CONFIG.navigation, E = (e) => T.find((t) => t.key === e)?.href || "#", D = [
		{
			page: "members",
			permission: "members.create",
			label: "Add a member",
			icon: h
		},
		{
			page: "committees",
			permission: "committees.create",
			label: "Create a committee",
			icon: d
		},
		{
			page: "assignments",
			permission: "assignments.create",
			label: "Assign a member",
			icon: p
		},
		{
			page: "reports",
			permission: "reports.create",
			label: "Build a report",
			icon: m
		}
	].filter((e) => t(window.APP_CONFIG, e.permission));
	return /* @__PURE__ */ (0, y.jsxs)(y.Fragment, { children: [
		/* @__PURE__ */ (0, y.jsxs)("div", {
			className: "ui-welcome",
			children: [/* @__PURE__ */ (0, y.jsxs)("div", { children: [
				/* @__PURE__ */ (0, y.jsx)("p", {
					className: "ui-eyebrow",
					children: "YOUR COMMUNITY, MOVING FORWARD"
				}),
				/* @__PURE__ */ (0, y.jsx)("h2", { children: "A little clarity. A lot of progress." }),
				/* @__PURE__ */ (0, y.jsx)("p", { children: "Keep your people, committees, and priorities connected. Here is what is happening across your workspace." })
			] }), /* @__PURE__ */ (0, y.jsx)(_, {
				size: 70,
				className: "ui-welcome-mark"
			})]
		}),
		/* @__PURE__ */ (0, y.jsxs)(i, { children: [
			/* @__PURE__ */ (0, y.jsx)(u, {
				label: "Committees",
				value: x.data?.length ?? "—",
				hint: "Across your accessible workspace",
				icon: /* @__PURE__ */ (0, y.jsx)(g, { size: 16 })
			}),
			/* @__PURE__ */ (0, y.jsx)(u, {
				label: "Team members",
				value: e.data?.length ?? "—",
				hint: "People making things happen",
				icon: /* @__PURE__ */ (0, y.jsx)(h, { size: 16 }),
				tone: "purple"
			}),
			/* @__PURE__ */ (0, y.jsx)(u, {
				label: "Pending tasks",
				value: C ?? "—",
				hint: "Ready for your next move",
				icon: /* @__PURE__ */ (0, y.jsx)(f, { size: 16 }),
				tone: "gold"
			}),
			/* @__PURE__ */ (0, y.jsx)(u, {
				label: "Completed tasks",
				value: w ?? "—",
				hint: "Progress worth celebrating",
				icon: /* @__PURE__ */ (0, y.jsx)(n, { size: 16 }),
				tone: "green"
			})
		] }),
		/* @__PURE__ */ (0, y.jsxs)("div", {
			className: "ui-dashboard-split",
			children: [/* @__PURE__ */ (0, y.jsx)(r, {
				title: "Task overview",
				description: "A clear picture of the work in motion.",
				children: /* @__PURE__ */ (0, y.jsx)(o, {
					queries: [S],
					children: S.data ? /* @__PURE__ */ (0, y.jsx)(b, {
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
					}) : /* @__PURE__ */ (0, y.jsx)(a, {
						title: "Task data is restricted",
						description: "Your role does not include access to tasks."
					})
				})
			}), /* @__PURE__ */ (0, y.jsx)(r, {
				title: "Recent committees",
				description: "The teams serving your community.",
				action: t(window.APP_CONFIG, "committees.view") && /* @__PURE__ */ (0, y.jsxs)("a", {
					className: "ui-link",
					href: E("committees"),
					children: ["View all", /* @__PURE__ */ (0, y.jsx)(v, { size: 13 })]
				}),
				children: /* @__PURE__ */ (0, y.jsx)(o, {
					queries: [x],
					children: x.data?.length ? x.data.slice(0, 4).map((e) => /* @__PURE__ */ (0, y.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, y.jsx)("div", { children: /* @__PURE__ */ (0, y.jsx)("strong", { children: e.name }) }), /* @__PURE__ */ (0, y.jsx)(l, { value: e.type })]
					}, e.id)) : /* @__PURE__ */ (0, y.jsx)(a, { title: t(window.APP_CONFIG, "committees.view") ? "No committees yet" : "Committee data is restricted" })
				})
			})]
		}),
		/* @__PURE__ */ (0, y.jsxs)("div", {
			className: "ui-two-column",
			children: [/* @__PURE__ */ (0, y.jsx)(r, {
				title: "Your people",
				description: "The members behind the work.",
				action: t(window.APP_CONFIG, "members.view") && /* @__PURE__ */ (0, y.jsxs)("a", {
					className: "ui-link",
					href: E("members"),
					children: ["View all", /* @__PURE__ */ (0, y.jsx)(v, { size: 13 })]
				}),
				children: /* @__PURE__ */ (0, y.jsx)(o, {
					queries: [e],
					children: e.data?.length ? e.data.slice(0, 4).map((e) => /* @__PURE__ */ (0, y.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, y.jsx)(s, {
							name: e.full_name,
							detail: e.position || "Committee member"
						}), /* @__PURE__ */ (0, y.jsx)(l, { value: e.availability })]
					}, e.id)) : /* @__PURE__ */ (0, y.jsx)(a, { title: t(window.APP_CONFIG, "members.view") ? "No members yet" : "Member data is restricted" })
				})
			}), /* @__PURE__ */ (0, y.jsxs)(r, {
				title: "Make your next move",
				description: "Useful shortcuts, right where you need them.",
				children: [/* @__PURE__ */ (0, y.jsx)("div", {
					className: "ui-quick-grid",
					children: D.map((e) => /* @__PURE__ */ (0, y.jsxs)("a", {
						href: E(e.page),
						className: "ui-quick-action",
						children: [/* @__PURE__ */ (0, y.jsx)(e.icon, { size: 20 }), /* @__PURE__ */ (0, y.jsx)("span", { children: e.label })]
					}, e.page))
				}), !D.length && /* @__PURE__ */ (0, y.jsx)(a, {
					title: "Explore your workspace",
					description: "Use the navigation to view the pages available to your role."
				})]
			})]
		})
	] });
}
//#endregion
export { x as default };
