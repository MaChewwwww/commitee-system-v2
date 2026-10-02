import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { a as n, h as r, l as i, n as a, o, s } from "./api-DVPVP-g0.js";
import { C as c, L as l, R as u, S as d, _ as f, a as p, b as m, d as h, g, h as _, l as v, m as y, n as b, r as x, s as S, t as C, u as w, v as T, x as E, y as D } from "./hooks-CGjnItOC.js";
import { c as O, n as ee } from "./app-B8tnWQbD.js";
import { o as k, r as A } from "./calculations-Pe71IOFb.js";
import { t as j } from "./charts-DSojZOtP.js";
//#region node_modules/lucide-react/dist/esm/icons/trending-up.mjs
var M = {
	name: "trending-up",
	size: 24,
	node: [["path", {
		d: "M16 7h6v6",
		key: "box55l"
	}], ["path", {
		d: "m22 7-8.5 8.5-5-5L2 17",
		key: "1t1m79"
	}]]
};
M.node;
var N = i(M), P = {
	name: "trophy",
	size: 24,
	node: [
		["path", {
			d: "M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2",
			key: "pwuv1l"
		}],
		["path", {
			d: "M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2",
			key: "1y54w1"
		}],
		["path", {
			d: "M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3",
			key: "e30mpu"
		}],
		["path", {
			d: "M4 22h16",
			key: "57wxv0"
		}],
		["path", {
			d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",
			key: "1mhfuq"
		}],
		["path", {
			d: "M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3",
			key: "i0yafy"
		}]
	]
};
P.node;
var F = i(P), I = /* @__PURE__ */ e(t(), 1), L = r();
function R() {
	let e = b("members"), t = b("tasks"), r = b("performance"), i = b("committees"), [M, P] = (0, I.useState)(""), [R, z] = (0, I.useState)(!1), [B, V] = (0, I.useState)(null), [H, U] = (0, I.useState)({
		member_id: "",
		committee_id: "",
		attendance_rate: ""
	}), [W, G] = (0, I.useState)(null), [K, q] = (0, I.useState)(null), J = c(), Y = K || k(e.data || [], t.data || [], r.data || []), X = !!e.data && !!t.data && !!r.data, Z = C(() => n("ai/performance.php", "POST", {})), Q = C(() => o("performance", {
		member_id: H.member_id,
		committee_id: H.committee_id || null,
		attendance_rate: Number(H.attendance_rate),
		task_completion_rate: 0,
		performance_score: 0,
		period: A().slice(0, 7)
	}), ["performance"]);
	async function te() {
		if (!H.member_id || H.attendance_rate === "" || Number(H.attendance_rate) < 0 || Number(H.attendance_rate) > 100 || !Number.isFinite(Number(H.attendance_rate))) {
			V(/* @__PURE__ */ Error("Select a member and enter attendance from 0 to 100."));
			return;
		}
		V(null);
		try {
			let e = await Q.run();
			e && (z(!1), q(null), U({
				member_id: "",
				committee_id: "",
				attendance_rate: ""
			}), J(e.message || "Attendance saved."));
		} catch {}
	}
	let ne = Y.length ? Math.round(Y.reduce((e, t) => e + t.final_score, 0) / Y.length) : 0, re = Y.filter((e) => e.grade === "Excellent").length, $ = [
		"Excellent",
		"Good",
		"Average",
		"Needs Improvement"
	];
	return /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [
		/* @__PURE__ */ (0, L.jsxs)("div", {
			className: "ui-page-actions",
			children: [/* @__PURE__ */ (0, L.jsx)("p", { children: "Recognize progress and see where support can make a difference." }), /* @__PURE__ */ (0, L.jsxs)("div", {
				className: "ui-actions",
				children: [a(window.APP_CONFIG, "ai.use") && /* @__PURE__ */ (0, L.jsxs)(x, {
					variant: "outline",
					busy: Z.isPending,
					onClick: () => {
						Z.run().then((t) => {
							t?.ai_insights ? (G(t.ai_insights), t.members?.length && q(t.members.map((t) => ({
								...e.data?.find((e) => e.id === t.member_id),
								...t,
								id: t.member_id,
								full_name: t.member_name,
								availability: e.data?.find((e) => e.id === t.member_id)?.availability || "available"
							})))) : t && J("AI returned no performance insights.", !0);
						}).catch(() => {});
					},
					children: [/* @__PURE__ */ (0, L.jsx)(l, { size: 15 }), "Analyze performance"]
				}), a(window.APP_CONFIG, "performance.create") && /* @__PURE__ */ (0, L.jsxs)(s, {
					disabled: !e.data,
					onClick: () => {
						Q.reset(), V(null), z(!0);
					},
					children: [/* @__PURE__ */ (0, L.jsx)(u, { size: 15 }), "Record attendance"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, L.jsxs)(m, { children: [
			/* @__PURE__ */ (0, L.jsx)(D, {
				label: "Members assessed",
				value: X ? Y.length : "—",
				hint: "Your accessible team",
				icon: /* @__PURE__ */ (0, L.jsx)(ee, { size: 16 })
			}),
			/* @__PURE__ */ (0, L.jsx)(D, {
				label: "Average score",
				value: X ? `${ne}%` : "—",
				hint: "Completion, attendance, and punctuality",
				icon: /* @__PURE__ */ (0, L.jsx)(O, { size: 16 }),
				tone: "purple"
			}),
			/* @__PURE__ */ (0, L.jsx)(D, {
				label: "Excellent performers",
				value: X ? re : "—",
				hint: "Final score of 90% or higher",
				icon: /* @__PURE__ */ (0, L.jsx)(F, { size: 16 }),
				tone: "gold"
			}),
			/* @__PURE__ */ (0, L.jsx)(D, {
				label: "Top score",
				value: X ? `${Y[0]?.final_score || 0}%` : "—",
				hint: Y[0]?.full_name || "Performance at a glance",
				icon: /* @__PURE__ */ (0, L.jsx)(N, { size: 16 }),
				tone: "green"
			})
		] }),
		/* @__PURE__ */ (0, L.jsx)(v, { error: Z.error }),
		W && /* @__PURE__ */ (0, L.jsxs)(p, {
			title: "Insights that move your team forward",
			description: "AI-assisted observations and recommendations.",
			children: [
				/* @__PURE__ */ (0, L.jsxs)("div", {
					className: "ui-actions",
					children: [/* @__PURE__ */ (0, L.jsx)(E, { value: W.team_status }), /* @__PURE__ */ (0, L.jsxs)("strong", {
						className: "tw:text-sm",
						children: [
							"Team score: ",
							W.overall_team_score,
							"% · Top performer: ",
							W.top_performer
						]
					})]
				}),
				/* @__PURE__ */ (0, L.jsxs)("div", {
					className: "ui-ai-result ui-two-column",
					children: [/* @__PURE__ */ (0, L.jsxs)("div", { children: [/* @__PURE__ */ (0, L.jsx)("h3", { children: "What is working" }), /* @__PURE__ */ (0, L.jsx)("ul", { children: W.insights?.map((e, t) => /* @__PURE__ */ (0, L.jsx)("li", { children: e }, t)) })] }), /* @__PURE__ */ (0, L.jsxs)("div", { children: [/* @__PURE__ */ (0, L.jsx)("h3", { children: "Where to focus next" }), /* @__PURE__ */ (0, L.jsx)("ul", { children: W.recommendations?.map((e, t) => /* @__PURE__ */ (0, L.jsx)("li", { children: e }, t)) })] })]
				}),
				W.needs_improvement?.length > 0 && /* @__PURE__ */ (0, L.jsx)("div", {
					className: "ui-actions tw:mt-4",
					children: W.needs_improvement.map((e) => /* @__PURE__ */ (0, L.jsx)(E, { value: e }, e))
				})
			]
		}),
		/* @__PURE__ */ (0, L.jsxs)("div", {
			className: "ui-dashboard-split",
			children: [/* @__PURE__ */ (0, L.jsx)(f, {
				title: "Performance snapshot",
				description: "How your team's grades are distributed.",
				children: /* @__PURE__ */ (0, L.jsx)(_, {
					queries: [
						e,
						t,
						r
					],
					children: X ? /* @__PURE__ */ (0, L.jsx)(j, {
						label: "Members",
						segments: $.map((e, t) => ({
							label: e,
							value: Y.filter((t) => t.grade === e).length,
							color: [
								"#3c9c7d",
								"#7595be",
								"#d6a23a",
								"#c77570"
							][t]
						}))
					}) : /* @__PURE__ */ (0, L.jsx)("p", {
						className: "ui-info",
						children: "Your role cannot access the data needed to calculate this view."
					})
				})
			}), /* @__PURE__ */ (0, L.jsxs)(f, {
				title: "A fair view of progress",
				description: "The current scoring model, made clear.",
				children: [
					/* @__PURE__ */ (0, L.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, L.jsx)("strong", { children: "Task completion" }), /* @__PURE__ */ (0, L.jsx)(E, { value: "50% weight" })]
					}),
					/* @__PURE__ */ (0, L.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, L.jsx)("strong", { children: "Attendance" }), /* @__PURE__ */ (0, L.jsx)(E, { value: "20% weight" })]
					}),
					/* @__PURE__ */ (0, L.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, L.jsx)("strong", { children: "On-time completion" }), /* @__PURE__ */ (0, L.jsx)(E, { value: "30% weight" })]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, L.jsx)(f, {
			title: "Performance directory",
			description: "A detailed view of your team's contributions.",
			children: /* @__PURE__ */ (0, L.jsx)(_, {
				queries: [
					e,
					t,
					r
				],
				children: /* @__PURE__ */ (0, L.jsx)(S, {
					data: X ? Y.filter((e) => !M || e.grade === M) : [],
					initialSorting: [{
						id: "final_score",
						desc: !0
					}],
					filter: /* @__PURE__ */ (0, L.jsx)(T, {
						label: "Filter grade",
						value: M,
						onChange: P,
						items: d($),
						placeholder: "All grades"
					}),
					columns: [
						{
							id: "rank",
							header: "Rank",
							cell: ({ row: e }) => Y.findIndex((t) => t.id === e.original.id) + 1
						},
						{
							accessorKey: "full_name",
							header: "Member",
							cell: ({ row: e }) => /* @__PURE__ */ (0, L.jsx)(y, {
								name: e.original.full_name,
								detail: e.original.position
							})
						},
						{
							accessorKey: "task_completion_rate",
							header: "Completion",
							cell: ({ row: e }) => /* @__PURE__ */ (0, L.jsx)(g, { value: e.original.task_completion_rate })
						},
						{
							accessorKey: "attendance_rate",
							header: "Attendance",
							cell: ({ row: e }) => `${e.original.attendance_rate}%`
						},
						{
							accessorKey: "on_time_rate",
							header: "On time",
							cell: ({ row: e }) => `${e.original.on_time_rate}%`
						},
						{
							accessorKey: "final_score",
							header: "Final score",
							cell: ({ row: e }) => /* @__PURE__ */ (0, L.jsxs)("strong", { children: [e.original.final_score, "%"] })
						},
						{
							accessorKey: "grade",
							header: "Grade",
							cell: ({ row: e }) => /* @__PURE__ */ (0, L.jsx)(E, { value: e.original.grade })
						}
					]
				})
			})
		}),
		/* @__PURE__ */ (0, L.jsxs)(h, {
			open: R,
			onClose: () => z(!1),
			title: "Record attendance",
			description: "Save attendance for the current month. Enter a percentage from 0 to 100.",
			busy: Q.isPending,
			onSubmit: () => void te(),
			error: B || Q.error,
			children: [
				/* @__PURE__ */ (0, L.jsx)(w, {
					label: "Member",
					value: H.member_id,
					onChange: (e) => U((t) => ({
						...t,
						member_id: e
					})),
					items: (e.data || []).map((e) => ({
						value: e.id,
						label: e.full_name
					})),
					required: !0
				}),
				/* @__PURE__ */ (0, L.jsx)(w, {
					label: "Committee",
					value: H.committee_id,
					onChange: (e) => U((t) => ({
						...t,
						committee_id: e
					})),
					items: (i.data || []).map((e) => ({
						value: e.id,
						label: e.name
					})),
					placeholder: "No committee"
				}),
				/* @__PURE__ */ (0, L.jsx)(w, {
					label: "Attendance rate (%)",
					type: "number",
					min: 0,
					max: 100,
					value: H.attendance_rate,
					onChange: (e) => U((t) => ({
						...t,
						attendance_rate: e
					})),
					required: !0
				})
			]
		})
	] });
}
//#endregion
export { R as default };
