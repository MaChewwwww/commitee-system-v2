import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { a as n, h as r, n as i, o as a, s as o } from "./api-DVPVP-g0.js";
import { C as s, H as c, I as l, L as u, S as d, a as f, h as p, l as m, m as h, n as g, o as _, r as v, t as y, u as b, x } from "./hooks-CGjnItOC.js";
import { t as S } from "./management-B_sQlv9E.js";
import { a as C, t as w } from "./calculations-Pe71IOFb.js";
//#region frontend/pages/assignments.tsx
var T = /* @__PURE__ */ e(t(), 1), E = r();
function D() {
	let e = g("members"), t = g("committees"), r = g("tasks"), [D, O] = (0, T.useState)({
		committee_id: "",
		required_skills: "",
		max_workload: "5",
		preferred_position: ""
	}), [k, A] = (0, T.useState)(null), [j, M] = (0, T.useState)(""), [N, P] = (0, T.useState)({}), [F, I] = (0, T.useState)(null), [L, R] = (0, T.useState)(null), z = s(), B = y((e) => n("ai/recommend.php", "POST", e)), V = y((e) => a("assignments", {
		member_id: e.member_id,
		committee_id: j,
		role: "Member"
	}), ["assignments"]), H = (t.data || []).map((e) => ({
		value: e.id,
		label: e.name
	})), U = (e.data || []).map((e) => ({
		value: e.id,
		label: e.full_name
	}));
	function W(e, t) {
		O((n) => ({
			...n,
			[e]: t
		})), R(null);
	}
	async function G() {
		if (!D.committee_id) {
			R(/* @__PURE__ */ Error("Select a committee before requesting recommendations."));
			return;
		}
		let e = D.committee_id, t = Number(D.max_workload);
		try {
			let n = await B.run({
				...D,
				required_skills: D.required_skills.split(",").map((e) => e.trim()).filter(Boolean),
				max_workload: t,
				availability: "available"
			});
			if (n) {
				let i = r.data ? n.data.recommendations.filter((e) => C(r.data, e.member_id) < t) : n.data.recommendations;
				A({
					...n,
					data: {
						...n.data,
						recommendations: i
					}
				}), M(e), P({});
			}
		} catch {}
	}
	let K = i(window.APP_CONFIG, "ai.use") && /* @__PURE__ */ (0, E.jsxs)(f, {
		title: "Put the right strengths together",
		description: "Find available members whose skills fit your committee's needs.",
		children: [
			/* @__PURE__ */ (0, E.jsxs)(p, {
				queries: [t, e],
				children: [
					/* @__PURE__ */ (0, E.jsxs)("div", {
						className: "ui-form-grid",
						children: [
							/* @__PURE__ */ (0, E.jsx)(b, {
								label: "Committee",
								value: D.committee_id,
								onChange: (e) => W("committee_id", e),
								items: H,
								required: !0
							}),
							/* @__PURE__ */ (0, E.jsx)(b, {
								label: "Required skills",
								value: D.required_skills,
								onChange: (e) => W("required_skills", e),
								placeholder: "Leadership, communication…"
							}),
							/* @__PURE__ */ (0, E.jsx)(b, {
								label: "Workload limit",
								value: D.max_workload,
								onChange: (e) => W("max_workload", e),
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
							/* @__PURE__ */ (0, E.jsx)(b, {
								label: "Preferred position",
								value: D.preferred_position,
								onChange: (e) => W("preferred_position", e),
								items: d([
									"SK Chairman",
									"SK Kagawad",
									"SK Secretary",
									"SK Treasurer",
									"SK Member"
								]),
								placeholder: "Any position"
							})
						]
					}),
					/* @__PURE__ */ (0, E.jsx)("p", {
						className: "tw:mt-3 tw:text-xs tw:text-muted-foreground",
						children: "Recommendations consider available members who are not already assigned to this committee."
					}),
					/* @__PURE__ */ (0, E.jsx)(m, { error: L || B.error }),
					/* @__PURE__ */ (0, E.jsxs)(v, {
						className: "tw:mt-5",
						busy: B.isPending,
						onClick: () => void G(),
						children: [/* @__PURE__ */ (0, E.jsx)(u, { size: 15 }), "Find recommended members"]
					})
				]
			}),
			k && /* @__PURE__ */ (0, E.jsxs)("div", {
				className: "ui-ai-result",
				children: [
					/* @__PURE__ */ (0, E.jsxs)("h3", { children: [
						"Recommendations for",
						" ",
						t.data?.find((e) => e.id === j)?.name || "your committee"
					] }),
					/* @__PURE__ */ (0, E.jsx)("p", { children: k.data.summary }),
					!k.data.recommendations.length && /* @__PURE__ */ (0, E.jsx)("p", {
						className: "tw:mt-3",
						children: "No members matched these criteria. Try another set of skills or workload limit."
					}),
					k.data.recommendations.map((e) => /* @__PURE__ */ (0, E.jsxs)("div", {
						className: "ui-list-row",
						children: [/* @__PURE__ */ (0, E.jsxs)("div", { children: [/* @__PURE__ */ (0, E.jsx)(h, {
							name: e.member_name,
							detail: e.reason
						}), /* @__PURE__ */ (0, E.jsxs)("div", {
							className: "ui-actions tw:mt-3",
							children: [/* @__PURE__ */ (0, E.jsx)(x, { value: `${e.score}/100 match` }), /* @__PURE__ */ (0, E.jsxs)("small", {
								className: "tw:text-xs tw:text-muted-foreground",
								children: ["Skills: ", e.skills_match]
							})]
						})] }), /* @__PURE__ */ (0, E.jsx)("div", {
							className: "ui-actions",
							children: N[e.member_id] ? /* @__PURE__ */ (0, E.jsx)(x, { value: N[e.member_id] }) : /* @__PURE__ */ (0, E.jsxs)(E.Fragment, { children: [i(window.APP_CONFIG, "assignments.create") && /* @__PURE__ */ (0, E.jsxs)(o, {
								size: "sm",
								onClick: () => {
									V.reset(), I(e);
								},
								children: [/* @__PURE__ */ (0, E.jsx)(c, { size: 13 }), "Accept"]
							}), /* @__PURE__ */ (0, E.jsxs)(o, {
								size: "sm",
								variant: "outline",
								onClick: () => P((t) => ({
									...t,
									[e.member_id]: "Rejected"
								})),
								children: [/* @__PURE__ */ (0, E.jsx)(l, { size: 13 }), "Dismiss"]
							})] })
						})]
					}, e.member_id))
				]
			}),
			/* @__PURE__ */ (0, E.jsx)(_, {
				open: !!F,
				onClose: () => I(null),
				title: `Assign ${F?.member_name || "this member"}?`,
				description: "This will add the member to the committee shown in these recommendations.",
				destructive: !1,
				busy: V.isPending,
				error: V.error,
				onConfirm: () => {
					F && V.run(F).then((e) => {
						e && (P((e) => ({
							...e,
							[F.member_id]: "Accepted"
						})), I(null), z(e.message || "Member assigned."));
					}).catch(() => {});
				}
			})
		]
	});
	return /* @__PURE__ */ (0, E.jsx)(S, {
		resource: "assignments",
		singular: "Assignment",
		defaults: {
			member_id: "",
			committee_id: "",
			role: "Member"
		},
		queries: [e, t],
		before: K,
		fields: () => [
			{
				name: "member_id",
				label: "Member",
				required: !0,
				items: U
			},
			{
				name: "committee_id",
				label: "Committee",
				required: !0,
				items: H
			},
			{
				name: "role",
				label: "Committee role",
				required: !0,
				items: d([
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
					return /* @__PURE__ */ (0, E.jsx)(h, {
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
				cell: ({ row: e }) => /* @__PURE__ */ (0, E.jsx)(x, { value: e.original.role })
			},
			{
				accessorKey: "assigned_at",
				header: "Assigned",
				cell: ({ row: e }) => w(e.original.assigned_at)
			}
		]
	});
}
//#endregion
export { D as default };
