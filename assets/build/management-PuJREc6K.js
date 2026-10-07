import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n, i as r, l as i, n as a, o, s } from "./api-DVPVP-g0.js";
import { C as c, _ as l, d as u, h as d, i as f, n as p, o as m, s as h, t as g, u as _ } from "./hooks-BlRndFBy.js";
import { c as v, l as y, u as b } from "./app-BANjibti.js";
//#region node_modules/lucide-react/dist/esm/icons/eye.mjs
var x = {
	name: "eye",
	size: 24,
	node: [["path", {
		d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
		key: "1nclc0"
	}], ["circle", {
		cx: "12",
		cy: "12",
		r: "3",
		key: "1v7zrd"
	}]]
};
x.node;
var S = i(x), C = {
	name: "pencil",
	size: 24,
	node: [["path", {
		d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
		key: "1a8usu"
	}], ["path", {
		d: "m15 5 4 4",
		key: "1mk7zo"
	}]]
};
C.node;
var w = i(C), T = {
	name: "trash",
	size: 24,
	node: [
		["path", {
			d: "M10 11v6",
			key: "nco0om"
		}],
		["path", {
			d: "M14 11v6",
			key: "outv1u"
		}],
		["path", {
			d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
			key: "miytrc"
		}],
		["path", {
			d: "M3 6h18",
			key: "d0wm0j"
		}],
		["path", {
			d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
			key: "e791ji"
		}]
	],
	aliases: ["trash-2"]
};
T.node;
var E = i(T), D = /* @__PURE__ */ e(t(), 1), O = n();
function k({ resource: e, singular: t, columns: n, fields: i, defaults: x, transform: C, before: T, queries: k = [], canDelete: A, describe: j, filter: M, filteredData: N, editContent: P, dialogClassName: F, onView: I, sectionTitle: L }) {
	let R = p(e), z = e === "penalties" ? "jurisdictions" : e, [B, V] = (0, D.useState)(!1), [H, U] = (0, D.useState)(), [W, G] = (0, D.useState)(x), [K, q] = (0, D.useState)(null), [J, Y] = (0, D.useState)(), X = c(), Z = g((t) => o(e, t.body, t.editing), e === "jurisdictions" || e === "committees" ? ["committees", "jurisdictions"] : [e]), Q = g((t) => r(e, t), [e]);
	function $(e) {
		U(e), q(null), Z.reset();
		let t = { ...x };
		e && i(!0, e).forEach((n) => {
			let r = e[n.name];
			t[n.name] = Array.isArray(r) ? r.join(", ") : r == null ? "" : String(r);
		}), G(t), V(!0);
	}
	async function ee() {
		let e = i(!!H, H).find((e) => e.required && !e.disabled && !W[e.name]?.trim());
		if (e) {
			q(/* @__PURE__ */ Error(`${e.label} is required.`));
			return;
		}
		q(null);
		try {
			let e = C ? C(W, !!H) : { ...W }, n = await Z.run({
				body: {
					...e,
					...H ? { id: H.id } : {}
				},
				editing: !!H
			});
			n && (V(!1), X(n.message || `${t} saved.`));
		} catch {}
	}
	let te = [...n, {
		id: "actions",
		header: "Actions",
		enableSorting: !1,
		cell: ({ row: n }) => /* @__PURE__ */ (0, O.jsxs)("div", {
			className: "ui-actions",
			children: [
				I && /* @__PURE__ */ (0, O.jsxs)(v, { children: [/* @__PURE__ */ (0, O.jsx)(b, {
					asChild: !0,
					children: /* @__PURE__ */ (0, O.jsx)(s, {
						type: "button",
						size: "icon-sm",
						variant: "ghost",
						"aria-label": `View ${t}`,
						onClick: () => I(n.original),
						children: /* @__PURE__ */ (0, O.jsx)(S, { size: 16 })
					})
				}), /* @__PURE__ */ (0, O.jsxs)(y, { children: ["View ", t.toLowerCase()] })] }),
				a(window.APP_CONFIG, `${z}.update`) && e !== "assignments" && /* @__PURE__ */ (0, O.jsxs)(v, { children: [/* @__PURE__ */ (0, O.jsx)(b, {
					asChild: !0,
					children: /* @__PURE__ */ (0, O.jsx)(s, {
						size: "icon-sm",
						variant: "ghost",
						"aria-label": `Edit ${t}`,
						onClick: () => $(n.original),
						children: /* @__PURE__ */ (0, O.jsx)(w, { size: 13 })
					})
				}), /* @__PURE__ */ (0, O.jsxs)(y, { children: ["Edit ", t.toLowerCase()] })] }),
				a(window.APP_CONFIG, `${z}.delete`) && (!A || A(n.original)) && /* @__PURE__ */ (0, O.jsxs)(v, { children: [/* @__PURE__ */ (0, O.jsx)(b, {
					asChild: !0,
					children: /* @__PURE__ */ (0, O.jsx)(s, {
						size: "icon-sm",
						variant: "ghost",
						className: "tw:text-destructive",
						"aria-label": `Remove ${t}`,
						onClick: () => {
							Y(n.original), Q.reset();
						},
						children: /* @__PURE__ */ (0, O.jsx)(E, { size: 13 })
					})
				}), /* @__PURE__ */ (0, O.jsxs)(y, { children: ["Remove ", t.toLowerCase()] })] })
			]
		})
	}];
	return /* @__PURE__ */ (0, O.jsxs)(O.Fragment, { children: [
		/* @__PURE__ */ (0, O.jsxs)("div", {
			className: "ui-page-actions",
			children: [/* @__PURE__ */ (0, O.jsx)("p", { children: j || `Manage ${e} and keep your workspace up to date.` }), a(window.APP_CONFIG, `${z}.create`) && /* @__PURE__ */ (0, O.jsxs)(f, {
				onClick: () => $(),
				children: ["Add ", t.toLowerCase()]
			})]
		}),
		T,
		/* @__PURE__ */ (0, O.jsx)(l, {
			title: L || `${e === "jurisdictions" ? "Jurisdiction" : e.charAt(0).toUpperCase() + e.slice(1)} directory`,
			description: "Find the details you need. Keep the work moving.",
			children: /* @__PURE__ */ (0, O.jsx)(d, {
				queries: [R, ...k],
				children: /* @__PURE__ */ (0, O.jsx)(h, {
					data: N ? N(R.data || []) : R.data || [],
					columns: te,
					searchLabel: `Search ${e}…`,
					filter: M
				})
			})
		}),
		/* @__PURE__ */ (0, O.jsxs)(u, {
			className: F,
			open: B,
			onClose: () => V(!1),
			title: `${H ? "Edit" : "Add"} ${t.toLowerCase()}`,
			onSubmit: () => void ee(),
			busy: Z.isPending,
			error: K || Z.error,
			children: [i(!!H, H).filter((e) => !e.onlyEdit || H).map((e) => /* @__PURE__ */ (0, O.jsx)("div", {
				className: e.fullWidth ? "tw:col-span-full" : void 0,
				children: /* @__PURE__ */ (0, O.jsx)(_, {
					...e,
					value: W[e.name] || "",
					onChange: (t) => {
						G((n) => ({
							...n,
							[e.name]: t
						})), q(null);
					}
				})
			}, e.name)), H && P?.(H)]
		}),
		/* @__PURE__ */ (0, O.jsx)(m, {
			open: !!J,
			onClose: () => Y(void 0),
			title: `Remove this ${t.toLowerCase()}?`,
			busy: Q.isPending,
			error: Q.error,
			onConfirm: () => {
				J && Q.run(J.id).then((e) => {
					e && (Y(void 0), X(e.message || `${t} removed.`));
				}).catch(() => {});
			}
		})
	] });
}
//#endregion
export { E as n, k as t };
