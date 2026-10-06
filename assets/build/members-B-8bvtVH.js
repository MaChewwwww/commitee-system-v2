import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n, l as r, n as i, o as a, s as o } from "./api-DVPVP-g0.js";
import { C as s, S as c, b as l, d as u, g as d, m as f, n as p, t as m, u as h, v as g, x as _, y as v } from "./hooks-BlRndFBy.js";
import { t as y } from "./clock-3-DqrQmDOW.js";
import { t as b } from "./management-Z1Cs2zh-.js";
import { n as x } from "./app-DpC2qKu3.js";
import { i as S, r as C } from "./calculations-ZvWekKcJ.js";
//#region node_modules/lucide-react/dist/esm/icons/user-check.mjs
var w = {
	name: "user-check",
	size: 24,
	node: [
		["path", {
			d: "m16 11 2 2 4-4",
			key: "9rsbq5"
		}],
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}]
	]
};
w.node;
var T = r(w), E = {
	name: "user-round",
	size: 24,
	node: [["circle", {
		cx: "12",
		cy: "8",
		r: "5",
		key: "1hypcn"
	}], ["path", {
		d: "M20 21a8 8 0 0 0-16 0",
		key: "rfgkzh"
	}]],
	aliases: ["user-2"]
};
E.node;
var D = r(E), O = /* @__PURE__ */ e(t(), 1), k = n();
function A() {
	let e = p("members"), t = p("committees"), n = p("assignments"), [r, c] = (0, O.useState)(!1), [l, d] = (0, O.useState)({
		member_id: "",
		committee_id: "",
		attendance_rate: "",
		period: C().slice(0, 7)
	}), [f, g] = (0, O.useState)(null), _ = s(), v = m(() => a("performance", {
		...l,
		committee_id: l.committee_id || null,
		attendance_rate: Number(l.attendance_rate)
	}), ["performance"]);
	if (!i(window.APP_CONFIG, "performance.create")) return null;
	async function y() {
		let e = Number(l.attendance_rate);
		if (!l.member_id || !l.period || !l.attendance_rate.trim() || !Number.isFinite(e) || e < 0 || e > 100) {
			g(/* @__PURE__ */ Error("Select a member, reporting month, and attendance percentage from 0 to 100."));
			return;
		}
		try {
			await v.run() && (c(!1), _("Attendance recorded for the reporting month."));
		} catch {}
	}
	return /* @__PURE__ */ (0, k.jsxs)("div", {
		className: "tw:mb-5",
		children: [/* @__PURE__ */ (0, k.jsx)(o, {
			variant: "outline",
			onClick: () => {
				v.reset(), g(null), c(!0);
			},
			children: "Record attendance"
		}), /* @__PURE__ */ (0, k.jsxs)(u, {
			open: r,
			onClose: () => c(!1),
			title: "Record attendance",
			description: "Enter attendance from the official attendance record. This saves a monthly summary, not a meeting certification.",
			busy: v.isPending,
			error: f || v.error,
			onSubmit: () => void y(),
			children: [
				/* @__PURE__ */ (0, k.jsx)(h, {
					label: "Attendance committee",
					value: l.committee_id,
					onChange: (e) => d({
						...l,
						committee_id: e,
						member_id: ""
					}),
					items: (t.data || []).map((e) => ({
						value: e.id,
						label: e.name
					})),
					placeholder: "Council-wide attendance"
				}),
				/* @__PURE__ */ (0, k.jsx)(h, {
					label: "Attendance member",
					required: !0,
					value: l.member_id,
					onChange: (e) => d({
						...l,
						member_id: e
					}),
					items: (e.data || []).filter((e) => !l.committee_id || n.data?.some((t) => t.committee_id === l.committee_id && t.member_id === e.id)).map((e) => ({
						value: e.id,
						label: e.full_name
					}))
				}),
				/* @__PURE__ */ (0, k.jsx)(h, {
					label: "Reporting month",
					type: "month",
					required: !0,
					value: l.period,
					onChange: (e) => d({
						...l,
						period: e
					})
				}),
				/* @__PURE__ */ (0, k.jsx)(h, {
					label: "Attendance rate (%)",
					type: "number",
					min: 0,
					max: 100,
					required: !0,
					value: l.attendance_rate,
					onChange: (e) => d({
						...l,
						attendance_rate: e
					})
				})
			]
		})]
	});
}
//#endregion
//#region frontend/pages/members.tsx
var j = c([
	"Presiding Officer",
	"City Councilor",
	"Municipal Councilor",
	"Sanggunian Secretary",
	"Committee Staff",
	"Committee Member"
]);
function M() {
	let e = p("members"), t = p("tasks"), [n, r] = (0, O.useState)("");
	return /* @__PURE__ */ (0, k.jsx)(b, {
		resource: "members",
		singular: "Member",
		defaults: {
			full_name: "",
			email: "",
			phone: "",
			position: "",
			skills: "",
			availability: "available"
		},
		fields: (e, t) => [
			{
				name: "full_name",
				label: "Full name",
				required: !0
			},
			{
				name: "email",
				label: "Email address",
				type: "email"
			},
			{
				name: "phone",
				label: "Phone number",
				type: "tel"
			},
			{
				name: "position",
				label: "Position",
				items: t?.position && !j.some((e) => e.value === t.position) ? [...j, {
					value: t.position,
					label: t.position
				}] : j
			},
			{
				name: "skills",
				label: "Skills",
				placeholder: "Leadership, communication…"
			},
			{
				name: "availability",
				label: "Availability",
				required: !0,
				items: c([
					"available",
					"busy",
					"unavailable"
				])
			}
		],
		transform: (e) => ({
			...e,
			full_name: e.full_name.trim(),
			skills: e.skills.split(",").map((e) => e.trim()).filter(Boolean)
		}),
		columns: [
			{
				accessorKey: "full_name",
				header: "Member",
				cell: ({ row: e }) => /* @__PURE__ */ (0, k.jsx)(f, { name: e.original.full_name })
			},
			{
				accessorKey: "position",
				header: "Position"
			},
			{
				accessorFn: (e) => e.email || e.phone || "—",
				id: "contact",
				header: "Contact"
			},
			{
				accessorKey: "availability",
				header: "Availability",
				cell: ({ row: e }) => /* @__PURE__ */ (0, k.jsx)(_, { value: e.original.availability })
			},
			{
				accessorKey: "workload_score",
				header: "Workload",
				cell: ({ row: e }) => t.data ? /* @__PURE__ */ (0, k.jsx)(d, {
					value: t.data ? S(t.data, e.original.id) * 20 : 0,
					label: `${e.original.full_name} workload`
				}) : /* @__PURE__ */ (0, k.jsx)("span", { children: "Not available" })
			}
		],
		filter: /* @__PURE__ */ (0, k.jsx)(g, {
			label: "Filter availability",
			value: n,
			onChange: r,
			items: c([
				"available",
				"busy",
				"unavailable"
			]),
			placeholder: "All availability"
		}),
		filteredData: (e) => n ? e.filter((e) => e.availability === n) : e,
		before: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsxs)(l, { children: [
			/* @__PURE__ */ (0, k.jsx)(v, {
				label: "Team members",
				value: e.data?.length ?? "—",
				hint: "Your community of contributors",
				icon: /* @__PURE__ */ (0, k.jsx)(x, { size: 16 })
			}),
			/* @__PURE__ */ (0, k.jsx)(v, {
				label: "Available",
				value: e.data?.filter((e) => e.availability === "available").length ?? "—",
				hint: "Ready for new opportunities",
				icon: /* @__PURE__ */ (0, k.jsx)(T, { size: 16 }),
				tone: "green"
			}),
			/* @__PURE__ */ (0, k.jsx)(v, {
				label: "Busy",
				value: e.data?.filter((e) => e.availability === "busy").length ?? "—",
				hint: "Focused on current priorities",
				icon: /* @__PURE__ */ (0, k.jsx)(y, { size: 16 }),
				tone: "gold"
			}),
			/* @__PURE__ */ (0, k.jsx)(v, {
				label: "Positions",
				value: e.data ? new Set(e.data.map((e) => e.position).filter(Boolean)).size : "—",
				hint: "Different strengths, shared purpose",
				icon: /* @__PURE__ */ (0, k.jsx)(D, { size: 16 }),
				tone: "purple"
			})
		] }), /* @__PURE__ */ (0, k.jsx)(A, {})] })
	});
}
//#endregion
export { M as default };
