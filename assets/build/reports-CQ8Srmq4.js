import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { a as n, c as r, h as i, l as a, m as o, n as s, o as c, s as l } from "./api-DVPVP-g0.js";
import { C as u, D as d, E as f, O as ee, R as te, T as ne, _ as p, a as re, dt as m, ft as h, gt as g, h as _, k as v, l as y, lt as b, mt as x, n as S, r as C, s as ie, t as w, u as T, ut as E, vt as D, w as ae, x as oe } from "./hooks-BlRndFBy.js";
import { d as O, f as k, i as se, p as A } from "./app-BS02kWBW.js";
import { n as j, r as M } from "./calculations-ZvWekKcJ.js";
//#region node_modules/@radix-ui/react-tabs/dist/index.mjs
var N = /* @__PURE__ */ e(t(), 1), P = i(), F = Object.defineProperty, I = (e, t) => F(e, "name", {
	value: t,
	configurable: !0
}), L = "Tabs", [R, z] = g(L, [A]), B = A(), [V, H] = R(L), U = /* @__PURE__ */ N.forwardRef(/* @__PURE__ */ I(function(e, t) {
	let { __scopeTabs: n, value: r, onValueChange: i, defaultValue: a, orientation: o = "horizontal", dir: s, activationMode: c = "automatic", ...l } = e, u = b(s), [d, f] = h({
		prop: r,
		onChange: i,
		defaultProp: a ?? "",
		caller: L
	});
	return /* @__PURE__ */ (0, P.jsx)(V, {
		scope: n,
		baseId: E(),
		value: d,
		onValueChange: f,
		orientation: o,
		dir: u,
		activationMode: c,
		children: /* @__PURE__ */ (0, P.jsx)(D.div, {
			dir: u,
			"data-orientation": o,
			...l,
			ref: t
		})
	});
}, "Tabs")), W = "TabsList", G = /* @__PURE__ */ N.forwardRef(/* @__PURE__ */ I(function(e, t) {
	let { __scopeTabs: n, loop: r = !0, ...i } = e, a = H(W, n), o = B(n);
	return /* @__PURE__ */ (0, P.jsx)(k, {
		asChild: !0,
		...o,
		orientation: a.orientation,
		dir: a.dir,
		loop: r,
		children: /* @__PURE__ */ (0, P.jsx)(D.div, {
			role: "tablist",
			"aria-orientation": a.orientation,
			...i,
			ref: t
		})
	});
}, "TabsList")), K = "TabsTrigger", ce = /* @__PURE__ */ N.forwardRef(/* @__PURE__ */ I(function(e, t) {
	let { __scopeTabs: n, value: r, disabled: i = !1, ...a } = e, o = H(K, n), s = B(n), c = q(o.baseId, r), l = J(o.baseId, r), u = r === o.value;
	return /* @__PURE__ */ (0, P.jsx)(O, {
		asChild: !0,
		...s,
		focusable: !i,
		active: u,
		children: /* @__PURE__ */ (0, P.jsx)(D.button, {
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
			onMouseDown: x(e.onMouseDown, (e) => {
				!i && e.button === 0 && e.ctrlKey === !1 ? o.onValueChange(r) : e.preventDefault();
			}),
			onKeyDown: x(e.onKeyDown, (e) => {
				i || e.target !== e.currentTarget || [" ", "Enter"].includes(e.key) && o.onValueChange(r);
			}),
			onFocus: x(e.onFocus, () => {
				let e = o.activationMode !== "manual";
				!u && !i && e && o.onValueChange(r);
			})
		})
	});
}, "TabsTrigger")), le = "TabsContent", ue = /* @__PURE__ */ N.forwardRef(/* @__PURE__ */ I(function(e, t) {
	let { __scopeTabs: n, value: r, forceMount: i, children: a, ...o } = e, s = H(le, n), c = q(s.baseId, r), l = J(s.baseId, r), u = r === s.value, d = N.useRef(u);
	return N.useEffect(() => {
		let e = requestAnimationFrame(() => d.current = !1);
		return () => cancelAnimationFrame(e);
	}, []), /* @__PURE__ */ (0, P.jsx)(m, {
		present: i || u,
		children: ({ present: n }) => /* @__PURE__ */ (0, P.jsx)(D.div, {
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
function q(e, t) {
	return `${e}-trigger-${t}`;
}
I(q, "makeTriggerId");
function J(e, t) {
	return `${e}-content-${t}`;
}
I(J, "makeContentId");
var de = U, fe = G, pe = ce, me = ue, Y = {
	name: "archive",
	size: 24,
	node: [
		["rect", {
			width: "20",
			height: "5",
			x: "2",
			y: "3",
			rx: "1",
			key: "1wp1u1"
		}],
		["path", {
			d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",
			key: "1s80jp"
		}],
		["path", {
			d: "M10 12h4",
			key: "a56b0p"
		}]
	]
};
Y.node;
var he = a(Y), X = {
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
X.node;
var ge = a(X), Z = {
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
Z.node;
var Q = a(Z), $ = {
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
$.node;
var _e = a($);
//#endregion
//#region frontend/components/ui/tabs.tsx
function ve({ className: e, orientation: t = "horizontal", ...n }) {
	return /* @__PURE__ */ (0, P.jsx)(de, {
		"data-slot": "tabs",
		"data-orientation": t,
		orientation: t,
		className: o("tw:group/tabs tw:flex tw:gap-2 tw:data-[orientation=horizontal]:flex-col", e),
		...n
	});
}
var ye = r("tw:group/tabs-list tw:inline-flex tw:w-fit tw:items-center tw:justify-center tw:rounded-lg tw:p-[3px] tw:text-muted-foreground tw:group-data-[orientation=horizontal]/tabs:h-9 tw:group-data-[orientation=vertical]/tabs:h-fit tw:group-data-[orientation=vertical]/tabs:flex-col tw:data-[variant=line]:rounded-none", {
	variants: { variant: {
		default: "tw:bg-muted",
		line: "tw:gap-1 tw:bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function be({ className: e, variant: t = "default", ...n }) {
	return /* @__PURE__ */ (0, P.jsx)(fe, {
		"data-slot": "tabs-list",
		"data-variant": t,
		className: o(ye({ variant: t }), e),
		...n
	});
}
function xe({ className: e, ...t }) {
	return /* @__PURE__ */ (0, P.jsx)(pe, {
		"data-slot": "tabs-trigger",
		className: o("tw:relative tw:inline-flex tw:h-[calc(100%-1px)] tw:flex-1 tw:items-center tw:justify-center tw:gap-1.5 tw:rounded-md tw:border tw:border-transparent tw:px-2 tw:py-1 tw:text-sm tw:font-medium tw:whitespace-nowrap tw:text-foreground/60 tw:transition-all tw:group-data-[orientation=vertical]/tabs:w-full tw:group-data-[orientation=vertical]/tabs:justify-start tw:hover:text-foreground tw:focus-visible:border-ring tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring/50 tw:focus-visible:outline-1 tw:focus-visible:outline-ring tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm tw:group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none tw:dark:text-muted-foreground tw:dark:hover:text-foreground tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4", "tw:group-data-[variant=line]/tabs-list:bg-transparent tw:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent tw:dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent tw:dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent", "tw:data-[state=active]:bg-background tw:data-[state=active]:text-foreground tw:dark:data-[state=active]:border-input tw:dark:data-[state=active]:bg-input/30 tw:dark:data-[state=active]:text-foreground", "tw:after:absolute tw:after:bg-foreground tw:after:opacity-0 tw:after:transition-opacity tw:group-data-[orientation=horizontal]/tabs:after:inset-x-0 tw:group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] tw:group-data-[orientation=horizontal]/tabs:after:h-0.5 tw:group-data-[orientation=vertical]/tabs:after:inset-y-0 tw:group-data-[orientation=vertical]/tabs:after:-right-1 tw:group-data-[orientation=vertical]/tabs:after:w-0.5 tw:group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100", e),
		...t
	});
}
function Se({ className: e, ...t }) {
	return /* @__PURE__ */ (0, P.jsx)(me, {
		"data-slot": "tabs-content",
		className: o("tw:flex-1 tw:outline-none", e),
		...t
	});
}
//#endregion
//#region frontend/lib/reports.ts
function Ce(e) {
	return "﻿" + [e.headers, ...e.rows].map((e) => e.map((e) => {
		let t = String(e);
		return typeof e == "string" && /^[=+@\-\t\r]/.test(t) && (t = "'" + t), `"${t.replace(/"/g, "\"\"")}"`;
	}).join(",")).join("\r\n");
}
function we(e, t) {
	let n = URL.createObjectURL(new Blob([Ce(e)], { type: "text/csv;charset=utf-8;" })), r = document.createElement("a");
	r.href = n, r.download = `${e.title.replace(/[^a-z0-9_-]+/gi, "_")}_${t}.csv`, r.click(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function Te(e, t) {
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
function Ee() {
	let e = S("members"), t = S("committees"), r = S("tasks"), i = S("assignments"), a = S("reports"), [o, m] = (0, N.useState)(""), [h, g] = (0, N.useState)(""), [b, x] = (0, N.useState)(M(/* @__PURE__ */ new Date(Date.now() - 2592e6))), [E, D] = (0, N.useState)(M()), [O, k] = (0, N.useState)(null), [A, F] = (0, N.useState)(""), [I, L] = (0, N.useState)(null), R = u(), z = w((e) => c("reports", e), ["reports"]), B = w(() => n("ai/report.php", "POST", {}), ["reports"]), V = w((e) => n("reports/export_to_archives.php", "POST", { report_id: e })), H = w(() => n("performance/send_to_session.php", "POST", { committee_id: h || null })), U = s(window.APP_CONFIG, "reports.export"), W = U || s(window.APP_CONFIG, "archives.create");
	async function G() {
		if (!o) {
			L(/* @__PURE__ */ Error("Choose a report type."));
			return;
		}
		if (b && E && b > E) {
			L(/* @__PURE__ */ Error("The start date must not be after the end date."));
			return;
		}
		L(null);
		let e = {
			committee: "Committee Report",
			member: "Member Report",
			performance: "Performance Report",
			workload: "Workload Distribution Report",
			full: "Full System Report"
		}[o];
		try {
			let t = await z.run({
				title: e,
				report_type: o,
				committee_id: h || null,
				date_from: b || null,
				date_to: E || null
			});
			if (t) {
				let e = t.data?.snapshot;
				if (!e || !Array.isArray(e.headers) || !Array.isArray(e.rows)) {
					L(/* @__PURE__ */ Error("The report was recorded but its saved figures are unavailable. Reload report history to retrieve it."));
					return;
				}
				k(e), R("Report generated and recorded in history.");
			}
		} catch {}
	}
	function K(e, t) {
		try {
			Te(e, t);
		} catch (e) {
			R(e.message, !0);
		}
	}
	return /* @__PURE__ */ (0, P.jsxs)(P.Fragment, { children: [/* @__PURE__ */ (0, P.jsxs)(ve, {
		defaultValue: "builder",
		children: [
			/* @__PURE__ */ (0, P.jsxs)(be, {
				className: "tw:mb-6",
				children: [/* @__PURE__ */ (0, P.jsx)(xe, {
					value: "builder",
					children: "Report builder"
				}), /* @__PURE__ */ (0, P.jsx)(xe, {
					value: "history",
					children: "Report history"
				})]
			}),
			/* @__PURE__ */ (0, P.jsxs)(Se, {
				value: "builder",
				className: "tw:space-y-6",
				children: [
					/* @__PURE__ */ (0, P.jsx)(p, {
						title: "Turn your work into a clear report",
						description: "Choose a report, review the preview, and share the progress.",
						children: /* @__PURE__ */ (0, P.jsxs)(_, {
							queries: [t],
							children: [
								/* @__PURE__ */ (0, P.jsxs)("div", {
									className: "ui-form-grid",
									children: [
										/* @__PURE__ */ (0, P.jsx)(T, {
											label: "Report type",
											value: o,
											onChange: (e) => m(e),
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
										/* @__PURE__ */ (0, P.jsx)(T, {
											label: "Committee",
											value: h,
											onChange: g,
											items: (t.data || []).map((e) => ({
												value: e.id,
												label: e.name
											})),
											placeholder: "All accessible committees"
										}),
										/* @__PURE__ */ (0, P.jsx)(T, {
											label: "Reporting period · From",
											type: "date",
											value: b,
											onChange: x
										}),
										/* @__PURE__ */ (0, P.jsx)(T, {
											label: "Reporting period · To",
											type: "date",
											value: E,
											onChange: D
										})
									]
								}),
								/* @__PURE__ */ (0, P.jsx)("p", {
									className: "tw:mt-3 tw:text-xs tw:text-muted-foreground",
									children: "Dates select tasks created in the period and attendance reporting months. Committee reports use issuance dates. Rosters reflect the generation date; saved figures remain unchanged."
								}),
								/* @__PURE__ */ (0, P.jsx)(y, { error: I || z.error }),
								/* @__PURE__ */ (0, P.jsxs)("div", {
									className: "ui-actions tw:mt-5",
									children: [s(window.APP_CONFIG, "reports.create") && /* @__PURE__ */ (0, P.jsxs)(C, {
										busy: z.isPending || [
											e,
											t,
											r,
											i
										].some((e) => e.isLoading),
										onClick: () => void G(),
										children: [/* @__PURE__ */ (0, P.jsx)(se, { size: 15 }), "Generate report"]
									}), s(window.APP_CONFIG, "ai.use") && /* @__PURE__ */ (0, P.jsxs)(C, {
										variant: "outline",
										busy: B.isPending,
										onClick: () => {
											B.run().then((e) => {
												e?.report_text && (F(e.report_text), R("AI summary generated."));
											}).catch(() => {});
										},
										children: [/* @__PURE__ */ (0, P.jsx)(te, { size: 15 }), "Generate AI summary"]
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, P.jsx)(y, { error: B.error }),
					O && /* @__PURE__ */ (0, P.jsx)(p, {
						title: O.title,
						description: `Generated ${j(M())} · ${O.rows.length} records`,
						action: /* @__PURE__ */ (0, P.jsxs)("div", {
							className: "ui-actions",
							children: [/* @__PURE__ */ (0, P.jsxs)(l, {
								variant: "outline",
								size: "sm",
								onClick: () => K(O.title, O),
								children: [/* @__PURE__ */ (0, P.jsx)(Q, { size: 14 }), "Print"]
							}), U && /* @__PURE__ */ (0, P.jsxs)(l, {
								variant: "outline",
								size: "sm",
								onClick: () => we(O, M()),
								children: [/* @__PURE__ */ (0, P.jsx)(ge, { size: 14 }), "CSV"]
							})]
						}),
						children: /* @__PURE__ */ (0, P.jsx)("div", {
							className: "ui-table-scroll",
							children: /* @__PURE__ */ (0, P.jsxs)(ae, { children: [/* @__PURE__ */ (0, P.jsx)(ee, { children: /* @__PURE__ */ (0, P.jsx)(v, { children: O.headers.map((e) => /* @__PURE__ */ (0, P.jsx)(d, { children: e }, e)) }) }), /* @__PURE__ */ (0, P.jsx)(ne, { children: O.rows.map((e, t) => /* @__PURE__ */ (0, P.jsx)(v, { children: e.map((e, t) => /* @__PURE__ */ (0, P.jsx)(f, { children: e }, t)) }, t)) })] })
						})
					}),
					A && /* @__PURE__ */ (0, P.jsxs)(re, {
						title: "AI-generated system report",
						description: "Review this advisory summary before sharing it.",
						children: [/* @__PURE__ */ (0, P.jsx)("div", {
							className: "ui-actions tw:mb-4",
							children: /* @__PURE__ */ (0, P.jsxs)(l, {
								variant: "outline",
								size: "sm",
								onClick: () => K("AI-Generated System Report", A),
								children: [/* @__PURE__ */ (0, P.jsx)(Q, { size: 14 }), "Print summary"]
							})
						}), /* @__PURE__ */ (0, P.jsx)("div", {
							className: "ui-report-output",
							children: A
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, P.jsx)(Se, {
				value: "history",
				children: /* @__PURE__ */ (0, P.jsxs)(p, {
					title: "Your reporting record",
					description: "A history of the reports generated in your workspace.",
					action: s(window.APP_CONFIG, "session.create") && /* @__PURE__ */ (0, P.jsxs)(C, {
						variant: "outline",
						size: "sm",
						busy: H.isPending,
						onClick: () => {
							H.run().then((e) => {
								e && R(e.message || "Performance sent to session management.");
							}).catch(() => {});
						},
						children: [/* @__PURE__ */ (0, P.jsx)(_e, { size: 14 }), "Send performance to sessions"]
					}),
					children: [
						/* @__PURE__ */ (0, P.jsx)(y, { error: V.error || H.error }),
						s(window.APP_CONFIG, "session.create") && /* @__PURE__ */ (0, P.jsx)("div", {
							className: "tw:mb-5 tw:max-w-sm",
							children: /* @__PURE__ */ (0, P.jsx)(T, {
								label: "Session export committee",
								value: h,
								onChange: g,
								items: (t.data || []).map((e) => ({
									value: e.id,
									label: e.name
								})),
								placeholder: "All accessible committees"
							})
						}),
						/* @__PURE__ */ (0, P.jsx)(_, {
							queries: [a],
							children: /* @__PURE__ */ (0, P.jsx)(ie, {
								data: a.data || [],
								columns: [
									{
										accessorKey: "title",
										header: "Report",
										cell: ({ row: e }) => /* @__PURE__ */ (0, P.jsx)("strong", { children: e.original.title })
									},
									{
										accessorKey: "report_type",
										header: "Type",
										cell: ({ row: e }) => /* @__PURE__ */ (0, P.jsx)(oe, { value: e.original.report_type.replace(/_/g, " ") })
									},
									{
										accessorFn: (e) => `${j(e.date_from)} – ${j(e.date_to)}`,
										id: "period",
										header: "Period"
									},
									{
										accessorKey: "created_at",
										header: "Generated",
										cell: ({ row: e }) => j(e.original.created_at)
									},
									{
										id: "actions",
										header: "Actions",
										cell: ({ row: e }) => /* @__PURE__ */ (0, P.jsxs)("div", {
											className: "ui-actions",
											children: [e.original.snapshot && /* @__PURE__ */ (0, P.jsx)(l, {
												variant: "ghost",
												size: "sm",
												onClick: () => {
													k(e.original.snapshot), K(e.original.title, e.original.snapshot);
												},
												children: "View / print"
											}), W && /* @__PURE__ */ (0, P.jsxs)(C, {
												variant: "ghost",
												size: "sm",
												busy: V.isPending,
												onClick: () => {
													V.run(e.original.id).then((e) => {
														e && R(`Report archived${e.archive_reference ? ` · ${e.archive_reference}` : ""}.`);
													}).catch(() => {});
												},
												children: [/* @__PURE__ */ (0, P.jsx)(he, { size: 14 }), "Archive"]
											})]
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
	}), /* @__PURE__ */ (0, P.jsx)(y, { error: [
		e,
		r,
		i
	].find((e) => e.error)?.error })] });
}
//#endregion
export { Ee as default };
