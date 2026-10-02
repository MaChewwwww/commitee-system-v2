import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n, i as r, l as i, n as a, o, s } from "./api-DVPVP-g0.js";
import { C as c, _ as l, d as u, h as d, i as f, n as p, o as m, s as h, t as g, u as _ } from "./hooks-CGjnItOC.js";
import { n as v, t as y } from "./trash-C6NxJFw3.js";
import { d as b, f as x, p as S } from "./app-B8tnWQbD.js";
//#region node_modules/lucide-react/dist/esm/icons/pencil.mjs
var C = {
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
var w = i(C), T = /* @__PURE__ */ e(t(), 1), E = n();
function D({ resource: e, singular: t, columns: n, fields: i, defaults: C, transform: D, before: O, queries: k = [], canDelete: A, describe: j, filter: M, filteredData: N, editContent: P, dialogClassName: F, onView: I }) {
	let L = p(e), [R, z] = (0, T.useState)(!1), [B, V] = (0, T.useState)(), [H, U] = (0, T.useState)(C), [W, G] = (0, T.useState)(null), [K, q] = (0, T.useState)(), J = c(), Y = g((t) => o(e, t.body, t.editing), [e]), X = g((t) => r(e, t), [e]);
	function Z(e) {
		V(e), G(null), Y.reset();
		let t = { ...C };
		e && i(!0, e).forEach((n) => {
			let r = e[n.name];
			t[n.name] = Array.isArray(r) ? r.join(", ") : r == null ? "" : String(r);
		}), U(t), z(!0);
	}
	async function Q() {
		let e = i(!!B, B).find((e) => e.required && !e.disabled && !H[e.name]?.trim());
		if (e) {
			G(/* @__PURE__ */ Error(`${e.label} is required.`));
			return;
		}
		G(null);
		try {
			let e = D ? D(H, !!B) : { ...H }, n = await Y.run({
				body: {
					...e,
					...B ? { id: B.id } : {}
				},
				editing: !!B
			});
			n && (z(!1), J(n.message || `${t} saved.`));
		} catch {}
	}
	let $ = [...n, {
		id: "actions",
		header: "Actions",
		enableSorting: !1,
		cell: ({ row: n }) => /* @__PURE__ */ (0, E.jsxs)("div", {
			className: "ui-actions",
			children: [
				I && /* @__PURE__ */ (0, E.jsxs)(b, { children: [/* @__PURE__ */ (0, E.jsx)(S, {
					asChild: !0,
					children: /* @__PURE__ */ (0, E.jsx)(s, {
						type: "button",
						size: "icon-sm",
						variant: "ghost",
						"aria-label": `View ${t}`,
						onClick: () => I(n.original),
						children: /* @__PURE__ */ (0, E.jsx)(v, { size: 16 })
					})
				}), /* @__PURE__ */ (0, E.jsxs)(x, { children: ["View ", t.toLowerCase()] })] }),
				a(window.APP_CONFIG, `${e}.update`) && e !== "assignments" && /* @__PURE__ */ (0, E.jsxs)(b, { children: [/* @__PURE__ */ (0, E.jsx)(S, {
					asChild: !0,
					children: /* @__PURE__ */ (0, E.jsx)(s, {
						size: "icon-sm",
						variant: "ghost",
						"aria-label": `Edit ${t}`,
						onClick: () => Z(n.original),
						children: /* @__PURE__ */ (0, E.jsx)(w, { size: 13 })
					})
				}), /* @__PURE__ */ (0, E.jsxs)(x, { children: ["Edit ", t.toLowerCase()] })] }),
				a(window.APP_CONFIG, `${e}.delete`) && (!A || A(n.original)) && /* @__PURE__ */ (0, E.jsxs)(b, { children: [/* @__PURE__ */ (0, E.jsx)(S, {
					asChild: !0,
					children: /* @__PURE__ */ (0, E.jsx)(s, {
						size: "icon-sm",
						variant: "ghost",
						className: "tw:text-destructive",
						"aria-label": `Remove ${t}`,
						onClick: () => {
							q(n.original), X.reset();
						},
						children: /* @__PURE__ */ (0, E.jsx)(y, { size: 13 })
					})
				}), /* @__PURE__ */ (0, E.jsxs)(x, { children: ["Remove ", t.toLowerCase()] })] })
			]
		})
	}];
	return /* @__PURE__ */ (0, E.jsxs)(E.Fragment, { children: [
		/* @__PURE__ */ (0, E.jsxs)("div", {
			className: "ui-page-actions",
			children: [/* @__PURE__ */ (0, E.jsx)("p", { children: j || `Manage ${e} and keep your workspace up to date.` }), a(window.APP_CONFIG, `${e}.create`) && /* @__PURE__ */ (0, E.jsxs)(f, {
				onClick: () => Z(),
				children: ["Add ", t.toLowerCase()]
			})]
		}),
		O,
		/* @__PURE__ */ (0, E.jsx)(l, {
			title: `${e === "jurisdictions" ? "Jurisdiction" : e.charAt(0).toUpperCase() + e.slice(1)} directory`,
			description: "Find the details you need. Keep the work moving.",
			children: /* @__PURE__ */ (0, E.jsx)(d, {
				queries: [L, ...k],
				children: /* @__PURE__ */ (0, E.jsx)(h, {
					data: N ? N(L.data || []) : L.data || [],
					columns: $,
					searchLabel: `Search ${e}…`,
					filter: M
				})
			})
		}),
		/* @__PURE__ */ (0, E.jsxs)(u, {
			className: F,
			open: R,
			onClose: () => z(!1),
			title: `${B ? "Edit" : "Add"} ${t.toLowerCase()}`,
			onSubmit: () => void Q(),
			busy: Y.isPending,
			error: W || Y.error,
			children: [i(!!B, B).filter((e) => !e.onlyEdit || B).map((e) => /* @__PURE__ */ (0, E.jsx)("div", {
				className: e.fullWidth ? "tw:col-span-full" : void 0,
				children: /* @__PURE__ */ (0, E.jsx)(_, {
					...e,
					value: H[e.name] || "",
					onChange: (t) => {
						U((n) => ({
							...n,
							[e.name]: t
						})), G(null);
					}
				})
			}, e.name)), B && P?.(B)]
		}),
		/* @__PURE__ */ (0, E.jsx)(m, {
			open: !!K,
			onClose: () => q(void 0),
			title: `Remove this ${t.toLowerCase()}?`,
			busy: X.isPending,
			error: X.error,
			onConfirm: () => {
				K && X.run(K.id).then((e) => {
					e && (q(void 0), J(e.message || `${t} removed.`));
				}).catch(() => {});
			}
		})
	] });
}
//#endregion
export { D as t };
