import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { a as n, c as r, h as i, l as a, m as o, n as s, o as c, s as l } from "./api-DVPVP-g0.js";
import { C as u, D as d, E as ee, L as te, O as ne, T as re, _ as f, _t as p, a as ie, ct as m, dt as h, h as g, ht as _, k as v, l as y, lt as b, n as x, pt as S, r as C, s as ae, t as w, u as T, ut as E, w as oe, x as se } from "./hooks-CGjnItOC.js";
import { t as ce } from "./archive-wn--b_zA.js";
import { g as D, h as O, m as k, o as le } from "./app-B8tnWQbD.js";
import { a as A, n as j, r as M, s as N, t as P } from "./calculations-Pe71IOFb.js";
//#region node_modules/@radix-ui/react-tabs/dist/index.mjs
var F = /* @__PURE__ */ e(t(), 1), I = i(), L = Object.defineProperty, R = (e, t) => L(e, "name", {
	value: t,
	configurable: !0
}), z = "Tabs", [B, V] = _(z, [D]), H = D(), [U, W] = B(z), G = /* @__PURE__ */ F.forwardRef(/* @__PURE__ */ R(function(e, t) {
	let { __scopeTabs: n, value: r, onValueChange: i, defaultValue: a, orientation: o = "horizontal", dir: s, activationMode: c = "automatic", ...l } = e, u = m(s), [d, ee] = h({
		prop: r,
		onChange: i,
		defaultProp: a ?? "",
		caller: z
	});
	return /* @__PURE__ */ (0, I.jsx)(U, {
		scope: n,
		baseId: b(),
		value: d,
		onValueChange: ee,
		orientation: o,
		dir: u,
		activationMode: c,
		children: /* @__PURE__ */ (0, I.jsx)(p.div, {
			dir: u,
			"data-orientation": o,
			...l,
			ref: t
		})
	});
}, "Tabs")), ue = "TabsList", de = /* @__PURE__ */ F.forwardRef(/* @__PURE__ */ R(function(e, t) {
	let { __scopeTabs: n, loop: r = !0, ...i } = e, a = W(ue, n), o = H(n);
	return /* @__PURE__ */ (0, I.jsx)(O, {
		asChild: !0,
		...o,
		orientation: a.orientation,
		dir: a.dir,
		loop: r,
		children: /* @__PURE__ */ (0, I.jsx)(p.div, {
			role: "tablist",
			"aria-orientation": a.orientation,
			...i,
			ref: t
		})
	});
}, "TabsList")), fe = "TabsTrigger", pe = /* @__PURE__ */ F.forwardRef(/* @__PURE__ */ R(function(e, t) {
	let { __scopeTabs: n, value: r, disabled: i = !1, ...a } = e, o = W(fe, n), s = H(n), c = K(o.baseId, r), l = q(o.baseId, r), u = r === o.value;
	return /* @__PURE__ */ (0, I.jsx)(k, {
		asChild: !0,
		...s,
		focusable: !i,
		active: u,
		children: /* @__PURE__ */ (0, I.jsx)(p.button, {
			type: "button",
			role: "tab",
			"aria-selected": u,
			"aria-controls": l,
			"data-state": u ? "active" : "inactive",
			"data-disabled": i ? "" : void 0,
			disabled: i,
			id: c,
			...a,
			ref: t,
			onMouseDown: S(e.onMouseDown, (e) => {
				!i && e.button === 0 && e.ctrlKey === !1 ? o.onValueChange(r) : e.preventDefault();
			}),
			onKeyDown: S(e.onKeyDown, (e) => {
				i || e.target !== e.currentTarget || [" ", "Enter"].includes(e.key) && o.onValueChange(r);
			}),
			onFocus: S(e.onFocus, () => {
				let e = o.activationMode !== "manual";
				!u && !i && e && o.onValueChange(r);
			})
		})
	});
}, "TabsTrigger")), me = "TabsContent", he = /* @__PURE__ */ F.forwardRef(/* @__PURE__ */ R(function(e, t) {
	let { __scopeTabs: n, value: r, forceMount: i, children: a, ...o } = e, s = W(me, n), c = K(s.baseId, r), l = q(s.baseId, r), u = r === s.value, d = F.useRef(u);
	return F.useEffect(() => {
		let e = requestAnimationFrame(() => d.current = !1);
		return () => cancelAnimationFrame(e);
	}, []), /* @__PURE__ */ (0, I.jsx)(E, {
		present: i || u,
		children: ({ present: n }) => /* @__PURE__ */ (0, I.jsx)(p.div, {
			"data-state": u ? "active" : "inactive",
			"data-orientation": s.orientation,
			role: "tabpanel",
			"aria-labelledby": c,
			hidden: !n,
			id: l,
			tabIndex: 0,
			...o,
			ref: t,
			style: {
				...e.style,
				animationDuration: d.current ? "0s" : void 0
			},
			children: n && a
		})
	});
}, "TabsContent"));
function K(e, t) {
	return `${e}-trigger-${t}`;
}
R(K, "makeTriggerId");
function q(e, t) {
	return `${e}-content-${t}`;
}
R(q, "makeContentId");
var ge = G, _e = de, ve = pe, ye = he, J = {
	name: "download",
	size: 24,
	node: [
		["path", {
			d: "M12 15V3",
			key: "m9g1x1"
		}],
		["path", {
			d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
			key: "ih7n3h"
		}],
		["path", {
			d: "m7 10 5 5 5-5",
			key: "brsn70"
		}]
	]
};
J.node;
var be = a(J), Y = {
	name: "printer",
	size: 24,
	node: [
		["path", {
			d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
			key: "143wyd"
		}],
		["path", {
			d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",
			key: "1itne7"
		}],
		["rect", {
			x: "6",
			y: "14",
			width: "12",
			height: "8",
			rx: "1",
			key: "1ue0tg"
		}]
	]
};
Y.node;
var X = a(Y), Z = {
	name: "send",
	size: 24,
	node: [["path", {
		d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
		key: "1ffxy3"
	}], ["path", {
		d: "m21.854 2.147-10.94 10.939",
		key: "12cjpa"
	}]]
};
Z.node;
var xe = a(Z);
//#endregion
//#region frontend/components/ui/tabs.tsx
function Se({ className: e, orientation: t = "horizontal", ...n }) {
	return /* @__PURE__ */ (0, I.jsx)(ge, {
		"data-slot": "tabs",
		"data-orientation": t,
		orientation: t,
		className: o("tw:group/tabs tw:flex tw:gap-2 tw:data-[orientation=horizontal]:flex-col", e),
		...n
	});
}
var Ce = r("tw:group/tabs-list tw:inline-flex tw:w-fit tw:items-center tw:justify-center tw:rounded-lg tw:p-[3px] tw:text-muted-foreground tw:group-data-[orientation=horizontal]/tabs:h-9 tw:group-data-[orientation=vertical]/tabs:h-fit tw:group-data-[orientation=vertical]/tabs:flex-col tw:data-[variant=line]:rounded-none", {
	variants: { variant: {
		default: "tw:bg-muted",
		line: "tw:gap-1 tw:bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function we({ className: e, variant: t = "default", ...n }) {
	return /* @__PURE__ */ (0, I.jsx)(_e, {
		"data-slot": "tabs-list",
		"data-variant": t,
		className: o(Ce({ variant: t }), e),
		...n
	});
}
function Q({ className: e, ...t }) {
	return /* @__PURE__ */ (0, I.jsx)(ve, {
		"data-slot": "tabs-trigger",
		className: o("tw:relative tw:inline-flex tw:h-[calc(100%-1px)] tw:flex-1 tw:items-center tw:justify-center tw:gap-1.5 tw:rounded-md tw:border tw:border-transparent tw:px-2 tw:py-1 tw:text-sm tw:font-medium tw:whitespace-nowrap tw:text-foreground/60 tw:transition-all tw:group-data-[orientation=vertical]/tabs:w-full tw:group-data-[orientation=vertical]/tabs:justify-start tw:hover:text-foreground tw:focus-visible:border-ring tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring/50 tw:focus-visible:outline-1 tw:focus-visible:outline-ring tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm tw:group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none tw:dark:text-muted-foreground tw:dark:hover:text-foreground tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4", "tw:group-data-[variant=line]/tabs-list:bg-transparent tw:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent tw:dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent tw:dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent", "tw:data-[state=active]:bg-background tw:data-[state=active]:text-foreground tw:dark:data-[state=active]:border-input tw:dark:data-[state=active]:bg-input/30 tw:dark:data-[state=active]:text-foreground", "tw:after:absolute tw:after:bg-foreground tw:after:opacity-0 tw:after:transition-opacity tw:group-data-[orientation=horizontal]/tabs:after:inset-x-0 tw:group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] tw:group-data-[orientation=horizontal]/tabs:after:h-0.5 tw:group-data-[orientation=vertical]/tabs:after:inset-y-0 tw:group-data-[orientation=vertical]/tabs:after:-right-1 tw:group-data-[orientation=vertical]/tabs:after:w-0.5 tw:group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100", e),
		...t
	});
}
function $({ className: e, ...t }) {
	return /* @__PURE__ */ (0, I.jsx)(ye, {
		"data-slot": "tabs-content",
		className: o("tw:flex-1 tw:outline-none", e),
		...t
	});
}
//#endregion
//#region frontend/lib/reports.ts
function Te(e, t, n = "") {
	let { committees: r, members: i, tasks: a, assignments: o } = t;
	return e === "committee" ? {
		title: "Committee Report",
		headers: [
			"Name",
			"Type",
			"Purpose",
			"Status",
			"Created"
		],
		rows: r.filter((e) => !n || e.id === n).map((e) => [
			e.name,
			e.type || "—",
			e.purpose || "—",
			e.status,
			P(e.created_at)
		])
	} : e === "member" ? {
		title: "Member Report",
		headers: [
			"Name",
			"Position",
			"Email",
			"Availability",
			"Workload"
		],
		rows: i.map((e) => [
			e.full_name,
			e.position || "—",
			e.email || "—",
			e.availability,
			`${A(a, e.id)}/5 tasks`
		])
	} : e === "performance" ? {
		title: "Performance Report",
		headers: [
			"Member",
			"Position",
			"Total Tasks",
			"Completed",
			"Rate",
			"Grade"
		],
		rows: i.map((e) => {
			let t = a.filter((t) => t.member_id === e.id), n = t.filter((e) => e.status === "completed").length, r = t.length ? Math.round(n / t.length * 100) : 0;
			return [
				e.full_name,
				e.position || "—",
				t.length,
				n,
				`${r}%`,
				j(r)
			];
		})
	} : e === "workload" ? {
		title: "Workload Distribution Report",
		headers: [
			"Member",
			"Position",
			"Pending",
			"Completed",
			"Status"
		],
		rows: i.map((e) => {
			let t = A(a, e.id);
			return [
				e.full_name,
				e.position || "—",
				t,
				a.filter((t) => t.member_id === e.id && t.status === "completed").length,
				N(t)
			];
		})
	} : {
		title: "Full System Report",
		headers: [
			"Category",
			"Details",
			"Count"
		],
		rows: [
			[
				"Total Committees",
				"Active SK Committees",
				r.length
			],
			[
				"Total Members",
				"Registered SK Members",
				i.length
			],
			[
				"Total Tasks",
				"All Tasks",
				a.length
			],
			[
				"Pending Tasks",
				"Not Yet Completed",
				a.filter((e) => e.status === "pending").length
			],
			[
				"Completed Tasks",
				"Finished Tasks",
				a.filter((e) => e.status === "completed").length
			],
			[
				"Total Assignments",
				"Member-Committee",
				o.length
			],
			[
				"Available Members",
				"Ready for Assignment",
				i.filter((e) => e.availability === "available").length
			]
		]
	};
}
function Ee(e) {
	return "﻿" + [e.headers, ...e.rows].map((e) => e.map((e) => {
		let t = String(e);
		return typeof e == "string" && /^[=+@\-\t\r]/.test(t) && (t = "'" + t), `"${t.replace(/"/g, "\"\"")}"`;
	}).join(",")).join("\r\n");
}
function De(e, t) {
	let n = URL.createObjectURL(new Blob([Ee(e)], { type: "text/csv;charset=utf-8;" })), r = document.createElement("a");
	r.href = n, r.download = `${e.title.replace(/[^a-z0-9_-]+/gi, "_")}_${t}.csv`, r.click(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function Oe(e, t) {
	let n = window.open("", "_blank");
	if (!n) throw Error("Allow popups for this site to print the report.");
	n.opener = null;
	let r = n.document;
	r.title = e;
	let i = r.createElement("style");
	i.textContent = "body{font:13px Arial,sans-serif;color:#1e293b;margin:36px}h1{font-size:24px;color:#0b3a6e}table{border-collapse:collapse;width:100%}td,th{padding:10px;border:1px solid #d8e0ea;text-align:left}th{background:#f1f5f9}pre{white-space:pre-wrap;font:inherit;line-height:1.8}@media print{thead{display:table-header-group}tr{break-inside:avoid}}", r.head.appendChild(i);
	let a = r.createElement("h1");
	if (a.textContent = e, r.body.appendChild(a), typeof t == "string") {
		let e = r.createElement("pre");
		e.textContent = t, r.body.appendChild(e);
	} else {
		let e = r.createElement("table"), n = r.createElement("thead"), i = r.createElement("tbody"), a = r.createElement("tr");
		t.headers.forEach((e) => {
			let t = r.createElement("th");
			t.textContent = e, a.appendChild(t);
		}), n.appendChild(a), t.rows.forEach((e) => {
			let t = r.createElement("tr");
			e.forEach((e) => {
				let n = r.createElement("td");
				n.textContent = String(e), t.appendChild(n);
			}), i.appendChild(t);
		}), e.append(n, i), r.body.appendChild(e);
	}
	n.requestAnimationFrame(() => n.print());
}
//#endregion
//#region frontend/pages/reports.tsx
function ke() {
	let e = x("members"), t = x("committees"), r = x("tasks"), i = x("assignments"), a = x("reports"), [o, p] = (0, F.useState)(""), [m, h] = (0, F.useState)(""), [_, b] = (0, F.useState)(M(/* @__PURE__ */ new Date(Date.now() - 2592e6))), [S, E] = (0, F.useState)(M()), [D, O] = (0, F.useState)(null), [k, A] = (0, F.useState)(""), [j, N] = (0, F.useState)(null), L = u(), R = w((e) => c("reports", e), ["reports"]), z = w(() => n("ai/report.php", "POST", {}), ["reports"]), B = w((e) => n("reports/export_to_archives.php", "POST", { report_id: e })), V = w(() => n("performance/send_to_session.php", "POST", { committee_id: m || null })), H = s(window.APP_CONFIG, "reports.export"), U = H || s(window.APP_CONFIG, "archives.create");
	async function W() {
		if (!o) {
			N(/* @__PURE__ */ Error("Choose a report type."));
			return;
		}
		if (_ && S && _ > S) {
			N(/* @__PURE__ */ Error("The start date must not be after the end date."));
			return;
		}
		if ((o === "committee" ? [t] : o === "full" ? [
			t,
			e,
			r,
			i
		] : [e, r]).some((e) => !e.data)) {
			N(/* @__PURE__ */ Error("The data required for this report is unavailable. Check your permissions or retry loading the page."));
			return;
		}
		N(null);
		let n = Te(o, {
			committees: t.data || [],
			members: e.data || [],
			tasks: r.data || [],
			assignments: i.data || []
		}, m);
		try {
			await R.run({
				title: n.title,
				report_type: o,
				committee_id: m || null,
				date_from: _ || null,
				date_to: S || null
			}) && (O(n), L("Report generated and recorded in history."));
		} catch {}
	}
	function G(e, t) {
		try {
			Oe(e, t);
		} catch (e) {
			L(e.message, !0);
		}
	}
	return /* @__PURE__ */ (0, I.jsxs)(I.Fragment, { children: [/* @__PURE__ */ (0, I.jsxs)(Se, {
		defaultValue: "builder",
		children: [
			/* @__PURE__ */ (0, I.jsxs)(we, {
				className: "tw:mb-6",
				children: [/* @__PURE__ */ (0, I.jsx)(Q, {
					value: "builder",
					children: "Report builder"
				}), /* @__PURE__ */ (0, I.jsx)(Q, {
					value: "history",
					children: "Report history"
				})]
			}),
			/* @__PURE__ */ (0, I.jsxs)($, {
				value: "builder",
				className: "tw:space-y-6",
				children: [
					/* @__PURE__ */ (0, I.jsx)(f, {
						title: "Turn your work into a clear report",
						description: "Choose a report, review the preview, and share the progress.",
						children: /* @__PURE__ */ (0, I.jsxs)(g, {
							queries: [t],
							children: [
								/* @__PURE__ */ (0, I.jsxs)("div", {
									className: "ui-form-grid",
									children: [
										/* @__PURE__ */ (0, I.jsx)(T, {
											label: "Report type",
											value: o,
											onChange: (e) => p(e),
											items: [
												{
													value: "committee",
													label: "Committee report"
												},
												{
													value: "member",
													label: "Member report"
												},
												{
													value: "performance",
													label: "Performance report"
												},
												{
													value: "workload",
													label: "Workload report"
												},
												{
													value: "full",
													label: "Full system report"
												}
											],
											required: !0
										}),
										/* @__PURE__ */ (0, I.jsx)(T, {
											label: "Committee",
											value: m,
											onChange: h,
											items: (t.data || []).map((e) => ({
												value: e.id,
												label: e.name
											})),
											placeholder: "All accessible committees"
										}),
										/* @__PURE__ */ (0, I.jsx)(T, {
											label: "Reporting period · From",
											type: "date",
											value: _,
											onChange: b
										}),
										/* @__PURE__ */ (0, I.jsx)(T, {
											label: "Reporting period · To",
											type: "date",
											value: S,
											onChange: E
										})
									]
								}),
								/* @__PURE__ */ (0, I.jsx)("p", {
									className: "tw:mt-3 tw:text-xs tw:text-muted-foreground",
									children: "Reporting dates label the saved report. Figures reflect current accessible records; committee reports use the selected committee."
								}),
								/* @__PURE__ */ (0, I.jsx)(y, { error: j || R.error }),
								/* @__PURE__ */ (0, I.jsxs)("div", {
									className: "ui-actions tw:mt-5",
									children: [s(window.APP_CONFIG, "reports.create") && /* @__PURE__ */ (0, I.jsxs)(C, {
										busy: R.isPending || [
											e,
											t,
											r,
											i
										].some((e) => e.isLoading),
										onClick: () => void W(),
										children: [/* @__PURE__ */ (0, I.jsx)(le, { size: 15 }), "Generate report"]
									}), s(window.APP_CONFIG, "ai.use") && /* @__PURE__ */ (0, I.jsxs)(C, {
										variant: "outline",
										busy: z.isPending,
										onClick: () => {
											z.run().then((e) => {
												e?.report_text && (A(e.report_text), L("AI summary generated."));
											}).catch(() => {});
										},
										children: [/* @__PURE__ */ (0, I.jsx)(te, { size: 15 }), "Generate AI summary"]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, I.jsx)(y, { error: z.error }),
					D && /* @__PURE__ */ (0, I.jsx)(f, {
						title: D.title,
						description: `Generated ${P(M())} · ${D.rows.length} records`,
						action: /* @__PURE__ */ (0, I.jsxs)("div", {
							className: "ui-actions",
							children: [/* @__PURE__ */ (0, I.jsxs)(l, {
								variant: "outline",
								size: "sm",
								onClick: () => G(D.title, D),
								children: [/* @__PURE__ */ (0, I.jsx)(X, { size: 14 }), "Print"]
							}), H && /* @__PURE__ */ (0, I.jsxs)(l, {
								variant: "outline",
								size: "sm",
								onClick: () => De(D, M()),
								children: [/* @__PURE__ */ (0, I.jsx)(be, { size: 14 }), "CSV"]
							})]
						}),
						children: /* @__PURE__ */ (0, I.jsx)("div", {
							className: "ui-table-scroll",
							children: /* @__PURE__ */ (0, I.jsxs)(oe, { children: [/* @__PURE__ */ (0, I.jsx)(ne, { children: /* @__PURE__ */ (0, I.jsx)(v, { children: D.headers.map((e) => /* @__PURE__ */ (0, I.jsx)(d, { children: e }, e)) }) }), /* @__PURE__ */ (0, I.jsx)(re, { children: D.rows.map((e, t) => /* @__PURE__ */ (0, I.jsx)(v, { children: e.map((e, t) => /* @__PURE__ */ (0, I.jsx)(ee, { children: e }, t)) }, t)) })] })
						})
					}),
					k && /* @__PURE__ */ (0, I.jsxs)(ie, {
						title: "AI-generated system report",
						description: "Review this advisory summary before sharing it.",
						children: [/* @__PURE__ */ (0, I.jsx)("div", {
							className: "ui-actions tw:mb-4",
							children: /* @__PURE__ */ (0, I.jsxs)(l, {
								variant: "outline",
								size: "sm",
								onClick: () => G("AI-Generated System Report", k),
								children: [/* @__PURE__ */ (0, I.jsx)(X, { size: 14 }), "Print summary"]
							})
						}), /* @__PURE__ */ (0, I.jsx)("div", {
							className: "ui-report-output",
							children: k
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, I.jsx)($, {
				value: "history",
				children: /* @__PURE__ */ (0, I.jsxs)(f, {
					title: "Your reporting record",
					description: "A history of the reports generated in your workspace.",
					action: s(window.APP_CONFIG, "session.create") && /* @__PURE__ */ (0, I.jsxs)(C, {
						variant: "outline",
						size: "sm",
						busy: V.isPending,
						onClick: () => {
							V.run().then((e) => {
								e && L(e.message || "Performance sent to session management.");
							}).catch(() => {});
						},
						children: [/* @__PURE__ */ (0, I.jsx)(xe, { size: 14 }), "Send performance to sessions"]
					}),
					children: [
						/* @__PURE__ */ (0, I.jsx)(y, { error: B.error || V.error }),
						s(window.APP_CONFIG, "session.create") && /* @__PURE__ */ (0, I.jsx)("div", {
							className: "tw:mb-5 tw:max-w-sm",
							children: /* @__PURE__ */ (0, I.jsx)(T, {
								label: "Session export committee",
								value: m,
								onChange: h,
								items: (t.data || []).map((e) => ({
									value: e.id,
									label: e.name
								})),
								placeholder: "All accessible committees"
							})
						}),
						/* @__PURE__ */ (0, I.jsx)(g, {
							queries: [a],
							children: /* @__PURE__ */ (0, I.jsx)(ae, {
								data: a.data || [],
								columns: [
									{
										accessorKey: "title",
										header: "Report",
										cell: ({ row: e }) => /* @__PURE__ */ (0, I.jsx)("strong", { children: e.original.title })
									},
									{
										accessorKey: "report_type",
										header: "Type",
										cell: ({ row: e }) => /* @__PURE__ */ (0, I.jsx)(se, { value: e.original.report_type.replace(/_/g, " ") })
									},
									{
										accessorFn: (e) => `${P(e.date_from)} – ${P(e.date_to)}`,
										id: "period",
										header: "Period"
									},
									{
										accessorKey: "created_at",
										header: "Generated",
										cell: ({ row: e }) => P(e.original.created_at)
									},
									{
										id: "actions",
										header: "Actions",
										cell: ({ row: e }) => U && /* @__PURE__ */ (0, I.jsxs)(C, {
											variant: "ghost",
											size: "sm",
											busy: B.isPending,
											onClick: () => {
												B.run(e.original.id).then((e) => {
													e && L(`Report archived${e.archive_reference ? ` · ${e.archive_reference}` : ""}.`);
												}).catch(() => {});
											},
											children: [/* @__PURE__ */ (0, I.jsx)(ce, { size: 14 }), "Archive"]
										})
									}
								],
								searchLabel: "Search report history…"
							})
						})
					]
				})
			})
		]
	}), /* @__PURE__ */ (0, I.jsx)(y, { error: [
		e,
		r,
		i
	].find((e) => e.error)?.error })] });
}
//#endregion
export { ke as default };
