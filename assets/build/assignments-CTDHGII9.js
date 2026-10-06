import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { a as n, h as r, n as i, o as a, s as o } from "./api-DVPVP-g0.js";
import { C as s, L as c, R as l, S as u, U as d, _ as f, a as p, d as m, h, l as g, m as _, n as v, o as y, r as b, s as x, t as S, u as C, x as w } from "./hooks-BlRndFBy.js";
import { t as T } from "./management-Z1Cs2zh-.js";
import { i as E, n as D, o as O, t as k } from "./calculations-ZvWekKcJ.js";
//#region frontend/components/committee-tasks.tsx
var A = /* @__PURE__ */ e(t(), 1), j = r();
function M() {
	let e = v("tasks"), t = v("committees"), n = v("members"), r = v("assignments"), [c, l] = (0, A.useState)(!1), [u, d] = (0, A.useState)({
		committee_id: "",
		member_id: "",
		title: "",
		due_date: ""
	}), [p, _] = (0, A.useState)(null), y = s(), T = S(() => a("tasks", {
		...u,
		due_date: u.due_date || null,
		status: "pending"
	}), [
		"tasks",
		"members",
		"performance"
	]), E = S((e) => a("tasks", e, !0), [
		"tasks",
		"members",
		"performance"
	]), M = window.APP_CONFIG, N = [
		"super_admin",
		"sk_chairperson",
		"secretary",
		"committee_chairperson"
	].includes(M.role);
	async function P(e, t) {
		try {
			let n = await E.run({
				id: e.id,
				status: t
			});
			n && y(n.message || "Task progress updated.");
		} catch {}
	}
	async function F() {
		if (!u.committee_id || !u.member_id || !u.title.trim()) {
			_(/* @__PURE__ */ Error("Select a committee, its handler, and a task title."));
			return;
		}
		try {
			await T.run() && (l(!1), d({
				committee_id: "",
				member_id: "",
				title: "",
				due_date: ""
			}), y("Task assigned."));
		} catch {}
	}
	return /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [/* @__PURE__ */ (0, j.jsxs)(f, {
		title: "Committee tasks",
		description: "Assign work here. Start it, submit it for review, and approve completion. Workload remains a monitoring page.",
		action: i(M, "tasks.create") && /* @__PURE__ */ (0, j.jsx)(o, {
			onClick: () => {
				T.reset(), _(null), l(!0);
			},
			children: "Assign task"
		}),
		children: [/* @__PURE__ */ (0, j.jsx)(g, { error: E.error }), /* @__PURE__ */ (0, j.jsx)(h, {
			queries: [
				e,
				t,
				n,
				r
			],
			children: /* @__PURE__ */ (0, j.jsx)(x, {
				data: e.data || [],
				searchLabel: "Search assigned tasks…",
				columns: [
					{
						accessorKey: "title",
						header: "Task"
					},
					{
						id: "committee",
						header: "Committee",
						accessorFn: (e) => t.data?.find((t) => t.id === e.committee_id)?.name || "Committee unavailable"
					},
					{
						id: "handler",
						header: "Handled by",
						accessorFn: (e) => n.data?.find((t) => t.id === e.member_id)?.full_name || "Member unavailable"
					},
					{
						accessorKey: "due_date",
						header: "Due",
						cell: ({ row: e }) => D(e.original.due_date)
					},
					{
						accessorKey: "status",
						header: "Status",
						cell: ({ row: e }) => /* @__PURE__ */ (0, j.jsx)(w, { value: O(e.original.status) })
					},
					{
						id: "actions",
						header: "Progress",
						cell: ({ row: e }) => {
							let t = e.original;
							if (!i(M, "tasks.update") || t.status === "completed") return null;
							let r = M.memberId === t.member_id || n.data?.find((e) => e.id === t.member_id)?.email === M.userEmail;
							return /* @__PURE__ */ (0, j.jsxs)("div", {
								className: "ui-actions",
								children: [
									t.status === "pending" && /* @__PURE__ */ (0, j.jsx)(b, {
										size: "sm",
										variant: "outline",
										busy: E.isPending,
										onClick: () => void P(t, "in_progress"),
										children: "Start"
									}),
									t.status === "in_progress" && /* @__PURE__ */ (0, j.jsx)(b, {
										size: "sm",
										variant: "outline",
										busy: E.isPending,
										onClick: () => void P(t, "awaiting_approval"),
										children: "Submit for review"
									}),
									t.status === "awaiting_approval" && N && /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [/* @__PURE__ */ (0, j.jsx)(b, {
										size: "sm",
										busy: E.isPending,
										disabled: r,
										onClick: () => void P(t, "completed"),
										children: "Approve completion"
									}), /* @__PURE__ */ (0, j.jsx)(b, {
										size: "sm",
										variant: "outline",
										busy: E.isPending,
										onClick: () => void P(t, "in_progress"),
										children: "Return for revision"
									})] })
								]
							});
						}
					}
				]
			})
		})]
	}), /* @__PURE__ */ (0, j.jsxs)(m, {
		open: c,
		onClose: () => l(!1),
		title: "Assign committee task",
		busy: T.isPending,
		error: p || T.error,
		onSubmit: () => void F(),
		children: [
			/* @__PURE__ */ (0, j.jsx)(C, {
				label: "Task committee",
				required: !0,
				value: u.committee_id,
				onChange: (e) => d({
					...u,
					committee_id: e,
					member_id: ""
				}),
				items: (t.data || []).filter(k).map((e) => ({
					value: e.id,
					label: e.name
				}))
			}),
			/* @__PURE__ */ (0, j.jsx)(C, {
				label: "Task handler",
				required: !0,
				value: u.member_id,
				onChange: (e) => d({
					...u,
					member_id: e
				}),
				items: (n.data || []).filter((e) => r.data?.some((t) => t.committee_id === u.committee_id && t.member_id === e.id)).map((e) => ({
					value: e.id,
					label: e.full_name
				}))
			}),
			/* @__PURE__ */ (0, j.jsx)(C, {
				label: "Task title",
				required: !0,
				value: u.title,
				onChange: (e) => d({
					...u,
					title: e
				})
			}),
			/* @__PURE__ */ (0, j.jsx)(C, {
				label: "Due date",
				type: "date",
				value: u.due_date,
				onChange: (e) => d({
					...u,
					due_date: e
				})
			})
		]
	})] });
}
//#endregion
//#region frontend/pages/assignments.tsx
function N() {
	let e = v("members"), t = v("committees"), r = v("tasks"), [f, m] = (0, A.useState)({
		committee_id: "",
		required_skills: "",
		max_workload: "5",
		preferred_position: ""
	}), [x, O] = (0, A.useState)(null), [N, P] = (0, A.useState)(""), [F, I] = (0, A.useState)({}), [L, R] = (0, A.useState)(null), [z, B] = (0, A.useState)(null), V = s(), H = S((e) => n("ai/recommend.php", "POST", e)), U = S((e) => a("assignments", {
		member_id: e.member_id,
		committee_id: N,
		role: "Member"
	}), ["assignments"]), W = (t.data || []).filter(k).map((e) => ({
		value: e.id,
		label: e.name
	})), G = (e.data || []).map((e) => ({
		value: e.id,
		label: e.full_name
	}));
	function K(e, t) {
		m((n) => ({
			...n,
			[e]: t
		})), B(null);
	}
	async function q() {
		if (!f.committee_id) {
			B(/* @__PURE__ */ Error("Select a committee before requesting recommendations."));
			return;
		}
		let e = f.committee_id, t = Number(f.max_workload);
		try {
			let n = await H.run({
				...f,
				required_skills: f.required_skills.split(",").map((e) => e.trim()).filter(Boolean),
				max_workload: t,
				availability: "available"
			});
			if (n) {
				let i = r.data ? n.data.recommendations.filter((e) => E(r.data, e.member_id) < t) : n.data.recommendations;
				O({
					...n,
					data: {
						...n.data,
						recommendations: i
					}
				}), P(e), I({});
			}
		} catch {}
	}
	let J = i(window.APP_CONFIG, "ai.use") && /* @__PURE__ */ (0, j.jsxs)(p, {
		title: "Put the right strengths together",
		description: "Find available members whose skills fit your committee's needs.",
		children: [
			/* @__PURE__ */ (0, j.jsxs)(h, {
				queries: [t, e],
				children: [
					/* @__PURE__ */ (0, j.jsxs)("div", {
						className: "ui-form-grid",
						children: [
							/* @__PURE__ */ (0, j.jsx)(C, {
								label: "Committee",
								value: f.committee_id,
								onChange: (e) => K("committee_id", e),
								items: W,
								required: !0
							}),
							/* @__PURE__ */ (0, j.jsx)(C, {
								label: "Required skills",
								value: f.required_skills,
								onChange: (e) => K("required_skills", e),
								placeholder: "Leadership, communication…"
							}),
							/* @__PURE__ */ (0, j.jsx)(C, {
								label: "Workload limit",
								value: f.max_workload,
								onChange: (e) => K("max_workload", e),
								items: [
									{
										value: "3",
										label: "Fewer than 3 pending tasks"
									},
									{
										value: "4",
										label: "Fewer than 4 pending tasks"
									},
									{
										value: "5",
										label: "Fewer than 5 pending tasks"
									}
								],
								disabled: !r.data
							}),
							/* @__PURE__ */ (0, j.jsx)(C, {
								label: "Preferred position",
								value: f.preferred_position,
								onChange: (e) => K("preferred_position", e),
								items: u([
									"Presiding Officer",
									"City Councilor",
									"Municipal Councilor",
									"Sanggunian Secretary",
									"Committee Staff",
									"Committee Member"
								]),
								placeholder: "Any position"
							})
						]
					}),
					/* @__PURE__ */ (0, j.jsx)("p", {
						className: "tw:mt-3 tw:text-xs tw:text-muted-foreground",
						children: "Recommendations consider available members who are not already assigned to this committee."
					}),
					/* @__PURE__ */ (0, j.jsx)(g, { error: z || H.error }),
					/* @__PURE__ */ (0, j.jsxs)(b, {
						className: "tw:mt-5",
						busy: H.isPending,
						onClick: () => void q(),
						children: [/* @__PURE__ */ (0, j.jsx)(l, { size: 15 }), "Find recommended members"]
					})
				]
			}),
			x && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "ui-ai-result",
				children: [
					/* @__PURE__ */ (0, j.jsxs)("h3", { children: [
						"Recommendations for",
						" ",
						t.data?.find((e) => e.id === N)?.name || "your committee"
					] }),
					/* @__PURE__ */ (0, j.jsx)("p", { children: x.data.summary }),
					!x.data.recommendations.length && /* @__PURE__ */ (0, j.jsx)("p", {
						className: "tw:mt-3",
						children: "No members matched these criteria. Try another set of skills or workload limit."
					}),
					x.data.recommendations.map((e) => /* @__PURE__ */ (0, j.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)(_, {
							name: e.member_name,
							detail: e.reason
						}), /* @__PURE__ */ (0, j.jsxs)("div", {
							className: "ui-actions tw:mt-3",
							children: [/* @__PURE__ */ (0, j.jsx)(w, { value: `${e.score}/100 match` }), /* @__PURE__ */ (0, j.jsxs)("small", {
								className: "tw:text-xs tw:text-muted-foreground",
								children: ["Skills: ", e.skills_match]
							})]
						})] }), /* @__PURE__ */ (0, j.jsx)("div", {
							className: "ui-actions",
							children: F[e.member_id] ? /* @__PURE__ */ (0, j.jsx)(w, { value: F[e.member_id] }) : /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [i(window.APP_CONFIG, "assignments.create") && /* @__PURE__ */ (0, j.jsxs)(o, {
								size: "sm",
								onClick: () => {
									U.reset(), R(e);
								},
								children: [/* @__PURE__ */ (0, j.jsx)(d, { size: 13 }), "Accept"]
							}), /* @__PURE__ */ (0, j.jsxs)(o, {
								size: "sm",
								variant: "outline",
								onClick: () => I((t) => ({
									...t,
									[e.member_id]: "Rejected"
								})),
								children: [/* @__PURE__ */ (0, j.jsx)(c, { size: 13 }), "Dismiss"]
							})] })
						})]
					}, e.member_id))
				]
			}),
			/* @__PURE__ */ (0, j.jsx)(y, {
				open: !!L,
				onClose: () => R(null),
				title: `Assign ${L?.member_name || "this member"}?`,
				description: "This will add the member to the committee shown in these recommendations.",
				destructive: !1,
				busy: U.isPending,
				error: U.error,
				onConfirm: () => {
					L && U.run(L).then((e) => {
						e && (I((e) => ({
							...e,
							[L.member_id]: "Accepted"
						})), R(null), V(e.message || "Member assigned."));
					}).catch(() => {});
				}
			})
		]
	});
	return /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [/* @__PURE__ */ (0, j.jsx)(T, {
		resource: "assignments",
		singular: "Assignment",
		defaults: {
			member_id: "",
			committee_id: "",
			role: "Member"
		},
		queries: [e, t],
		before: J,
		fields: (e) => [
			{
				name: "member_id",
				label: "Member",
				required: !0,
				items: G,
				disabled: e
			},
			{
				name: "committee_id",
				label: "Committee",
				required: !0,
				items: e ? (t.data || []).map((e) => ({
					value: e.id,
					label: e.name
				})) : W,
				disabled: e
			},
			{
				name: "role",
				label: "Committee role",
				required: !0,
				items: u([
					"Member",
					"Chairperson",
					"Vice Chairperson",
					"Secretary"
				])
			}
		],
		columns: [
			{
				accessorFn: (t) => e.data?.find((e) => e.id === t.member_id)?.full_name || "Unknown member",
				id: "member",
				header: "Member",
				cell: ({ row: t }) => {
					let n = e.data?.find((e) => e.id === t.original.member_id);
					return /* @__PURE__ */ (0, j.jsx)(_, {
						name: n?.full_name || "Unknown member",
						detail: n?.position
					});
				}
			},
			{
				accessorFn: (e) => t.data?.find((t) => t.id === e.committee_id)?.name || "Unknown committee",
				id: "committee",
				header: "Committee"
			},
			{
				accessorKey: "role",
				header: "Role",
				cell: ({ row: e }) => /* @__PURE__ */ (0, j.jsx)(w, { value: e.original.role })
			},
			{
				accessorKey: "assigned_at",
				header: "Assigned",
				cell: ({ row: e }) => D(e.original.assigned_at)
			}
		]
	}), /* @__PURE__ */ (0, j.jsx)(M, {})] });
}
//#endregion
export { N as default };
