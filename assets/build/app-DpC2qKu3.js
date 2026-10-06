import { n as e, r as t } from "./rolldown-runtime-B0aSnxlc.js";
import { t as n } from "./react-B4u1yd7E.js";
import { a as r, d as i, f as a, h as o, l as s, m as c, n as l, p as u, s as d } from "./api-DVPVP-g0.js";
import { $ as f, At as p, C as m, Ct as h, Dt as g, Et as _, Ft as v, G as y, H as b, J as x, K as S, L as C, Mt as w, Nt as T, Ot as ee, Pt as E, Q as D, St as te, Tt as O, W as k, X as A, Y as ne, Z as re, _t as ie, at as j, bt as ae, ct as oe, dt as M, et as se, f as ce, ft as le, gt as ue, ht as de, it as fe, jt as N, kt as pe, lt as me, mt as P, nt as he, ot as ge, p as _e, pt as ve, q as ye, rt as be, st as xe, t as Se, tt as Ce, ut as F, vt as I, wt as we, xt as Te, yt as Ee } from "./hooks-BlRndFBy.js";
//#region node_modules/@tanstack/query-core/build/modern/mutationCache.js
var De = class extends O {
	#e;
	#t;
	#n;
	constructor(e = {}) {
		super(), this.config = e, this.#e = /* @__PURE__ */ new Set(), this.#t = /* @__PURE__ */ new Map(), this.#n = 0;
	}
	build(e, t, n) {
		let r = new ae({
			client: e,
			mutationCache: this,
			mutationId: ++this.#n,
			options: e.defaultMutationOptions(t),
			state: n
		});
		return this.add(r), r;
	}
	add(e) {
		this.#e.add(e);
		let t = L(e);
		if (typeof t == "string") {
			let n = this.#t.get(t);
			n ? n.push(e) : this.#t.set(t, [e]);
		}
		this.notify({
			type: "added",
			mutation: e
		});
	}
	remove(e) {
		if (this.#e.delete(e)) {
			let t = L(e);
			if (typeof t == "string") {
				let n = this.#t.get(t);
				if (n) {
					if (n.length > 1) {
						let t = n.indexOf(e);
						t !== -1 && n.splice(t, 1);
					} else n[0] === e && this.#t.delete(t);
				}
			}
		}
		this.notify({
			type: "removed",
			mutation: e
		});
	}
	canRun(e) {
		let t = L(e);
		if (typeof t == "string") {
			let n = this.#t.get(t)?.find((e) => e.state.status === "pending");
			return !n || n === e;
		}
		return !0;
	}
	runNext(e) {
		let t = L(e);
		return typeof t == "string" ? (this.#t.get(t)?.find((t) => t !== e && t.state.isPaused))?.continue() ?? Promise.resolve() : Promise.resolve();
	}
	clear() {
		h.batch(() => {
			this.#e.forEach((e) => {
				this.notify({
					type: "removed",
					mutation: e
				});
			}), this.#e.clear(), this.#t.clear();
		});
	}
	getAll() {
		return Array.from(this.#e);
	}
	find(e) {
		let t = {
			exact: !0,
			...e
		};
		return this.getAll().find((e) => pe(t, e));
	}
	findAll(e = {}) {
		return this.getAll().filter((t) => pe(e, t));
	}
	notify(e) {
		h.batch(() => {
			this.listeners.forEach((t) => {
				t(e);
			});
		});
	}
	resumePausedMutations() {
		let e = this.getAll().filter((e) => e.state.isPaused);
		return h.batch(() => Promise.all(e.map((e) => e.continue().catch(N))));
	}
};
function L(e) {
	return e.options.scope?.id;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryCache.js
var Oe = class extends O {
	#e;
	constructor(e = {}) {
		super(), this.config = e, this.#e = /* @__PURE__ */ new Map();
	}
	build(e, t, n) {
		let r = t.queryKey, i = t.queryHash ?? ee(r, t), a = this.get(i);
		return a || (a = new Te({
			client: e,
			queryKey: r,
			queryHash: i,
			options: e.defaultQueryOptions(t),
			state: n,
			defaultOptions: e.getQueryDefaults(r)
		}), this.add(a)), a;
	}
	add(e) {
		this.#e.has(e.queryHash) || (this.#e.set(e.queryHash, e), this.notify({
			type: "added",
			query: e
		}));
	}
	remove(e) {
		this.#e.get(e.queryHash) === e && (e.destroy(), this.#e.delete(e.queryHash), this.notify({
			type: "removed",
			query: e
		}));
	}
	clear() {
		h.batch(() => {
			this.getAll().forEach((e) => {
				this.remove(e);
			});
		});
	}
	get(e) {
		return this.#e.get(e);
	}
	getAll() {
		return [...this.#e.values()];
	}
	find(e) {
		let t = {
			exact: !0,
			...e
		};
		return this.getAll().find((e) => p(t, e));
	}
	findAll(e = {}) {
		let t = this.getAll();
		return Object.keys(e).length > 0 ? t.filter((t) => p(e, t)) : t;
	}
	notify(e) {
		h.batch(() => {
			this.listeners.forEach((t) => {
				t(e);
			});
		});
	}
	onFocus() {
		h.batch(() => {
			this.getAll().forEach((e) => {
				e.onFocus();
			});
		});
	}
	onOnline() {
		h.batch(() => {
			this.getAll().forEach((e) => {
				e.onOnline();
			});
		});
	}
}, ke = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	constructor(e = {}) {
		this.#e = e.queryCache || new Oe(), this.#t = e.mutationCache || new De(), this.#n = e.defaultOptions || {}, this.#r = /* @__PURE__ */ new Map(), this.#i = /* @__PURE__ */ new Map(), this.#a = 0;
	}
	mount() {
		this.#a++, this.#a === 1 && (this.#o = we.subscribe(async (e) => {
			e && (await this.resumePausedMutations(), this.#e.onFocus());
		}), this.#s = te.subscribe(async (e) => {
			e && (await this.resumePausedMutations(), this.#e.onOnline());
		}));
	}
	unmount() {
		this.#a--, this.#a === 0 && (this.#o?.(), this.#o = void 0, this.#s?.(), this.#s = void 0);
	}
	isFetching(e) {
		return this.#e.findAll({
			...e,
			fetchStatus: "fetching"
		}).length;
	}
	isMutating(e) {
		return this.#t.findAll({
			...e,
			status: "pending"
		}).length;
	}
	getQueryData(e) {
		let t = this.defaultQueryOptions({ queryKey: e });
		return this.#e.get(t.queryHash)?.state.data;
	}
	ensureQueryData(e) {
		let t = this.defaultQueryOptions(e), n = this.#e.build(this, t), r = n.state.data;
		return r === void 0 ? this.fetchQuery(e) : (e.revalidateIfStale && n.isStaleByTime(T(t.staleTime, n)) && this.prefetchQuery(t), Promise.resolve(r));
	}
	getQueriesData(e) {
		return this.#e.findAll(e).map(({ queryKey: e, state: t }) => [e, t.data]);
	}
	setQueryData(e, t, n) {
		let r = this.defaultQueryOptions({ queryKey: e }), i = this.#e.get(r.queryHash)?.state.data, a = _(t, i);
		if (a !== void 0) return this.#e.build(this, r).setData(a, {
			...n,
			manual: !0
		});
	}
	setQueriesData(e, t, n) {
		return h.batch(() => this.#e.findAll(e).map(({ queryKey: e }) => [e, this.setQueryData(e, t, n)]));
	}
	getQueryState(e) {
		let t = this.defaultQueryOptions({ queryKey: e });
		return this.#e.get(t.queryHash)?.state;
	}
	removeQueries(e) {
		let t = this.#e;
		h.batch(() => {
			t.findAll(e).forEach((e) => {
				t.remove(e);
			});
		});
	}
	resetQueries(e, t) {
		let n = this.#e;
		return h.batch(() => {
			let r = n.findAll(e), i = new Set(r);
			return r.forEach((e) => {
				e.reset();
			}), this.refetchQueries({
				type: "active",
				predicate: (e) => i.has(e)
			}, t);
		});
	}
	cancelQueries(e, t = {}) {
		let n = {
			revert: !0,
			...t
		}, r = h.batch(() => this.#e.findAll(e).map((e) => e.cancel(n)));
		return Promise.all(r).then(N).catch(N);
	}
	invalidateQueries(e, t = {}) {
		return h.batch(() => (this.#e.findAll(e).forEach((e) => {
			e.invalidate();
		}), e?.refetchType === "none" ? Promise.resolve() : this.refetchQueries({
			...e,
			type: e?.refetchType ?? e?.type ?? "active"
		}, t)));
	}
	refetchQueries(e, t = {}) {
		let n = {
			...t,
			cancelRefetch: t.cancelRefetch ?? !0
		}, r = h.batch(() => this.#e.findAll(e).filter((e) => !e.isDisabled() && !e.isStatic()).map((e) => {
			let t = e.fetch(void 0, n);
			return n.throwOnError || (t = t.catch(N)), e.state.fetchStatus === "paused" ? Promise.resolve() : t;
		}));
		return Promise.all(r).then(N);
	}
	async query(e) {
		let t = this.defaultQueryOptions(e);
		t.retry === void 0 && (t.retry = !1);
		let n = this.#e.build(this, t), r = n.isStaleByTime(T(t.staleTime, n)) ? await n.fetch(t) : n.state.data, i = t.select;
		return i ? i(r) : r;
	}
	fetchQuery(e) {
		let t = this.defaultQueryOptions(e);
		t.retry === void 0 && (t.retry = !1);
		let n = this.#e.build(this, t);
		return n.isStaleByTime(T(t.staleTime, n)) ? n.fetch(t) : Promise.resolve(n.state.data);
	}
	prefetchQuery(e) {
		return this.fetchQuery(e).then(N).catch(N);
	}
	infiniteQuery(e) {
		return e._type = "infinite", this.query(e);
	}
	fetchInfiniteQuery(e) {
		return e._type = "infinite", this.fetchQuery(e);
	}
	prefetchInfiniteQuery(e) {
		return this.fetchInfiniteQuery(e).then(N).catch(N);
	}
	ensureInfiniteQueryData(e) {
		return e._type = "infinite", this.ensureQueryData(e);
	}
	resumePausedMutations() {
		return te.isOnline() ? this.#t.resumePausedMutations() : Promise.resolve();
	}
	getQueryCache() {
		return this.#e;
	}
	getMutationCache() {
		return this.#t;
	}
	getDefaultOptions() {
		return this.#n;
	}
	setDefaultOptions(e) {
		this.#n = e;
	}
	setQueryDefaults(e, t) {
		this.#r.set(g(e), {
			queryKey: e,
			defaultOptions: t
		});
	}
	getQueryDefaults(e) {
		let t = [...this.#r.values()], n = {};
		return t.forEach((t) => {
			w(e, t.queryKey) && Object.assign(n, t.defaultOptions);
		}), n;
	}
	setMutationDefaults(e, t) {
		this.#i.set(g(e), {
			mutationKey: e,
			defaultOptions: t
		});
	}
	getMutationDefaults(e) {
		let t = [...this.#i.values()], n = {};
		return t.forEach((t) => {
			w(e, t.mutationKey) && Object.assign(n, t.defaultOptions);
		}), n;
	}
	defaultQueryOptions(e) {
		if (e._defaulted) return e;
		let t = {
			...this.#n.queries,
			...this.getQueryDefaults(e.queryKey),
			...e,
			_defaulted: !0
		};
		return t.queryHash ||= ee(t.queryKey, t), t.refetchOnReconnect === void 0 && (t.refetchOnReconnect = t.networkMode !== "always"), t.throwOnError === void 0 && (t.throwOnError = !!t.suspense), !t.networkMode && t.persister && (t.networkMode = "offlineFirst"), t.queryFn === E && (t.enabled = !1), t;
	}
	defaultMutationOptions(e) {
		return e?._defaulted ? e : {
			...this.#n.mutations,
			...e?.mutationKey && this.getMutationDefaults(e.mutationKey),
			...e,
			_defaulted: !0
		};
	}
	clear() {
		this.#e.clear(), this.#t.clear();
	}
}, R = /* @__PURE__ */ t(n(), 1), Ae = Object.defineProperty, je = (e, t) => Ae(e, "name", {
	value: t,
	configurable: !0
}), Me = !1;
function Ne() {
	let [e, t] = R.useState(Me);
	return R.useEffect(() => {
		Me || (Me = !0, t(!0));
	}, []), e;
}
je(Ne, "useIsHydrated");
var Pe = R.useSyncExternalStore;
function Fe() {
	return () => {};
}
je(Fe, "subscribe");
function Ie() {
	return Pe(Fe, () => !0, () => !1);
}
je(Ie, "useIsHydratedModern");
var Le = typeof Pe == "function" ? Ie : Ne, z = o(), Re = Object.defineProperty, B = (e, t) => Re(e, "name", {
	value: t,
	configurable: !0
}), ze = "rovingFocusGroup.onEntryFocus", Be = {
	bubbles: !1,
	cancelable: !0
}, V = "RovingFocusGroup", [Ve, He, Ue] = de(V), [We, Ge] = ue(V, [Ue]), [Ke, qe] = We(V), Je = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ B(function(e, t) {
	return /* @__PURE__ */ (0, z.jsx)(Ve.Provider, {
		scope: e.__scopeRovingFocusGroup,
		children: /* @__PURE__ */ (0, z.jsx)(Ve.Slot, {
			scope: e.__scopeRovingFocusGroup,
			children: /* @__PURE__ */ (0, z.jsx)(Ye, {
				...e,
				ref: t
			})
		})
	});
}, "RovingFocusGroup")), Ye = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ B(function(e, t) {
	let { __scopeRovingFocusGroup: n, orientation: r, loop: i = !1, dir: a, currentTabStopId: o, defaultCurrentTabStopId: s, onCurrentTabStopIdChange: c, onEntryFocus: l, preventScrollOnEntryFocus: d = !1, ...f } = e, p = R.useRef(null), m = u(t, p), h = me(a), [g, _] = le({
		prop: o,
		defaultProp: s ?? null,
		onChange: c,
		caller: V
	}), [v, y] = R.useState(!1), b = oe(l), x = He(n), S = R.useRef(!1), [C, w] = R.useState(0);
	return R.useEffect(() => {
		let e = p.current;
		if (e) return e.addEventListener(ze, b), () => e.removeEventListener(ze, b);
	}, [b]), /* @__PURE__ */ (0, z.jsx)(Ke, {
		scope: n,
		orientation: r,
		dir: h,
		loop: i,
		currentTabStopId: g,
		onItemFocus: R.useCallback((e) => _(e), [_]),
		onItemShiftTab: R.useCallback(() => y(!0), []),
		onFocusableItemAdd: R.useCallback(() => w((e) => e + 1), []),
		onFocusableItemRemove: R.useCallback(() => w((e) => e - 1), []),
		children: /* @__PURE__ */ (0, z.jsx)(I.div, {
			tabIndex: v || C === 0 ? -1 : 0,
			"data-orientation": r,
			...f,
			ref: m,
			style: {
				outline: "none",
				...e.style
			},
			onMouseDown: P(e.onMouseDown, () => {
				S.current = !0;
			}),
			onFocus: P(e.onFocus, (e) => {
				let t = !S.current;
				if (e.target === e.currentTarget && t && !v) {
					let t = new CustomEvent(ze, Be);
					if (e.currentTarget.dispatchEvent(t), !t.defaultPrevented) {
						let e = x().filter((e) => e.focusable);
						tt([
							e.find((e) => e.active),
							e.find((e) => e.id === g),
							...e
						].filter(Boolean).map((e) => e.ref.current), d);
					}
				}
				S.current = !1;
			}),
			onBlur: P(e.onBlur, () => y(!1))
		})
	});
}, "RovingFocusGroupImpl")), Xe = "RovingFocusGroupItem", Ze = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ B(function(e, t) {
	let { __scopeRovingFocusGroup: n, focusable: r = !0, active: i = !1, tabStopId: a, children: o, ...s } = e, c = F(), l = a || c, u = qe(Xe, n), d = u.currentTabStopId === l, f = He(n), { onFocusableItemAdd: p, onFocusableItemRemove: m, currentTabStopId: h } = u, g = Le();
	return ve(() => {
		if (g && r) return p(), () => m();
	}, [
		g,
		r,
		p,
		m
	]), R.useEffect(() => {
		if (!g && r) return p(), () => m();
	}, [
		g,
		r,
		p,
		m
	]), /* @__PURE__ */ (0, z.jsx)(Ve.ItemSlot, {
		scope: n,
		id: l,
		focusable: r,
		active: i,
		children: /* @__PURE__ */ (0, z.jsx)(I.span, {
			tabIndex: d ? 0 : -1,
			"data-orientation": u.orientation,
			...s,
			ref: t,
			onMouseDown: P(e.onMouseDown, (e) => {
				r ? u.onItemFocus(l) : e.preventDefault();
			}),
			onFocus: P(e.onFocus, () => u.onItemFocus(l)),
			onKeyDown: P(e.onKeyDown, (e) => {
				if (e.key === "Tab" && e.shiftKey) {
					u.onItemShiftTab();
					return;
				}
				if (e.target !== e.currentTarget) return;
				let t = et(e, u.orientation, u.dir);
				if (t !== void 0) {
					if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
					e.preventDefault();
					let n = f().filter((e) => e.focusable).map((e) => e.ref.current);
					if (t === "last") n.reverse();
					else if (t === "prev" || t === "next") {
						t === "prev" && n.reverse();
						let r = n.indexOf(e.currentTarget);
						n = u.loop ? nt(n, r + 1) : n.slice(r + 1);
					}
					setTimeout(() => tt(n));
				}
			}),
			children: typeof o == "function" ? o({
				isCurrentTabStop: d,
				hasTabStop: h != null
			}) : o
		})
	});
}, "RovingFocusGroupItem")), Qe = {
	ArrowLeft: "prev",
	ArrowUp: "prev",
	ArrowRight: "next",
	ArrowDown: "next",
	PageUp: "first",
	Home: "first",
	PageDown: "last",
	End: "last"
};
function $e(e, t) {
	return t === "rtl" ? e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e : e;
}
B($e, "getDirectionAwareKey");
function et(e, t, n) {
	let r = $e(e.key, n);
	if (!(t === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(t === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r))) return Qe[r];
}
B(et, "getFocusIntent");
function tt(e, t = !1) {
	let n = document.activeElement;
	for (let r of e) if (r === n || (r.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
B(tt, "focusFirst");
function nt(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
B(nt, "wrapArray");
var rt = Je, it = Ze, at = Object.defineProperty, H = (e, t) => at(e, "name", {
	value: t,
	configurable: !0
}), ot = ["Enter", " "], st = [
	"ArrowDown",
	"PageUp",
	"Home"
], ct = [
	"ArrowUp",
	"PageDown",
	"End"
], lt = [...st, ...ct];
[...ot], [...ot];
var U = "Menu", [ut, dt, ft] = de(U), [W, pt] = ue(U, [
	ft,
	x,
	Ge
]), mt = x(), ht = Ge(), [gt, G] = W(U), [_t, vt] = W(U), yt = /* @__PURE__ */ H((e) => {
	let { __scopeMenu: t, open: n = !1, children: r, dir: i, onOpenChange: a, modal: o = !0 } = e, s = mt(t), [c, l] = R.useState(null), u = R.useRef(!1), d = oe(a), f = me(i);
	return R.useEffect(() => {
		let e = /* @__PURE__ */ H(() => {
			u.current = !0, document.addEventListener("pointerdown", t, {
				capture: !0,
				once: !0
			}), document.addEventListener("pointermove", t, {
				capture: !0,
				once: !0
			});
		}, "handleKeyDown"), t = /* @__PURE__ */ H(() => u.current = !1, "handlePointer");
		return document.addEventListener("keydown", e, { capture: !0 }), () => {
			document.removeEventListener("keydown", e, { capture: !0 }), document.removeEventListener("pointerdown", t, { capture: !0 }), document.removeEventListener("pointermove", t, { capture: !0 });
		};
	}, []), R.useEffect(() => {
		if (!n) return;
		let e = /* @__PURE__ */ H(() => d(!1), "handleBlur");
		return window.addEventListener("blur", e), () => window.removeEventListener("blur", e);
	}, [n, d]), /* @__PURE__ */ (0, z.jsx)(ye, {
		...s,
		children: /* @__PURE__ */ (0, z.jsx)(gt, {
			scope: t,
			open: n,
			onOpenChange: d,
			content: c,
			onContentChange: l,
			children: /* @__PURE__ */ (0, z.jsx)(_t, {
				scope: t,
				onClose: R.useCallback(() => d(!1), [d]),
				isUsingKeyboardRef: u,
				dir: f,
				modal: o,
				children: r
			})
		})
	});
}, "Menu"), bt = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let { __scopeMenu: n, ...r } = e, i = mt(n);
	return /* @__PURE__ */ (0, z.jsx)(k, {
		...i,
		...r,
		ref: t
	});
}, "MenuAnchor")), xt = "MenuPortal", [St, Ct] = W(xt, { forceMount: void 0 }), wt = /* @__PURE__ */ H((e) => {
	let { __scopeMenu: t, forceMount: n, children: r, container: i } = e, a = G(xt, t);
	return /* @__PURE__ */ (0, z.jsx)(St, {
		scope: t,
		forceMount: n,
		children: /* @__PURE__ */ (0, z.jsx)(M, {
			present: n || a.open,
			children: /* @__PURE__ */ (0, z.jsx)(j, {
				asChild: !0,
				container: i,
				children: r
			})
		})
	});
}, "MenuPortal"), K = "MenuContent", [Tt, Et] = W(K), Dt = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let n = Ct(K, e.__scopeMenu), { forceMount: r = n.forceMount, ...i } = e, a = G(K, e.__scopeMenu), o = vt(K, e.__scopeMenu);
	return /* @__PURE__ */ (0, z.jsx)(ut.Provider, {
		scope: e.__scopeMenu,
		children: /* @__PURE__ */ (0, z.jsx)(M, {
			present: r || a.open,
			children: /* @__PURE__ */ (0, z.jsx)(ut.Slot, {
				scope: e.__scopeMenu,
				children: o.modal ? /* @__PURE__ */ (0, z.jsx)(Ot, {
					...i,
					ref: t
				}) : /* @__PURE__ */ (0, z.jsx)(kt, {
					...i,
					ref: t
				})
			})
		})
	});
}, "MenuContent")), Ot = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let n = G(K, e.__scopeMenu), r = R.useRef(null), i = u(t, r);
	return R.useEffect(() => {
		let e = r.current;
		if (e) return he(e);
	}, []), /* @__PURE__ */ (0, z.jsx)(jt, {
		...e,
		ref: i,
		trapFocus: n.open,
		disableOutsidePointerEvents: n.open,
		disableOutsideScroll: !0,
		onFocusOutside: P(e.onFocusOutside, (e) => e.preventDefault(), { checkForDefaultPrevented: !1 }),
		onDismiss: () => n.onOpenChange(!1)
	});
}, "MenuRootContentModal")), kt = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let n = G(K, e.__scopeMenu);
	return /* @__PURE__ */ (0, z.jsx)(jt, {
		...e,
		ref: t,
		trapFocus: !1,
		disableOutsidePointerEvents: !1,
		disableOutsideScroll: !1,
		onDismiss: () => n.onOpenChange(!1)
	});
}, "MenuRootContentNonModal")), At = i("MenuContent.ScrollLock"), jt = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let { __scopeMenu: n, loop: r = !1, trapFocus: i, onOpenAutoFocus: a, onCloseAutoFocus: o, disableOutsidePointerEvents: s, onEntryFocus: c, onEscapeKeyDown: l, onPointerDownOutside: d, onFocusOutside: f, onInteractOutside: p, onDismiss: m, disableOutsideScroll: h, ...g } = e, _ = G(K, n), v = vt(K, n), y = mt(n), b = ht(n), x = dt(n), [C, w] = R.useState(null), T = R.useRef(null), ee = u(t, T, _.onContentChange), E = R.useRef(0), D = R.useRef(""), te = R.useRef(0), O = R.useRef(null), k = R.useRef("right"), A = R.useRef(0), ne = h ? be : R.Fragment, re = h ? {
		as: At,
		allowPinchZoom: !0
	} : void 0, ie = /* @__PURE__ */ H((e) => {
		let t = D.current + e, n = x().filter((e) => !e.disabled), r = document.activeElement, i = n.find((e) => e.ref.current === r)?.textValue, a = Yt(n.map((e) => e.textValue), t, i), o = n.find((e) => e.textValue === a)?.ref.current;
		(/* @__PURE__ */ H((function e(t) {
			D.current = t, window.clearTimeout(E.current), t !== "" && (E.current = window.setTimeout(() => e(""), 1e3));
		}), "updateSearch"))(t), o && setTimeout(() => o.focus());
	}, "handleTypeaheadSearch");
	R.useEffect(() => () => window.clearTimeout(E.current), []), fe();
	let j = R.useCallback((e) => k.current === O.current?.side && Zt(e, O.current?.area), []);
	return /* @__PURE__ */ (0, z.jsx)(Tt, {
		scope: n,
		searchRef: D,
		onItemEnter: R.useCallback((e) => {
			j(e) && e.preventDefault();
		}, [j]),
		onItemLeave: R.useCallback((e) => {
			j(e) || (T.current?.focus(), w(null));
		}, [j]),
		onTriggerLeave: R.useCallback((e) => {
			j(e) && e.preventDefault();
		}, [j]),
		pointerGraceTimerRef: te,
		onPointerGraceIntentChange: R.useCallback((e) => {
			O.current = e;
		}, []),
		children: /* @__PURE__ */ (0, z.jsx)(ne, {
			...re,
			children: /* @__PURE__ */ (0, z.jsx)(ge, {
				asChild: !0,
				trapped: i,
				onMountAutoFocus: P(a, (e) => {
					e.preventDefault(), T.current?.focus({ preventScroll: !0 });
				}),
				onUnmountAutoFocus: o,
				children: /* @__PURE__ */ (0, z.jsx)(xe, {
					asChild: !0,
					disableOutsidePointerEvents: s,
					onEscapeKeyDown: l,
					onPointerDownOutside: d,
					onFocusOutside: f,
					onInteractOutside: p,
					onDismiss: m,
					children: /* @__PURE__ */ (0, z.jsx)(rt, {
						asChild: !0,
						...b,
						dir: v.dir,
						orientation: "vertical",
						loop: r,
						currentTabStopId: C,
						onCurrentTabStopIdChange: w,
						onEntryFocus: P(c, (e) => {
							v.isUsingKeyboardRef.current || e.preventDefault();
						}),
						preventScrollOnEntryFocus: !0,
						children: /* @__PURE__ */ (0, z.jsx)(S, {
							role: "menu",
							"aria-orientation": "vertical",
							"data-state": Wt(_.open),
							"data-radix-menu-content": "",
							dir: v.dir,
							...y,
							...g,
							ref: ee,
							style: {
								outline: "none",
								...g.style
							},
							onKeyDown: P(g.onKeyDown, (e) => {
								let t = e.target.closest("[data-radix-menu-content]") === e.currentTarget, n = e.ctrlKey || e.altKey || e.metaKey, r = e.key.length === 1;
								t && (e.key === "Tab" && e.preventDefault(), !n && r && ie(e.key));
								let i = T.current;
								if (e.target !== i || !lt.includes(e.key)) return;
								e.preventDefault();
								let a = x().filter((e) => !e.disabled).map((e) => e.ref.current);
								ct.includes(e.key) && a.reverse(), qt(a);
							}),
							onBlur: P(e.onBlur, (e) => {
								e.currentTarget.contains(e.target) || (window.clearTimeout(E.current), D.current = "");
							}),
							onPointerMove: P(e.onPointerMove, q((e) => {
								let t = e.target, n = A.current !== e.clientX;
								if (e.currentTarget.contains(t) && n) {
									let t = e.clientX > A.current ? "right" : "left";
									k.current = t, A.current = e.clientX;
								}
							}))
						})
					})
				})
			})
		})
	});
}, "MenuContentImpl")), Mt = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let { __scopeMenu: n, ...r } = e;
	return /* @__PURE__ */ (0, z.jsx)(I.div, {
		...r,
		ref: t
	});
}, "MenuLabel")), Nt = "MenuItem", Pt = "menu.itemSelect", Ft = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let { disabled: n = !1, onSelect: r, ...i } = e, a = R.useRef(null), o = vt(Nt, e.__scopeMenu), s = Et(Nt, e.__scopeMenu), c = u(t, a), l = R.useRef(!1), d = /* @__PURE__ */ H(() => {
		let e = a.current;
		if (!n && e) {
			let t = new CustomEvent(Pt, {
				bubbles: !0,
				cancelable: !0
			});
			e.addEventListener(Pt, (e) => r?.(e), { once: !0 }), Ee(e, t), t.defaultPrevented ? l.current = !1 : o.onClose();
		}
	}, "handleSelect");
	return /* @__PURE__ */ (0, z.jsx)(It, {
		...i,
		ref: c,
		disabled: n,
		onClick: P(e.onClick, d),
		onPointerDown: (t) => {
			e.onPointerDown?.(t), l.current = !0;
		},
		onPointerUp: P(e.onPointerUp, (e) => {
			l.current || e.currentTarget?.click();
		}),
		onKeyDown: P(e.onKeyDown, (e) => {
			n || e.target !== e.currentTarget || (s.searchRef.current === "" || e.key !== " ") && ot.includes(e.key) && (e.currentTarget.click(), e.preventDefault());
		})
	});
}, "MenuItem")), It = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let { __scopeMenu: n, disabled: r = !1, textValue: i, ...a } = e, o = Et(Nt, n), s = ht(n), c = R.useRef(null), l = u(t, c), [d, f] = R.useState(!1), [p, m] = R.useState("");
	return R.useEffect(() => {
		let e = c.current;
		e && m((e.textContent ?? "").trim());
	}, [a.children]), /* @__PURE__ */ (0, z.jsx)(ut.ItemSlot, {
		scope: n,
		disabled: r,
		textValue: i ?? p,
		children: /* @__PURE__ */ (0, z.jsx)(it, {
			asChild: !0,
			...s,
			focusable: !r,
			children: /* @__PURE__ */ (0, z.jsx)(I.div, {
				role: "menuitem",
				"data-highlighted": d ? "" : void 0,
				"aria-disabled": r || void 0,
				"data-disabled": r ? "" : void 0,
				...a,
				ref: l,
				onPointerMove: P(e.onPointerMove, q((e) => {
					r ? o.onItemLeave(e) : (o.onItemEnter(e), e.defaultPrevented || e.currentTarget.focus({ preventScroll: !0 }));
				})),
				onPointerLeave: P(e.onPointerLeave, q((e) => o.onItemLeave(e))),
				onFocus: P(e.onFocus, () => f(!0)),
				onBlur: P(e.onBlur, () => f(!1))
			})
		})
	});
}, "MenuItemImpl")), [Lt, Rt] = W("MenuRadioGroup", {
	value: void 0,
	onValueChange: /* @__PURE__ */ H(() => {}, "onValueChange")
}), [zt, Bt] = W("MenuItemIndicator", { checked: !1 }), Vt = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ H(function(e, t) {
	let { __scopeMenu: n, ...r } = e;
	return /* @__PURE__ */ (0, z.jsx)(I.div, {
		role: "separator",
		"aria-orientation": "horizontal",
		...r,
		ref: t
	});
}, "MenuSeparator")), [Ht, Ut] = W("MenuSub");
function Wt(e) {
	return e ? "open" : "closed";
}
H(Wt, "getOpenState");
function Gt(e) {
	return e === "indeterminate";
}
H(Gt, "isIndeterminate");
function Kt(e) {
	return Gt(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
H(Kt, "getCheckedState");
function qt(e) {
	let t = document.activeElement;
	for (let n of e) if (n === t || (n.focus(), document.activeElement !== t)) return;
}
H(qt, "focusFirst");
function Jt(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
H(Jt, "wrapArray");
function Yt(e, t, n) {
	let r = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1, a = Jt(e, Math.max(i, 0));
	r.length === 1 && (a = a.filter((e) => e !== n));
	let o = a.find((e) => e.toLowerCase().startsWith(r.toLowerCase()));
	return o === n ? void 0 : o;
}
H(Yt, "getNextMatch");
function Xt(e, t) {
	let { x: n, y: r } = e, i = !1;
	for (let e = 0, a = t.length - 1; e < t.length; a = e++) {
		let o = t[e], s = t[a], c = o.x, l = o.y, u = s.x, d = s.y;
		l > r != d > r && n < (u - c) * (r - l) / (d - l) + c && (i = !i);
	}
	return i;
}
H(Xt, "isPointInPolygon");
function Zt(e, t) {
	return t ? Xt({
		x: e.clientX,
		y: e.clientY
	}, t) : !1;
}
H(Zt, "isPointerInGraceArea");
function q(e) {
	return (t) => t.pointerType === "mouse" ? e(t) : void 0;
}
H(q, "whenMouse");
var Qt = yt, $t = bt, en = wt, tn = Dt, nn = Mt, rn = Ft, an = Vt, on = Object.defineProperty, J = (e, t) => on(e, "name", {
	value: t,
	configurable: !0
}), sn = "DropdownMenu", [cn, ln] = ue(sn, [pt]), Y = pt(), [un, dn] = cn(sn), fn = /* @__PURE__ */ J((e) => {
	let { __scopeDropdownMenu: t, children: n, dir: r, open: i, defaultOpen: a, onOpenChange: o, modal: s = !0 } = e, c = Y(t), l = R.useRef(null), [u, d] = le({
		prop: i,
		defaultProp: a ?? !1,
		onChange: o,
		caller: sn
	});
	return /* @__PURE__ */ (0, z.jsx)(un, {
		scope: t,
		triggerId: F(),
		triggerRef: l,
		contentId: F(),
		open: u,
		onOpenChange: d,
		onOpenToggle: R.useCallback(() => d((e) => !e), [d]),
		modal: s,
		children: /* @__PURE__ */ (0, z.jsx)(Qt, {
			...c,
			open: u,
			onOpenChange: d,
			dir: r,
			modal: s,
			children: n
		})
	});
}, "DropdownMenu"), pn = "DropdownMenuTrigger", mn = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeDropdownMenu: n, disabled: r = !1, ...i } = e, a = dn(pn, n), o = Y(n), s = u(t, a.triggerRef);
	return /* @__PURE__ */ (0, z.jsx)($t, {
		asChild: !0,
		...o,
		children: /* @__PURE__ */ (0, z.jsx)(I.button, {
			type: "button",
			id: a.triggerId,
			"aria-haspopup": "menu",
			"aria-expanded": a.open,
			"aria-controls": a.open ? a.contentId : void 0,
			"data-state": a.open ? "open" : "closed",
			"data-disabled": r ? "" : void 0,
			disabled: r,
			...i,
			ref: s,
			onPointerDown: P(e.onPointerDown, (e) => {
				!r && e.button === 0 && e.ctrlKey === !1 && (a.onOpenToggle(), a.open || e.preventDefault());
			}),
			onKeyDown: P(e.onKeyDown, (e) => {
				r || (["Enter", " "].includes(e.key) && a.onOpenToggle(), e.key === "ArrowDown" && a.onOpenChange(!0), [
					"Enter",
					" ",
					"ArrowDown"
				].includes(e.key) && e.preventDefault());
			})
		})
	});
}, "DropdownMenuTrigger")), hn = /* @__PURE__ */ J((e) => {
	let { __scopeDropdownMenu: t, ...n } = e, r = Y(t);
	return /* @__PURE__ */ (0, z.jsx)(en, {
		...r,
		...n
	});
}, "DropdownMenuPortal"), gn = "DropdownMenuContent", _n = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeDropdownMenu: n, ...r } = e, i = dn(gn, n), a = Y(n), o = R.useRef(!1);
	return /* @__PURE__ */ (0, z.jsx)(tn, {
		id: i.contentId,
		"aria-labelledby": i.triggerId,
		...a,
		...r,
		ref: t,
		onCloseAutoFocus: P(e.onCloseAutoFocus, (e) => {
			o.current || i.triggerRef.current?.focus(), o.current = !1, e.preventDefault();
		}),
		onInteractOutside: P(e.onInteractOutside, (e) => {
			let t = e.detail.originalEvent, n = t.button === 0 && t.ctrlKey === !0, r = t.button === 2 || n;
			(!i.modal || r) && (o.current = !0);
		}),
		style: {
			...e.style,
			"--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
			"--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
			"--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
}, "DropdownMenuContent")), vn = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeDropdownMenu: n, ...r } = e, i = Y(n);
	return /* @__PURE__ */ (0, z.jsx)(nn, {
		...i,
		...r,
		ref: t
	});
}, "DropdownMenuLabel")), yn = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeDropdownMenu: n, ...r } = e, i = Y(n);
	return /* @__PURE__ */ (0, z.jsx)(rn, {
		...i,
		...r,
		ref: t
	});
}, "DropdownMenuItem")), bn = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeDropdownMenu: n, ...r } = e, i = Y(n);
	return /* @__PURE__ */ (0, z.jsx)(an, {
		...i,
		...r,
		ref: t
	});
}, "DropdownMenuSeparator")), xn = fn, Sn = mn, Cn = hn, wn = _n, Tn = vn, En = yn, Dn = bn, On = Object.defineProperty, kn = (e, t) => On(e, "name", {
	value: t,
	configurable: !0
}), An = "horizontal", jn = ["horizontal", "vertical"], Mn = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ kn(function(e, t) {
	let { decorative: n, orientation: r = An, ...i } = e, a = Nn(r) ? r : An, o = n ? { role: "none" } : {
		"aria-orientation": a === "vertical" ? a : void 0,
		role: "separator"
	};
	return /* @__PURE__ */ (0, z.jsx)(I.div, {
		"data-orientation": a,
		...o,
		...i,
		ref: t
	});
}, "Separator"));
function Nn(e) {
	return jn.includes(e);
}
kn(Nn, "isValidOrientation");
var Pn = Mn, Fn = Object.defineProperty, X = (e, t) => Fn(e, "name", {
	value: t,
	configurable: !0
}), [In, Ln] = ue("Tooltip", [x]), Z = x(), Rn = "TooltipProvider", zn = 700, Bn = "tooltip.open", [Vn, Hn] = In(Rn), Un = /* @__PURE__ */ X((e) => {
	let { __scopeTooltip: t, delayDuration: n = zn, skipDelayDuration: r = 300, disableHoverableContent: i = !1, children: a } = e, o = R.useRef(!0), s = R.useRef(!1), c = R.useRef(0);
	return R.useEffect(() => {
		let e = c.current;
		return () => window.clearTimeout(e);
	}, []), /* @__PURE__ */ (0, z.jsx)(Vn, {
		scope: t,
		isOpenDelayedRef: o,
		delayDuration: n,
		onOpen: R.useCallback(() => {
			r <= 0 || (window.clearTimeout(c.current), o.current = !1);
		}, [r]),
		onClose: R.useCallback(() => {
			r <= 0 || (window.clearTimeout(c.current), c.current = window.setTimeout(() => o.current = !0, r));
		}, [r]),
		isPointerInTransitRef: s,
		onPointerInTransitChange: R.useCallback((e) => {
			s.current = e;
		}, []),
		disableHoverableContent: i,
		children: a
	});
}, "TooltipProvider"), Wn = "Tooltip", [Gn, Q] = In(Wn), Kn = /* @__PURE__ */ X((e) => {
	let { __scopeTooltip: t, children: n, open: r, defaultOpen: i, onOpenChange: a, disableHoverableContent: o, delayDuration: s } = e, c = Hn(Wn, e.__scopeTooltip), l = Z(t), [u, d] = R.useState(null), [f, p] = R.useState(void 0), m = F(), h = R.useRef(0), g = o ?? c.disableHoverableContent, _ = s ?? c.delayDuration, v = R.useRef(!1), [y, b] = le({
		prop: r,
		defaultProp: i ?? !1,
		onChange: /* @__PURE__ */ X((e) => {
			e ? (c.onOpen(), document.dispatchEvent(new CustomEvent(Bn))) : c.onClose(), a?.(e);
		}, "onChange"),
		caller: Wn
	}), x = R.useMemo(() => y ? v.current ? "delayed-open" : "instant-open" : "closed", [y]), S = R.useCallback(() => {
		window.clearTimeout(h.current), h.current = 0, v.current = !1, b(!0);
	}, [b]), C = R.useCallback(() => {
		window.clearTimeout(h.current), h.current = 0, b(!1);
	}, [b]), w = R.useCallback(() => {
		window.clearTimeout(h.current), h.current = window.setTimeout(() => {
			v.current = !0, b(!0), h.current = 0;
		}, _);
	}, [_, b]);
	R.useEffect(() => () => {
		h.current &&= (window.clearTimeout(h.current), 0);
	}, []);
	let T = f ?? m;
	return /* @__PURE__ */ (0, z.jsx)(ye, {
		...l,
		children: /* @__PURE__ */ (0, z.jsx)(Gn, {
			scope: t,
			contentId: T,
			setContentId: p,
			open: y,
			stateAttribute: x,
			trigger: u,
			onTriggerChange: d,
			onTriggerEnter: R.useCallback(() => {
				c.isOpenDelayedRef.current ? w() : S();
			}, [
				c.isOpenDelayedRef,
				w,
				S
			]),
			onTriggerLeave: R.useCallback(() => {
				g ? C() : (window.clearTimeout(h.current), h.current = 0);
			}, [C, g]),
			onOpen: S,
			onClose: C,
			disableHoverableContent: g,
			children: n
		})
	});
}, "Tooltip"), qn = "TooltipTrigger", Jn = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ X(function(e, t) {
	let { __scopeTooltip: n, ...r } = e, i = Q(qn, n), a = Hn(qn, n), o = Z(n), s = R.useRef(null), c = u(t, s, i.onTriggerChange), l = R.useRef(!1), d = R.useRef(!1), f = R.useCallback(() => l.current = !1, []);
	return R.useEffect(() => () => document.removeEventListener("pointerup", f), [f]), /* @__PURE__ */ (0, z.jsx)(k, {
		asChild: !0,
		...o,
		children: /* @__PURE__ */ (0, z.jsx)(I.button, {
			"aria-describedby": i.open ? i.contentId : void 0,
			"data-state": i.stateAttribute,
			...r,
			ref: c,
			onPointerMove: P(e.onPointerMove, (e) => {
				e.pointerType !== "touch" && !d.current && !a.isPointerInTransitRef.current && (i.onTriggerEnter(), d.current = !0);
			}),
			onPointerLeave: P(e.onPointerLeave, () => {
				i.onTriggerLeave(), d.current = !1;
			}),
			onPointerDown: P(e.onPointerDown, () => {
				i.open && i.onClose(), l.current = !0, document.addEventListener("pointerup", f, { once: !0 });
			}),
			onFocus: P(e.onFocus, () => {
				l.current || i.onOpen();
			}),
			onBlur: P(e.onBlur, i.onClose),
			onClick: P(e.onClick, i.onClose)
		})
	});
}, "TooltipTrigger")), Yn = "TooltipPortal", [Xn, Zn] = In(Yn, { forceMount: void 0 }), Qn = /* @__PURE__ */ X((e) => {
	let { __scopeTooltip: t, forceMount: n, children: r, container: i } = e, a = Q(Yn, t);
	return /* @__PURE__ */ (0, z.jsx)(Xn, {
		scope: t,
		forceMount: n,
		children: /* @__PURE__ */ (0, z.jsx)(M, {
			present: n || a.open,
			children: /* @__PURE__ */ (0, z.jsx)(j, {
				asChild: !0,
				container: i,
				children: r
			})
		})
	});
}, "TooltipPortal"), $ = "TooltipContent", $n = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ X(function(e, t) {
	let n = Zn($, e.__scopeTooltip), { forceMount: r = n.forceMount, side: i = "top", ...a } = e, o = Q($, e.__scopeTooltip);
	return /* @__PURE__ */ (0, z.jsx)(M, {
		present: r || o.open,
		children: o.disableHoverableContent ? /* @__PURE__ */ (0, z.jsx)(nr, {
			side: i,
			...a,
			ref: t
		}) : /* @__PURE__ */ (0, z.jsx)(er, {
			side: i,
			...a,
			ref: t
		})
	});
}, "TooltipContent")), er = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ X(function(e, t) {
	let n = Q($, e.__scopeTooltip), r = Hn($, e.__scopeTooltip), i = R.useRef(null), a = u(t, i), [o, s] = R.useState(null), { trigger: c, onClose: l } = n, d = i.current, { onPointerInTransitChange: f } = r, p = R.useCallback(() => {
		s(null), f(!1);
	}, [f]), m = R.useCallback((e, t) => {
		let n = e.currentTarget, r = {
			x: e.clientX,
			y: e.clientY
		}, i = ar(r, ir(r, n.getBoundingClientRect())), a = or(t.getBoundingClientRect()), o = cr([...i, ...a]);
		s(o), f(!0);
	}, [f]);
	return R.useEffect(() => () => p(), [p]), R.useEffect(() => {
		if (c && d) {
			let e = /* @__PURE__ */ X((e) => m(e, d), "handleTriggerLeave"), t = /* @__PURE__ */ X((e) => m(e, c), "handleContentLeave");
			return c.addEventListener("pointerleave", e), d.addEventListener("pointerleave", t), () => {
				c.removeEventListener("pointerleave", e), d.removeEventListener("pointerleave", t);
			};
		}
	}, [
		c,
		d,
		m,
		p
	]), R.useEffect(() => {
		if (o) {
			let e = /* @__PURE__ */ X((e) => {
				let t = e.target, n = {
					x: e.clientX,
					y: e.clientY
				}, r = c?.contains(t) || d?.contains(t), i = !sr(n, o);
				r ? p() : i && (p(), l());
			}, "handleTrackPointerGrace");
			return document.addEventListener("pointermove", e), () => document.removeEventListener("pointermove", e);
		}
	}, [
		c,
		d,
		o,
		l,
		p
	]), /* @__PURE__ */ (0, z.jsx)(nr, {
		...e,
		ref: a
	});
}, "TooltipContentHoverable")), tr = a("TooltipContent"), nr = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ X(function(e, t) {
	let { __scopeTooltip: n, children: r, "aria-label": i, id: a, onEscapeKeyDown: o, onPointerDownOutside: s, ...c } = e, l = Q($, n), u = Z(n), { onClose: d } = l;
	R.useEffect(() => (document.addEventListener(Bn, d), () => document.removeEventListener(Bn, d)), [d]), R.useEffect(() => {
		if (l.trigger) {
			let e = /* @__PURE__ */ X((e) => {
				e.target instanceof Node && e.target.contains(l.trigger) && d();
			}, "handleScroll");
			return window.addEventListener("scroll", e, { capture: !0 }), () => window.removeEventListener("scroll", e, { capture: !0 });
		}
	}, [l.trigger, d]);
	let { setContentId: f } = l;
	return ve(() => (f(a), () => {
		f(void 0);
	}), [a, f]), /* @__PURE__ */ (0, z.jsx)(xe, {
		asChild: !0,
		disableOutsidePointerEvents: !1,
		onEscapeKeyDown: o,
		onPointerDownOutside: s,
		onFocusOutside: (e) => e.preventDefault(),
		onDismiss: d,
		children: /* @__PURE__ */ (0, z.jsxs)(S, {
			"data-state": l.stateAttribute,
			role: i ? void 0 : "tooltip",
			id: i ? void 0 : l.contentId,
			...u,
			...c,
			ref: t,
			style: {
				...c.style,
				"--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
				"--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
				"--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
				"--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
				"--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
			},
			children: [/* @__PURE__ */ (0, z.jsx)(tr, { children: r }), i ? /* @__PURE__ */ (0, z.jsx)(ie, {
				id: l.contentId,
				role: "tooltip",
				children: i
			}) : null]
		})
	});
}, "TooltipContentImpl")), rr = /* @__PURE__ */ R.forwardRef(/* @__PURE__ */ X(function(e, t) {
	let { __scopeTooltip: n, ...r } = e, i = Z(n);
	return /* @__PURE__ */ (0, z.jsx)(y, {
		...i,
		...r,
		ref: t
	});
}, "TooltipArrow"));
function ir(e, t) {
	let n = Math.abs(t.top - e.y), r = Math.abs(t.bottom - e.y), i = Math.abs(t.right - e.x), a = Math.abs(t.left - e.x);
	switch (Math.min(n, r, i, a)) {
		case a: return "left";
		case i: return "right";
		case n: return "top";
		case r: return "bottom";
		default: throw Error("unreachable");
	}
}
X(ir, "getExitSideFromRect");
function ar(e, t, n = 5) {
	let r = [];
	switch (t) {
		case "top":
			r.push({
				x: e.x - n,
				y: e.y + n
			}, {
				x: e.x + n,
				y: e.y + n
			});
			break;
		case "bottom":
			r.push({
				x: e.x - n,
				y: e.y - n
			}, {
				x: e.x + n,
				y: e.y - n
			});
			break;
		case "left":
			r.push({
				x: e.x + n,
				y: e.y - n
			}, {
				x: e.x + n,
				y: e.y + n
			});
			break;
		case "right": r.push({
			x: e.x - n,
			y: e.y - n
		}, {
			x: e.x - n,
			y: e.y + n
		});
	}
	return r;
}
X(ar, "getPaddedExitPoints");
function or(e) {
	let { top: t, right: n, bottom: r, left: i } = e;
	return [
		{
			x: i,
			y: t
		},
		{
			x: n,
			y: t
		},
		{
			x: n,
			y: r
		},
		{
			x: i,
			y: r
		}
	];
}
X(or, "getPointsFromRect");
function sr(e, t) {
	let { x: n, y: r } = e, i = !1;
	for (let e = 0, a = t.length - 1; e < t.length; a = e++) {
		let o = t[e], s = t[a], c = o.x, l = o.y, u = s.x, d = s.y;
		l > r != d > r && n < (u - c) * (r - l) / (d - l) + c && (i = !i);
	}
	return i;
}
X(sr, "isPointInPolygon");
function cr(e) {
	let t = e.slice();
	return t.sort((e, t) => e.x < t.x ? -1 : e.x > t.x ? 1 : e.y < t.y ? -1 : +(e.y > t.y)), lr(t);
}
X(cr, "getHull");
function lr(e) {
	if (e.length <= 1) return e.slice();
	let t = [];
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (; t.length >= 2;) {
			let e = t[t.length - 1], n = t[t.length - 2];
			if ((e.x - n.x) * (r.y - n.y) >= (e.y - n.y) * (r.x - n.x)) t.pop();
			else break;
		}
		t.push(r);
	}
	t.pop();
	let n = [];
	for (let t = e.length - 1; t >= 0; t--) {
		let r = e[t];
		for (; n.length >= 2;) {
			let e = n[n.length - 1], t = n[n.length - 2];
			if ((e.x - t.x) * (r.y - t.y) >= (e.y - t.y) * (r.x - t.x)) n.pop();
			else break;
		}
		n.push(r);
	}
	return n.pop(), t.length === 1 && n.length === 1 && t[0].x === n[0].x && t[0].y === n[0].y ? t : t.concat(n);
}
X(lr, "getHullPresorted");
var ur = Un, dr = Kn, fr = Jn, pr = Qn, mr = $n, hr = rr;
//#endregion
//#region frontend/components/ui/tooltip.tsx
function gr({ delayDuration: e = 0, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(ur, {
		"data-slot": "tooltip-provider",
		delayDuration: e,
		...t
	});
}
function _r({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(dr, {
		"data-slot": "tooltip",
		...e
	});
}
function vr({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(fr, {
		"data-slot": "tooltip-trigger",
		...e
	});
}
function yr({ className: e, sideOffset: t = 0, children: n, ...r }) {
	return /* @__PURE__ */ (0, z.jsx)(pr, {
		container: document.getElementById("ui-portal-root"),
		children: /* @__PURE__ */ (0, z.jsxs)(mr, {
			"data-slot": "tooltip-content",
			sideOffset: t,
			className: c("tw:z-50 tw:w-fit tw:origin-(--radix-tooltip-content-transform-origin) tw:animate-in tw:rounded-md tw:bg-foreground tw:px-3 tw:py-1.5 tw:text-xs tw:text-balance tw:text-background tw:fade-in-0 tw:zoom-in-95 tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=closed]:zoom-out-95", e),
			...r,
			children: [n, /* @__PURE__ */ (0, z.jsx)(hr, { className: "tw:z-50 tw:size-2.5 tw:translate-y-[calc(-50%_-_2px)] tw:rotate-45 tw:rounded-[2px] tw:bg-foreground tw:fill-foreground" })]
		})
	});
}
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/arrow-up-right.mjs
var br = {
	name: "arrow-up-right",
	size: 24,
	node: [["path", {
		d: "M7 7h10v10",
		key: "1tivn9"
	}], ["path", {
		d: "M7 17 17 7",
		key: "1vkiza"
	}]]
};
br.node;
var xr = s(br), Sr = {
	name: "building-complex",
	size: 24,
	node: [
		["path", {
			d: "M10 12h4",
			key: "a56b0p"
		}],
		["path", {
			d: "M10 8h4",
			key: "1sr2af"
		}],
		["path", {
			d: "M14 21v-3a2 2 0 0 0-4 0v3",
			key: "1rgiei"
		}],
		["path", {
			d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
			key: "secmi2"
		}],
		["path", {
			d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",
			key: "16ra0t"
		}]
	],
	aliases: ["building-2"]
};
Sr.node;
var Cr = s(Sr), wr = {
	name: "chart-no-axes-combined",
	size: 24,
	node: [
		["path", {
			d: "M12 16v5",
			key: "zza2cw"
		}],
		["path", {
			d: "M16 14.639V21",
			key: "1s85h0"
		}],
		["path", {
			d: "M20 10.656V21",
			key: "q45596"
		}],
		["path", {
			d: "m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15",
			key: "1fw8x9"
		}],
		["path", {
			d: "M4 18.463V21",
			key: "1otddq"
		}],
		["path", {
			d: "M8 14.656V21",
			key: "1t2idw"
		}]
	]
};
wr.node;
var Tr = s(wr), Er = {
	name: "clipboard-list",
	size: 24,
	node: [
		["rect", {
			width: "8",
			height: "4",
			x: "8",
			y: "2",
			rx: "1",
			ry: "1",
			key: "tgr4d6"
		}],
		["path", {
			d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
			key: "116196"
		}],
		["path", {
			d: "M12 11h4",
			key: "1jrz19"
		}],
		["path", {
			d: "M12 16h4",
			key: "n85exb"
		}],
		["path", {
			d: "M8 11h.01",
			key: "1dfujw"
		}],
		["path", {
			d: "M8 16h.01",
			key: "18s6g9"
		}]
	]
};
Er.node;
var Dr = s(Er), Or = {
	name: "file-text",
	size: 24,
	node: [
		["path", {
			d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
			key: "1oefj6"
		}],
		["path", {
			d: "M14 2v5a1 1 0 0 0 1 1h5",
			key: "wfsgrz"
		}],
		["path", {
			d: "M10 9H8",
			key: "b1mrlr"
		}],
		["path", {
			d: "M16 13H8",
			key: "t4e002"
		}],
		["path", {
			d: "M16 17H8",
			key: "z1uh3a"
		}]
	]
};
Or.node;
var kr = s(Or), Ar = {
	name: "layout-dashboard",
	size: 24,
	node: [
		["rect", {
			width: "7",
			height: "9",
			x: "3",
			y: "3",
			rx: "1",
			key: "10lvy0"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "14",
			y: "3",
			rx: "1",
			key: "16une8"
		}],
		["rect", {
			width: "7",
			height: "9",
			x: "14",
			y: "12",
			rx: "1",
			key: "1hutg5"
		}],
		["rect", {
			width: "7",
			height: "5",
			x: "3",
			y: "16",
			rx: "1",
			key: "ldoo1y"
		}]
	]
};
Ar.node;
var jr = s(Ar), Mr = {
	name: "log-out",
	size: 24,
	node: [
		["path", {
			d: "m16 17 5-5-5-5",
			key: "1bji2h"
		}],
		["path", {
			d: "M21 12H9",
			key: "dn1m92"
		}],
		["path", {
			d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
			key: "1uf3rs"
		}]
	]
};
Mr.node;
var Nr = s(Mr), Pr = {
	name: "map-pinned",
	size: 24,
	node: [
		["path", {
			d: "M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 01-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0112 0",
			key: "61byd1"
		}],
		["path", {
			d: "M4.474 15h-.197a1 1 0 00-.969.753l-1.097 4.35a1.5 1.5 0 001.444 1.898L20.344 22a1.5 1.5 0 001.446-1.897l-1.098-4.35a1 1 0 00-.969-.753h-.197",
			key: "1m5apm"
		}],
		["circle", {
			cx: "12",
			cy: "8",
			r: "2",
			key: "1822b1"
		}]
	]
};
Pr.node;
var Fr = s(Pr), Ir = {
	name: "menu",
	size: 24,
	node: [
		["path", {
			d: "M4 5h16",
			key: "1tepv9"
		}],
		["path", {
			d: "M4 12h16",
			key: "1lakjw"
		}],
		["path", {
			d: "M4 19h16",
			key: "1djgab"
		}]
	]
};
Ir.node;
var Lr = s(Ir), Rr = {
	name: "panel-left-close",
	size: 24,
	node: [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M9 3v18",
			key: "fh3hqa"
		}],
		["path", {
			d: "m16 15-3-3 3-3",
			key: "14y99z"
		}]
	],
	aliases: ["sidebar-close"]
};
Rr.node;
var zr = s(Rr), Br = {
	name: "panel-left-open",
	size: 24,
	node: [
		["rect", {
			width: "18",
			height: "18",
			x: "3",
			y: "3",
			rx: "2",
			key: "afitv7"
		}],
		["path", {
			d: "M9 3v18",
			key: "fh3hqa"
		}],
		["path", {
			d: "m14 9 3 3-3 3",
			key: "8010ee"
		}]
	],
	aliases: ["sidebar-open"]
};
Br.node;
var Vr = s(Br), Hr = {
	name: "scale",
	size: 24,
	node: [
		["path", {
			d: "M12 3v18",
			key: "108xh3"
		}],
		["path", {
			d: "m19 8 3 8a5 5 0 0 1-6 0zV7",
			key: "zcdpyk"
		}],
		["path", {
			d: "M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1",
			key: "1yorad"
		}],
		["path", {
			d: "m5 8 3 8a5 5 0 0 1-6 0zV7",
			key: "eua70x"
		}],
		["path", {
			d: "M7 21h10",
			key: "1b0cd5"
		}]
	]
};
Hr.node;
var Ur = s(Hr), Wr = {
	name: "shield-check",
	size: 24,
	node: [["path", {
		d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
		key: "oel41y"
	}], ["path", {
		d: "m9 12 2 2 4-4",
		key: "dzmm74"
	}]]
};
Wr.node;
var Gr = s(Wr), Kr = {
	name: "users",
	size: 24,
	node: [
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["path", {
			d: "M16 3.128a4 4 0 0 1 0 7.744",
			key: "16gr8j"
		}],
		["path", {
			d: "M22 21v-2a4 4 0 0 0-3-3.87",
			key: "kshegd"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}]
	]
};
Kr.node;
var qr = s(Kr);
//#endregion
//#region frontend/components/ui/sheet.tsx
function Jr({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(ne, {
		"data-slot": "sheet",
		...e
	});
}
function Yr({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(se, {
		container: document.getElementById("ui-portal-root"),
		"data-slot": "sheet-portal",
		...e
	});
}
function Xr({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(f, {
		"data-slot": "sheet-overlay",
		className: c("tw:fixed tw:inset-0 tw:z-50 tw:bg-black/50 tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:animate-in tw:data-[state=open]:fade-in-0", e),
		...t
	});
}
function Zr({ className: e, children: t, side: n = "right", showCloseButton: r = !0, ...i }) {
	return /* @__PURE__ */ (0, z.jsxs)(Yr, { children: [/* @__PURE__ */ (0, z.jsx)(Xr, {}), /* @__PURE__ */ (0, z.jsxs)(re, {
		"data-slot": "sheet-content",
		className: c("tw:fixed tw:z-50 tw:flex tw:flex-col tw:gap-4 tw:bg-background tw:shadow-lg tw:transition tw:ease-in-out tw:data-[state=closed]:animate-out tw:data-[state=closed]:duration-300 tw:data-[state=open]:animate-in tw:data-[state=open]:duration-500", n === "right" && "tw:inset-y-0 tw:right-0 tw:h-full tw:w-3/4 tw:border-l tw:data-[state=closed]:slide-out-to-right tw:data-[state=open]:slide-in-from-right tw:sm:max-w-sm", n === "left" && "tw:inset-y-0 tw:left-0 tw:h-full tw:w-3/4 tw:border-r tw:data-[state=closed]:slide-out-to-left tw:data-[state=open]:slide-in-from-left tw:sm:max-w-sm", n === "top" && "tw:inset-x-0 tw:top-0 tw:h-auto tw:border-b tw:data-[state=closed]:slide-out-to-top tw:data-[state=open]:slide-in-from-top", n === "bottom" && "tw:inset-x-0 tw:bottom-0 tw:h-auto tw:border-t tw:data-[state=closed]:slide-out-to-bottom tw:data-[state=open]:slide-in-from-bottom", e),
		...i,
		children: [t, r && /* @__PURE__ */ (0, z.jsxs)(A, {
			className: "tw:absolute tw:top-4 tw:right-4 tw:rounded-xs tw:opacity-70 tw:ring-offset-background tw:transition-opacity tw:hover:opacity-100 tw:focus:ring-2 tw:focus:ring-ring tw:focus:ring-offset-2 tw:focus:outline-hidden tw:disabled:pointer-events-none tw:data-[state=open]:bg-secondary",
			children: [/* @__PURE__ */ (0, z.jsx)(C, { className: "tw:size-4" }), /* @__PURE__ */ (0, z.jsx)("span", {
				className: "tw:sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function Qr({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)("div", {
		"data-slot": "sheet-header",
		className: c("tw:flex tw:flex-col tw:gap-1.5 tw:p-4", e),
		...t
	});
}
function $r({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(Ce, {
		"data-slot": "sheet-title",
		className: c("tw:font-semibold tw:text-foreground", e),
		...t
	});
}
function ei({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(D, {
		"data-slot": "sheet-description",
		className: c("tw:text-sm tw:text-muted-foreground", e),
		...t
	});
}
//#endregion
//#region frontend/components/ui/dropdown-menu.tsx
function ti({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(xn, {
		"data-slot": "dropdown-menu",
		...e
	});
}
function ni({ ...e }) {
	return /* @__PURE__ */ (0, z.jsx)(Sn, {
		"data-slot": "dropdown-menu-trigger",
		...e
	});
}
function ri({ className: e, sideOffset: t = 4, ...n }) {
	return /* @__PURE__ */ (0, z.jsx)(Cn, {
		container: document.getElementById("ui-portal-root"),
		children: /* @__PURE__ */ (0, z.jsx)(wn, {
			"data-slot": "dropdown-menu-content",
			sideOffset: t,
			className: c("tw:z-50 tw:max-h-(--radix-dropdown-menu-content-available-height) tw:min-w-[8rem] tw:origin-(--radix-dropdown-menu-content-transform-origin) tw:overflow-x-hidden tw:overflow-y-auto tw:rounded-md tw:border tw:bg-popover tw:p-1 tw:text-popover-foreground tw:shadow-md tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:animate-in tw:data-[state=open]:fade-in-0 tw:data-[state=open]:zoom-in-95", e),
			...n
		})
	});
}
function ii({ className: e, inset: t, variant: n = "default", ...r }) {
	return /* @__PURE__ */ (0, z.jsx)(En, {
		"data-slot": "dropdown-menu-item",
		"data-inset": t,
		"data-variant": n,
		className: c("tw:relative tw:flex tw:cursor-default tw:items-center tw:gap-2 tw:rounded-sm tw:px-2 tw:py-1.5 tw:text-sm tw:outline-hidden tw:select-none tw:focus:bg-accent tw:focus:text-accent-foreground tw:data-[disabled]:pointer-events-none tw:data-[disabled]:opacity-50 tw:data-[inset]:pl-8 tw:data-[variant=destructive]:text-destructive tw:data-[variant=destructive]:focus:bg-destructive/10 tw:data-[variant=destructive]:focus:text-destructive tw:dark:data-[variant=destructive]:focus:bg-destructive/20 tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4 tw:[&_svg:not([class*=text-])]:text-muted-foreground tw:data-[variant=destructive]:*:[svg]:text-destructive!", e),
		...r
	});
}
function ai({ className: e, inset: t, ...n }) {
	return /* @__PURE__ */ (0, z.jsx)(Tn, {
		"data-slot": "dropdown-menu-label",
		"data-inset": t,
		className: c("tw:px-2 tw:py-1.5 tw:text-sm tw:font-medium tw:data-[inset]:pl-8", e),
		...n
	});
}
function oi({ className: e, ...t }) {
	return /* @__PURE__ */ (0, z.jsx)(Dn, {
		"data-slot": "dropdown-menu-separator",
		className: c("tw:-mx-1 tw:my-1 tw:h-px tw:bg-border", e),
		...t
	});
}
//#endregion
//#region frontend/components/ui/separator.tsx
function si({ className: e, orientation: t = "horizontal", decorative: n = !0, ...r }) {
	return /* @__PURE__ */ (0, z.jsx)(Pn, {
		"data-slot": "separator",
		decorative: n,
		orientation: t,
		className: c("tw:shrink-0 tw:bg-border tw:data-[orientation=horizontal]:h-px tw:data-[orientation=horizontal]:w-full tw:data-[orientation=vertical]:h-full tw:data-[orientation=vertical]:w-px", e),
		...r
	});
}
//#endregion
//#region frontend/components/shell.tsx
var ci = {
	dashboard: jr,
	members: qr,
	committees: Cr,
	assignments: Dr,
	jurisdiction: Fr,
	workload: Ur,
	performance: Tr,
	reports: kr,
	users: Gr
};
function li({ children: e }) {
	let t = window.APP_CONFIG, [n, i] = (0, R.useState)(!1), [a, o] = (0, R.useState)(!1), s = m(), u = Se(async () => {
		await r("logout.php", "POST"), window.location.assign(t.login);
	}), f = t.navigation.filter((e) => l(t, e.permission)), p = t.userEmail.slice(0, 2).toUpperCase() || "SP", h = (/* @__PURE__ */ new Date()).toLocaleDateString("en-PH", {
		timeZone: "Asia/Manila",
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric"
	});
	function g(e = !1) {
		return /* @__PURE__ */ (0, z.jsxs)(z.Fragment, { children: [
			/* @__PURE__ */ (0, z.jsxs)("a", {
				className: "ui-brand",
				href: f.find((e) => e.key === "dashboard")?.href || f[0]?.href || t.login,
				children: [/* @__PURE__ */ (0, z.jsx)("span", {
					className: "ui-brand-emblem",
					children: "SP"
				}), !e && /* @__PURE__ */ (0, z.jsxs)("span", { children: [/* @__PURE__ */ (0, z.jsxs)("strong", { children: ["Committee", /* @__PURE__ */ (0, z.jsx)("span", {
					className: "ui-brand-dot",
					children: "."
				})] }), /* @__PURE__ */ (0, z.jsx)("small", { children: "SANGGUNIANG PANLUNGSOD" })] })]
			}),
			/* @__PURE__ */ (0, z.jsx)(si, { className: "ui-nav-separator" }),
			/* @__PURE__ */ (0, z.jsx)("nav", {
				className: "ui-sidebar-nav",
				"aria-label": "Main navigation",
				children: f.map((n, r) => {
					let i = ci[n.key] || jr, a = /* @__PURE__ */ (0, z.jsxs)("a", {
						href: n.href,
						className: c("ui-nav-link", t.page === n.key && "active"),
						"aria-current": t.page === n.key ? "page" : void 0,
						"aria-label": e ? n.label : void 0,
						children: [
							/* @__PURE__ */ (0, z.jsx)(i, { size: 19 }),
							!e && /* @__PURE__ */ (0, z.jsx)("span", { children: n.label }),
							!e && t.page === n.key && /* @__PURE__ */ (0, z.jsx)("span", { className: "ui-nav-active-dot" })
						]
					});
					return /* @__PURE__ */ (0, z.jsxs)("div", { children: [!e && (r === 0 || f[r - 1].group !== n.group) && /* @__PURE__ */ (0, z.jsx)("p", {
						className: "ui-nav-group",
						children: n.group
					}), e ? /* @__PURE__ */ (0, z.jsxs)(_r, { children: [/* @__PURE__ */ (0, z.jsx)(vr, {
						asChild: !0,
						children: a
					}), /* @__PURE__ */ (0, z.jsx)(yr, {
						side: "right",
						children: n.label
					})] }) : a] }, n.key);
				})
			}),
			/* @__PURE__ */ (0, z.jsxs)("div", {
				className: "ui-sidebar-bottom",
				children: [!e && /* @__PURE__ */ (0, z.jsxs)("div", {
					className: "ui-civic-note",
					children: [
						/* @__PURE__ */ (0, z.jsx)(Gr, { size: 20 }),
						/* @__PURE__ */ (0, z.jsx)("strong", { children: "Built for better governance" }),
						/* @__PURE__ */ (0, z.jsx)("p", { children: "A shared space for a stronger youth community." })
					]
				}), /* @__PURE__ */ (0, z.jsxs)("div", {
					className: "ui-sidebar-user",
					children: [/* @__PURE__ */ (0, z.jsx)("span", {
						className: "ui-avatar",
						children: p
					}), !e && /* @__PURE__ */ (0, z.jsxs)("div", { children: [/* @__PURE__ */ (0, z.jsx)("strong", { children: t.roleLabel }), /* @__PURE__ */ (0, z.jsx)("small", { children: t.userEmail })] })]
				})]
			})
		] });
	}
	return /* @__PURE__ */ (0, z.jsxs)("div", {
		className: c("ui-app-shell", n && "is-collapsed"),
		children: [
			/* @__PURE__ */ (0, z.jsx)("aside", {
				className: "ui-sidebar",
				children: g(n)
			}),
			/* @__PURE__ */ (0, z.jsx)(Jr, {
				open: a,
				onOpenChange: o,
				children: /* @__PURE__ */ (0, z.jsxs)(Zr, {
					side: "left",
					className: "ui-mobile-sidebar tw:bg-[#082d55] tw:text-[#dce8f5] tw:gap-0",
					children: [/* @__PURE__ */ (0, z.jsxs)(Qr, {
						className: "tw:sr-only",
						children: [/* @__PURE__ */ (0, z.jsx)($r, { children: "Navigation" }), /* @__PURE__ */ (0, z.jsx)(ei, { children: "Choose a page in the committee system." })]
					}), g()]
				})
			}),
			/* @__PURE__ */ (0, z.jsxs)("div", {
				className: "ui-app-main",
				children: [
					/* @__PURE__ */ (0, z.jsxs)("header", {
						className: "ui-topbar",
						children: [/* @__PURE__ */ (0, z.jsxs)("div", {
							className: "ui-topbar-breadcrumb",
							children: [
								/* @__PURE__ */ (0, z.jsx)(d, {
									variant: "ghost",
									size: "icon",
									className: "ui-desktop-toggle tw:max-[800px]:hidden",
									"aria-label": n ? "Expand sidebar" : "Collapse sidebar",
									onClick: () => i(!n),
									children: n ? /* @__PURE__ */ (0, z.jsx)(Vr, { size: 18 }) : /* @__PURE__ */ (0, z.jsx)(zr, { size: 18 })
								}),
								/* @__PURE__ */ (0, z.jsx)(d, {
									variant: "ghost",
									size: "icon",
									className: "ui-mobile-toggle tw:hidden tw:max-[800px]:inline-flex",
									"aria-label": "Open navigation",
									onClick: () => o(!0),
									children: /* @__PURE__ */ (0, z.jsx)(Lr, { size: 20 })
								}),
								/* @__PURE__ */ (0, z.jsx)("span", { children: "Workspace" }),
								/* @__PURE__ */ (0, z.jsx)("span", {
									className: "ui-breadcrumb-divider",
									children: "/"
								}),
								/* @__PURE__ */ (0, z.jsx)("strong", { children: t.title })
							]
						}), /* @__PURE__ */ (0, z.jsxs)("div", {
							className: "ui-topbar-right",
							children: [/* @__PURE__ */ (0, z.jsx)("span", {
								className: "ui-today",
								children: h
							}), /* @__PURE__ */ (0, z.jsxs)(ti, { children: [/* @__PURE__ */ (0, z.jsx)(ni, {
								asChild: !0,
								children: /* @__PURE__ */ (0, z.jsxs)(d, {
									variant: "ghost",
									className: "ui-user-trigger tw:h-10 tw:px-2 tw:py-0",
									children: [/* @__PURE__ */ (0, z.jsx)("span", {
										className: "ui-avatar",
										children: p
									}), /* @__PURE__ */ (0, z.jsx)(b, { size: 14 })]
								})
							}), /* @__PURE__ */ (0, z.jsxs)(ri, {
								align: "end",
								className: "tw:max-w-[calc(100vw-2rem)]",
								children: [
									/* @__PURE__ */ (0, z.jsxs)(ai, {
										className: "tw:break-all",
										children: [t.userEmail, /* @__PURE__ */ (0, z.jsx)("p", {
											className: "tw:mt-1 tw:text-xs tw:font-normal tw:text-muted-foreground",
											children: t.roleLabel
										})]
									}),
									/* @__PURE__ */ (0, z.jsx)(oi, {}),
									/* @__PURE__ */ (0, z.jsxs)(ii, {
										disabled: u.isPending,
										onSelect: (e) => {
											e.preventDefault(), u.run().catch((e) => s(e.message, !0));
										},
										children: [/* @__PURE__ */ (0, z.jsx)(Nr, { size: 16 }), u.isPending ? "Signing out…" : "Sign out"]
									})
								]
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, z.jsxs)("main", {
						id: "main-content",
						className: "ui-content",
						children: [/* @__PURE__ */ (0, z.jsxs)("div", {
							className: "ui-page-heading",
							children: [/* @__PURE__ */ (0, z.jsxs)("div", { children: [
								/* @__PURE__ */ (0, z.jsx)("p", {
									className: "ui-eyebrow",
									children: "SP COMMITTEE WORKSPACE"
								}),
								/* @__PURE__ */ (0, z.jsx)("h1", { children: t.title }),
								/* @__PURE__ */ (0, z.jsx)("p", { children: t.description })
							] }), /* @__PURE__ */ (0, z.jsx)("span", {
								className: "ui-page-mark",
								children: /* @__PURE__ */ (0, z.jsx)(xr, { size: 28 })
							})]
						}), e]
					}),
					/* @__PURE__ */ (0, z.jsxs)("footer", {
						className: "ui-footer",
						children: [/* @__PURE__ */ (0, z.jsx)("span", { children: "SP Committee Management System" }), /* @__PURE__ */ (0, z.jsx)("span", { children: "Purposeful work. Stronger communities." })]
					})
				]
			})
		]
	});
}
//#endregion
//#region frontend/app.tsx
var ui = /* @__PURE__ */ e({ App: () => mi }), di = {
	login: () => import("./login-B7kNQ1iU.js"),
	dashboard: () => import("./dashboard-CBnWXmcV.js"),
	members: () => import("./members-B-8bvtVH.js"),
	committees: () => import("./committees-CRbPvxAs.js"),
	assignments: () => import("./assignments-CTDHGII9.js"),
	jurisdiction: () => import("./jurisdiction-pIqD1M0_.js"),
	workload: () => import("./workload-CDX0wxWM.js"),
	performance: () => import("./performance-DQqZSZ_o.js"),
	reports: () => import("./reports-D3-IZG7V.js"),
	users: () => import("./users-BHoKLPSH.js"),
	forbidden: () => import("./forbidden-B0KFy6wT.js")
}, fi = new ke({ defaultOptions: {
	queries: {
		retry: !1,
		refetchOnWindowFocus: !1
	},
	mutations: { retry: !1 }
} }), pi = class extends R.Component {
	state = { failed: !1 };
	static getDerivedStateFromError() {
		return { failed: !0 };
	}
	render() {
		return this.state.failed ? /* @__PURE__ */ (0, z.jsxs)("div", {
			className: "ui-empty",
			role: "alert",
			children: [
				/* @__PURE__ */ (0, z.jsx)("h2", { children: "This page could not start" }),
				/* @__PURE__ */ (0, z.jsx)("p", { children: "Please reload the page. If this continues, check that the complete frontend build was uploaded." }),
				/* @__PURE__ */ (0, z.jsx)("button", {
					className: "ui-reload",
					onClick: () => window.location.reload(),
					children: "Reload page"
				})
			]
		}) : this.props.children;
	}
};
function mi() {
	let e = window.APP_CONFIG, t = (0, R.lazy)(di[e.page] || di.forbidden), n = /* @__PURE__ */ (0, z.jsx)(pi, { children: /* @__PURE__ */ (0, z.jsx)(R.Suspense, {
		fallback: /* @__PURE__ */ (0, z.jsx)(ce, {}),
		children: /* @__PURE__ */ (0, z.jsx)(t, {})
	}) });
	return /* @__PURE__ */ (0, z.jsx)(v, {
		client: fi,
		children: /* @__PURE__ */ (0, z.jsx)(gr, { children: /* @__PURE__ */ (0, z.jsxs)(_e, { children: [/* @__PURE__ */ (0, z.jsx)("a", {
			href: "#main-content",
			className: "ui-skip-link",
			children: "Skip to content"
		}), e.page === "login" ? n : /* @__PURE__ */ (0, z.jsx)(li, { children: n })] }) })
	});
}
//#endregion
export { mi as App, Dr as a, _r as c, it as d, rt as f, kr as i, yr as l, qr as n, Cr as o, Ge as p, Gr as r, xr as s, ui as t, vr as u };
