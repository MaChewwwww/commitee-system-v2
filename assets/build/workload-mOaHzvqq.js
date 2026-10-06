import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { a as n, h as r, i, l as a, n as o, o as s, s as c } from "./api-DVPVP-g0.js";
import { C as l, H as ee, L as te, R as ne, S as re, _ as u, a as d, b as ie, d as f, g as p, h as m, l as h, m as g, n as _, o as v, r as y, s as b, t as x, u as S, v as ae, x as C, y as w } from "./hooks-CGjnItOC.js";
import { n as oe, t as se } from "./trash-C6NxJFw3.js";
import { i as ce, n as T } from "./app-4em4_PaO.js";
import { a as E, s as le, t as D } from "./calculations-Pe71IOFb.js";
import { t as O } from "./charts-DSojZOtP.js";
//#region node_modules/lucide-react/dist/esm/icons/coffee.mjs
var k = {
	name: "coffee",
	size: 24,
	node: [
		["path", {
			d: "M10 2v2",
			key: "7u0qdc"
		}],
		["path", {
			d: "M14 2v2",
			key: "6buw04"
		}],
		["path", {
			d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
			key: "pwadti"
		}],
		["path", {
			d: "M6 2v2",
			key: "colzsn"
		}]
	]
};
k.node;
var ue = a(k), A = {
	name: "triangle-alert",
	size: 24,
	node: [
		["path", {
			d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
			key: "wmoenq"
		}],
		["path", {
			d: "M12 9v4",
			key: "juzpu7"
		}],
		["path", {
			d: "M12 17h.01",
			key: "p32p05"
		}]
	],
	aliases: ["alert-triangle"]
};
A.node;
var de = a(A), j = /* @__PURE__ */ e(t(), 1), M = r();
function N() {
	let e = _("members"), t = _("committees"), r = _("tasks"), [a, k] = (0, j.useState)({
		member_id: "",
		committee_id: "",
		title: "",
		due_date: ""
	}), [A, N] = (0, j.useState)(!1), [P, F] = (0, j.useState)(""), [I, L] = (0, j.useState)(null), [R, z] = (0, j.useState)(null), [B, V] = (0, j.useState)(null), [fe, H] = (0, j.useState)(null), U = l(), W = x(() => s("tasks", {
		...a,
		title: a.title.trim(),
		committee_id: a.committee_id || null,
		due_date: a.due_date || null,
		status: "pending"
	}), ["tasks", "members"]), G = x((e) => s("tasks", {
		id: e.id,
		status: "completed",
		title: e.title
	}, !0), [
		"tasks",
		"members",
		"performance"
	]), K = x((e) => i("tasks", e), ["tasks", "members"]), q = x(() => n("ai/workload.php", "POST", {})), J = (e.data || []).map((e) => ({
		...e,
		pending: E(r.data || [], e.id),
		workload: le(E(r.data || [], e.id))
	})), Y = J.filter((e) => e.workload === "Balanced").length, X = J.filter((e) => e.workload === "Overloaded").length, Z = J.filter((e) => e.workload === "Underloaded").length, Q = !!e.data && !!r.data;
	async function pe() {
		if (!a.member_id || !a.title.trim()) {
			H(/* @__PURE__ */ Error("Select a member and enter a task title."));
			return;
		}
		if (E(r.data || [], a.member_id) >= 5) {
			H(/* @__PURE__ */ Error("This member already has five pending tasks. Choose another member."));
			return;
		}
		H(null);
		try {
			let e = await W.run();
			e && (N(!1), k({
				member_id: "",
				committee_id: "",
				title: "",
				due_date: ""
			}), U(e.message || "Task created."));
		} catch {}
	}
	function $(e, t) {
		k((n) => ({
			...n,
			[e]: t
		})), H(null);
	}
	let me = (e.data || []).map((e) => ({
		value: e.id,
		label: e.full_name
	})), he = (t.data || []).map((e) => ({
		value: e.id,
		label: e.name
	}));
	return /* @__PURE__ */ (0, M.jsxs)(M.Fragment, { children: [
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "ui-page-actions",
			children: [/* @__PURE__ */ (0, M.jsx)("p", { children: "Balance the work. Give every member room to contribute." }), /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "ui-actions",
				children: [o(window.APP_CONFIG, "ai.use") && /* @__PURE__ */ (0, M.jsxs)(y, {
					variant: "outline",
					busy: q.isPending,
					onClick: () => {
						q.run().then((e) => {
							e?.ai_analysis ? V(e.ai_analysis) : e && U("AI returned no workload analysis.", !0);
						}).catch(() => {});
					},
					children: [/* @__PURE__ */ (0, M.jsx)(te, { size: 15 }), "Analyze workload"]
				}), o(window.APP_CONFIG, "tasks.create") && /* @__PURE__ */ (0, M.jsxs)(c, {
					disabled: !Q,
					onClick: () => {
						W.reset(), H(null), N(!0);
					},
					children: [/* @__PURE__ */ (0, M.jsx)(ne, { size: 15 }), "Add task"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, M.jsxs)(ie, { children: [
			/* @__PURE__ */ (0, M.jsx)(w, {
				label: "Team members",
				value: e.data?.length ?? "—",
				hint: "Across your accessible workspace",
				icon: /* @__PURE__ */ (0, M.jsx)(T, { size: 16 })
			}),
			/* @__PURE__ */ (0, M.jsx)(w, {
				label: "Balanced",
				value: Q ? Y : "—",
				hint: "Two to five pending tasks",
				icon: /* @__PURE__ */ (0, M.jsx)(ce, { size: 16 }),
				tone: "green"
			}),
			/* @__PURE__ */ (0, M.jsx)(w, {
				label: "Overloaded",
				value: Q ? X : "—",
				hint: "More than five pending tasks",
				icon: /* @__PURE__ */ (0, M.jsx)(de, { size: 16 }),
				tone: "gold"
			}),
			/* @__PURE__ */ (0, M.jsx)(w, {
				label: "Underloaded",
				value: Q ? Z : "—",
				hint: "Fewer than two pending tasks",
				icon: /* @__PURE__ */ (0, M.jsx)(ue, { size: 16 }),
				tone: "purple"
			})
		] }),
		/* @__PURE__ */ (0, M.jsx)(h, { error: q.error }),
		B && /* @__PURE__ */ (0, M.jsxs)(d, {
			title: "A more balanced team",
			description: "AI-assisted observations based on your current workload.",
			children: [/* @__PURE__ */ (0, M.jsx)("div", {
				className: "ui-actions tw:mb-4",
				children: /* @__PURE__ */ (0, M.jsx)(C, { value: B.alert_level === "red" ? "Critical" : B.alert_level === "yellow" ? "Warning" : "Good" })
			}), /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "ui-ai-result",
				children: [/* @__PURE__ */ (0, M.jsx)("p", { children: B.summary }), B.recommendations?.map((e, t) => /* @__PURE__ */ (0, M.jsx)("div", {
					className: "ui-list-row",
					children: /* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsxs)("strong", { children: [
						e.from_member,
						" → ",
						e.to_member
					] }), /* @__PURE__ */ (0, M.jsx)("p", { children: e.reason })] })
				}, t))]
			})]
		}),
		/* @__PURE__ */ (0, M.jsxs)("div", {
			className: "ui-dashboard-split",
			children: [/* @__PURE__ */ (0, M.jsx)(u, {
				title: "Workload distribution",
				description: "A shared picture of capacity.",
				children: /* @__PURE__ */ (0, M.jsx)(m, {
					queries: [e, r],
					children: Q ? /* @__PURE__ */ (0, M.jsx)(O, {
						label: "Members",
						segments: [
							{
								label: "Balanced",
								value: Y,
								color: "#3c9c7d"
							},
							{
								label: "Underloaded",
								value: Z,
								color: "#7595be"
							},
							{
								label: "Overloaded",
								value: X,
								color: "#d6a23a"
							}
						]
					}) : /* @__PURE__ */ (0, M.jsx)("p", {
						className: "ui-info",
						children: "Your role cannot access the member and task data needed for this view."
					})
				})
			}), /* @__PURE__ */ (0, M.jsxs)(u, {
				title: "How capacity is measured",
				description: "A simple limit that keeps responsibilities manageable.",
				children: [/* @__PURE__ */ (0, M.jsx)("p", {
					className: "ui-info",
					children: "Each member can have up to five pending tasks. Completed tasks free up capacity for new work."
				}), /* @__PURE__ */ (0, M.jsx)("p", {
					className: "tw:mt-4 tw:text-xs tw:leading-7 tw:text-muted-foreground",
					children: "Review the member directory below before assigning work. AI suggestions are advisory; task changes remain under your control."
				})]
			})]
		}),
		/* @__PURE__ */ (0, M.jsx)(u, {
			title: "Member capacity",
			description: "See where your next task fits best.",
			children: /* @__PURE__ */ (0, M.jsx)(m, {
				queries: [e, r],
				children: /* @__PURE__ */ (0, M.jsx)(b, {
					data: Q ? J : [],
					columns: [
						{
							accessorKey: "full_name",
							header: "Member",
							cell: ({ row: e }) => /* @__PURE__ */ (0, M.jsx)(g, {
								name: e.original.full_name,
								detail: e.original.position
							})
						},
						{
							accessorKey: "pending",
							header: "Pending tasks"
						},
						{
							accessorKey: "pending",
							id: "capacity",
							header: "Capacity used",
							cell: ({ row: e }) => /* @__PURE__ */ (0, M.jsx)(p, {
								value: e.original.pending * 20,
								label: "Task capacity used"
							})
						},
						{
							accessorKey: "workload",
							header: "Workload",
							cell: ({ row: e }) => /* @__PURE__ */ (0, M.jsx)(C, { value: e.original.workload })
						},
						{
							id: "details",
							header: "Details",
							cell: ({ row: e }) => /* @__PURE__ */ (0, M.jsxs)(c, {
								variant: "ghost",
								size: "sm",
								onClick: () => z(e.original),
								children: [/* @__PURE__ */ (0, M.jsx)(oe, { size: 14 }), "View tasks"]
							})
						}
					],
					searchLabel: "Search team members…"
				})
			})
		}),
		/* @__PURE__ */ (0, M.jsx)(u, {
			title: "Task board",
			description: "Track what is pending and what is done.",
			children: /* @__PURE__ */ (0, M.jsx)(m, {
				queries: [r],
				children: /* @__PURE__ */ (0, M.jsx)(b, {
					data: (r.data || []).filter((e) => !P || e.status === P),
					filter: /* @__PURE__ */ (0, M.jsx)(ae, {
						label: "Filter task status",
						value: P,
						onChange: F,
						items: re(["pending", "completed"]),
						placeholder: "All tasks"
					}),
					columns: [
						{
							accessorKey: "title",
							header: "Task"
						},
						{
							accessorFn: (t) => e.data?.find((e) => e.id === t.member_id)?.full_name || "Unassigned",
							id: "member",
							header: "Assigned to"
						},
						{
							accessorKey: "due_date",
							header: "Due",
							cell: ({ row: e }) => D(e.original.due_date)
						},
						{
							accessorKey: "status",
							header: "Status",
							cell: ({ row: e }) => /* @__PURE__ */ (0, M.jsx)(C, { value: e.original.status })
						},
						{
							id: "actions",
							header: "Actions",
							cell: ({ row: e }) => /* @__PURE__ */ (0, M.jsxs)("div", {
								className: "ui-actions",
								children: [e.original.status === "pending" && o(window.APP_CONFIG, "tasks.update") && /* @__PURE__ */ (0, M.jsxs)(y, {
									variant: "ghost",
									size: "sm",
									busy: G.isPending,
									onClick: () => {
										G.run(e.original).then((e) => {
											e && U("Task completed.");
										}).catch((e) => U(e.message, !0));
									},
									children: [/* @__PURE__ */ (0, M.jsx)(ee, { size: 13 }), "Complete"]
								}), o(window.APP_CONFIG, "tasks.delete") && /* @__PURE__ */ (0, M.jsxs)(c, {
									variant: "ghost",
									size: "sm",
									className: "tw:text-destructive",
									onClick: () => {
										K.reset(), L(e.original);
									},
									children: [/* @__PURE__ */ (0, M.jsx)(se, { size: 13 }), "Remove"]
								})]
							})
						}
					]
				})
			})
		}),
		/* @__PURE__ */ (0, M.jsxs)(f, {
			open: A,
			onClose: () => N(!1),
			title: "Add a task",
			onSubmit: () => void pe(),
			busy: W.isPending,
			error: fe || W.error,
			children: [
				/* @__PURE__ */ (0, M.jsx)(S, {
					label: "Member",
					value: a.member_id,
					onChange: (e) => $("member_id", e),
					items: me,
					required: !0
				}),
				/* @__PURE__ */ (0, M.jsx)(S, {
					label: "Committee",
					value: a.committee_id,
					onChange: (e) => $("committee_id", e),
					items: he,
					placeholder: "No committee"
				}),
				/* @__PURE__ */ (0, M.jsx)(S, {
					label: "Task title",
					value: a.title,
					onChange: (e) => $("title", e),
					required: !0
				}),
				/* @__PURE__ */ (0, M.jsx)(S, {
					label: "Due date",
					type: "date",
					value: a.due_date,
					onChange: (e) => $("due_date", e)
				})
			]
		}),
		/* @__PURE__ */ (0, M.jsx)(v, {
			open: !!I,
			onClose: () => L(null),
			title: "Remove this task?",
			description: I?.title,
			busy: K.isPending,
			error: K.error,
			onConfirm: () => {
				I && K.run(I.id).then((e) => {
					e && (L(null), U("Task removed."));
				}).catch(() => {});
			}
		}),
		/* @__PURE__ */ (0, M.jsx)(f, {
			open: !!R,
			onClose: () => z(null),
			title: `${R?.full_name || "Member"} · Tasks`,
			description: "Current responsibilities for this member.",
			onSubmit: () => z(null),
			busy: !1,
			children: /* @__PURE__ */ (0, M.jsxs)("div", {
				className: "tw:col-span-full",
				children: [(r.data || []).filter((e) => e.member_id === R?.id).map((e) => /* @__PURE__ */ (0, M.jsxs)("div", {
					className: "ui-list-row",
					children: [/* @__PURE__ */ (0, M.jsxs)("div", { children: [/* @__PURE__ */ (0, M.jsx)("strong", { children: e.title }), /* @__PURE__ */ (0, M.jsxs)("small", { children: ["Due ", D(e.due_date)] })] }), /* @__PURE__ */ (0, M.jsx)(C, { value: e.status })]
				}, e.id)), !(r.data || []).some((e) => e.member_id === R?.id) && /* @__PURE__ */ (0, M.jsx)("p", {
					className: "ui-info",
					children: "No tasks assigned to this member."
				})]
			})
		})
	] });
}
//#endregion
export { N as default };
