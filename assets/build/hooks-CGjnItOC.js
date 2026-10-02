import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { c as n, d as r, h as i, l as a, m as o, n as s, p as c, r as l, s as u, t as d, u as f } from "./api-DVPVP-g0.js";
import { t as p } from "./react-dom-O0mraopd.js";
//#region node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var m = /* @__PURE__ */ e(t(), 1), h = i(), g = m.createContext(void 0), _ = (e) => {
	let t = m.useContext(g);
	if (e) return e;
	if (!t) throw Error("No QueryClient set, use QueryClientProvider to set one");
	return t;
}, v = ({ client: e, children: t }) => (m.useEffect(() => (e.mount(), () => {
	e.unmount();
}), [e]), /* @__PURE__ */ (0, h.jsx)(g.Provider, {
	value: e,
	children: t
})), y = {
	setTimeout: (e, t) => setTimeout(e, t),
	clearTimeout: (e) => clearTimeout(e),
	setInterval: (e, t) => setInterval(e, t),
	clearInterval: (e) => clearInterval(e)
}, b = new class {
	#e = y;
	setTimeoutProvider(e) {
		this.#e = e;
	}
	setTimeout(e, t) {
		return this.#e.setTimeout(e, t);
	}
	clearTimeout(e) {
		this.#e.clearTimeout(e);
	}
	setInterval(e, t) {
		return this.#e.setInterval(e, t);
	}
	clearInterval(e) {
		this.#e.clearInterval(e);
	}
}();
function x(e) {
	setTimeout(e, 0);
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/utils.js
var S = typeof window > "u" || "Deno" in globalThis;
function C() {}
function w(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function T(e) {
	return typeof e == "number" && e >= 0 && e !== Infinity;
}
function E(e, t) {
	return Math.max(e + (t || 0) - Date.now(), 0);
}
function D(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function O(e, t) {
	let { type: n = "all", exact: r, fetchStatus: i, predicate: a, queryKey: o, stale: s } = e;
	if (o) {
		if (r) {
			if (t.queryHash !== A(o, t.options)) return !1;
		} else if (!M(t.queryKey, o)) return !1;
	}
	if (n !== "all") {
		let e = t.isActive();
		if (n === "active" && !e || n === "inactive" && e) return !1;
	}
	return !(typeof s == "boolean" && t.isStale() !== s || i && i !== t.state.fetchStatus || a && !a(t));
}
function k(e, t) {
	let { exact: n, status: r, predicate: i, mutationKey: a } = e;
	if (a) {
		if (!t.options.mutationKey) return !1;
		if (n) {
			if (j(t.options.mutationKey) !== j(a)) return !1;
		} else if (!M(t.options.mutationKey, a)) return !1;
	}
	return !(r && t.state.status !== r || i && !i(t));
}
function A(e, t) {
	return (t?.queryKeyHashFn || j)(e);
}
function j(e) {
	return JSON.stringify(e, (e, t) => I(t) ? Object.keys(t).sort().reduce((e, n) => (e[n] = t[n], e), {}) : t);
}
function M(e, t) {
	if (e === t) return !0;
	if (typeof e != typeof t) return !1;
	if (e && t && typeof e == "object" && typeof t == "object") {
		if (Array.isArray(e) && Array.isArray(t)) {
			if (t.length > e.length) return !1;
			for (let n = 0; n < t.length; n++) if (!M(e[n], t[n])) return !1;
			return !0;
		}
		let n = Object.keys(t);
		for (let r of n) if (!M(e[r], t[r])) return !1;
		return !0;
	}
	return !1;
}
var N = Object.prototype.hasOwnProperty;
function P(e, t, n = 0) {
	if (e === t) return e;
	if (n > 500) return t;
	let r = ee(e) && ee(t);
	if (!r && !(I(e) && I(t))) return t;
	let i = (r ? e : Object.keys(e)).length, a = r ? t : Object.keys(t), o = a.length, s = r ? Array(o) : {}, c = 0;
	for (let l = 0; l < o; l++) {
		let o = r ? l : a[l], u = e[o], d = t[o];
		if (u === d) {
			s[o] = u, (r ? l < i : N.call(e, o)) && c++;
			continue;
		}
		if (u === null || d === null || typeof u != "object" || typeof d != "object") {
			s[o] = d;
			continue;
		}
		let f = P(u, d, n + 1);
		s[o] = f, f === u && c++;
	}
	return i === o && c === i ? e : s;
}
function F(e, t) {
	if (!t || Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let n in e) if (e[n] !== t[n]) return !1;
	return !0;
}
function ee(e) {
	return Array.isArray(e) && e.length === Object.keys(e).length;
}
function I(e) {
	if (!L(e)) return !1;
	let t = Object.getPrototypeOf(e), n = t?.constructor;
	if (n === void 0) return !0;
	if (typeof n != "function") return !1;
	let r = n.prototype;
	return !(!L(r) || !r.hasOwnProperty("isPrototypeOf") || t !== Object.prototype);
}
function L(e) {
	return Object.prototype.toString.call(e) === "[object Object]";
}
function te(e) {
	return new Promise((t) => {
		b.setTimeout(t, e);
	});
}
function ne(e, t, n) {
	return typeof n.structuralSharing == "function" ? n.structuralSharing(e, t) : n.structuralSharing === !1 ? t : P(e, t);
}
function re(e, t, n = 0) {
	let r = [...e, t];
	return n && r.length > n ? r.slice(1) : r;
}
function ie(e, t, n = 0) {
	let r = [t, ...e];
	return n && r.length > n ? r.slice(0, -1) : r;
}
var ae = Symbol();
function oe(e, t) {
	return !e.queryFn && t?.initialPromise ? () => t.initialPromise : !e.queryFn || e.queryFn === ae ? () => Promise.reject(/* @__PURE__ */ Error(`Missing queryFn: '${e.queryHash}'`)) : e.queryFn;
}
function se(e, t) {
	return typeof e == "function" ? e(...t) : !!e;
}
function ce(e, t, n) {
	let r = !1, i;
	return Object.defineProperty(e, "signal", {
		enumerable: !0,
		get: () => (i ??= t(), r ? i : (r = !0, i.aborted ? n() : i.addEventListener("abort", n, { once: !0 }), i))
	}), e;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/environmentManager.js
var le = () => S, ue = () => le(), de = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set(), this.subscribe = this.subscribe.bind(this);
	}
	subscribe(e) {
		return this.listeners.add(e), this.onSubscribe(), () => {
			this.listeners.delete(e), this.onUnsubscribe();
		};
	}
	hasListeners() {
		return this.listeners.size > 0;
	}
	onSubscribe() {}
	onUnsubscribe() {}
}, fe = new class extends de {
	#e;
	#t;
	#n;
	constructor() {
		super(), this.#n = (e) => {
			if (typeof window < "u" && window.addEventListener) {
				let t = () => e();
				return window.addEventListener("visibilitychange", t, !1), () => {
					window.removeEventListener("visibilitychange", t);
				};
			}
		};
	}
	onSubscribe() {
		this.#t || this.setEventListener(this.#n);
	}
	onUnsubscribe() {
		this.hasListeners() || (this.#t?.(), this.#t = void 0);
	}
	setEventListener(e) {
		this.#n = e, this.#t?.(), this.#t = e((e) => {
			typeof e == "boolean" ? this.setFocused(e) : this.onFocus();
		});
	}
	setFocused(e) {
		this.#e !== e && (this.#e = e, this.onFocus());
	}
	onFocus() {
		let e = this.isFocused();
		this.listeners.forEach((t) => {
			t(e);
		});
	}
	isFocused() {
		return typeof this.#e == "boolean" ? this.#e : globalThis.document?.visibilityState !== "hidden";
	}
}(), pe = x;
function me() {
	let e = [], t = 0, n = (e) => {
		e();
	}, r = (e) => {
		e();
	}, i = pe, a = (r) => {
		t ? e.push(r) : i(() => {
			n(r);
		});
	}, o = () => {
		let t = e;
		e = [], t.length && i(() => {
			r(() => {
				t.forEach((e) => {
					n(e);
				});
			});
		});
	};
	return {
		batch: (e) => {
			let n;
			t++;
			try {
				n = e();
			} finally {
				t--, t || o();
			}
			return n;
		},
		batchCalls: (e) => (...t) => {
			a(() => {
				e(...t);
			});
		},
		schedule: a,
		setNotifyFunction: (e) => {
			n = e;
		},
		setBatchNotifyFunction: (e) => {
			r = e;
		},
		setScheduler: (e) => {
			i = e;
		}
	};
}
var he = me(), ge = new class extends de {
	#e = !0;
	#t;
	#n;
	constructor() {
		super(), this.#n = (e) => {
			if (typeof window < "u" && window.addEventListener) {
				let t = () => e(!0), n = () => e(!1);
				return window.addEventListener("online", t, !1), window.addEventListener("offline", n, !1), () => {
					window.removeEventListener("online", t), window.removeEventListener("offline", n);
				};
			}
		};
	}
	onSubscribe() {
		this.#t || this.setEventListener(this.#n);
	}
	onUnsubscribe() {
		this.hasListeners() || (this.#t?.(), this.#t = void 0);
	}
	setEventListener(e) {
		this.#n = e, this.#t?.(), this.#t = e(this.setOnline.bind(this));
	}
	setOnline(e) {
		this.#e !== e && (this.#e = e, this.listeners.forEach((t) => {
			t(e);
		}));
	}
	isOnline() {
		return this.#e;
	}
}();
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/retryer.js
function _e(e) {
	return Math.min(1e3 * 2 ** e, 3e4);
}
function ve(e) {
	return (e ?? "online") !== "online" || ge.isOnline();
}
var ye = class extends Error {
	constructor(e) {
		super("CancelledError"), this.revert = e?.revert, this.silent = e?.silent;
	}
};
function be(e) {
	let t = !1, n = 0, r, i = "pending", a, o, s = new Promise((e, t) => {
		a = e, o = t;
	});
	s.catch(C);
	let c = () => i !== "pending", l = (t) => {
		if (!c()) {
			let n = new ye(t);
			h(n), e.onCancel?.(n);
		}
	}, u = () => {
		t = !0;
	}, d = () => {
		t = !1;
	}, f = () => fe.isFocused() && (e.networkMode === "always" || ge.isOnline()) && e.canRun(), p = () => ve(e.networkMode) && e.canRun(), m = (e) => {
		c() || (r?.(), i = "resolved", a(e));
	}, h = (e) => {
		c() || (r?.(), i = "rejected", o(e));
	}, g = () => new Promise((t) => {
		r = (e) => {
			(c() || f()) && t(e);
		}, e.onPause?.();
	}).then(() => {
		r = void 0, c() || e.onContinue?.();
	}), _ = () => {
		if (c()) return;
		let r, i = n === 0 ? e.initialPromise : void 0;
		try {
			r = i ?? e.fn();
		} catch (e) {
			r = Promise.reject(e);
		}
		Promise.resolve(r).then(m).catch((r) => {
			if (c()) return;
			let i = e.retry ?? (ue() ? 0 : 3), a = e.retryDelay ?? _e, o = typeof a == "function" ? a(n, r) : a, s = i === !0 || typeof i == "number" && n < i || typeof i == "function" && i(n, r);
			if (t || !s) {
				h(r);
				return;
			}
			n++, e.onFail?.(n, r), te(o).then(() => f() ? void 0 : g()).then(() => {
				t ? h(r) : _();
			});
		});
	};
	return {
		promise: s,
		status: () => i,
		cancel: l,
		continue: () => (r?.(), s),
		cancelRetry: u,
		continueRetry: d,
		canStart: p,
		start: () => (p() ? _() : g().then(_), s)
	};
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/removable.js
var xe = class {
	#e;
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout(), T(this.gcTime) && (this.#e = b.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime));
	}
	updateGcTime(e) {
		this.gcTime = Math.max(this.gcTime || 0, e ?? (ue() ? Infinity : 3e5));
	}
	clearGcTimeout() {
		this.#e !== void 0 && (b.clearTimeout(this.#e), this.#e = void 0);
	}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js
function Se(e) {
	return { onFetch: (t, n) => {
		let r = t.options, i = t.fetchOptions?.meta?.fetchMore?.direction, a = t.state.data?.pages || [], o = t.state.data?.pageParams || [], s = {
			pages: [],
			pageParams: []
		}, c = 0, l = async () => {
			let n = !1, l = (e) => {
				ce(e, () => t.signal, () => n = !0);
			}, u = oe(t.options, t.fetchOptions), d = async (e, r, i) => {
				if (n) return Promise.reject(t.signal.reason);
				if (r == null && e.pages.length) return Promise.resolve(e);
				let a = (() => {
					let e = {
						client: t.client,
						queryKey: t.queryKey,
						pageParam: r,
						direction: i ? "backward" : "forward",
						meta: t.options.meta
					};
					return l(e), e;
				})(), o = await u(a), { maxPages: s } = t.options, c = i ? ie : re;
				return {
					pages: c(e.pages, o, s),
					pageParams: c(e.pageParams, r, s)
				};
			};
			if (i && a.length) {
				let e = i === "backward", t = e ? we : Ce, n = {
					pages: a,
					pageParams: o
				};
				s = await d(n, t(r, n), e);
			} else {
				let t = e ?? a.length;
				do {
					let e = c === 0 ? o[0] ?? r.initialPageParam : Ce(r, s);
					if (c > 0 && e == null) break;
					s = await d(s, e), c++;
				} while (c < t);
			}
			return s;
		};
		t.fetchFn = t.options.persister ? () => t.options.persister?.(l, {
			client: t.client,
			queryKey: t.queryKey,
			meta: t.options.meta,
			signal: t.signal
		}, n) : l;
	} };
}
function Ce(e, { pages: t, pageParams: n }) {
	let r = t.length - 1;
	return t.length > 0 ? e.getNextPageParam(t[r], t, n[r], n) : void 0;
}
function we(e, { pages: t, pageParams: n }) {
	return t.length > 0 ? e.getPreviousPageParam?.(t[0], t, n[0], n) : void 0;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/query.js
var Te = class extends xe {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	constructor(e) {
		super(), this.#s = !1, this.#o = e.defaultOptions, this.setOptions(e.options), this.observers = [], this.#i = e.client, this.#r = this.#i.getQueryCache(), this.queryKey = e.queryKey, this.queryHash = e.queryHash, this.#t = Oe(this.options), this.state = e.state ?? this.#t, this.scheduleGc();
	}
	get meta() {
		return this.options.meta;
	}
	get queryType() {
		return this.#e;
	}
	get promise() {
		return this.#a?.promise;
	}
	setOptions(e) {
		if (this.options = {
			...this.#o,
			...e
		}, e?._type && (this.#e = e._type), this.updateGcTime(this.options.gcTime), this.state && this.state.data === void 0) {
			let e = Oe(this.options);
			e.data !== void 0 && (this.setState(De(e.data, e.dataUpdatedAt)), this.#t = e);
		}
	}
	optionalRemove() {
		!this.observers.length && this.state.fetchStatus === "idle" && this.#r.remove(this);
	}
	setData(e, t) {
		let n = ne(this.state.data, e, this.options);
		return this.#c({
			data: n,
			type: "success",
			dataUpdatedAt: t?.updatedAt,
			manual: t?.manual
		}), n;
	}
	setState(e) {
		this.#c({
			type: "setState",
			state: e
		});
	}
	cancel(e) {
		let t = this.#a?.promise;
		return this.#a?.cancel(e), t ? t.then(C).catch(C) : Promise.resolve();
	}
	destroy() {
		super.destroy(), this.cancel({ silent: !0 });
	}
	get resetState() {
		return this.#t;
	}
	reset() {
		this.destroy(), this.setState(this.resetState);
	}
	isActive() {
		return this.observers.some((e) => D(e.options.enabled, this) !== !1);
	}
	isDisabled() {
		return this.getObserversCount() > 0 ? !this.isActive() : this.options.queryFn === ae || !this.isFetched();
	}
	isFetched() {
		return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
	}
	isStatic() {
		return this.getObserversCount() > 0 && this.observers.some((e) => D(e.options.staleTime, this) === "static");
	}
	isStale() {
		return this.getObserversCount() > 0 ? this.observers.some((e) => e.getCurrentResult().isStale) : this.state.data === void 0 || this.state.isInvalidated;
	}
	isStaleByTime(e = 0) {
		return this.state.data === void 0 ? !0 : e === "static" ? !1 : this.state.isInvalidated ? !0 : !E(this.state.dataUpdatedAt, e);
	}
	onFocus() {
		this.observers.find((e) => e.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: !1 }), this.#a?.continue();
	}
	onOnline() {
		this.observers.find((e) => e.shouldFetchOnReconnect())?.refetch({ cancelRefetch: !1 }), this.#a?.continue();
	}
	addObserver(e) {
		this.observers.includes(e) || (this.observers.push(e), this.clearGcTimeout(), this.#r.notify({
			type: "observerAdded",
			query: this,
			observer: e
		}));
	}
	removeObserver(e) {
		let t = this.observers.indexOf(e);
		t !== -1 && (this.observers.splice(t, 1), this.observers.length || (this.#a && (this.#s || this.state.fetchStatus === "paused" && this.state.status === "pending" ? this.#a.cancel({ revert: !0 }) : this.#a.cancelRetry()), this.scheduleGc()), this.#r.notify({
			type: "observerRemoved",
			query: this,
			observer: e
		}));
	}
	getObserversCount() {
		return this.observers.length;
	}
	invalidate() {
		this.state.isInvalidated || this.#c({ type: "invalidate" });
	}
	async fetch(e, t) {
		if (this.state.fetchStatus !== "idle" && this.#a?.status() !== "rejected") {
			if (this.state.data !== void 0 && t?.cancelRefetch) this.cancel({ silent: !0 });
			else if (this.#a) return this.#a.continueRetry(), this.#a.promise;
		}
		if (e && this.setOptions(e), !this.options.queryFn) {
			let e = this.observers.find((e) => e.options.queryFn);
			e && this.setOptions(e.options);
		}
		let n = new AbortController(), r = (e) => {
			Object.defineProperty(e, "signal", {
				enumerable: !0,
				get: () => (this.#s = !0, n.signal)
			});
		}, i = () => {
			let e = oe(this.options, t), n = (() => {
				let e = {
					client: this.#i,
					queryKey: this.queryKey,
					meta: this.meta
				};
				return r(e), e;
			})();
			return this.#s = !1, this.options.persister ? this.options.persister(e, n, this) : e(n);
		}, a = (() => {
			let e = {
				fetchOptions: t,
				options: this.options,
				queryKey: this.queryKey,
				client: this.#i,
				state: this.state,
				fetchFn: i
			};
			return r(e), e;
		})();
		(this.#e === "infinite" ? Se(this.options.pages) : this.options.behavior)?.onFetch(a, this), this.#n = this.state, (this.state.fetchStatus === "idle" || this.state.fetchMeta !== a.fetchOptions?.meta) && this.#c({
			type: "fetch",
			meta: a.fetchOptions?.meta
		});
		let o = this.#a = be({
			initialPromise: t?.initialPromise,
			fn: a.fetchFn,
			onCancel: (e) => {
				e instanceof ye && e.revert && this.setState({
					...this.#n,
					fetchStatus: "idle"
				}), n.abort();
			},
			onFail: (e, t) => {
				this.#c({
					type: "failed",
					failureCount: e,
					error: t
				});
			},
			onPause: () => {
				this.#c({ type: "pause" });
			},
			onContinue: () => {
				this.#c({ type: "continue" });
			},
			retry: a.options.retry,
			retryDelay: a.options.retryDelay,
			networkMode: a.options.networkMode,
			canRun: () => !0
		});
		try {
			let e = await o.start();
			if (e === void 0) throw Error(`${this.queryHash} data is undefined`);
			return this.setData(e), this.#r.config.onSuccess?.(e, this), this.#r.config.onSettled?.(e, this.state.error, this), e;
		} catch (e) {
			if (e instanceof ye) {
				if (e.silent) return this.#a.promise;
				if (e.revert) {
					if (this.state.data === void 0) throw e;
					return this.state.data;
				}
			}
			throw this.#c({
				type: "error",
				error: e
			}), this.#r.config.onError?.(e, this), this.#r.config.onSettled?.(this.state.data, e, this), e;
		} finally {
			this.#a === o && (this.#a = void 0), this.scheduleGc();
		}
	}
	#c(e) {
		let t = (t) => {
			switch (e.type) {
				case "failed": return {
					...t,
					fetchFailureCount: e.failureCount,
					fetchFailureReason: e.error
				};
				case "pause": return {
					...t,
					fetchStatus: "paused"
				};
				case "continue": return {
					...t,
					fetchStatus: "fetching"
				};
				case "fetch": return {
					...t,
					...Ee(t.data, this.options),
					fetchMeta: e.meta ?? null
				};
				case "success":
					let n = {
						...t,
						...De(e.data, e.dataUpdatedAt),
						dataUpdateCount: t.dataUpdateCount + 1,
						...!e.manual && {
							fetchStatus: "idle",
							fetchFailureCount: 0,
							fetchFailureReason: null
						}
					};
					return this.#n = e.manual ? n : void 0, n;
				case "error":
					let r = e.error;
					return {
						...t,
						error: r,
						errorUpdateCount: t.errorUpdateCount + 1,
						errorUpdatedAt: Date.now(),
						fetchFailureCount: t.fetchFailureCount + 1,
						fetchFailureReason: r,
						fetchStatus: "idle",
						status: "error",
						isInvalidated: !0
					};
				case "invalidate": return {
					...t,
					isInvalidated: !0
				};
				case "setState": return {
					...t,
					...e.state
				};
			}
		};
		this.state = t(this.state), he.batch(() => {
			this.observers.slice().forEach((e) => {
				e.onQueryUpdate();
			}), this.#r.notify({
				query: this,
				type: "updated",
				action: e
			});
		});
	}
};
function Ee(e, t) {
	return {
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchStatus: ve(t.networkMode) ? "fetching" : "paused",
		...e === void 0 && {
			error: null,
			status: "pending"
		}
	};
}
function De(e, t) {
	return {
		data: e,
		dataUpdatedAt: t ?? Date.now(),
		error: null,
		isInvalidated: !1,
		status: "success"
	};
}
function Oe(e) {
	let t = typeof e.initialData == "function" ? e.initialData() : e.initialData, n = t !== void 0, r = n ? typeof e.initialDataUpdatedAt == "function" ? e.initialDataUpdatedAt() : e.initialDataUpdatedAt : 0;
	return {
		data: t,
		dataUpdateCount: 0,
		dataUpdatedAt: n ? r ?? Date.now() : 0,
		error: null,
		errorUpdateCount: 0,
		errorUpdatedAt: 0,
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchMeta: null,
		isInvalidated: !1,
		status: n ? "success" : "pending",
		fetchStatus: "idle"
	};
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryObserver.js
var ke = class extends de {
	#e;
	#t = void 0;
	#n = void 0;
	#r = void 0;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	#f;
	#p = /* @__PURE__ */ new Set();
	constructor(e, t) {
		super(), this.options = t, this.#e = e, this.#o = null, this.bindMethods(), this.setOptions(t);
	}
	bindMethods() {
		this.refetch = this.refetch.bind(this);
	}
	onSubscribe() {
		this.listeners.size === 1 && (this.#t.addObserver(this), je(this.#t, this.options) ? this.#m() : this.updateResult(), this.#y());
	}
	onUnsubscribe() {
		this.hasListeners() || this.destroy();
	}
	shouldFetchOnReconnect() {
		return Me(this.#t, this.options, this.options.refetchOnReconnect);
	}
	shouldFetchOnWindowFocus() {
		return Me(this.#t, this.options, this.options.refetchOnWindowFocus);
	}
	destroy() {
		this.listeners = /* @__PURE__ */ new Set(), this.#b(), this.#x(), this.#t.removeObserver(this);
	}
	setOptions(e) {
		let t = this.options, n = this.#t;
		if (this.options = this.#e.defaultQueryOptions(e), this.options.enabled !== void 0 && typeof this.options.enabled != "boolean" && typeof this.options.enabled != "function" && typeof D(this.options.enabled, this.#t) != "boolean") throw Error("Expected enabled to be a boolean or a callback that returns a boolean");
		this.#S(), this.#t.setOptions(this.options), t._defaulted && !F(this.options, t) && this.#e.getQueryCache().notify({
			type: "observerOptionsUpdated",
			query: this.#t,
			observer: this
		});
		let r = this.hasListeners();
		r && Ne(this.#t, n, this.options, t) && this.#m(), this.updateResult(), r && (this.#t !== n || D(this.options.enabled, this.#t) !== D(t.enabled, this.#t) || D(this.options.staleTime, this.#t) !== D(t.staleTime, this.#t)) && this.#g();
		let i = this.#_();
		r && (this.#t !== n || D(this.options.enabled, this.#t) !== D(t.enabled, this.#t) || i !== this.#f) && this.#v(i);
	}
	getOptimisticResult(e) {
		let t = this.#e.getQueryCache().build(this.#e, e), n = this.createResult(t, e);
		return F(this.getCurrentResult(), n) || (this.#r = n, this.#a = this.options, this.#i = this.#t.state), n;
	}
	getCurrentResult() {
		return this.#r;
	}
	trackResult(e, t) {
		return new Proxy(e, { get: (e, n) => (this.trackProp(n), t?.(n), Reflect.get(e, n)) });
	}
	trackProp(e) {
		this.#p.add(e);
	}
	getCurrentQuery() {
		return this.#t;
	}
	refetch({ ...e } = {}) {
		return this.fetch({ ...e });
	}
	fetchOptimistic(e) {
		let t = this.#e.defaultQueryOptions(e), n = this.#e.getQueryCache().build(this.#e, t), r = () => {}, i, a = new Promise((e) => {
			i = e, r = this.#e.getQueryCache().subscribe((i) => {
				i.type === "updated" && i.query.queryHash === n.queryHash && n.state.data !== void 0 && (r(), e(this.createResult(n, t)));
			});
		});
		return Promise.race([n.fetch().then(() => {
			let e = this.createResult(n, t);
			return i?.(e), e;
		}).finally(() => {
			r();
		}), a]);
	}
	fetch(e) {
		return this.#m({
			...e,
			cancelRefetch: e.cancelRefetch ?? !0
		}).then(() => (this.updateResult(), this.#r));
	}
	#m(e) {
		this.#S();
		let t = this.#t.fetch(this.options, e);
		return e?.throwOnError || (t = t.catch(C)), t;
	}
	#h(e) {
		return !ue() && D(this.options.enabled, this.#t) !== !1 && T(e);
	}
	#g() {
		this.#b();
		let e = D(this.options.staleTime, this.#t);
		if (this.#r.isStale || !this.#h(e)) return;
		let t = E(this.#r.dataUpdatedAt, e) + 1;
		this.#u = b.setTimeout(() => {
			this.#r.isStale || this.updateResult();
		}, t);
	}
	#_() {
		return D(this.options.refetchInterval, this.#t) ?? !1;
	}
	#v(e) {
		this.#x(), this.#f = e, this.#f !== 0 && this.#h(this.#f) && (this.#d = b.setInterval(() => {
			(this.options.refetchIntervalInBackground || fe.isFocused()) && this.#m();
		}, this.#f));
	}
	#y() {
		this.#g(), this.#v(this.#_());
	}
	#b() {
		this.#u !== void 0 && (b.clearTimeout(this.#u), this.#u = void 0);
	}
	#x() {
		this.#d !== void 0 && (b.clearInterval(this.#d), this.#d = void 0);
	}
	createResult(e, t) {
		let n = this.#t, r = this.options, i = this.#r, a = this.#i, o = this.#a, s = e === n ? this.#n : e.state, { state: c } = e, l = { ...c }, u = !1, d;
		if (t._optimisticResults) {
			let i = this.hasListeners(), a = !i && je(e, t), o = i && Ne(e, n, t, r);
			(a || o) && (l = {
				...l,
				...Ee(c.data, e.options)
			}), t._optimisticResults === "isRestoring" && (l.fetchStatus = "idle");
		}
		let { error: f, errorUpdatedAt: p, status: m } = l;
		d = l.data;
		let h = !1;
		if (t.placeholderData !== void 0 && d === void 0 && m === "pending") {
			let e;
			i?.isPlaceholderData && t.placeholderData === o?.placeholderData ? (e = i.data, h = !0) : e = typeof t.placeholderData == "function" ? t.placeholderData(this.#l?.state.data, this.#l) : t.placeholderData, e !== void 0 && (m = "success", d = ne(i?.data, e, t), u = !0);
		}
		if (t.select && d !== void 0 && !h) {
			if (i && d === a?.data && t.select === this.#s) d = this.#c;
			else try {
				this.#s = t.select, d = t.select(d), d = ne(i?.data, d, t), this.#c = d, this.#o = null;
			} catch (e) {
				this.#o = e;
			}
		} else d === void 0 && (this.#o = null);
		this.#o && (f = this.#o, d = this.#c, p = Date.now(), m = "error", u = !1);
		let g = l.fetchStatus === "fetching", _ = m === "pending", v = m === "error", y = _ && g, b = d !== void 0;
		return {
			status: m,
			fetchStatus: l.fetchStatus,
			isPending: _,
			isSuccess: m === "success",
			isError: v,
			isInitialLoading: y,
			isLoading: y,
			data: d,
			dataUpdatedAt: l.dataUpdatedAt,
			error: f,
			errorUpdatedAt: p,
			failureCount: l.fetchFailureCount,
			failureReason: l.fetchFailureReason,
			errorUpdateCount: l.errorUpdateCount,
			isFetched: e.isFetched(),
			isFetchedAfterMount: l.dataUpdateCount > s.dataUpdateCount || l.errorUpdateCount > s.errorUpdateCount,
			isFetching: g,
			isRefetching: g && !_,
			isLoadingError: v && !b,
			isPaused: l.fetchStatus === "paused",
			isPlaceholderData: u,
			isRefetchError: v && b,
			isStale: Pe(e, t),
			refetch: this.refetch,
			isEnabled: D(t.enabled, e) !== !1
		};
	}
	updateResult() {
		let e = this.#r, t = this.createResult(this.#t, this.options);
		if (this.#i = this.#t.state, this.#a = this.options, this.#i.data !== void 0 && (this.#l = this.#t), F(t, e)) return;
		this.#r = t;
		let n = (() => {
			if (!e) return !0;
			let { notifyOnChangeProps: t } = this.options, n = typeof t == "function" ? t() : t;
			if (n === "all" || !n && !this.#p.size) return !0;
			let r = new Set(n ?? this.#p);
			return this.options.throwOnError && r.add("error"), Object.keys(this.#r).some((t) => {
				let n = t;
				return this.#r[n] !== e[n] && r.has(n);
			});
		})();
		he.batch(() => {
			n && this.listeners.forEach((e) => {
				e(this.#r);
			}), this.#e.getQueryCache().notify({
				query: this.#t,
				type: "observerResultsUpdated"
			});
		});
	}
	#S() {
		let e = this.#e.getQueryCache().build(this.#e, this.options);
		if (e === this.#t) return;
		let t = this.#t;
		this.#t = e, this.#n = e.state, this.hasListeners() && (t?.removeObserver(this), e.addObserver(this));
	}
	onQueryUpdate() {
		this.updateResult(), this.hasListeners() && this.#y();
	}
};
function Ae(e, t) {
	return D(t.enabled, e) !== !1 && e.state.data === void 0 && (e.state.status !== "error" || D(t.retryOnMount, e) !== !1);
}
function je(e, t) {
	return Ae(e, t) || e.state.data !== void 0 && Me(e, t, t.refetchOnMount);
}
function Me(e, t, n) {
	if (D(t.enabled, e) !== !1 && D(t.staleTime, e) !== "static") {
		let r = D(n, e);
		return r === "always" || r !== !1 && Pe(e, t);
	}
	return !1;
}
function Ne(e, t, n, r) {
	return (e !== t || D(r.enabled, e) === !1) && (!n.suspense || e.state.status !== "error") && Pe(e, n);
}
function Pe(e, t) {
	return D(t.enabled, e) !== !1 && e.isStaleByTime(D(t.staleTime, e));
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/mutation.js
var Fe = class extends xe {
	#e;
	#t;
	#n;
	#r;
	constructor(e) {
		super(), this.#e = e.client, this.mutationId = e.mutationId, this.#n = e.mutationCache, this.#t = [], this.state = e.state || Ie(), this.setOptions(e.options), this.scheduleGc();
	}
	setOptions(e) {
		this.options = e, this.updateGcTime(this.options.gcTime);
	}
	get meta() {
		return this.options.meta;
	}
	addObserver(e) {
		this.#t.includes(e) || (this.#t.push(e), this.clearGcTimeout(), this.#n.notify({
			type: "observerAdded",
			mutation: this,
			observer: e
		}));
	}
	removeObserver(e) {
		this.#t = this.#t.filter((t) => t !== e), this.scheduleGc(), this.#n.notify({
			type: "observerRemoved",
			mutation: this,
			observer: e
		});
	}
	optionalRemove() {
		this.#t.length || (this.state.status === "pending" ? this.scheduleGc() : this.#n.remove(this));
	}
	continue() {
		return this.#r?.continue() ?? (this.state.status === "pending" ? this.execute(this.state.variables) : Promise.resolve());
	}
	async execute(e) {
		let t = () => {
			this.#i({ type: "continue" });
		}, n = {
			client: this.#e,
			meta: this.options.meta,
			mutationKey: this.options.mutationKey
		}, r = this.#r = be({
			fn: () => this.options.mutationFn ? this.options.mutationFn(e, n) : Promise.reject(/* @__PURE__ */ Error("No mutationFn found")),
			onFail: (e, t) => {
				this.#i({
					type: "failed",
					failureCount: e,
					error: t
				});
			},
			onPause: () => {
				this.#i({ type: "pause" });
			},
			onContinue: t,
			retry: this.options.retry ?? 0,
			retryDelay: this.options.retryDelay,
			networkMode: this.options.networkMode,
			canRun: () => this.#n.canRun(this)
		}), i = this.state.status === "pending", a = !r.canStart();
		try {
			if (i) t();
			else {
				this.#i({
					type: "pending",
					variables: e,
					isPaused: a
				}), this.#n.config.onMutate && await this.#n.config.onMutate(e, this, n);
				let t = await this.options.onMutate?.(e, n);
				t !== this.state.context && this.#i({
					type: "pending",
					context: t,
					variables: e,
					isPaused: a
				});
			}
			let o = await r.start();
			return await this.#n.config.onSuccess?.(o, e, this.state.context, this, n), await this.options.onSuccess?.(o, e, this.state.context, n), await this.#n.config.onSettled?.(o, null, this.state.variables, this.state.context, this, n), await this.options.onSettled?.(o, null, e, this.state.context, n), this.#i({
				type: "success",
				data: o
			}), o;
		} catch (t) {
			try {
				await this.#n.config.onError?.(t, e, this.state.context, this, n);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onError?.(t, e, this.state.context, n);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.#n.config.onSettled?.(void 0, t, this.state.variables, this.state.context, this, n);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onSettled?.(void 0, t, e, this.state.context, n);
			} catch (e) {
				Promise.reject(e);
			}
			throw this.#i({
				type: "error",
				error: t
			}), t;
		} finally {
			this.#r === r && (this.#r = void 0), this.#n.runNext(this);
		}
	}
	#i(e) {
		let t = (t) => {
			switch (e.type) {
				case "failed": return {
					...t,
					failureCount: e.failureCount,
					failureReason: e.error
				};
				case "pause": return {
					...t,
					isPaused: !0
				};
				case "continue": return {
					...t,
					isPaused: !1
				};
				case "pending": return {
					...t,
					context: e.context,
					data: void 0,
					failureCount: 0,
					failureReason: null,
					error: null,
					isPaused: e.isPaused,
					status: "pending",
					variables: e.variables,
					submittedAt: Date.now()
				};
				case "success": return {
					...t,
					data: e.data,
					failureCount: 0,
					failureReason: null,
					error: null,
					status: "success",
					isPaused: !1
				};
				case "error": return {
					...t,
					data: void 0,
					error: e.error,
					failureCount: t.failureCount + 1,
					failureReason: e.error,
					isPaused: !1,
					status: "error"
				};
			}
		};
		this.state = t(this.state), he.batch(() => {
			this.#t.forEach((t) => {
				t.onMutationUpdate(e);
			}), this.#n.notify({
				mutation: this,
				type: "updated",
				action: e
			});
		});
	}
};
function Ie() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		failureReason: null,
		isPaused: !1,
		status: "idle",
		variables: void 0,
		submittedAt: 0
	};
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/mutationObserver.js
var Le = class extends de {
	#e;
	#t = void 0;
	#n;
	#r;
	constructor(e, t) {
		super(), this.#e = e, this.setOptions(t), this.bindMethods(), this.#i();
	}
	bindMethods() {
		this.mutate = this.mutate.bind(this), this.reset = this.reset.bind(this);
	}
	setOptions(e) {
		let t = this.options;
		this.options = this.#e.defaultMutationOptions(e), F(this.options, t) || this.#e.getMutationCache().notify({
			type: "observerOptionsUpdated",
			mutation: this.#n,
			observer: this
		}), t?.mutationKey && this.options.mutationKey && j(t.mutationKey) !== j(this.options.mutationKey) ? this.reset() : this.#n?.state.status === "pending" && this.#n.setOptions(this.options);
	}
	onSubscribe() {
		this.listeners.size === 1 && this.#n && (this.#n.addObserver(this), this.#i());
	}
	onUnsubscribe() {
		this.hasListeners() || this.#n?.removeObserver(this);
	}
	onMutationUpdate(e) {
		this.#i(), this.#a(e);
	}
	getCurrentResult() {
		return this.#t;
	}
	reset() {
		this.#n?.removeObserver(this), this.#n = void 0, this.#i(), this.#a();
	}
	mutate(e, t) {
		return this.#r = t, this.#n?.removeObserver(this), this.#n = this.#e.getMutationCache().build(this.#e, this.options), this.#n.addObserver(this), this.#n.execute(e);
	}
	#i() {
		let e = this.#n?.state ?? Ie();
		this.#t = {
			...e,
			isPending: e.status === "pending",
			isSuccess: e.status === "success",
			isError: e.status === "error",
			isIdle: e.status === "idle",
			mutate: this.mutate,
			reset: this.reset
		};
	}
	#a(e) {
		he.batch(() => {
			if (this.#r && this.hasListeners()) {
				let t = this.#t.variables, n = this.#t.context, r = {
					client: this.#e,
					meta: this.options.meta,
					mutationKey: this.options.mutationKey
				};
				if (e?.type === "success") {
					try {
						this.#r.onSuccess?.(e.data, t, n, r);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#r.onSettled?.(e.data, null, t, n, r);
					} catch (e) {
						Promise.reject(e);
					}
				} else if (e?.type === "error") {
					try {
						this.#r.onError?.(e.error, t, n, r);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						this.#r.onSettled?.(void 0, e.error, t, n, r);
					} catch (e) {
						Promise.reject(e);
					}
				}
			}
			this.listeners.forEach((e) => {
				e(this.#t);
			});
		});
	}
}, Re = m.createContext(!1), ze = () => m.useContext(Re);
Re.Provider;
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
function Be() {
	let e = !1;
	return {
		clearReset: () => {
			e = !1;
		},
		reset: () => {
			e = !0;
		},
		isReset: () => e
	};
}
var Ve = m.createContext(Be()), He = () => m.useContext(Ve), Ue = (e, t, n) => {
	let r = n?.state.error && typeof e.throwOnError == "function" ? se(e.throwOnError, [n.state.error, n]) : e.throwOnError;
	(e.suspense || r) && (t.isReset() || (e.retryOnMount = !1));
}, We = (e) => {
	m.useEffect(() => {
		e.clearReset();
	}, [e]);
}, Ge = ({ result: e, errorResetBoundary: t, throwOnError: n, query: r, suspense: i }) => e.isError && !t.isReset() && !e.isFetching && r && (i && e.data === void 0 || se(n, [e.error, r])), Ke = (e) => {
	if (e.suspense) {
		let t = 1e3, n = (e) => e === "static" ? e : Math.max(e ?? t, t), r = e.staleTime;
		e.staleTime = typeof r == "function" ? (...e) => n(r(...e)) : n(r), typeof e.gcTime == "number" && (e.gcTime = Math.max(e.gcTime, t));
	}
}, qe = (e, t) => e?.suspense && t.isPending, Je = (e, t, n) => t.fetchOptimistic(e).catch(() => {
	n.clearReset();
});
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useBaseQuery.js
function Ye(e, t, n) {
	let r = ze(), i = He(), a = _(n), o = a.defaultQueryOptions(e), s = a.getQueryCache().get(o.queryHash), c = e.subscribed !== !1;
	o._optimisticResults = r ? "isRestoring" : c ? "optimistic" : void 0, Ke(o), Ue(o, i, s), We(i);
	let [l] = m.useState(() => new t(a, o)), u = l.getOptimisticResult(o), d = !r && c;
	if (m.useSyncExternalStore(m.useCallback((e) => {
		let t = d ? l.subscribe(he.batchCalls(e)) : C;
		return l.updateResult(), t;
	}, [l, d]), () => l.getCurrentResult(), () => l.getCurrentResult()), m.useEffect(() => {
		l.setOptions(o);
	}, [o, l]), qe(o, u)) throw Je(o, l, i);
	if (Ge({
		result: u,
		errorResetBoundary: i,
		throwOnError: o.throwOnError,
		query: s,
		suspense: o.suspense
	})) throw u.error;
	return o.notifyOnChangeProps ? u : l.trackResult(u);
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useQuery.js
function Xe(e, t) {
	return Ye(e, ke, t);
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/useMutation.js
function Ze(e, t) {
	let n = _(t), [r] = m.useState(() => new Le(n, e));
	m.useEffect(() => {
		r.setOptions(e);
	}, [r, e]);
	let i = m.useSyncExternalStore(m.useCallback((e) => r.subscribe(he.batchCalls(e)), [r]), () => r.getCurrentResult(), () => r.getCurrentResult()), a = m.useCallback((...e) => {
		r.mutate(e[0], e[1]).catch(C);
	}, [r]);
	if (i.error && se(r.options.throwOnError, [i.error])) throw i.error;
	return {
		...i,
		mutate: a,
		mutateAsync: i.mutate
	};
}
//#endregion
//#region node_modules/@radix-ui/react-primitive/dist/index.mjs
var Qe = /* @__PURE__ */ e(p(), 1), $e = Object.defineProperty, et = (e, t) => $e(e, "name", {
	value: t,
	configurable: !0
}), R = [
	"a",
	"button",
	"div",
	"form",
	"h2",
	"h3",
	"img",
	"input",
	"label",
	"li",
	"nav",
	"ol",
	"p",
	"select",
	"span",
	"svg",
	"ul"
].reduce((e, t) => {
	let n = r(`Primitive.${t}`), i = m.forwardRef((e, r) => {
		let { asChild: i, ...a } = e, o = i ? n : t;
		return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ (0, h.jsx)(o, {
			...a,
			ref: r
		});
	});
	return i.displayName = `Primitive.${t}`, {
		...e,
		[t]: i
	};
}, {});
function tt(e, t) {
	e && Qe.flushSync(() => e.dispatchEvent(t));
}
et(tt, "dispatchDiscreteCustomEvent");
//#endregion
//#region node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
var nt = Object.defineProperty, rt = (e, t) => nt(e, "name", {
	value: t,
	configurable: !0
}), it = Object.freeze({
	position: "absolute",
	border: 0,
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	wordWrap: "normal"
}), at = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ rt(function(e, t) {
	return /* @__PURE__ */ (0, h.jsx)(R.span, {
		...e,
		ref: t,
		style: {
			...it,
			...e.style
		}
	});
}, "VisuallyHidden")), ot = Object.defineProperty, z = (e, t) => ot(e, "name", {
	value: t,
	configurable: !0
});
// @__NO_SIDE_EFFECTS__
function st(e, t) {
	let n = m.createContext(t);
	n.displayName = e + "Context";
	let r = /* @__PURE__ */ z((e) => {
		let { children: t, ...r } = e, i = m.useMemo(() => r, Object.values(r));
		return /* @__PURE__ */ (0, h.jsx)(n.Provider, {
			value: i,
			children: t
		});
	}, "Provider");
	r.displayName = e + "Provider";
	function i(r, i = {}) {
		let { optional: a = !1 } = i, o = m.useContext(n);
		if (o) return o;
		if (t !== void 0) return t;
		if (!a) throw Error(`\`${r}\` must be used within \`${e}\``);
	}
	return z(i, "useContext"), [r, i];
}
z(st, "createContext");
// @__NO_SIDE_EFFECTS__
function ct(e, t = []) {
	let n = [];
	function r(t, r) {
		let i = m.createContext(r);
		i.displayName = t + "Context";
		let a = n.length;
		n = [...n, r];
		let o = /* @__PURE__ */ z((t) => {
			let { scope: n, children: r, ...o } = t, s = n?.[e]?.[a] || i, c = m.useMemo(() => o, Object.values(o));
			return /* @__PURE__ */ (0, h.jsx)(s.Provider, {
				value: c,
				children: r
			});
		}, "Provider");
		o.displayName = t + "Provider";
		function s(n, o, s = {}) {
			let { optional: c = !1 } = s, l = o?.[e]?.[a] || i, u = m.useContext(l);
			if (u) return u;
			if (r !== void 0) return r;
			if (!c) throw Error(`\`${n}\` must be used within \`${t}\``);
		}
		return z(s, "useContext"), [o, s];
	}
	z(r, "createContext");
	let i = /* @__PURE__ */ z(() => {
		let t = n.map((e) => m.createContext(e));
		return /* @__PURE__ */ z(function(n) {
			let r = n?.[e] || t;
			return m.useMemo(() => ({ [`__scope${e}`]: {
				...n,
				[e]: r
			} }), [n, r]);
		}, "useScope");
	}, "createScope");
	return i.scopeName = e, [r, lt(i, ...t)];
}
z(ct, "createContextScope");
function lt(...e) {
	let t = e[0];
	if (e.length === 1) return t;
	let n = /* @__PURE__ */ z(() => {
		let n = e.map((e) => ({
			useScope: e(),
			scopeName: e.scopeName
		}));
		return /* @__PURE__ */ z(function(e) {
			let r = n.reduce((t, { useScope: n, scopeName: r }) => {
				let i = n(e)[`__scope${r}`];
				return {
					...t,
					...i
				};
			}, {});
			return m.useMemo(() => ({ [`__scope${t.scopeName}`]: r }), [r]);
		}, "useComposedScopes");
	}, "createScope");
	return n.scopeName = t.scopeName, n;
}
z(lt, "composeContextScopes");
//#endregion
//#region node_modules/@radix-ui/react-collection/dist/index.mjs
var ut = Object.defineProperty, B = (e, t) => ut(e, "name", {
	value: t,
	configurable: !0
});
// @__NO_SIDE_EFFECTS__
function dt(e) {
	let t = e + "CollectionProvider", [n, i] = /* @__PURE__ */ ct(t), [a, o] = n(t, {
		collectionRef: { current: null },
		itemMap: /* @__PURE__ */ new Map()
	}), s = /* @__PURE__ */ B((e) => {
		let { scope: t, children: n } = e, r = m.useRef(null), i = m.useRef(/* @__PURE__ */ new Map()).current;
		return /* @__PURE__ */ (0, h.jsx)(a, {
			scope: t,
			itemMap: i,
			collectionRef: r,
			children: n
		});
	}, "CollectionProvider");
	s.displayName = t;
	let l = e + "CollectionSlot", u = r(l), d = m.forwardRef((e, t) => {
		let { scope: n, children: r } = e, i = o(l, n), a = c(t, i.collectionRef);
		return /* @__PURE__ */ (0, h.jsx)(u, {
			ref: a,
			children: r
		});
	});
	d.displayName = l;
	let f = e + "CollectionItemSlot", p = "data-radix-collection-item", g = r(f), _ = m.forwardRef((e, t) => {
		let { scope: n, children: r, ...i } = e, a = m.useRef(null), s = c(t, a), l = o(f, n);
		return m.useEffect(() => (l.itemMap.set(a, {
			ref: a,
			...i
		}), () => void l.itemMap.delete(a))), /* @__PURE__ */ (0, h.jsx)(g, {
			[p]: "",
			ref: s,
			children: r
		});
	});
	_.displayName = f;
	function v(t) {
		let n = o(e + "CollectionConsumer", t);
		return m.useCallback(() => {
			let e = n.collectionRef.current;
			if (!e) return [];
			let t = Array.from(e.querySelectorAll(`[${p}]`));
			return Array.from(n.itemMap.values()).sort((e, n) => t.indexOf(e.ref.current) - t.indexOf(n.ref.current));
		}, [n.collectionRef, n.itemMap]);
	}
	return B(v, "useCollection"), [
		{
			Provider: s,
			Slot: d,
			ItemSlot: _
		},
		v,
		i
	];
}
B(dt, "createCollection");
var ft = /* @__PURE__ */ new WeakMap(), pt = class e extends Map {
	static {
		B(this, "OrderedDict");
	}
	#e;
	constructor(e) {
		super(e), this.#e = [...super.keys()], ft.set(this, !0);
	}
	set(e, t) {
		return ft.get(this) && (this.has(e) ? this.#e[this.#e.indexOf(e)] = e : this.#e.push(e)), super.set(e, t), this;
	}
	insert(e, t, n) {
		let r = this.has(t), i = this.#e.length, a = gt(e), o = a >= 0 ? a : i + a, s = o < 0 || o >= i ? -1 : o;
		if (s === this.size || r && s === this.size - 1 || s === -1) return this.set(t, n), this;
		let c = this.size + +!r;
		a < 0 && o++;
		let l = [...this.#e], u, d = !1;
		for (let e = o; e < c; e++) if (o === e) {
			let i = l[e];
			l[e] === t && (i = l[e + 1]), r && this.delete(t), u = this.get(i), this.set(t, n);
		} else {
			!d && l[e - 1] === t && (d = !0);
			let n = l[d ? e : e - 1], r = u;
			u = this.get(n), this.delete(n), this.set(n, r);
		}
		return this;
	}
	with(t, n, r) {
		let i = new e(this);
		return i.insert(t, n, r), i;
	}
	before(e) {
		let t = this.#e.indexOf(e) - 1;
		if (!(t < 0)) return this.entryAt(t);
	}
	setBefore(e, t, n) {
		let r = this.#e.indexOf(e);
		return r === -1 ? this : this.insert(r, t, n);
	}
	after(e) {
		let t = this.#e.indexOf(e);
		if (t = t === -1 || t === this.size - 1 ? -1 : t + 1, t !== -1) return this.entryAt(t);
	}
	setAfter(e, t, n) {
		let r = this.#e.indexOf(e);
		return r === -1 ? this : this.insert(r + 1, t, n);
	}
	first() {
		return this.entryAt(0);
	}
	last() {
		return this.entryAt(-1);
	}
	clear() {
		return this.#e = [], super.clear();
	}
	delete(e) {
		let t = super.delete(e);
		return t && this.#e.splice(this.#e.indexOf(e), 1), t;
	}
	deleteAt(e) {
		let t = this.keyAt(e);
		return t !== void 0 && this.delete(t);
	}
	at(e) {
		let t = mt(this.#e, e);
		if (t !== void 0) return this.get(t);
	}
	entryAt(e) {
		let t = mt(this.#e, e);
		if (t !== void 0) return [t, this.get(t)];
	}
	indexOf(e) {
		return this.#e.indexOf(e);
	}
	keyAt(e) {
		return mt(this.#e, e);
	}
	from(e, t) {
		let n = this.indexOf(e);
		if (n === -1) return;
		let r = n + t;
		return r < 0 && (r = 0), r >= this.size && (r = this.size - 1), this.at(r);
	}
	keyFrom(e, t) {
		let n = this.indexOf(e);
		if (n === -1) return;
		let r = n + t;
		return r < 0 && (r = 0), r >= this.size && (r = this.size - 1), this.keyAt(r);
	}
	find(e, t) {
		let n = 0;
		for (let r of this) {
			if (Reflect.apply(e, t, [
				r,
				n,
				this
			])) return r;
			n++;
		}
	}
	findIndex(e, t) {
		let n = 0;
		for (let r of this) {
			if (Reflect.apply(e, t, [
				r,
				n,
				this
			])) return n;
			n++;
		}
		return -1;
	}
	filter(t, n) {
		let r = [], i = 0;
		for (let e of this) Reflect.apply(t, n, [
			e,
			i,
			this
		]) && r.push(e), i++;
		return new e(r);
	}
	map(t, n) {
		let r = [], i = 0;
		for (let e of this) r.push([e[0], Reflect.apply(t, n, [
			e,
			i,
			this
		])]), i++;
		return new e(r);
	}
	reduce(...e) {
		let [t, n] = e, r = 0, i = n ?? this.at(0);
		for (let n of this) i = r === 0 && e.length === 1 ? n : Reflect.apply(t, this, [
			i,
			n,
			r,
			this
		]), r++;
		return i;
	}
	reduceRight(...e) {
		let [t, n] = e, r = n ?? this.at(-1);
		for (let n = this.size - 1; n >= 0; n--) {
			let i = this.at(n);
			r = n === this.size - 1 && e.length === 1 ? i : Reflect.apply(t, this, [
				r,
				i,
				n,
				this
			]);
		}
		return r;
	}
	toSorted(t) {
		let n = [...this.entries()].sort(t);
		return new e(n);
	}
	toReversed() {
		let t = new e();
		for (let e = this.size - 1; e >= 0; e--) {
			let n = this.keyAt(e), r = this.get(n);
			t.set(n, r);
		}
		return t;
	}
	toSpliced(...t) {
		let n = [...this.entries()];
		return n.splice(...t), new e(n);
	}
	slice(t, n) {
		let r = new e(), i = this.size - 1;
		if (t === void 0) return r;
		t < 0 && (t += this.size), n !== void 0 && n > 0 && (i = n - 1);
		for (let e = t; e <= i; e++) {
			let t = this.keyAt(e), n = this.get(t);
			r.set(t, n);
		}
		return r;
	}
	every(e, t) {
		let n = 0;
		for (let r of this) {
			if (!Reflect.apply(e, t, [
				r,
				n,
				this
			])) return !1;
			n++;
		}
		return !0;
	}
	some(e, t) {
		let n = 0;
		for (let r of this) {
			if (Reflect.apply(e, t, [
				r,
				n,
				this
			])) return !0;
			n++;
		}
		return !1;
	}
};
function mt(e, t) {
	if ("at" in Array.prototype) return Array.prototype.at.call(e, t);
	let n = ht(e, t);
	return n === -1 ? void 0 : e[n];
}
B(mt, "at");
function ht(e, t) {
	let n = e.length, r = gt(t), i = r >= 0 ? r : n + r;
	return i < 0 || i >= n ? -1 : i;
}
B(ht, "toSafeIndex");
function gt(e) {
	return e !== e || e === 0 ? 0 : Math.trunc(e);
}
B(gt, "toSafeInteger");
// @__NO_SIDE_EFFECTS__
function _t(e) {
	let t = e + "CollectionProvider", [n, i] = /* @__PURE__ */ ct(t), [a, o] = n(t, {
		collectionElement: null,
		collectionRef: { current: null },
		collectionRefObject: { current: null },
		itemMap: new pt(),
		setItemMap: /* @__PURE__ */ B(() => void 0, "setItemMap")
	}), s = /* @__PURE__ */ B(({ state: e, ...t }) => e ? /* @__PURE__ */ (0, h.jsx)(u, {
		...t,
		state: e
	}) : /* @__PURE__ */ (0, h.jsx)(l, { ...t }), "CollectionProvider");
	s.displayName = t;
	let l = /* @__PURE__ */ B((e) => {
		let t = y();
		return /* @__PURE__ */ (0, h.jsx)(u, {
			...e,
			state: t
		});
	}, "CollectionInit");
	l.displayName = t + "Init";
	let u = /* @__PURE__ */ B((e) => {
		let { scope: t, children: n, state: r } = e, i = m.useRef(null), [o, s] = m.useState(null), l = c(i, s), [u, d] = r;
		return m.useEffect(() => {
			if (!o) return;
			let e = xt(() => {});
			return e.observe(o, {
				childList: !0,
				subtree: !0
			}), () => {
				e.disconnect();
			};
		}, [o]), /* @__PURE__ */ (0, h.jsx)(a, {
			scope: t,
			itemMap: u,
			setItemMap: d,
			collectionRef: l,
			collectionRefObject: i,
			collectionElement: o,
			children: n
		});
	}, "CollectionProviderImpl");
	u.displayName = t + "Impl";
	let d = e + "CollectionSlot", f = r(d), p = m.forwardRef((e, t) => {
		let { scope: n, children: r } = e, i = o(d, n), a = c(t, i.collectionRef);
		return /* @__PURE__ */ (0, h.jsx)(f, {
			ref: a,
			children: r
		});
	});
	p.displayName = d;
	let g = e + "CollectionItemSlot", _ = r(g), v = m.forwardRef((e, t) => {
		let { scope: n, children: r, ...i } = e, a = m.useRef(null), [s, l] = m.useState(null), u = c(t, a, l), { setItemMap: d } = o(g, n), f = m.useRef(i);
		vt(f.current, i) || (f.current = i);
		let p = f.current;
		return m.useEffect(() => {
			let e = p;
			return d((t) => s ? t.has(s) ? t.set(s, {
				...e,
				element: s
			}).toSorted(bt) : (t.set(s, {
				...e,
				element: s
			}), t.toSorted(bt)) : t), () => {
				d((e) => !s || !e.has(s) ? e : (e.delete(s), new pt(e)));
			};
		}, [
			s,
			p,
			d
		]), /* @__PURE__ */ (0, h.jsx)(_, {
			"data-radix-collection-item": "",
			ref: u,
			children: r
		});
	});
	v.displayName = g;
	function y() {
		return m.useState(new pt());
	}
	B(y, "useInitCollection");
	function b(t) {
		let { itemMap: n } = o(e + "CollectionConsumer", t);
		return n;
	}
	return B(b, "useCollection"), [{
		Provider: s,
		Slot: p,
		ItemSlot: v
	}, {
		createCollectionScope: i,
		useCollection: b,
		useInitCollection: y
	}];
}
B(_t, "createCollection");
function vt(e, t) {
	if (e === t) return !0;
	if (typeof e != "object" || typeof t != "object" || e == null || t == null) return !1;
	let n = Object.keys(e), r = Object.keys(t);
	if (n.length !== r.length) return !1;
	for (let r of n) if (!Object.prototype.hasOwnProperty.call(t, r) || e[r] !== t[r]) return !1;
	return !0;
}
B(vt, "shallowEqual");
function yt(e, t) {
	return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING);
}
B(yt, "isElementPreceding");
function bt(e, t) {
	return !e[1].element || !t[1].element ? 0 : yt(e[1].element, t[1].element) ? -1 : 1;
}
B(bt, "sortByDocumentPosition");
function xt(e) {
	return new MutationObserver((t) => {
		for (let n of t) if (n.type === "childList") {
			e();
			return;
		}
	});
}
B(xt, "getChildListObserver");
//#endregion
//#region node_modules/@radix-ui/primitive/dist/index.mjs
var St = Object.defineProperty, Ct = (e, t) => St(e, "name", {
	value: t,
	configurable: !0
}), wt = !!(typeof window < "u" && window.document && window.document.createElement);
function V(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
	return /* @__PURE__ */ Ct(function(r) {
		if (e?.(r), n === !1 || !r || !r.defaultPrevented) return t?.(r);
	}, "handleEvent");
}
Ct(V, "composeEventHandlers");
function Tt(e) {
	if (!wt) throw Error("Cannot access window outside of the DOM");
	return e?.ownerDocument?.defaultView ?? window;
}
Ct(Tt, "getOwnerWindow");
function Et(e) {
	if (!wt) throw Error("Cannot access document outside of the DOM");
	return e?.ownerDocument ?? document;
}
Ct(Et, "getOwnerDocument");
function Dt(e, t = !1) {
	let { activeElement: n } = Et(e);
	if (!n?.nodeName) return null;
	if (Ot(n) && n.contentDocument) return Dt(n.contentDocument.body, t);
	if (t) {
		let e = n.getAttribute("aria-activedescendant");
		if (e) {
			let t = Et(n).getElementById(e);
			if (t) return t;
		}
	}
	return n;
}
Ct(Dt, "getActiveElement");
function Ot(e) {
	return e.tagName === "IFRAME";
}
Ct(Ot, "isFrame");
//#endregion
//#region node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var H = globalThis?.document ? m.useLayoutEffect : () => {}, kt = Object.defineProperty, At = (e, t) => kt(e, "name", {
	value: t,
	configurable: !0
}), jt = m.useEffectEvent, Mt = m.useInsertionEffect;
function Nt(e) {
	if (typeof jt == "function") return jt(e);
	let t = m.useRef(() => {
		throw Error("Cannot call an event handler while rendering.");
	});
	return typeof Mt == "function" ? Mt(() => {
		t.current = e;
	}) : H(() => {
		t.current = e;
	}), m.useMemo(() => ((...e) => t.current?.(...e)), []);
}
At(Nt, "useEffectEvent");
//#endregion
//#region node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var Pt = Object.defineProperty, Ft = (e, t) => Pt(e, "name", {
	value: t,
	configurable: !0
}), It = m.useInsertionEffect || H;
function Lt({ prop: e, defaultProp: t, onChange: n = /* @__PURE__ */ Ft(() => {}, "onChange"), caller: r }) {
	let [i, a, o] = Rt({
		defaultProp: t,
		onChange: n
	}), s = e !== void 0;
	return [s ? e : i, m.useCallback((t) => {
		if (s) {
			let n = zt(t) ? t(e) : t;
			n !== e && o.current?.(n);
		} else a(t);
	}, [
		s,
		e,
		a,
		o
	])];
}
Ft(Lt, "useControllableState");
function Rt({ defaultProp: e, onChange: t }) {
	let [n, r] = m.useState(e), i = m.useRef(n), a = m.useRef(t);
	return It(() => {
		a.current = t;
	}, [t]), m.useEffect(() => {
		i.current !== n && (a.current?.(n), i.current = n);
	}, [n, i]), [
		n,
		r,
		a
	];
}
Ft(Rt, "useUncontrolledState");
function zt(e) {
	return typeof e == "function";
}
Ft(zt, "isFunction");
var Bt = Symbol("RADIX:SYNC_STATE");
function Vt(e, t, n, r) {
	let { prop: i, defaultProp: a, onChange: o, caller: s } = t, c = i !== void 0, l = Nt(o), u = [{
		...n,
		state: a
	}];
	r && u.push(r);
	let [d, f] = m.useReducer((t, n) => {
		if (n.type === Bt) return {
			...t,
			state: n.state
		};
		let r = e(t, n);
		return c && !Object.is(r.state, t.state) && l(r.state), r;
	}, ...u), p = d.state, h = m.useRef(p);
	m.useEffect(() => {
		h.current !== p && (h.current = p, c || l(p));
	}, [
		p,
		h,
		c
	]);
	let g = m.useMemo(() => i === void 0 ? d : {
		...d,
		state: i
	}, [d, i]);
	return m.useEffect(() => {
		c && !Object.is(i, d.state) && f({
			type: Bt,
			state: i
		});
	}, [
		i,
		d.state,
		c
	]), [g, f];
}
Ft(Vt, "useControllableStateReducer");
//#endregion
//#region node_modules/@radix-ui/react-presence/dist/index.mjs
var Ht = Object.defineProperty, Ut = (e, t) => Ht(e, "name", {
	value: t,
	configurable: !0
});
function Wt(e, t) {
	return m.useReducer((e, n) => t[e][n] ?? e, e);
}
Ut(Wt, "useStateMachine");
var Gt = /* @__PURE__ */ Ut((e) => {
	let { present: t, children: n } = e, r = Kt(t), i = typeof n == "function" ? n({ present: r.isPresent }) : m.Children.only(n), a = Jt(r.ref, Xt(i));
	return typeof n == "function" || r.isPresent ? m.cloneElement(i, { ref: a }) : null;
}, "Presence");
function Kt(e) {
	let [t, n] = m.useState(), r = m.useRef(null), i = m.useRef(e), a = m.useRef("none"), o = m.useRef(void 0), [s, c] = Wt(e ? "mounted" : "unmounted", {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	return m.useEffect(() => {
		s === "mounted" ? (a.current = o.current ?? Yt(r.current), o.current = void 0) : a.current = "none";
	}, [s]), H(() => {
		let t = r.current, n = i.current;
		if (n !== e) {
			let r = a.current, s = Yt(t);
			e ? (o.current = s, c("MOUNT")) : s === "none" || t?.display === "none" ? c("UNMOUNT") : c(n && r !== s ? "ANIMATION_OUT" : "UNMOUNT"), i.current = e;
		}
	}, [e, c]), H(() => {
		if (t) {
			let e, n = t.ownerDocument.defaultView ?? window, o = /* @__PURE__ */ Ut((a) => {
				let o = Yt(r.current).includes(CSS.escape(a.animationName));
				if (a.target === t && o && (c("ANIMATION_END"), !i.current)) {
					let r = t.style.animationFillMode;
					t.style.animationFillMode = "forwards", e = n.setTimeout(() => {
						t.style.animationFillMode === "forwards" && (t.style.animationFillMode = r);
					});
				}
			}, "handleAnimationEnd"), s = /* @__PURE__ */ Ut((e) => {
				e.target === t && (a.current = Yt(r.current));
			}, "handleAnimationStart");
			return t.addEventListener("animationstart", s), t.addEventListener("animationcancel", o), t.addEventListener("animationend", o), () => {
				n.clearTimeout(e), t.removeEventListener("animationstart", s), t.removeEventListener("animationcancel", o), t.removeEventListener("animationend", o);
			};
		}
		c("ANIMATION_END");
	}, [t, c]), {
		isPresent: ["mounted", "unmountSuspended"].includes(s),
		ref: m.useCallback((e) => {
			if (e) {
				let t = getComputedStyle(e);
				r.current = t, o.current = Yt(t);
			} else r.current = null;
			n(e);
		}, [])
	};
}
Ut(Kt, "usePresence");
function qt(e, t) {
	if (typeof e == "function") return e(t);
	e != null && (e.current = t);
}
Ut(qt, "setRef");
function Jt(...e) {
	let t = m.useRef(e);
	return t.current = e, m.useCallback((e) => {
		let n = t.current, r = !1, i = n.map((t) => {
			let n = qt(t, e);
			return !r && typeof n == "function" && (r = !0), n;
		});
		if (r) return () => {
			for (let e = 0; e < i.length; e++) {
				let t = i[e];
				typeof t == "function" ? t() : qt(n[e], null);
			}
		};
	}, []);
}
Ut(Jt, "useStableComposedRefs");
function Yt(e) {
	return e?.animationName || "none";
}
Ut(Yt, "getAnimationName");
function Xt(e) {
	let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning;
	return n ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
Ut(Xt, "getElementRef");
//#endregion
//#region node_modules/@radix-ui/react-id/dist/index.mjs
var Zt = Object.defineProperty, Qt = (e, t) => Zt(e, "name", {
	value: t,
	configurable: !0
}), $t = m.useId || (() => void 0), en = 0;
function tn(e) {
	let [t, n] = m.useState($t());
	return H(() => {
		e || n((e) => e ?? String(en++));
	}, [e]), e || (t ? `radix-${t}` : "");
}
Qt(tn, "useId");
//#endregion
//#region node_modules/@radix-ui/react-direction/dist/index.mjs
var nn = Object.defineProperty, rn = (e, t) => nn(e, "name", {
	value: t,
	configurable: !0
}), an = m.createContext(void 0);
function on(e) {
	let t = m.useContext(an);
	return e || t || "ltr";
}
rn(on, "useDirection");
//#endregion
//#region node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var sn = Object.defineProperty, cn = (e, t) => sn(e, "name", {
	value: t,
	configurable: !0
});
function U(e) {
	let t = m.useRef(e);
	return m.useEffect(() => {
		t.current = e;
	}), m.useMemo(() => ((...e) => t.current?.(...e)), []);
}
cn(U, "useCallbackRef");
//#endregion
//#region node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
var ln = Object.defineProperty, W = (e, t) => ln(e, "name", {
	value: t,
	configurable: !0
}), un = "dismissableLayer.update", dn = "dismissableLayer.pointerDownOutside", fn = "dismissableLayer.focusOutside", pn, mn = m.createContext({
	layers: /* @__PURE__ */ new Set(),
	layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
	branches: /* @__PURE__ */ new Set(),
	dismissableSurfaces: /* @__PURE__ */ new Set()
}), hn = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ W(function(e, t) {
	let { disableOutsidePointerEvents: n = !1, deferPointerDownOutside: r = !1, onEscapeKeyDown: i, onPointerDownOutside: a, onFocusOutside: o, onInteractOutside: s, onDismiss: l, ...u } = e, d = m.useContext(mn), [f, p] = m.useState(null), g = f?.ownerDocument ?? globalThis?.document, [, _] = m.useState({}), v = c(t, p), y = Array.from(d.layers), [b] = [...d.layersWithOutsidePointerEventsDisabled].slice(-1), x = b ? y.indexOf(b) : -1, S = f ? y.indexOf(f) : -1, C = d.layersWithOutsidePointerEventsDisabled.size > 0, w = S >= x, T = m.useRef(!1), E = vn((e) => {
		a?.(e), s?.(e), e.defaultPrevented || l?.();
	}, {
		ownerDocument: g,
		deferPointerDownOutside: r,
		isDeferredPointerDownOutsideRef: T,
		dismissableSurfaces: d.dismissableSurfaces,
		shouldHandlePointerDownOutside: m.useCallback((e) => {
			if (!(e instanceof Node)) return !1;
			let t = [...d.branches].some((t) => t.contains(e));
			return w && !t;
		}, [d.branches, w])
	}), D = yn((e) => {
		if (r && T.current) return;
		let t = e.target;
		[...d.branches].some((e) => e.contains(t)) || (o?.(e), s?.(e), e.defaultPrevented || l?.());
	}, g), O = f ? S === y.length - 1 : !1, k = U((e) => {
		e.key === "Escape" && (i?.(e), !e.defaultPrevented && l && (e.preventDefault(), l()));
	});
	return m.useEffect(() => {
		if (O) return g.addEventListener("keydown", k, { capture: !0 }), () => g.removeEventListener("keydown", k, { capture: !0 });
	}, [
		g,
		O,
		k
	]), m.useEffect(() => {
		if (f) return n && (d.layersWithOutsidePointerEventsDisabled.size === 0 && (pn = g.body.style.pointerEvents, g.body.style.pointerEvents = "none"), d.layersWithOutsidePointerEventsDisabled.add(f)), d.layers.add(f), bn(), () => {
			n && (d.layersWithOutsidePointerEventsDisabled.delete(f), d.layersWithOutsidePointerEventsDisabled.size === 0 && (g.body.style.pointerEvents = pn));
		};
	}, [
		f,
		g,
		n,
		d
	]), m.useEffect(() => () => {
		f && (d.layers.delete(f), d.layersWithOutsidePointerEventsDisabled.delete(f), bn());
	}, [f, d]), m.useEffect(() => {
		let e = /* @__PURE__ */ W(() => _({}), "handleUpdate");
		return document.addEventListener(un, e), () => document.removeEventListener(un, e);
	}, []), /* @__PURE__ */ (0, h.jsx)(R.div, {
		...u,
		ref: v,
		style: {
			pointerEvents: C ? w ? "auto" : "none" : void 0,
			...e.style
		},
		onFocusCapture: V(e.onFocusCapture, D.onFocusCapture),
		onBlurCapture: V(e.onBlurCapture, D.onBlurCapture),
		onPointerDownCapture: V(e.onPointerDownCapture, E.onPointerDownCapture)
	});
}, "DismissableLayer"));
function gn() {
	let e = m.useContext(mn), [t, n] = m.useState(null);
	return m.useEffect(() => {
		if (t) return e.dismissableSurfaces.add(t), () => {
			e.dismissableSurfaces.delete(t);
		};
	}, [t, e.dismissableSurfaces]), n;
}
W(gn, "useDismissableLayerSurface");
var _n = /* @__PURE__ */ W(() => !0, "IS_TRUE");
function vn(e, t) {
	let { ownerDocument: n = globalThis?.document, deferPointerDownOutside: r = !1, isDeferredPointerDownOutsideRef: i, dismissableSurfaces: a, shouldHandlePointerDownOutside: o = _n } = t, s = U(e), c = m.useRef(!1), l = m.useRef(!1), u = m.useRef(/* @__PURE__ */ new Map()), d = m.useRef(() => {});
	return m.useEffect(() => {
		function e() {
			l.current = !1, i.current = !1, u.current.clear();
		}
		W(e, "resetOutsideInteraction");
		function t() {
			return Array.from(u.current.values()).some(Boolean);
		}
		W(t, "isOutsideInteractionIntercepted");
		function f(e) {
			if (!l.current) return;
			let t = e.target;
			t instanceof Node && [...a].some((e) => e.contains(t)) || u.current.set(e.type, !0), e.type === "click" && window.setTimeout(() => {
				l.current && d.current();
			}, 0);
		}
		W(f, "handleInteractionCapture");
		function p(e) {
			l.current && u.current.set(e.type, !1);
		}
		W(p, "handleInteractionBubble");
		let m = /* @__PURE__ */ W((a) => {
			if (a.target && !c.current) {
				let f = function() {
					n.removeEventListener("click", d.current);
					let r = t();
					e(), r || xn(dn, s, p, { discrete: !0 });
				};
				if (W(f, "handleAndDispatchPointerDownOutsideEvent"), !o(a.target)) {
					n.removeEventListener("click", d.current), e(), c.current = !1;
					return;
				}
				let p = { originalEvent: a };
				l.current = !0, i.current = r && a.button === 0, u.current.clear(), !r || a.button !== 0 ? f() : (n.removeEventListener("click", d.current), d.current = f, n.addEventListener("click", d.current, { once: !0 }));
			} else n.removeEventListener("click", d.current), e();
			c.current = !1;
		}, "handlePointerDown"), h = [
			"pointerup",
			"mousedown",
			"mouseup",
			"touchstart",
			"touchend",
			"click"
		];
		for (let e of h) n.addEventListener(e, f, !0), n.addEventListener(e, p);
		let g = window.setTimeout(() => {
			n.addEventListener("pointerdown", m);
		}, 0);
		return () => {
			window.clearTimeout(g), n.removeEventListener("pointerdown", m), n.removeEventListener("click", d.current);
			for (let e of h) n.removeEventListener(e, f, !0), n.removeEventListener(e, p);
		};
	}, [
		n,
		s,
		r,
		i,
		a,
		o
	]), { onPointerDownCapture: /* @__PURE__ */ W(() => c.current = !0, "onPointerDownCapture") };
}
W(vn, "usePointerDownOutside");
function yn(e, t = globalThis?.document) {
	let n = U(e), r = m.useRef(!1);
	return m.useEffect(() => {
		let e = /* @__PURE__ */ W((e) => {
			e.target && !r.current && xn(fn, n, { originalEvent: e }, { discrete: !1 });
		}, "handleFocus");
		return t.addEventListener("focusin", e), () => t.removeEventListener("focusin", e);
	}, [t, n]), {
		onFocusCapture: /* @__PURE__ */ W(() => r.current = !0, "onFocusCapture"),
		onBlurCapture: /* @__PURE__ */ W(() => r.current = !1, "onBlurCapture")
	};
}
W(yn, "useFocusOutside");
function bn() {
	let e = new CustomEvent(un);
	document.dispatchEvent(e);
}
W(bn, "dispatchUpdate");
function xn(e, t, n, { discrete: r }) {
	let i = n.originalEvent.target, a = new CustomEvent(e, {
		bubbles: !1,
		cancelable: !0,
		detail: n
	});
	t && i.addEventListener(e, t, { once: !0 }), r ? tt(i, a) : i.dispatchEvent(a);
}
W(xn, "handleAndDispatchCustomEvent");
//#endregion
//#region node_modules/@radix-ui/react-focus-scope/dist/index.mjs
var Sn = Object.defineProperty, G = (e, t) => Sn(e, "name", {
	value: t,
	configurable: !0
}), Cn = "focusScope.autoFocusOnMount", wn = "focusScope.autoFocusOnUnmount", Tn = {
	bubbles: !1,
	cancelable: !0
}, En = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ G(function(e, t) {
	let { loop: n = !1, trapped: r = !1, onMountAutoFocus: i, onUnmountAutoFocus: a, ...o } = e, [s, l] = m.useState(null), u = U(i), d = U(a), f = m.useRef(null), p = c(t, l), g = m.useRef({
		paused: !1,
		pause() {
			this.paused = !0;
		},
		resume() {
			this.paused = !1;
		}
	}).current;
	m.useEffect(() => {
		if (r) {
			let e = function(e) {
				if (g.paused || !s) return;
				let t = e.target;
				s.contains(t) ? f.current = t : Nn(f.current, { select: !0 });
			}, t = function(e) {
				if (g.paused || !s) return;
				let t = e.relatedTarget;
				t !== null && (s.contains(t) || Nn(f.current, { select: !0 }));
			}, n = function(e) {
				if (document.activeElement === document.body) for (let t of e) t.removedNodes.length > 0 && Nn(s);
			};
			G(e, "handleFocusIn"), G(t, "handleFocusOut"), G(n, "handleMutations"), document.addEventListener("focusin", e), document.addEventListener("focusout", t);
			let r = new MutationObserver(n);
			return s && r.observe(s, {
				childList: !0,
				subtree: !0
			}), () => {
				document.removeEventListener("focusin", e), document.removeEventListener("focusout", t), r.disconnect();
			};
		}
	}, [
		r,
		s,
		g.paused
	]), m.useEffect(() => {
		if (s) {
			Pn.add(g);
			let e = document.activeElement;
			if (!s.contains(e)) {
				let t = new CustomEvent(Cn, Tn);
				s.addEventListener(Cn, u), s.dispatchEvent(t), t.defaultPrevented || (Dn(Ln(kn(s)), { select: !0 }), document.activeElement === e && Nn(s));
			}
			return () => {
				s.removeEventListener(Cn, u), setTimeout(() => {
					let t = new CustomEvent(wn, Tn);
					s.addEventListener(wn, d), s.dispatchEvent(t), t.defaultPrevented || Nn(e ?? document.body, { select: !0 }), s.removeEventListener(wn, d), Pn.remove(g);
				}, 0);
			};
		}
	}, [
		s,
		u,
		d,
		g
	]);
	let _ = m.useCallback((e) => {
		if (!n && !r || g.paused) return;
		let t = e.key === "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey, i = document.activeElement;
		if (t && i) {
			let t = e.currentTarget, [r, a] = On(t);
			r && a ? !e.shiftKey && i === a ? (e.preventDefault(), n && Nn(r, { select: !0 })) : e.shiftKey && i === r && (e.preventDefault(), n && Nn(a, { select: !0 })) : i === t && e.preventDefault();
		}
	}, [
		n,
		r,
		g.paused
	]);
	return /* @__PURE__ */ (0, h.jsx)(R.div, {
		tabIndex: -1,
		...o,
		ref: p,
		onKeyDown: _
	});
}, "FocusScope"));
function Dn(e, { select: t = !1 } = {}) {
	let n = document.activeElement;
	for (let r of e) if (Nn(r, { select: t }), document.activeElement !== n) return;
}
G(Dn, "focusFirst");
function On(e) {
	let t = kn(e);
	return [An(t, e), An(t.reverse(), e)];
}
G(On, "getTabbableEdges");
function kn(e) {
	let t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, { acceptNode: /* @__PURE__ */ G((e) => {
		let t = e.tagName === "INPUT" && e.type === "hidden";
		return e.disabled || e.hidden || t ? NodeFilter.FILTER_SKIP : e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	}, "acceptNode") });
	for (; n.nextNode();) t.push(n.currentNode);
	return t;
}
G(kn, "getTabbableCandidates");
function An(e, t) {
	let n = typeof t.checkVisibility == "function" && t.checkVisibility({ checkVisibilityCSS: !0 });
	for (let r of e) if (!(n ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : jn(r, { upTo: t }))) return r;
}
G(An, "findVisible");
function jn(e, { upTo: t }) {
	if (getComputedStyle(e).visibility === "hidden") return !0;
	for (; e;) {
		if (t !== void 0 && e === t) return !1;
		if (getComputedStyle(e).display === "none") return !0;
		e = e.parentElement;
	}
	return !1;
}
G(jn, "isHidden");
function Mn(e) {
	return e instanceof HTMLInputElement && "select" in e;
}
G(Mn, "isSelectableInput");
function Nn(e, { select: t = !1 } = {}) {
	if (e && e.focus) {
		let n = document.activeElement;
		e.focus({ preventScroll: !0 }), e !== n && Mn(e) && t && e.select();
	}
}
G(Nn, "focus");
var Pn = Fn();
function Fn() {
	let e = [];
	return {
		add(t) {
			let n = e[0];
			t !== n && n?.pause(), e = In(e, t), e.unshift(t);
		},
		remove(t) {
			e = In(e, t), e[0]?.resume();
		}
	};
}
G(Fn, "createFocusScopesStack");
function In(e, t) {
	let n = [...e], r = n.indexOf(t);
	return r !== -1 && n.splice(r, 1), n;
}
G(In, "arrayRemove");
function Ln(e) {
	return e.filter((e) => e.tagName !== "A");
}
G(Ln, "removeLinks");
//#endregion
//#region node_modules/@radix-ui/react-portal/dist/index.mjs
var Rn = Object.defineProperty, zn = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ ((e, t) => Rn(e, "name", {
	value: t,
	configurable: !0
}))(function(e, t) {
	let { container: n, ...r } = e, [i, a] = m.useState(!1);
	H(() => a(!0), []);
	let o = n || i && globalThis?.document?.body;
	return o ? Qe.createPortal(/* @__PURE__ */ (0, h.jsx)(R.div, {
		...r,
		ref: t
	}), o) : null;
}, "Portal")), Bn = Object.defineProperty, Vn = (e, t) => Bn(e, "name", {
	value: t,
	configurable: !0
}), Hn = 0, Un = null;
function Wn(e) {
	return Gn(), e.children;
}
Vn(Wn, "FocusGuards");
function Gn() {
	m.useEffect(() => {
		Un ||= {
			start: Kn(),
			end: Kn()
		};
		let { start: e, end: t } = Un;
		return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), Hn++, () => {
			Hn === 1 && (Un?.start.remove(), Un?.end.remove(), Un = null), Hn = Math.max(0, Hn - 1);
		};
	}, []);
}
Vn(Gn, "useFocusGuards");
function Kn() {
	let e = document.createElement("span");
	return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
Vn(Kn, "createFocusGuard");
//#endregion
//#region node_modules/tslib/tslib.es6.mjs
var qn = function() {
	return qn = Object.assign || function(e) {
		for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e;
	}, qn.apply(this, arguments);
};
function Jn(e, t) {
	var n = {};
	for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && typeof Object.getOwnPropertySymbols == "function") for (var i = 0, r = Object.getOwnPropertySymbols(e); i < r.length; i++) t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
	return n;
}
function Yn(e, t, n) {
	if (n || arguments.length === 2) for (var r = 0, i = t.length, a; r < i; r++) (a || !(r in t)) && (a ||= Array.prototype.slice.call(t, 0, r), a[r] = t[r]);
	return e.concat(a || Array.prototype.slice.call(t));
}
//#endregion
//#region node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var Xn = "right-scroll-bar-position", Zn = "width-before-scroll-bar", Qn = "with-scroll-bars-hidden", $n = "--removed-body-scroll-bar-size";
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/assignRef.js
function er(e, t) {
	return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/useRef.js
function tr(e, t) {
	var n = (0, m.useState)(function() {
		return {
			value: e,
			callback: t,
			facade: {
				get current() {
					return n.value;
				},
				set current(e) {
					var t = n.value;
					t !== e && (n.value = e, n.callback(e, t));
				}
			}
		};
	})[0];
	return n.callback = t, n.facade;
}
//#endregion
//#region node_modules/use-callback-ref/dist/es2015/useMergeRef.js
var nr = typeof window < "u" ? m.useLayoutEffect : m.useEffect, rr = /* @__PURE__ */ new WeakMap();
function ir(e, t) {
	var n = tr(t || null, function(t) {
		return e.forEach(function(e) {
			return er(e, t);
		});
	});
	return nr(function() {
		var t = rr.get(n);
		if (t) {
			var r = new Set(t), i = new Set(e), a = n.current;
			r.forEach(function(e) {
				i.has(e) || er(e, null);
			}), i.forEach(function(e) {
				r.has(e) || er(e, a);
			});
		}
		rr.set(n, e);
	}, [e]), n;
}
//#endregion
//#region node_modules/use-sidecar/dist/es2015/medium.js
function ar(e) {
	return e;
}
function or(e, t) {
	t === void 0 && (t = ar);
	var n = [], r = !1;
	return {
		read: function() {
			if (r) throw Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
			return n.length ? n[n.length - 1] : e;
		},
		useMedium: function(e) {
			var i = t(e, r);
			return n.push(i), function() {
				n = n.filter(function(e) {
					return e !== i;
				});
			};
		},
		assignSyncMedium: function(e) {
			for (r = !0; n.length;) {
				var t = n;
				n = [], t.forEach(e);
			}
			n = {
				push: function(t) {
					return e(t);
				},
				filter: function() {
					return n;
				}
			};
		},
		assignMedium: function(e) {
			r = !0;
			var t = [];
			if (n.length) {
				var i = n;
				n = [], i.forEach(e), t = n;
			}
			var a = function() {
				var n = t;
				t = [], n.forEach(e);
			}, o = function() {
				return Promise.resolve().then(a);
			};
			o(), n = {
				push: function(e) {
					t.push(e), o();
				},
				filter: function(e) {
					return t = t.filter(e), n;
				}
			};
		}
	};
}
function sr(e) {
	e === void 0 && (e = {});
	var t = or(null);
	return t.options = qn({
		async: !0,
		ssr: !1
	}, e), t;
}
//#endregion
//#region node_modules/use-sidecar/dist/es2015/exports.js
var cr = function(e) {
	var t = e.sideCar, n = Jn(e, ["sideCar"]);
	if (!t) throw Error("Sidecar: please provide `sideCar` property to import the right car");
	var r = t.read();
	if (!r) throw Error("Sidecar medium not found");
	return m.createElement(r, qn({}, n));
};
cr.isSideCarExport = !0;
function lr(e, t) {
	return e.useMedium(t), cr;
}
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/medium.js
var ur = sr(), dr = function() {}, fr = m.forwardRef(function(e, t) {
	var n = m.useRef(null), r = m.useState({
		onScrollCapture: dr,
		onWheelCapture: dr,
		onTouchMoveCapture: dr
	}), i = r[0], a = r[1], o = e.forwardProps, s = e.children, c = e.className, l = e.removeScrollBar, u = e.enabled, d = e.shards, f = e.sideCar, p = e.noRelative, h = e.noIsolation, g = e.inert, _ = e.allowPinchZoom, v = e.as, y = v === void 0 ? "div" : v, b = e.gapMode, x = Jn(e, [
		"forwardProps",
		"children",
		"className",
		"removeScrollBar",
		"enabled",
		"shards",
		"sideCar",
		"noRelative",
		"noIsolation",
		"inert",
		"allowPinchZoom",
		"as",
		"gapMode"
	]), S = f, C = ir([n, t]), w = qn(qn({}, x), i);
	return m.createElement(m.Fragment, null, u && m.createElement(S, {
		sideCar: ur,
		removeScrollBar: l,
		shards: d,
		noRelative: p,
		noIsolation: h,
		inert: g,
		setCallbacks: a,
		allowPinchZoom: !!_,
		lockRef: n,
		gapMode: b
	}), o ? m.cloneElement(m.Children.only(s), qn(qn({}, w), { ref: C })) : m.createElement(y, qn({}, w, {
		className: c,
		ref: C
	}), s));
});
fr.defaultProps = {
	enabled: !0,
	removeScrollBar: !0,
	inert: !1
}, fr.classNames = {
	fullWidth: Zn,
	zeroRight: Xn
};
//#endregion
//#region node_modules/get-nonce/dist/es2015/index.js
var pr = function() {
	if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
//#endregion
//#region node_modules/react-style-singleton/dist/es2015/singleton.js
function mr() {
	if (!document) return null;
	var e = document.createElement("style");
	e.type = "text/css";
	var t = pr();
	return t && e.setAttribute("nonce", t), e;
}
function hr(e, t) {
	e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function gr(e) {
	(document.head || document.getElementsByTagName("head")[0]).appendChild(e);
}
var _r = function() {
	var e = 0, t = null;
	return {
		add: function(n) {
			e == 0 && (t = mr()) && (hr(t, n), gr(t)), e++;
		},
		remove: function() {
			e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
		}
	};
}, vr = function() {
	var e = _r();
	return function(t, n) {
		m.useEffect(function() {
			return e.add(t), function() {
				e.remove();
			};
		}, [t && n]);
	};
}, yr = function() {
	var e = vr();
	return function(t) {
		var n = t.styles, r = t.dynamic;
		return e(n, r), null;
	};
}, br = {
	left: 0,
	top: 0,
	right: 0,
	gap: 0
}, xr = function(e) {
	return parseInt(e || "", 10) || 0;
}, Sr = function(e) {
	var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], i = t[e === "padding" ? "paddingRight" : "marginRight"];
	return [
		xr(n),
		xr(r),
		xr(i)
	];
}, Cr = function(e) {
	if (e === void 0 && (e = "margin"), typeof window > "u") return br;
	var t = Sr(e), n = document.documentElement.clientWidth, r = window.innerWidth;
	return {
		left: t[0],
		top: t[1],
		right: t[2],
		gap: Math.max(0, r - n + t[2] - t[0])
	};
}, wr = yr(), Tr = "data-scroll-locked", Er = function(e, t, n, r) {
	var i = e.left, a = e.top, o = e.right, s = e.gap;
	return n === void 0 && (n = "margin"), `
  .${Qn} {
   overflow: hidden ${r};
   padding-right: ${s}px ${r};
  }
  body[${Tr}] {
    overflow: hidden ${r};
    overscroll-behavior: contain;
    ${[
		t && `position: relative ${r};`,
		n === "margin" && `
    padding-left: ${i}px;
    padding-top: ${a}px;
    padding-right: ${o}px;
    margin-left:0;
    margin-top:0;
    margin-right: ${s}px ${r};
    `,
		n === "padding" && `padding-right: ${s}px ${r};`
	].filter(Boolean).join("")}
  }
  
  .${Xn} {
    right: ${s}px ${r};
  }
  
  .${Zn} {
    margin-right: ${s}px ${r};
  }
  
  .${Xn} .${Xn} {
    right: 0 ${r};
  }
  
  .${Zn} .${Zn} {
    margin-right: 0 ${r};
  }
  
  body[${Tr}] {
    ${$n}: ${s}px;
  }
`;
}, Dr = function() {
	var e = parseInt(document.body.getAttribute("data-scroll-locked") || "0", 10);
	return isFinite(e) ? e : 0;
}, Or = function() {
	m.useEffect(function() {
		return document.body.setAttribute(Tr, (Dr() + 1).toString()), function() {
			var e = Dr() - 1;
			e <= 0 ? document.body.removeAttribute(Tr) : document.body.setAttribute(Tr, e.toString());
		};
	}, []);
}, kr = function(e) {
	var t = e.noRelative, n = e.noImportant, r = e.gapMode, i = r === void 0 ? "margin" : r;
	Or();
	var a = m.useMemo(function() {
		return Cr(i);
	}, [i]);
	return m.createElement(wr, { styles: Er(a, !t, i, n ? "" : "!important") });
}, Ar = !1;
if (typeof window < "u") try {
	var jr = Object.defineProperty({}, "passive", { get: function() {
		return Ar = !0, !0;
	} });
	window.addEventListener("test", jr, jr), window.removeEventListener("test", jr, jr);
} catch {
	Ar = !1;
}
var Mr = Ar ? { passive: !1 } : !1, Nr = function(e) {
	return e.tagName === "TEXTAREA";
}, Pr = function(e, t) {
	if (!(e instanceof Element)) return !1;
	var n = window.getComputedStyle(e);
	return n[t] !== "hidden" && !(n.overflowY === n.overflowX && !Nr(e) && n[t] === "visible");
}, Fr = function(e) {
	return Pr(e, "overflowY");
}, Ir = function(e) {
	return Pr(e, "overflowX");
}, Lr = function(e, t) {
	var n = t.ownerDocument, r = t;
	do {
		if (typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host), Br(e, r)) {
			var i = Vr(e, r);
			if (i[1] > i[2]) return !0;
		}
		r = r.parentNode;
	} while (r && r !== n.body);
	return !1;
}, Rr = function(e) {
	return [
		e.scrollTop,
		e.scrollHeight,
		e.clientHeight
	];
}, zr = function(e) {
	return [
		e.scrollLeft,
		e.scrollWidth,
		e.clientWidth
	];
}, Br = function(e, t) {
	return e === "v" ? Fr(t) : Ir(t);
}, Vr = function(e, t) {
	return e === "v" ? Rr(t) : zr(t);
}, Hr = function(e, t) {
	return e === "h" && t === "rtl" ? -1 : 1;
}, Ur = function(e, t, n, r, i) {
	var a = Hr(e, window.getComputedStyle(t).direction), o = a * r, s = n.target, c = t.contains(s), l = !1, u = o > 0, d = 0, f = 0;
	do {
		if (!s) break;
		var p = Vr(e, s), m = p[0], h = p[1] - p[2] - a * m;
		(m || h) && Br(e, s) && (d += h, f += m);
		var g = s.parentNode;
		s = g && g.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? g.host : g;
	} while (!c && s !== document.body || c && (t.contains(s) || t === s));
	return (u && (i && Math.abs(d) < 1 || !i && o > d) || !u && (i && Math.abs(f) < 1 || !i && -o > f)) && (l = !0), l;
}, Wr = function(e) {
	return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Gr = function(e) {
	return [e.deltaX, e.deltaY];
}, Kr = function(e) {
	return e && "current" in e ? e.current : e;
}, qr = function(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}, Jr = function(e) {
	return `
  .block-interactivity-${e} {pointer-events: none;}
  .allow-interactivity-${e} {pointer-events: all;}
`;
}, Yr = 0, Xr = [];
function Zr(e) {
	var t = m.useRef([]), n = m.useRef([0, 0]), r = m.useRef(), i = m.useState(Yr++)[0], a = m.useState(yr)[0], o = m.useRef(e);
	m.useEffect(function() {
		o.current = e;
	}, [e]), m.useEffect(function() {
		if (e.inert) {
			document.body.classList.add(`block-interactivity-${i}`);
			var t = Yn([e.lockRef.current], (e.shards || []).map(Kr), !0).filter(Boolean);
			return t.forEach(function(e) {
				return e.classList.add(`allow-interactivity-${i}`);
			}), function() {
				document.body.classList.remove(`block-interactivity-${i}`), t.forEach(function(e) {
					return e.classList.remove(`allow-interactivity-${i}`);
				});
			};
		}
	}, [
		e.inert,
		e.lockRef.current,
		e.shards
	]);
	var s = m.useCallback(function(e, t) {
		if ("touches" in e && e.touches.length === 2 || e.type === "wheel" && e.ctrlKey) return !o.current.allowPinchZoom;
		var i = Wr(e), a = n.current, s = "deltaX" in e ? e.deltaX : a[0] - i[0], c = "deltaY" in e ? e.deltaY : a[1] - i[1], l, u = e.target, d = Math.abs(s) > Math.abs(c) ? "h" : "v";
		if ("touches" in e && d === "h" && u.type === "range") return !1;
		var f = window.getSelection(), p = f && f.anchorNode;
		if (p && (p === u || p.contains(u))) return !1;
		var m = Lr(d, u);
		if (!m) return !0;
		if (m ? l = d : (l = d === "v" ? "h" : "v", m = Lr(d, u)), !m) return !1;
		if (!r.current && "changedTouches" in e && (s || c) && (r.current = l), !l) return !0;
		var h = r.current || l;
		return Ur(h, t, e, h === "h" ? s : c, !0);
	}, []), c = m.useCallback(function(e) {
		var n = e;
		if (Xr.length && Xr[Xr.length - 1] === a) {
			var r = "deltaY" in n ? Gr(n) : Wr(n), i = t.current.filter(function(e) {
				return e.name === n.type && (e.target === n.target || n.target === e.shadowParent) && qr(e.delta, r);
			})[0];
			if (i && i.should) {
				n.cancelable && n.preventDefault();
				return;
			}
			if (!i) {
				var c = (o.current.shards || []).map(Kr).filter(Boolean).filter(function(e) {
					return e.contains(n.target);
				});
				(c.length > 0 ? s(n, c[0]) : !o.current.noIsolation) && n.cancelable && n.preventDefault();
			}
		}
	}, []), l = m.useCallback(function(e, n, r, i) {
		var a = {
			name: e,
			delta: n,
			target: r,
			should: i,
			shadowParent: Qr(r)
		};
		t.current.push(a), setTimeout(function() {
			t.current = t.current.filter(function(e) {
				return e !== a;
			});
		}, 1);
	}, []), u = m.useCallback(function(e) {
		n.current = Wr(e), r.current = void 0;
	}, []), d = m.useCallback(function(t) {
		l(t.type, Gr(t), t.target, s(t, e.lockRef.current));
	}, []), f = m.useCallback(function(t) {
		l(t.type, Wr(t), t.target, s(t, e.lockRef.current));
	}, []);
	m.useEffect(function() {
		return Xr.push(a), e.setCallbacks({
			onScrollCapture: d,
			onWheelCapture: d,
			onTouchMoveCapture: f
		}), document.addEventListener("wheel", c, Mr), document.addEventListener("touchmove", c, Mr), document.addEventListener("touchstart", u, Mr), function() {
			Xr = Xr.filter(function(e) {
				return e !== a;
			}), document.removeEventListener("wheel", c, Mr), document.removeEventListener("touchmove", c, Mr), document.removeEventListener("touchstart", u, Mr);
		};
	}, []);
	var p = e.removeScrollBar, h = e.inert;
	return m.createElement(m.Fragment, null, h ? m.createElement(a, { styles: Jr(i) }) : null, p ? m.createElement(kr, {
		noRelative: e.noRelative,
		gapMode: e.gapMode
	}) : null);
}
function Qr(e) {
	for (var t = null; e !== null;) e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
	return t;
}
//#endregion
//#region node_modules/react-remove-scroll/dist/es2015/sidecar.js
var $r = lr(ur, Zr), ei = m.forwardRef(function(e, t) {
	return m.createElement(fr, qn({}, e, {
		ref: t,
		sideCar: $r
	}));
});
ei.classNames = fr.classNames;
//#endregion
//#region node_modules/aria-hidden/dist/es2015/index.js
var ti = function(e) {
	return typeof document > "u" ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body;
}, ni = /* @__PURE__ */ new WeakMap(), ri = /* @__PURE__ */ new WeakMap(), ii = {}, ai = 0, oi = function(e) {
	return e && (e.host || oi(e.parentNode));
}, si = function(e, t) {
	return t.map(function(t) {
		if (e.contains(t)) return t;
		var n = oi(t);
		return n && e.contains(n) ? n : (console.error("aria-hidden", t, "in not contained inside", e, ". Doing nothing"), null);
	}).filter(function(e) {
		return !!e;
	});
}, ci = function(e, t, n, r) {
	var i = si(t, Array.isArray(e) ? e : [e]);
	ii[n] || (ii[n] = /* @__PURE__ */ new WeakMap());
	var a = ii[n], o = [], s = /* @__PURE__ */ new Set(), c = new Set(i), l = function(e) {
		e && !s.has(e) && (s.add(e), l(e.parentNode));
	};
	i.forEach(l);
	var u = function(e) {
		e && !c.has(e) && Array.prototype.forEach.call(e.children, function(e) {
			if (s.has(e)) u(e);
			else try {
				var t = e.getAttribute(r), i = t !== null && t !== "false", c = (ni.get(e) || 0) + 1, l = (a.get(e) || 0) + 1;
				ni.set(e, c), a.set(e, l), o.push(e), c === 1 && i && ri.set(e, !0), l === 1 && e.setAttribute(n, "true"), i || e.setAttribute(r, "true");
			} catch (t) {
				console.error("aria-hidden: cannot operate on ", e, t);
			}
		});
	};
	return u(t), s.clear(), ai++, function() {
		o.forEach(function(e) {
			var t = ni.get(e) - 1, i = a.get(e) - 1;
			ni.set(e, t), a.set(e, i), t || (ri.has(e) || e.removeAttribute(r), ri.delete(e)), i || e.removeAttribute(n);
		}), ai--, ai || (ni = /* @__PURE__ */ new WeakMap(), ni = /* @__PURE__ */ new WeakMap(), ri = /* @__PURE__ */ new WeakMap(), ii = {});
	};
}, li = function(e, t, n) {
	n === void 0 && (n = "data-aria-hidden");
	var r = Array.from(Array.isArray(e) ? e : [e]), i = t || ti(e);
	return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), ci(r, i, n, "aria-hidden")) : function() {
		return null;
	};
}, ui = Object.defineProperty, K = (e, t) => ui(e, "name", {
	value: t,
	configurable: !0
}), di = "Dialog", [fi, pi] = /* @__PURE__ */ ct(di), [mi, hi] = fi(di), gi = /* @__PURE__ */ K((e) => {
	let { __scopeDialog: t, children: n, open: r, defaultOpen: i, onOpenChange: a, modal: o = !0 } = e, s = m.useRef(null), c = m.useRef(null), [l, u] = Lt({
		prop: r,
		defaultProp: i ?? !1,
		onChange: a,
		caller: di
	}), [d, f] = m.useState(0), [p, g] = m.useState(0);
	return /* @__PURE__ */ (0, h.jsx)(mi, {
		scope: t,
		triggerRef: s,
		contentRef: c,
		contentId: tn(),
		titleId: tn(),
		descriptionId: tn(),
		titlePresent: d > 0,
		descriptionPresent: p > 0,
		setTitleCount: f,
		setDescriptionCount: g,
		open: l,
		onOpenChange: u,
		onOpenToggle: m.useCallback(() => u((e) => !e), [u]),
		modal: o,
		children: n
	});
}, "Dialog"), _i = "DialogTrigger", vi = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let { __scopeDialog: n, ...r } = e, i = hi(_i, n), a = c(t, i.triggerRef);
	return /* @__PURE__ */ (0, h.jsx)(R.button, {
		type: "button",
		"aria-haspopup": "dialog",
		"aria-expanded": i.open,
		"aria-controls": i.open ? i.contentId : void 0,
		"data-state": Ri(i.open),
		...r,
		ref: a,
		onClick: V(e.onClick, i.onOpenToggle)
	});
}, "DialogTrigger")), yi = "DialogPortal", [bi, xi] = fi(yi, { forceMount: void 0 }), Si = /* @__PURE__ */ K((e) => {
	let { __scopeDialog: t, forceMount: n, children: r, container: i } = e, a = hi(yi, t);
	return /* @__PURE__ */ (0, h.jsx)(bi, {
		scope: t,
		forceMount: n,
		children: m.Children.map(r, (e) => /* @__PURE__ */ (0, h.jsx)(Gt, {
			present: n || a.open,
			children: /* @__PURE__ */ (0, h.jsx)(zn, {
				asChild: !0,
				container: i,
				children: e
			})
		}))
	});
}, "DialogPortal"), Ci = "DialogOverlay", wi = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let n = xi(Ci, e.__scopeDialog), { forceMount: r = n.forceMount, ...i } = e, a = hi(Ci, e.__scopeDialog);
	return a.modal ? /* @__PURE__ */ (0, h.jsx)(Gt, {
		present: r || a.open,
		children: /* @__PURE__ */ (0, h.jsx)(Ei, {
			...i,
			ref: t
		})
	}) : null;
}, "DialogOverlay")), Ti = r("DialogOverlay.RemoveScroll"), Ei = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let { __scopeDialog: n, ...r } = e, i = hi(Ci, n), a = gn(), o = c(t, a);
	return /* @__PURE__ */ (0, h.jsx)(ei, {
		as: Ti,
		allowPinchZoom: !0,
		shards: [i.contentRef],
		children: /* @__PURE__ */ (0, h.jsx)(R.div, {
			"data-state": Ri(i.open),
			...r,
			ref: o,
			style: {
				pointerEvents: "auto",
				...r.style
			}
		})
	});
}, "DialogOverlayImpl")), Di = "DialogContent", Oi = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let n = xi(Di, e.__scopeDialog), { forceMount: r = n.forceMount, ...i } = e, a = hi(Di, e.__scopeDialog);
	return /* @__PURE__ */ (0, h.jsx)(Gt, {
		present: r || a.open,
		children: a.modal ? /* @__PURE__ */ (0, h.jsx)(ki, {
			...i,
			ref: t
		}) : /* @__PURE__ */ (0, h.jsx)(Ai, {
			...i,
			ref: t
		})
	});
}, "DialogContent")), ki = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let n = hi(Di, e.__scopeDialog), r = m.useRef(null), i = c(t, n.contentRef, r);
	return m.useEffect(() => {
		let e = r.current;
		if (e) return li(e);
	}, []), /* @__PURE__ */ (0, h.jsx)(ji, {
		...e,
		ref: i,
		trapFocus: n.open,
		disableOutsidePointerEvents: n.open,
		onCloseAutoFocus: V(e.onCloseAutoFocus, (e) => {
			e.preventDefault(), n.triggerRef.current?.focus();
		}),
		onPointerDownOutside: V(e.onPointerDownOutside, (e) => {
			let t = e.detail.originalEvent, n = t.button === 0 && t.ctrlKey === !0;
			(t.button === 2 || n) && e.preventDefault();
		}),
		onFocusOutside: V(e.onFocusOutside, (e) => e.preventDefault())
	});
}, "DialogContentModal")), Ai = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let n = hi(Di, e.__scopeDialog), r = m.useRef(!1), i = m.useRef(!1);
	return /* @__PURE__ */ (0, h.jsx)(ji, {
		...e,
		ref: t,
		trapFocus: !1,
		disableOutsidePointerEvents: !1,
		onCloseAutoFocus: (t) => {
			e.onCloseAutoFocus?.(t), t.defaultPrevented || (r.current || n.triggerRef.current?.focus(), t.preventDefault()), r.current = !1, i.current = !1;
		},
		onInteractOutside: (t) => {
			e.onInteractOutside?.(t), t.defaultPrevented || (r.current = !0, t.detail.originalEvent.type === "pointerdown" && (i.current = !0));
			let a = t.target;
			n.triggerRef.current?.contains(a) && t.preventDefault(), t.detail.originalEvent.type === "focusin" && i.current && t.preventDefault();
		}
	});
}, "DialogContentNonModal")), ji = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: i, onCloseAutoFocus: a, ...o } = e, s = hi(Di, n);
	return Gn(), /* @__PURE__ */ (0, h.jsx)(h.Fragment, { children: /* @__PURE__ */ (0, h.jsx)(En, {
		asChild: !0,
		loop: !0,
		trapped: r,
		onMountAutoFocus: i,
		onUnmountAutoFocus: a,
		children: /* @__PURE__ */ (0, h.jsx)(hn, {
			role: "dialog",
			id: s.contentId,
			"aria-describedby": s.descriptionPresent ? s.descriptionId : void 0,
			"aria-labelledby": s.titlePresent ? s.titleId : void 0,
			"data-state": Ri(s.open),
			...o,
			ref: t,
			deferPointerDownOutside: !0,
			onDismiss: () => s.onOpenChange(!1)
		})
	}) });
}, "DialogContentImpl")), Mi = "DialogTitle", Ni = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let { __scopeDialog: n, ...r } = e, i = hi(Mi, n), { setTitleCount: a } = i;
	return H(() => (a((e) => e + 1), () => a((e) => e - 1)), [a]), /* @__PURE__ */ (0, h.jsx)(R.h2, {
		id: i.titleId,
		...r,
		ref: t
	});
}, "DialogTitle")), Pi = "DialogDescription", Fi = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let { __scopeDialog: n, ...r } = e, i = hi(Pi, n), { setDescriptionCount: a } = i;
	return H(() => (a((e) => e + 1), () => a((e) => e - 1)), [a]), /* @__PURE__ */ (0, h.jsx)(R.p, {
		id: i.descriptionId,
		...r,
		ref: t
	});
}, "DialogDescription")), Ii = "DialogClose", Li = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ K(function(e, t) {
	let { __scopeDialog: n, ...r } = e, i = hi(Ii, n);
	return /* @__PURE__ */ (0, h.jsx)(R.button, {
		type: "button",
		...r,
		ref: t,
		onClick: V(e.onClick, () => i.onOpenChange(!1))
	});
}, "DialogClose"));
function Ri(e) {
	return e ? "open" : "closed";
}
K(Ri, "getState");
//#endregion
//#region node_modules/@radix-ui/react-alert-dialog/dist/index.mjs
var zi = Object.defineProperty, Bi = (e, t) => zi(e, "name", {
	value: t,
	configurable: !0
}), [Vi, Hi] = /* @__PURE__ */ ct("AlertDialog", [pi]), Ui = pi(), Wi = /* @__PURE__ */ Bi((e) => {
	let { __scopeAlertDialog: t, ...n } = e, r = Ui(t);
	return /* @__PURE__ */ (0, h.jsx)(gi, {
		...r,
		...n,
		modal: !0
	});
}, "AlertDialog");
m.forwardRef(/* @__PURE__ */ Bi(function(e, t) {
	let { __scopeAlertDialog: n, ...r } = e, i = Ui(n);
	return /* @__PURE__ */ (0, h.jsx)(vi, {
		...i,
		...r,
		ref: t
	});
}, "AlertDialogTrigger"));
var Gi = /* @__PURE__ */ Bi((e) => {
	let { __scopeAlertDialog: t, ...n } = e, r = Ui(t);
	return /* @__PURE__ */ (0, h.jsx)(Si, {
		...r,
		...n
	});
}, "AlertDialogPortal"), Ki = m.forwardRef(/* @__PURE__ */ Bi(function(e, t) {
	let { __scopeAlertDialog: n, ...r } = e, i = Ui(n);
	return /* @__PURE__ */ (0, h.jsx)(wi, {
		...i,
		...r,
		ref: t
	});
}, "AlertDialogOverlay")), [qi, Ji] = Vi("AlertDialogContent"), Yi = m.forwardRef(/* @__PURE__ */ Bi(function(e, t) {
	let { __scopeAlertDialog: n, children: r, ...i } = e, a = Ui(n), o = m.useRef(null), s = c(t, o), l = m.useRef(null);
	return /* @__PURE__ */ (0, h.jsx)(qi, {
		scope: n,
		cancelRef: l,
		children: /* @__PURE__ */ (0, h.jsx)(Oi, {
			role: "alertdialog",
			...a,
			...i,
			ref: s,
			onOpenAutoFocus: V(i.onOpenAutoFocus, (e) => {
				e.preventDefault(), l.current?.focus({ preventScroll: !0 });
			}),
			onPointerDownOutside: (e) => e.preventDefault(),
			onInteractOutside: (e) => e.preventDefault(),
			children: r
		})
	});
}, "AlertDialogContent")), Xi = m.forwardRef(/* @__PURE__ */ Bi(function(e, t) {
	let { __scopeAlertDialog: n, ...r } = e, i = Ui(n);
	return /* @__PURE__ */ (0, h.jsx)(Ni, {
		...i,
		...r,
		ref: t
	});
}, "AlertDialogTitle")), Zi = m.forwardRef(/* @__PURE__ */ Bi(function(e, t) {
	let { __scopeAlertDialog: n, ...r } = e, i = Ui(n);
	return /* @__PURE__ */ (0, h.jsx)(Fi, {
		...i,
		...r,
		ref: t
	});
}, "AlertDialogDescription"));
m.forwardRef(/* @__PURE__ */ Bi(function(e, t) {
	let { __scopeAlertDialog: n, ...r } = e, i = Ui(n);
	return /* @__PURE__ */ (0, h.jsx)(Li, {
		...i,
		...r,
		ref: t
	});
}, "AlertDialogAction"));
var Qi = "AlertDialogCancel", $i = m.forwardRef(/* @__PURE__ */ Bi(function(e, t) {
	let { __scopeAlertDialog: n, ...r } = e, { cancelRef: i } = Ji(Qi, n), a = Ui(n), o = c(t, i);
	return /* @__PURE__ */ (0, h.jsx)(Li, {
		...a,
		...r,
		ref: o
	});
}, "AlertDialogCancel")), ea = Wi, ta = Gi, na = Ki, ra = Yi, ia = $i, aa = Xi, oa = Zi, sa = Object.defineProperty, ca = (e, t) => sa(e, "name", {
	value: t,
	configurable: !0
});
function la(e) {
	let [t, n] = m.useState(void 0);
	return H(() => {
		if (e) {
			n({
				width: e.offsetWidth,
				height: e.offsetHeight
			});
			let t = new ResizeObserver((t) => {
				if (!Array.isArray(t) || !t.length) return;
				let r = t[0], i, a;
				if ("borderBoxSize" in r) {
					let e = r.borderBoxSize, t = Array.isArray(e) ? e[0] : e;
					i = t.inlineSize, a = t.blockSize;
				} else i = e.offsetWidth, a = e.offsetHeight;
				n({
					width: i,
					height: a
				});
			});
			return t.observe(e, { box: "border-box" }), () => t.unobserve(e);
		}
		n(void 0);
	}, [e]), t;
}
ca(la, "useSize");
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var ua = [
	"top",
	"right",
	"bottom",
	"left"
], da = Math.min, fa = Math.max, pa = Math.round, ma = Math.floor, ha = (e) => ({
	x: e,
	y: e
}), ga = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function _a(e, t, n) {
	return fa(e, da(t, n));
}
function va(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function ya(e) {
	return e.split("-")[0];
}
function ba(e) {
	return e.split("-")[1];
}
function xa(e) {
	return e === "x" ? "y" : "x";
}
function Sa(e) {
	return e === "y" ? "height" : "width";
}
function Ca(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function wa(e) {
	return xa(Ca(e));
}
function Ta(e, t, n) {
	n === void 0 && (n = !1);
	let r = ba(e), i = wa(e), a = Sa(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Pa(o)), [o, Pa(o)];
}
function Ea(e) {
	let t = Pa(e);
	return [
		Da(e),
		t,
		Da(t)
	];
}
function Da(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var Oa = ["left", "right"], ka = ["right", "left"], Aa = ["top", "bottom"], ja = ["bottom", "top"];
function Ma(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? ka : Oa : t ? Oa : ka;
		case "left":
		case "right": return t ? Aa : ja;
		default: return [];
	}
}
function Na(e, t, n, r) {
	let i = ba(e), a = Ma(ya(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(Da)))), a;
}
function Pa(e) {
	let t = ya(e);
	return ga[t] + e.slice(t.length);
}
function Fa(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function Ia(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Fa(e);
}
function La(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
//#endregion
//#region node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function Ra(e, t, n) {
	let { reference: r, floating: i } = e, a = Ca(t), o = wa(t), s = Sa(o), c = ya(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
	switch (c) {
		case "top":
			p = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			p = {
				x: u,
				y: r.y + r.height
			};
			break;
		case "right":
			p = {
				x: r.x + r.width,
				y: d
			};
			break;
		case "left":
			p = {
				x: r.x - i.width,
				y: d
			};
			break;
		default: p = {
			x: r.x,
			y: r.y
		};
	}
	let m = ba(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function za(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = va(t, e), p = Ia(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = La(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(m)) ?? !0 ? m : m.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), g = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), v = await (i.isElement == null ? void 0 : i.isElement(_)) && await (i.getScale == null ? void 0 : i.getScale(_)) || {
		x: 1,
		y: 1
	}, y = La(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: g,
		offsetParent: _,
		strategy: s
	}) : g);
	return {
		top: (h.top - y.top + p.top) / v.y,
		bottom: (y.bottom - h.bottom + p.bottom) / v.y,
		left: (h.left - y.left + p.left) / v.x,
		right: (y.right - h.right + p.right) / v.x
	};
}
var Ba = 50, Va = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: za
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Ra(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < Ba && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Ra(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, Ha = (e) => ({
	name: "arrow",
	options: e,
	async fn(t) {
		let { x: n, y: r, placement: i, rects: a, platform: o, elements: s, middlewareData: c } = t, { element: l, padding: u = 0 } = va(e, t) || {};
		if (l == null) return {};
		let d = Ia(u), f = {
			x: n,
			y: r
		}, p = wa(i), m = Sa(p), h = await o.getDimensions(l), g = p === "y", _ = g ? "top" : "left", v = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", b = a.reference[m] + a.reference[p] - f[p] - a.floating[m], x = f[p] - a.reference[p], S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l)), C = S ? S[y] : 0;
		(!C || !await (o.isElement == null ? void 0 : o.isElement(S))) && (C = s.floating[y] || a.floating[m]);
		let w = b / 2 - x / 2, T = C / 2 - h[m] / 2 - 1, E = da(d[_], T), D = da(d[v], T), O = C - h[m] - D, k = C / 2 - h[m] / 2 + w, A = _a(E, k, O), j = !c.arrow && ba(i) != null && k !== A && a.reference[m] / 2 - (k < E ? E : D) - h[m] / 2 < 0, M = j ? k < E ? k - E : k - O : 0;
		return {
			[p]: f[p] + M,
			data: {
				[p]: A,
				centerOffset: k - A - M,
				...j && { alignmentOffset: M }
			},
			reset: j
		};
	}
}), Ua = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = va(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = ya(r), _ = Ca(o), v = ya(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Pa(o)] : Ea(o)), x = p !== "none";
			!d && x && b.push(...Na(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), w = [], T = i.flip?.overflows || [];
			if (l && w.push(C[g]), u) {
				let e = Ta(r, a, y);
				w.push(C[e[0]], C[e[1]]);
			}
			if (T = [...T, {
				placement: r,
				overflows: w
			}], !w.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (u !== "alignment" || _ === Ca(t) || T.every((e) => Ca(e.placement) !== _ || e.overflows[0] > 0))) return {
					data: {
						index: e,
						overflows: T
					},
					reset: { placement: t }
				};
				let n = T.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = T.filter((e) => {
							if (x) {
								let t = Ca(e.placement);
								return t === _ || t === "y";
							}
							return !0;
						}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
						e && (n = e);
						break;
					}
					case "initialPlacement": n = o;
				}
				if (r !== n) return { reset: { placement: n } };
			}
			return {};
		}
	};
};
function Wa(e, t) {
	return {
		top: e.top - t.height,
		right: e.right - t.width,
		bottom: e.bottom - t.height,
		left: e.left - t.width
	};
}
function Ga(e) {
	return ua.some((t) => e[t] >= 0);
}
var Ka = function(e) {
	return e === void 0 && (e = {}), {
		name: "hide",
		options: e,
		async fn(t) {
			let { rects: n, platform: r } = t, { strategy: i = "referenceHidden", ...a } = va(e, t);
			switch (i) {
				case "referenceHidden": {
					let e = Wa(await r.detectOverflow(t, {
						...a,
						elementContext: "reference"
					}), n.reference);
					return { data: {
						referenceHiddenOffsets: e,
						referenceHidden: Ga(e)
					} };
				}
				case "escaped": {
					let e = Wa(await r.detectOverflow(t, {
						...a,
						altBoundary: !0
					}), n.floating);
					return { data: {
						escapedOffsets: e,
						escaped: Ga(e)
					} };
				}
				default: return {};
			}
		}
	};
}, qa = /*#__PURE__*/ new Set(["left", "top"]);
async function Ja(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = ya(n), s = ba(n), c = Ca(n) === "y", l = qa.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = va(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
		mainAxis: d,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: d.mainAxis || 0,
		crossAxis: d.crossAxis || 0,
		alignmentAxis: d.alignmentAxis
	};
	return s && typeof m == "number" && (p = s === "end" ? m * -1 : m), c ? {
		x: p * u,
		y: f * l
	} : {
		x: f * l,
		y: p * u
	};
}
var Ya = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await Ja(t, e);
			return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
				x: r + s.x,
				y: i + s.y,
				data: {
					...s,
					placement: a
				}
			};
		}
	};
}, Xa = function(e) {
	return e === void 0 && (e = {}), {
		name: "shift",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: s = !1, limiter: c = { fn: (e) => {
				let { x: t, y: n } = e;
				return {
					x: t,
					y: n
				};
			} }, ...l } = va(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Ca(i), p = xa(f), m = u[p], h = u[f], g = (e, t) => _a(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
			o && (m = g(p, m)), s && (h = g(f, h));
			let _ = c.fn({
				...t,
				[p]: m,
				[f]: h
			});
			return {
				..._,
				data: {
					x: _.x - n,
					y: _.y - r,
					enabled: {
						[p]: o,
						[f]: s
					}
				}
			};
		}
	};
}, Za = function(e) {
	return e === void 0 && (e = {}), {
		options: e,
		fn(t) {
			let { x: n, y: r, placement: i, rects: a, middlewareData: o } = t, { offset: s = 0, mainAxis: c = !0, crossAxis: l = !0 } = va(e, t), u = {
				x: n,
				y: r
			}, d = Ca(i), f = xa(d), p = u[f], m = u[d], h = va(s, t), g = typeof h == "number" ? {
				mainAxis: h,
				crossAxis: 0
			} : {
				mainAxis: h.mainAxis ?? 0,
				crossAxis: h.crossAxis ?? 0
			};
			if (c) {
				let e = f === "y" ? "height" : "width", t = a.reference[f] - a.floating[e] + g.mainAxis, n = a.reference[f] + a.reference[e] - g.mainAxis;
				p < t ? p = t : p > n && (p = n);
			}
			if (l) {
				let e = f === "y" ? "width" : "height", t = qa.has(ya(i)), n = a.reference[d] - a.floating[e] + (t && o.offset?.[d] || 0) + (t ? 0 : g.crossAxis), r = a.reference[d] + a.reference[e] + (t ? 0 : o.offset?.[d] || 0) - (t ? g.crossAxis : 0);
				m < n ? m = n : m > r && (m = r);
			}
			return {
				[f]: p,
				[d]: m
			};
		}
	};
}, Qa = function(e) {
	return e === void 0 && (e = {}), {
		name: "size",
		options: e,
		async fn(t) {
			let { placement: n, rects: r, platform: i, elements: a } = t, { apply: o = () => {}, ...s } = va(e, t), c = await i.detectOverflow(t, s), l = ya(n), u = ba(n), d = Ca(n) === "y", { width: f, height: p } = r.floating, m, h;
			l === "top" || l === "bottom" ? (m = l, h = u === (await (i.isRTL == null ? void 0 : i.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (h = l, m = u === "end" ? "top" : "bottom");
			let g = p - c.top - c.bottom, _ = f - c.left - c.right, v = da(p - c[m], g), y = da(f - c[h], _), b = t.middlewareData.shift, x = !b, S = v, C = y;
			b != null && b.enabled.x && (C = _), b != null && b.enabled.y && (S = g), x && !u && (d ? C = f - 2 * fa(c.left, c.right) : S = p - 2 * fa(c.top, c.bottom)), await o({
				...t,
				availableWidth: C,
				availableHeight: S
			});
			let w = await i.getDimensions(a.floating);
			return f !== w.width || p !== w.height ? { reset: { rects: !0 } } : {};
		}
	};
};
//#endregion
//#region node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function $a() {
	return typeof window < "u";
}
function eo(e) {
	return no(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function q(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function to(e) {
	return ((no(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function no(e) {
	return $a() ? e instanceof Node || e instanceof q(e).Node : !1;
}
function ro(e) {
	return $a() ? e instanceof Element || e instanceof q(e).Element : !1;
}
function io(e) {
	return $a() ? e instanceof HTMLElement || e instanceof q(e).HTMLElement : !1;
}
function ao(e) {
	return !$a() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof q(e).ShadowRoot;
}
function oo(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = vo(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function so(e) {
	return /^(table|td|th)$/.test(eo(e));
}
function co(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var lo = /transform|translate|scale|rotate|perspective|filter/, uo = /paint|layout|strict|content/, fo = (e) => !!e && e !== "none", po;
function mo(e) {
	let t = ro(e) ? vo(e) : e;
	return fo(t.transform) || fo(t.translate) || fo(t.scale) || fo(t.rotate) || fo(t.perspective) || !go() && (fo(t.backdropFilter) || fo(t.filter)) || lo.test(t.willChange || "") || uo.test(t.contain || "");
}
function ho(e) {
	let t = bo(e);
	for (; io(t) && !_o(t);) {
		if (mo(t)) return t;
		if (co(t)) return null;
		t = bo(t);
	}
	return null;
}
function go() {
	return po ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), po;
}
function _o(e) {
	return /^(html|body|#document)$/.test(eo(e));
}
function vo(e) {
	return q(e).getComputedStyle(e);
}
function yo(e) {
	return ro(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function bo(e) {
	if (eo(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || ao(e) && e.host || to(e);
	return ao(t) ? t.host : t;
}
function xo(e) {
	let t = bo(e);
	return _o(t) ? (e.ownerDocument || e).body : io(t) && oo(t) ? t : xo(t);
}
function So(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = xo(e), i = r === e.ownerDocument?.body, a = q(r);
	if (i) {
		let e = Co(a);
		return t.concat(a, a.visualViewport || [], oo(r) ? r : [], e && n ? So(e) : []);
	}
	return t.concat(r, So(r, [], n));
}
function Co(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
//#endregion
//#region node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function wo(e) {
	let t = vo(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = io(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = pa(n) !== a || pa(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function To(e) {
	return ro(e) ? e : e.contextElement;
}
function Eo(e) {
	let t = To(e);
	if (!io(t)) return ha(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = wo(t), o = (a ? pa(n.width) : n.width) / r, s = (a ? pa(n.height) : n.height) / i;
	return (!o || !Number.isFinite(o)) && (o = 1), (!s || !Number.isFinite(s)) && (s = 1), {
		x: o,
		y: s
	};
}
var Do = /*#__PURE__*/ ha(0);
function Oo(e) {
	let t = q(e);
	return !go() || !t.visualViewport ? Do : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function ko(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === q(e);
}
function Ao(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = To(e), o = ha(1);
	t && (r ? ro(r) && (o = Eo(r)) : o = Eo(e));
	let s = ko(a, n, r) ? Oo(a) : ha(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = q(a), t = ro(r) ? q(r) : r, n = e, i = Co(n);
		for (; i && t !== n;) {
			let e = Eo(i), t = i.getBoundingClientRect(), r = vo(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = q(i), i = Co(n);
		}
	}
	return La({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function jo(e, t) {
	let n = yo(e).scrollLeft;
	return t ? t.left + n : Ao(to(e)).left + n;
}
function Mo(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - jo(e, n),
		y: n.top + t.scrollTop
	};
}
function No(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = to(r), s = t ? co(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = ha(1), u = ha(0), d = io(r);
	if ((d || !a) && ((eo(r) !== "body" || oo(o)) && (c = yo(r)), d)) {
		let e = Ao(r);
		l = Eo(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Mo(o, c) : ha(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Po(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Fo(e) {
	let t = yo(e), n = e.ownerDocument.body, r = fa(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = fa(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + jo(e), o = -t.scrollTop;
	return vo(n).direction === "rtl" && (a += fa(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var Io = 25;
function Lo(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = q(e), a = to(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !go() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (jo(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= Io && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function Ro(e, t) {
	let n = Ao(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = Eo(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function zo(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = Lo(e, n, t);
	else if (t === "document") r = Fo(to(e));
	else if (ro(t)) r = Ro(t, n);
	else {
		let n = Oo(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return La(r);
}
function Bo(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = So(e, [], !1).filter((e) => ro(e) && eo(e) !== "body"), i = null, a = vo(e).position === "fixed", o = a ? bo(e) : e;
	for (; ro(o) && !_o(o);) {
		let e = vo(o), t = mo(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = bo(o);
	}
	return t.set(e, r), r;
}
function Vo(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? co(t) ? [] : Bo(t, this._c) : [].concat(n), r], o = zo(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = zo(t, a[e], i);
		s = fa(n.top, s), c = da(n.right, c), l = da(n.bottom, l), u = fa(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Ho(e) {
	let { width: t, height: n } = wo(e);
	return {
		width: t,
		height: n
	};
}
function Uo(e, t, n) {
	let r = io(t), i = to(t), a = n === "fixed", o = Ao(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = ha(0);
	if ((r || !a) && ((eo(t) !== "body" || oo(i)) && (s = yo(t)), r)) {
		let e = Ao(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = jo(i));
	let l = i && !r && !a ? Mo(i, s) : ha(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function Wo(e) {
	return vo(e).position === "static";
}
function Go(e, t) {
	if (!io(e) || vo(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return to(e) === n && (n = n.ownerDocument.body), n;
}
function Ko(e, t) {
	let n = q(e);
	if (co(e)) return n;
	if (!io(e)) {
		let t = bo(e);
		for (; t && !_o(t);) {
			if (ro(t) && !Wo(t)) return t;
			t = bo(t);
		}
		return n;
	}
	let r = Go(e, t);
	for (; r && so(r) && Wo(r);) r = Go(r, t);
	return r && _o(r) && Wo(r) && !mo(r) ? n : r || ho(e) || n;
}
var qo = async function(e) {
	let t = this.getOffsetParent || Ko, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Uo(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Jo(e) {
	return vo(e).direction === "rtl";
}
var Yo = {
	convertOffsetParentRelativeRectToViewportRelativeRect: No,
	getDocumentElement: to,
	getClippingRect: Vo,
	getOffsetParent: Ko,
	getElementRects: qo,
	getClientRects: Po,
	getDimensions: Ho,
	getScale: Eo,
	isElement: ro,
	isRTL: Jo
};
function Xo(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Zo(e, t, n) {
	let r = null, i, a = to(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = ma(d), h = ma(a.clientWidth - (u + f)), g = ma(a.clientHeight - (d + p)), _ = ma(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: fa(0, da(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!Xo(l, e.getBoundingClientRect())) return s();
			if (n !== c) {
				if (!y) return s();
				n ? s(!1, n) : i = setTimeout(() => {
					s(!1, 1e-7);
				}, 1e3);
			}
			y = !1;
		}
		try {
			r = new IntersectionObserver(b, {
				...v,
				root: a.ownerDocument
			});
		} catch {
			r = new IntersectionObserver(b, v);
		}
		r.observe(e);
	}
	let c = q(e), l = () => s(n);
	return c.addEventListener("resize", l), s(!0), () => {
		c.removeEventListener("resize", l), o();
	};
}
function Qo(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = To(e), u = i || a ? [...l ? So(l) : [], ...t ? So(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? Zo(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? Ao(e) : null;
	c && g();
	function g() {
		let t = Ao(e);
		h && !Xo(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var $o = Ya, es = Xa, ts = Ua, ns = Qa, rs = Ka, is = Ha, as = Za, os = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...Yo,
		...i.platform,
		_c: r
	};
	return Va(e, t, {
		...i,
		platform: a
	});
}, ss = typeof document < "u" ? m.useLayoutEffect : function() {};
function cs(e, t) {
	if (e === t) return !0;
	if (typeof e != typeof t) return !1;
	if (typeof e == "function" && e.toString() === t.toString()) return !0;
	let n, r, i;
	if (e && t && typeof e == "object") {
		if (Array.isArray(e)) {
			if (n = e.length, n !== t.length) return !1;
			for (r = n; r-- !== 0;) if (!cs(e[r], t[r])) return !1;
			return !0;
		}
		if (i = Object.keys(e), n = i.length, n !== Object.keys(t).length) return !1;
		for (r = n; r-- !== 0;) if (!{}.hasOwnProperty.call(t, i[r])) return !1;
		for (r = n; r-- !== 0;) {
			let n = i[r];
			if (!(n === "_owner" && e.$$typeof) && !cs(e[n], t[n])) return !1;
		}
		return !0;
	}
	return e !== e && t !== t;
}
function ls(e) {
	return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function us(e, t) {
	let n = ls(e);
	return Math.round(t * n) / n;
}
function ds(e) {
	let t = m.useRef(e);
	return ss(() => {
		t.current = e;
	}), t;
}
function fs(e) {
	e === void 0 && (e = {});
	let { placement: t = "bottom", strategy: n = "absolute", middleware: r = [], platform: i, elements: { reference: a, floating: o } = {}, transform: s = !0, whileElementsMounted: c, open: l } = e, [u, d] = m.useState({
		x: 0,
		y: 0,
		strategy: n,
		placement: t,
		middlewareData: {},
		isPositioned: !1
	}), [f, p] = m.useState(r);
	cs(f, r) || p(r);
	let [h, g] = m.useState(null), [_, v] = m.useState(null), y = m.useCallback((e) => {
		e !== C.current && (C.current = e, g(e));
	}, []), b = m.useCallback((e) => {
		e !== w.current && (w.current = e, v(e));
	}, []), x = a || h, S = o || _, C = m.useRef(null), w = m.useRef(null), T = m.useRef(u), E = c != null, D = ds(c), O = ds(i), k = ds(l), A = m.useCallback(() => {
		if (!C.current || !w.current) return;
		let e = {
			placement: t,
			strategy: n,
			middleware: f
		};
		O.current && (e.platform = O.current), os(C.current, w.current, e).then((e) => {
			let t = {
				...e,
				isPositioned: k.current !== !1
			};
			j.current && !cs(T.current, t) && (T.current = t, Qe.flushSync(() => {
				d(t);
			}));
		});
	}, [
		f,
		t,
		n,
		O,
		k
	]);
	ss(() => {
		l === !1 && T.current.isPositioned && (T.current.isPositioned = !1, d((e) => ({
			...e,
			isPositioned: !1
		})));
	}, [l]);
	let j = m.useRef(!1);
	ss(() => (j.current = !0, () => {
		j.current = !1;
	}), []), ss(() => {
		if (x && (C.current = x), S && (w.current = S), x && S) {
			if (D.current) return D.current(x, S, A);
			A();
		}
	}, [
		x,
		S,
		A,
		D,
		E
	]);
	let M = m.useMemo(() => ({
		reference: C,
		floating: w,
		setReference: y,
		setFloating: b
	}), [y, b]), N = m.useMemo(() => ({
		reference: x,
		floating: S
	}), [x, S]), P = m.useMemo(() => {
		let e = {
			position: n,
			left: 0,
			top: 0
		};
		if (!N.floating) return e;
		let t = us(N.floating, u.x), r = us(N.floating, u.y);
		return s ? {
			...e,
			transform: "translate(" + t + "px, " + r + "px)",
			...ls(N.floating) >= 1.5 && { willChange: "transform" }
		} : {
			position: n,
			left: t,
			top: r
		};
	}, [
		n,
		s,
		N.floating,
		u.x,
		u.y
	]);
	return m.useMemo(() => ({
		...u,
		update: A,
		refs: M,
		elements: N,
		floatingStyles: P
	}), [
		u,
		A,
		M,
		N,
		P
	]);
}
var ps = (e) => {
	function t(e) {
		return {}.hasOwnProperty.call(e, "current");
	}
	return {
		name: "arrow",
		options: e,
		fn(n) {
			let { element: r, padding: i } = typeof e == "function" ? e(n) : e;
			return r && t(r) ? r.current == null ? {} : is({
				element: r.current,
				padding: i
			}).fn(n) : r ? is({
				element: r,
				padding: i
			}).fn(n) : {};
		}
	};
}, ms = (e, t) => {
	let n = $o(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, hs = (e, t) => {
	let n = es(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, gs = (e, t) => ({
	fn: as(e).fn,
	options: [e, t]
}), _s = (e, t) => {
	let n = ts(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, vs = (e, t) => {
	let n = ns(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, ys = (e, t) => {
	let n = rs(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, bs = (e, t) => {
	let n = ps(e);
	return {
		name: n.name,
		fn: n.fn,
		options: [e, t]
	};
}, xs = Object.defineProperty, Ss = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ ((e, t) => xs(e, "name", {
	value: t,
	configurable: !0
}))(function(e, t) {
	let { children: n, width: r = 10, height: i = 5, ...a } = e;
	return /* @__PURE__ */ (0, h.jsx)(R.svg, {
		...a,
		ref: t,
		width: r,
		height: i,
		viewBox: "0 0 30 10",
		preserveAspectRatio: "none",
		children: e.asChild ? n : /* @__PURE__ */ (0, h.jsx)("polygon", { points: "0,0 30,0 15,10" })
	});
}, "Arrow")), Cs = Object.defineProperty, ws = (e, t) => Cs(e, "name", {
	value: t,
	configurable: !0
}), Ts = "Popper", [Es, Ds] = /* @__PURE__ */ ct(Ts), [Os, ks] = Es(Ts), As = /* @__PURE__ */ ws((e) => {
	let { __scopePopper: t, children: n } = e, [r, i] = m.useState(null), [a, o] = m.useState(void 0);
	return /* @__PURE__ */ (0, h.jsx)(Os, {
		scope: t,
		anchor: r,
		onAnchorChange: i,
		placementState: a,
		setPlacementState: o,
		children: n
	});
}, "Popper"), js = "PopperAnchor", Ms = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ ws(function(e, t) {
	let { __scopePopper: n, virtualRef: r, ...i } = e, a = ks(js, n), o = m.useRef(null), s = a.onAnchorChange, l = m.useCallback((e) => {
		o.current = e, e && s(e);
	}, [s]), u = c(t, l), d = m.useRef(null);
	m.useEffect(() => {
		if (!r) return;
		let e = d.current;
		d.current = r.current, e !== d.current && s(d.current);
	});
	let f = a.placementState && Hs(a.placementState), p = f?.[0], g = f?.[1];
	return r ? null : /* @__PURE__ */ (0, h.jsx)(R.div, {
		"data-radix-popper-side": p,
		"data-radix-popper-align": g,
		...i,
		ref: u
	});
}, "PopperAnchor")), Ns = "PopperContent", [Ps, Fs] = Es(Ns), Is = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ ws(function(e, t) {
	let { __scopePopper: n, side: r = "bottom", sideOffset: i = 0, align: a = "center", alignOffset: o = 0, arrowPadding: s = 0, avoidCollisions: l = !0, collisionBoundary: u = [], collisionPadding: d = 0, sticky: f = "partial", hideWhenDetached: p = !1, updatePositionStrategy: g = "optimized", onPlaced: _, ...v } = e, y = ks(Ns, n), [b, x] = m.useState(null), S = c(t, x), [C, w] = m.useState(null), T = la(C), E = T?.width ?? 0, D = T?.height ?? 0, O = r + (a === "center" ? "" : "-" + a), k = typeof d == "number" ? d : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...d
	}, A = Array.isArray(u) ? u : [u], j = A.length > 0, M = {
		padding: k,
		boundary: A.filter(Bs),
		altBoundary: j
	}, { refs: N, floatingStyles: P, placement: F, isPositioned: ee, middlewareData: I } = fs({
		strategy: "fixed",
		placement: O,
		whileElementsMounted: /* @__PURE__ */ ws((...e) => Qo(...e, { animationFrame: g === "always" }), "whileElementsMounted"),
		elements: { reference: y.anchor },
		middleware: [
			ms({
				mainAxis: i + D,
				alignmentAxis: o
			}),
			l && hs({
				mainAxis: !0,
				crossAxis: !1,
				limiter: f === "partial" ? gs() : void 0,
				...M
			}),
			l && _s({ ...M }),
			vs({
				...M,
				apply: /* @__PURE__ */ ws(({ elements: e, rects: t, availableWidth: n, availableHeight: r }) => {
					let { width: i, height: a } = t.reference, o = e.floating.style;
					o.setProperty("--radix-popper-available-width", `${n}px`), o.setProperty("--radix-popper-available-height", `${r}px`), o.setProperty("--radix-popper-anchor-width", `${i}px`), o.setProperty("--radix-popper-anchor-height", `${a}px`);
				}, "apply")
			}),
			C && bs({
				element: C,
				padding: s
			}),
			Vs({
				arrowWidth: E,
				arrowHeight: D
			}),
			p && ys({
				strategy: "referenceHidden",
				...M,
				boundary: j ? M.boundary : void 0
			})
		]
	}), L = y.setPlacementState;
	H(() => (L(F), () => {
		L(void 0);
	}), [F, L]);
	let [te, ne] = Hs(F), re = U(_);
	H(() => {
		ee && re?.();
	}, [ee, re]);
	let ie = I.arrow?.x, ae = I.arrow?.y, oe = I.arrow?.centerOffset !== 0, [se, ce] = m.useState();
	return H(() => {
		b && ce(window.getComputedStyle(b).zIndex);
	}, [b]), /* @__PURE__ */ (0, h.jsx)("div", {
		ref: N.setFloating,
		"data-radix-popper-content-wrapper": "",
		style: {
			...P,
			transform: ee ? P.transform : "translate(0, -200%)",
			minWidth: "max-content",
			zIndex: se,
			"--radix-popper-transform-origin": [I.transformOrigin?.x, I.transformOrigin?.y].join(" "),
			...I.hide?.referenceHidden && {
				visibility: "hidden",
				pointerEvents: "none"
			}
		},
		dir: e.dir,
		children: /* @__PURE__ */ (0, h.jsx)(Ps, {
			scope: n,
			placedSide: te,
			placedAlign: ne,
			onArrowChange: w,
			arrowX: ie,
			arrowY: ae,
			shouldHideArrow: oe,
			children: /* @__PURE__ */ (0, h.jsx)(R.div, {
				"data-side": te,
				"data-align": ne,
				...v,
				ref: S,
				style: {
					...v.style,
					animation: ee ? v.style?.animation : "none"
				}
			})
		})
	});
}, "PopperContent")), Ls = "PopperArrow", Rs = {
	top: "bottom",
	right: "left",
	bottom: "top",
	left: "right"
}, zs = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ ws(function(e, t) {
	let { __scopePopper: n, ...r } = e, i = Fs(Ls, n), a = Rs[i.placedSide];
	return /* @__PURE__ */ (0, h.jsx)("span", {
		ref: i.onArrowChange,
		style: {
			position: "absolute",
			left: i.arrowX,
			top: i.arrowY,
			[a]: 0,
			transformOrigin: {
				top: "",
				right: "0 0",
				bottom: "center 0",
				left: "100% 0"
			}[i.placedSide],
			transform: {
				top: "translateY(100%)",
				right: "translateY(50%) rotate(90deg) translateX(-50%)",
				bottom: "rotate(180deg)",
				left: "translateY(50%) rotate(-90deg) translateX(50%)"
			}[i.placedSide],
			visibility: i.shouldHideArrow ? "hidden" : void 0
		},
		children: /* @__PURE__ */ (0, h.jsx)(Ss, {
			...r,
			ref: t,
			style: {
				...r.style,
				display: "block"
			}
		})
	});
}, "PopperArrow"));
function Bs(e) {
	return e !== null;
}
ws(Bs, "isNotNull");
var Vs = /* @__PURE__ */ ws((e) => ({
	name: "transformOrigin",
	options: e,
	fn(t) {
		let { placement: n, rects: r, middlewareData: i } = t, a = i.arrow?.centerOffset !== 0, o = a ? 0 : e.arrowWidth, s = a ? 0 : e.arrowHeight, [c, l] = Hs(n), u = {
			start: "0%",
			center: "50%",
			end: "100%"
		}[l], d = (i.arrow?.x ?? 0) + o / 2, f = (i.arrow?.y ?? 0) + s / 2, p = "", m = "";
		return c === "bottom" ? (p = a ? u : `${d}px`, m = `${-s}px`) : c === "top" ? (p = a ? u : `${d}px`, m = `${r.floating.height + s}px`) : c === "right" ? (p = `${-s}px`, m = a ? u : `${f}px`) : c === "left" && (p = `${r.floating.width + s}px`, m = a ? u : `${f}px`), { data: {
			x: p,
			y: m
		} };
	}
}), "transformOrigin");
function Hs(e) {
	let [t, n = "center"] = e.split("-");
	return [t, n];
}
ws(Hs, "getSideAndAlignFromPlacement");
var Us = As, Ws = Ms, Gs = Is, Ks = zs, qs = Object.defineProperty, Js = (e, t) => qs(e, "name", {
	value: t,
	configurable: !0
});
function Ys(e) {
	let t = m.useRef({
		value: e,
		previous: e
	});
	return m.useMemo(() => (t.current.value !== e && (t.current.previous = t.current.value, t.current.value = e), t.current.previous), [e]);
}
Js(Ys, "usePrevious");
//#endregion
//#region node_modules/@radix-ui/number/dist/index.mjs
var Xs = Object.defineProperty, Zs = (e, t) => Xs(e, "name", {
	value: t,
	configurable: !0
});
function Qs(e, [t, n]) {
	return Math.min(n, Math.max(t, e));
}
Zs(Qs, "clamp");
//#endregion
//#region node_modules/@radix-ui/react-progress/dist/index.mjs
var $s = Object.defineProperty, ec = (e, t) => $s(e, "name", {
	value: t,
	configurable: !0
}), tc = "Progress", nc = 100, [rc, ic] = /* @__PURE__ */ ct(tc), [ac, oc] = rc(tc), sc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ ec(function(e, t) {
	let { __scopeProgress: n, value: r = null, max: i, getValueLabel: a = uc, ...o } = e;
	(i || i === 0) && !pc(i) && console.error(hc(`${i}`, "Progress"));
	let s = pc(i) ? i : nc;
	r !== null && !mc(r, s) && console.error(gc(`${r}`, "Progress"));
	let c = mc(r, s) ? r : null, l = fc(c) ? a(c, s) : void 0;
	return /* @__PURE__ */ (0, h.jsx)(ac, {
		scope: n,
		value: c,
		max: s,
		children: /* @__PURE__ */ (0, h.jsx)(R.div, {
			"aria-valuemax": s,
			"aria-valuemin": 0,
			"aria-valuenow": fc(c) ? c : void 0,
			"aria-valuetext": l,
			role: "progressbar",
			"data-state": dc(c, s),
			"data-value": c ?? void 0,
			"data-max": s,
			...o,
			ref: t
		})
	});
}, "Progress")), cc = "ProgressIndicator", lc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ ec(function(e, t) {
	let { __scopeProgress: n, ...r } = e, i = oc(cc, n);
	return /* @__PURE__ */ (0, h.jsx)(R.div, {
		"data-state": dc(i.value, i.max),
		"data-value": i.value ?? void 0,
		"data-max": i.max,
		...r,
		ref: t
	});
}, "ProgressIndicator"));
function uc(e, t) {
	return `${Math.round(e / t * 100)}%`;
}
ec(uc, "defaultGetValueLabel");
function dc(e, t) {
	return e == null ? "indeterminate" : e === t ? "complete" : "loading";
}
ec(dc, "getProgressState");
function fc(e) {
	return typeof e == "number";
}
ec(fc, "isNumber");
function pc(e) {
	return fc(e) && !isNaN(e) && e > 0;
}
ec(pc, "isValidMaxNumber");
function mc(e, t) {
	return fc(e) && !isNaN(e) && e <= t && e >= 0;
}
ec(mc, "isValidValueNumber");
function hc(e, t) {
	return `Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${nc}\`.`;
}
ec(hc, "getInvalidMaxError");
function gc(e, t) {
	return `Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${nc} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
ec(gc, "getInvalidValueError");
var _c = sc, vc = lc, yc = Object.defineProperty, J = (e, t) => yc(e, "name", {
	value: t,
	configurable: !0
}), bc = [
	" ",
	"Enter",
	"ArrowUp",
	"ArrowDown"
], xc = [" ", "Enter"], Sc = "Select", [Cc, wc, Tc] = /* @__PURE__ */ dt(Sc), [Ec, Dc] = /* @__PURE__ */ ct(Sc, [Tc, Ds]), Oc = Ds(), [kc, Ac] = Ec(Sc), [jc, Mc] = Ec(Sc);
function Nc(e) {
	let { __scopeSelect: t, children: n, open: r, defaultOpen: i, onOpenChange: a, value: o, defaultValue: s, onValueChange: c, dir: l, name: u, autoComplete: d, disabled: f, required: p, form: g, internal_do_not_use_render: _ } = e, v = Oc(t), [y, b] = m.useState(null), [x, S] = m.useState(null), [C, w] = m.useState(!1), T = on(l), [E, D] = Lt({
		prop: r,
		defaultProp: i ?? !1,
		onChange: a,
		caller: Sc
	}), [O, k] = Lt({
		prop: o,
		defaultProp: s,
		onChange: c,
		caller: Sc
	}), A = m.useRef(null), j = m.useRef(O);
	m.useEffect(() => {
		let e = g ? y?.ownerDocument.getElementById(g) : y?.form;
		if (e instanceof HTMLFormElement) {
			let t = /* @__PURE__ */ J(() => k(j.current), "reset");
			return e.addEventListener("reset", t), () => e.removeEventListener("reset", t);
		}
	}, [
		g,
		y,
		k
	]);
	let M = !y || !!g || !!y.closest("form"), [N, P] = m.useState(/* @__PURE__ */ new Set()), F = tn(), ee = Array.from(N).map((e) => e.props.value).join(";"), I = m.useCallback((e) => {
		P((t) => new Set(t).add(e));
	}, []), L = m.useCallback((e) => {
		P((t) => {
			let n = new Set(t);
			return n.delete(e), n;
		});
	}, []), te = {
		required: p,
		trigger: y,
		onTriggerChange: b,
		valueNode: x,
		onValueNodeChange: S,
		valueNodeHasChildren: C,
		onValueNodeHasChildrenChange: w,
		contentId: F,
		value: O,
		onValueChange: k,
		open: E,
		onOpenChange: D,
		dir: T,
		triggerPointerDownPosRef: A,
		disabled: f,
		name: u,
		autoComplete: d,
		form: g,
		nativeOptions: N,
		nativeSelectKey: ee,
		isFormControl: M
	};
	return /* @__PURE__ */ (0, h.jsx)(Us, {
		...v,
		children: /* @__PURE__ */ (0, h.jsx)(kc, {
			scope: t,
			...te,
			children: /* @__PURE__ */ (0, h.jsx)(Cc.Provider, {
				scope: t,
				children: /* @__PURE__ */ (0, h.jsx)(jc, {
					scope: t,
					onNativeOptionAdd: I,
					onNativeOptionRemove: L,
					children: yl(_) ? _(te) : n
				})
			})
		})
	});
}
J(Nc, "SelectProvider");
var Pc = /* @__PURE__ */ J((e) => {
	let { __scopeSelect: t, children: n, ...r } = e;
	return /* @__PURE__ */ (0, h.jsx)(Nc, {
		__scopeSelect: t,
		...r,
		internal_do_not_use_render: ({ isFormControl: e }) => /* @__PURE__ */ (0, h.jsxs)(h.Fragment, { children: [n, e ? /* @__PURE__ */ (0, h.jsx)(vl, { __scopeSelect: t }) : null] })
	});
}, "Select"), Fc = "SelectTrigger", Ic = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, disabled: r = !1, ...i } = e, a = Oc(n), o = Ac(Fc, n), s = o.disabled || r, l = c(t, o.onTriggerChange), u = wc(n), d = m.useRef("touch"), [f, p, g] = xl((e) => {
		let t = u().filter((e) => !e.disabled), n = Sl(t, e, t.find((e) => e.value === o.value));
		n !== void 0 && o.onValueChange(n.value);
	}), _ = /* @__PURE__ */ J((e) => {
		s || (o.onOpenChange(!0), g()), e && (o.triggerPointerDownPosRef.current = {
			x: Math.round(e.pageX),
			y: Math.round(e.pageY)
		});
	}, "handleOpen");
	return /* @__PURE__ */ (0, h.jsx)(Ws, {
		asChild: !0,
		...a,
		children: /* @__PURE__ */ (0, h.jsx)(R.button, {
			type: "button",
			role: "combobox",
			"aria-controls": o.open ? o.contentId : void 0,
			"aria-expanded": o.open,
			"aria-required": o.required,
			"aria-autocomplete": "none",
			dir: o.dir,
			"data-state": o.open ? "open" : "closed",
			disabled: s,
			"data-disabled": s ? "" : void 0,
			"data-placeholder": bl(o.value) ? "" : void 0,
			...i,
			ref: l,
			onClick: V(i.onClick, (e) => {
				e.currentTarget.focus(), d.current !== "mouse" && _(e);
			}),
			onPointerDown: V(i.onPointerDown, (e) => {
				d.current = e.pointerType;
				let t = e.target;
				t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), e.button === 0 && e.ctrlKey === !1 && e.pointerType === "mouse" && (_(e), e.preventDefault());
			}),
			onKeyDown: V(i.onKeyDown, (e) => {
				let t = f.current !== "";
				!(e.ctrlKey || e.altKey || e.metaKey) && e.key.length === 1 && p(e.key), !(t && e.key === " ") && bc.includes(e.key) && (_(), e.preventDefault());
			})
		})
	});
}, "SelectTrigger")), Lc = "SelectValue", Rc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, className: r, style: i, children: a, placeholder: o = "", ...s } = e, l = Ac(Lc, n), { onValueNodeHasChildrenChange: u } = l, d = a !== void 0, f = c(t, l.onValueNodeChange);
	H(() => {
		u(d);
	}, [u, d]);
	let p = bl(l.value);
	return /* @__PURE__ */ (0, h.jsx)(R.span, {
		...s,
		asChild: !p && s.asChild,
		ref: f,
		style: { pointerEvents: "none" },
		children: /* @__PURE__ */ (0, h.jsx)(m.Fragment, { children: p ? o : a }, p ? "placeholder" : "value")
	});
}, "SelectValue")), zc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, children: r, ...i } = e;
	return /* @__PURE__ */ (0, h.jsx)(R.span, {
		"aria-hidden": !0,
		...i,
		ref: t,
		children: r || "▼"
	});
}, "SelectIcon")), [Bc, Vc] = Ec("SelectPortal", { forceMount: void 0 }), Hc = /* @__PURE__ */ J((e) => {
	let { __scopeSelect: t, forceMount: n, ...r } = e;
	return /* @__PURE__ */ (0, h.jsx)(Bc, {
		scope: e.__scopeSelect,
		forceMount: n,
		children: /* @__PURE__ */ (0, h.jsx)(zn, {
			asChild: !0,
			...r
		})
	});
}, "SelectPortal"), Uc = "SelectContent", Wc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let n = Vc(Uc, e.__scopeSelect), { forceMount: r = n.forceMount, ...i } = e, a = Ac(Uc, e.__scopeSelect), [o, s] = m.useState();
	return H(() => {
		s(new DocumentFragment());
	}, []), /* @__PURE__ */ (0, h.jsx)(Gt, {
		present: r || a.open,
		children: ({ present: e }) => e ? /* @__PURE__ */ (0, h.jsx)(Yc, {
			...i,
			ref: t
		}) : /* @__PURE__ */ (0, h.jsx)(Gc, {
			...i,
			fragment: o
		})
	});
}, "SelectContent")), Gc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, children: r, fragment: i } = e;
	return i ? Qe.createPortal(/* @__PURE__ */ (0, h.jsx)(Kc, {
		scope: n,
		children: /* @__PURE__ */ (0, h.jsx)(Cc.Slot, {
			scope: n,
			children: /* @__PURE__ */ (0, h.jsx)("div", {
				ref: t,
				children: r
			})
		})
	}), i) : null;
}, "SelectContentFragment")), Y = 10, [Kc, qc] = Ec(Uc), Jc = r("SelectContent.RemoveScroll"), Yc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n } = e, { position: r = "item-aligned", onCloseAutoFocus: i, onEscapeKeyDown: a, onPointerDownOutside: o, side: s, sideOffset: l, align: u, alignOffset: d, arrowPadding: f, collisionBoundary: p, collisionPadding: g, sticky: _, hideWhenDetached: v, avoidCollisions: y, ...b } = e, x = Ac(Uc, n), [S, C] = m.useState(null), [w, T] = m.useState(null), E = c(t, C), [D, O] = m.useState(null), [k, A] = m.useState(null), j = wc(n), [M, N] = m.useState(!1), P = m.useRef(!1);
	m.useEffect(() => {
		if (S) return li(S);
	}, [S]), Gn();
	let F = m.useCallback((e) => {
		let [t, ...n] = j().map((e) => e.ref.current), [r] = n.slice(-1), i = document.activeElement;
		for (let n of e) if (n === i || (n?.scrollIntoView({ block: "nearest" }), n === t && w && (w.scrollTop = 0), n === r && w && (w.scrollTop = w.scrollHeight), n?.focus(), document.activeElement !== i)) return;
	}, [j, w]), ee = m.useCallback(() => F([D, S]), [
		F,
		D,
		S
	]);
	m.useEffect(() => {
		M && ee();
	}, [M, ee]);
	let { onOpenChange: I, triggerPointerDownPosRef: L } = x;
	m.useEffect(() => {
		if (S) {
			let e = {
				x: 0,
				y: 0
			}, t = /* @__PURE__ */ J((t) => {
				e = {
					x: Math.abs(Math.round(t.pageX) - (L.current?.x ?? 0)),
					y: Math.abs(Math.round(t.pageY) - (L.current?.y ?? 0))
				};
			}, "handlePointerMove"), n = /* @__PURE__ */ J((n) => {
				e.x <= 10 && e.y <= 10 ? n.preventDefault() : n.composedPath().includes(S) || I(!1), document.removeEventListener("pointermove", t), L.current = null;
			}, "handlePointerUp");
			return L.current !== null && (document.addEventListener("pointermove", t), document.addEventListener("pointerup", n, {
				capture: !0,
				once: !0
			})), () => {
				document.removeEventListener("pointermove", t), document.removeEventListener("pointerup", n, { capture: !0 });
			};
		}
	}, [
		S,
		I,
		L
	]), m.useEffect(() => {
		let e = /* @__PURE__ */ J(() => I(!1), "close");
		return window.addEventListener("blur", e), window.addEventListener("resize", e), () => {
			window.removeEventListener("blur", e), window.removeEventListener("resize", e);
		};
	}, [I]);
	let [te, ne] = xl((e) => {
		let t = j().filter((e) => !e.disabled), n = Sl(t, e, t.find((e) => e.ref.current === document.activeElement));
		n && setTimeout(() => n.ref.current?.focus());
	}), re = m.useCallback((e, t, n) => {
		let r = !P.current && !n;
		(x.value !== void 0 && x.value === t || r) && (O(e), r && (P.current = !0));
	}, [x.value]), ie = m.useCallback(() => S?.focus(), [S]), ae = m.useCallback((e, t, n) => {
		let r = !P.current && !n;
		(x.value !== void 0 && x.value === t || r) && A(e);
	}, [x.value]), oe = r === "popper" ? Zc : Xc, se = oe === Zc ? {
		side: s,
		sideOffset: l,
		align: u,
		alignOffset: d,
		arrowPadding: f,
		collisionBoundary: p,
		collisionPadding: g,
		sticky: _,
		hideWhenDetached: v,
		avoidCollisions: y
	} : {};
	return /* @__PURE__ */ (0, h.jsx)(Kc, {
		scope: n,
		content: S,
		viewport: w,
		onViewportChange: T,
		itemRefCallback: re,
		selectedItem: D,
		onItemLeave: ie,
		itemTextRefCallback: ae,
		focusSelectedItem: ee,
		selectedItemText: k,
		position: r,
		isPositioned: M,
		searchRef: te,
		children: /* @__PURE__ */ (0, h.jsx)(ei, {
			as: Jc,
			allowPinchZoom: !0,
			children: /* @__PURE__ */ (0, h.jsx)(En, {
				asChild: !0,
				trapped: x.open,
				onMountAutoFocus: (e) => {
					e.preventDefault();
				},
				onUnmountAutoFocus: V(i, (e) => {
					x.trigger?.focus({ preventScroll: !0 }), e.preventDefault();
				}),
				children: /* @__PURE__ */ (0, h.jsx)(hn, {
					asChild: !0,
					disableOutsidePointerEvents: !0,
					onEscapeKeyDown: a,
					onPointerDownOutside: o,
					onFocusOutside: (e) => e.preventDefault(),
					onDismiss: () => x.onOpenChange(!1),
					children: /* @__PURE__ */ (0, h.jsx)(oe, {
						role: "listbox",
						id: x.contentId,
						"data-state": x.open ? "open" : "closed",
						dir: x.dir,
						onContextMenu: (e) => e.preventDefault(),
						...b,
						...se,
						onPlaced: () => N(!0),
						ref: E,
						style: {
							display: "flex",
							flexDirection: "column",
							outline: "none",
							...b.style
						},
						onKeyDown: V(b.onKeyDown, (e) => {
							let t = e.ctrlKey || e.altKey || e.metaKey;
							if (e.key === "Tab" && e.preventDefault(), !t && e.key.length === 1 && ne(e.key), [
								"ArrowUp",
								"ArrowDown",
								"Home",
								"End"
							].includes(e.key)) {
								let t = j().filter((e) => !e.disabled).map((e) => e.ref.current);
								if (["ArrowUp", "End"].includes(e.key) && (t = t.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(e.key)) {
									let n = e.target, r = t.indexOf(n);
									t = t.slice(r + 1);
								}
								setTimeout(() => F(t)), e.preventDefault();
							}
						})
					})
				})
			})
		})
	});
}, "SelectContentImpl")), Xc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, onPlaced: r, ...i } = e, a = Ac(Uc, n), o = qc(Uc, n), [s, l] = m.useState(null), [u, d] = m.useState(null), f = c(t, d), p = wc(n), g = m.useRef(!1), _ = m.useRef(!0), { viewport: v, selectedItem: y, selectedItemText: b, focusSelectedItem: x } = o, S = m.useCallback(() => {
		if (a.trigger && a.valueNode && s && u && v && y && b) {
			let e = a.trigger.getBoundingClientRect(), t = u.getBoundingClientRect(), n = a.valueNode.getBoundingClientRect(), i = b.getBoundingClientRect();
			if (a.dir !== "rtl") {
				let r = i.left - t.left, a = n.left - r, o = e.left - a, c = e.width + o, l = Math.max(c, t.width), u = window.innerWidth - Y, d = Qs(a, [Y, Math.max(Y, u - l)]);
				s.style.minWidth = c + "px", s.style.left = d + "px";
			} else {
				let r = t.right - i.right, a = window.innerWidth - n.right - r, o = window.innerWidth - e.right - a, c = e.width + o, l = Math.max(c, t.width), u = window.innerWidth - Y, d = Qs(a, [Y, Math.max(Y, u - l)]);
				s.style.minWidth = c + "px", s.style.right = d + "px";
			}
			let o = p(), c = window.innerHeight - Y * 2, l = v.scrollHeight, d = window.getComputedStyle(u), f = parseInt(d.borderTopWidth, 10), m = parseInt(d.paddingTop, 10), h = parseInt(d.borderBottomWidth, 10), _ = parseInt(d.paddingBottom, 10), x = f + m + l + _ + h, S = Math.min(y.offsetHeight * 5, x), C = window.getComputedStyle(v), w = parseInt(C.paddingTop, 10), T = parseInt(C.paddingBottom, 10), E = e.top + e.height / 2 - Y, D = c - E, O = y.offsetHeight / 2, k = y.offsetTop + O, A = f + m + k, j = x - A;
			if (A <= E) {
				let e = o.length > 0 && y === o[o.length - 1].ref.current;
				s.style.bottom = "0px";
				let t = u.clientHeight - v.offsetTop - v.offsetHeight, n = A + Math.max(D, O + (e ? T : 0) + t + h);
				s.style.height = n + "px";
			} else {
				let e = o.length > 0 && y === o[0].ref.current;
				s.style.top = "0px";
				let t = Math.max(E, f + v.offsetTop + (e ? w : 0) + O) + j;
				s.style.height = t + "px", v.scrollTop = A - E + v.offsetTop;
			}
			s.style.margin = `${Y}px 0`, s.style.minHeight = S + "px", s.style.maxHeight = c + "px", r?.(), requestAnimationFrame(() => g.current = !0);
		}
	}, [
		p,
		a.trigger,
		a.valueNode,
		s,
		u,
		v,
		y,
		b,
		a.dir,
		r
	]);
	H(() => S(), [S]);
	let [C, w] = m.useState();
	H(() => {
		u && w(window.getComputedStyle(u).zIndex);
	}, [u]);
	let T = m.useCallback((e) => {
		e && _.current === !0 && (S(), x?.(), _.current = !1);
	}, [S, x]);
	return /* @__PURE__ */ (0, h.jsx)(Qc, {
		scope: n,
		contentWrapper: s,
		shouldExpandOnScrollRef: g,
		onScrollButtonChange: T,
		children: /* @__PURE__ */ (0, h.jsx)("div", {
			ref: l,
			style: {
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: C
			},
			children: /* @__PURE__ */ (0, h.jsx)(R.div, {
				...i,
				ref: f,
				style: {
					boxSizing: "border-box",
					maxHeight: "100%",
					...i.style
				}
			})
		})
	});
}, "SelectItemAlignedPosition")), Zc = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, align: r = "start", collisionPadding: i = Y, ...a } = e, o = Oc(n);
	return /* @__PURE__ */ (0, h.jsx)(Gs, {
		...o,
		...a,
		ref: t,
		align: r,
		collisionPadding: i,
		style: {
			boxSizing: "border-box",
			...a.style,
			"--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-select-content-available-width": "var(--radix-popper-available-width)",
			"--radix-select-content-available-height": "var(--radix-popper-available-height)",
			"--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
}, "SelectPopperPosition")), [Qc, $c] = Ec(Uc, {}), el = "SelectViewport", tl = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, nonce: r, ...i } = e, a = qc(el, n), o = $c(el, n), s = c(t, a.onViewportChange), l = m.useRef(0);
	return /* @__PURE__ */ (0, h.jsxs)(h.Fragment, { children: [/* @__PURE__ */ (0, h.jsx)("style", {
		dangerouslySetInnerHTML: { __html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}" },
		nonce: r
	}), /* @__PURE__ */ (0, h.jsx)(Cc.Slot, {
		scope: n,
		children: /* @__PURE__ */ (0, h.jsx)(R.div, {
			"data-radix-select-viewport": "",
			role: "presentation",
			...i,
			ref: s,
			style: {
				position: "relative",
				flex: 1,
				overflow: "hidden auto",
				...i.style
			},
			onScroll: V(i.onScroll, (e) => {
				let t = e.currentTarget, { contentWrapper: n, shouldExpandOnScrollRef: r } = o;
				if (r?.current && n) {
					let e = Math.abs(l.current - t.scrollTop);
					if (e > 0) {
						let r = window.innerHeight - Y * 2, i = parseFloat(n.style.minHeight), a = parseFloat(n.style.height), o = Math.max(i, a);
						if (o < r) {
							let i = o + e, a = Math.min(r, i), s = i - a;
							n.style.height = a + "px", n.style.bottom === "0px" && (t.scrollTop = s > 0 ? s : 0, n.style.justifyContent = "flex-end");
						}
					}
				}
				l.current = t.scrollTop;
			})
		})
	})] });
}, "SelectViewport")), [nl, rl] = Ec("SelectGroup"), il = "SelectItem", [al, ol] = Ec(il), sl = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, value: r, disabled: i = !1, textValue: a, ...o } = e, s = Ac(il, n), l = qc(il, n), u = s.value === r, [d, f] = m.useState(a ?? ""), [p, g] = m.useState(!1), _ = U((e) => l.itemRefCallback?.(e, r, i)), v = c(t, _), y = tn(), b = m.useRef("touch"), x = /* @__PURE__ */ J(() => {
		i || (s.onValueChange(r), s.onOpenChange(!1));
	}, "handleSelect");
	return /* @__PURE__ */ (0, h.jsx)(al, {
		scope: n,
		value: r,
		disabled: i,
		textId: y,
		isSelected: u,
		onItemTextChange: m.useCallback((e) => {
			f((t) => t || (e?.textContent ?? "").trim());
		}, []),
		children: /* @__PURE__ */ (0, h.jsx)(Cc.ItemSlot, {
			scope: n,
			value: r,
			disabled: i,
			textValue: d,
			children: /* @__PURE__ */ (0, h.jsx)(R.div, {
				role: "option",
				"aria-labelledby": y,
				"data-highlighted": p ? "" : void 0,
				"aria-selected": u && p,
				"data-state": u ? "checked" : "unchecked",
				"aria-disabled": i || void 0,
				"data-disabled": i ? "" : void 0,
				tabIndex: i ? void 0 : -1,
				...o,
				ref: v,
				onFocus: V(o.onFocus, () => g(!0)),
				onBlur: V(o.onBlur, () => g(!1)),
				onClick: V(o.onClick, () => {
					b.current !== "mouse" && x();
				}),
				onPointerUp: V(o.onPointerUp, () => {
					b.current === "mouse" && x();
				}),
				onPointerDown: V(o.onPointerDown, (e) => {
					b.current = e.pointerType;
				}),
				onPointerMove: V(o.onPointerMove, (e) => {
					b.current = e.pointerType, i ? l.onItemLeave?.() : b.current === "mouse" && e.currentTarget.focus({ preventScroll: !0 });
				}),
				onPointerLeave: V(o.onPointerLeave, (e) => {
					e.currentTarget === document.activeElement && l.onItemLeave?.();
				}),
				onKeyDown: V(o.onKeyDown, (e) => {
					i || e.target !== e.currentTarget || (l.searchRef?.current === "" || e.key !== " ") && (xc.includes(e.key) && x(), e.key === " " && e.preventDefault());
				})
			})
		})
	});
}, "SelectItem")), cl = "SelectItemText", ll = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, className: r, style: i, ...a } = e, o = Ac(cl, n), s = qc(cl, n), l = ol(cl, n), u = Mc(cl, n), [d, f] = m.useState(null), p = U((e) => s.itemTextRefCallback?.(e, l.value, l.disabled)), g = c(t, f, l.onItemTextChange, p), _ = d?.textContent, v = m.useMemo(() => /* @__PURE__ */ (0, h.jsx)("option", {
		value: l.value,
		disabled: l.disabled,
		children: _
	}, l.value), [
		l.disabled,
		l.value,
		_
	]), { onNativeOptionAdd: y, onNativeOptionRemove: b } = u;
	return H(() => (y(v), () => b(v)), [
		y,
		b,
		v
	]), /* @__PURE__ */ (0, h.jsxs)(h.Fragment, { children: [/* @__PURE__ */ (0, h.jsx)(R.span, {
		id: l.textId,
		...a,
		ref: g
	}), l.isSelected && o.valueNode && !o.valueNodeHasChildren && !bl(o.value) ? Qe.createPortal(a.children, o.valueNode) : null] });
}, "SelectItemText")), ul = "SelectItemIndicator", dl = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, ...r } = e;
	return ol(ul, n).isSelected ? /* @__PURE__ */ (0, h.jsx)(R.span, {
		"aria-hidden": !0,
		...r,
		ref: t
	}) : null;
}, "SelectItemIndicator")), fl = "SelectScrollUpButton", pl = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let n = qc(fl, e.__scopeSelect), r = $c(fl, e.__scopeSelect), [i, a] = m.useState(!1), o = c(t, r.onScrollButtonChange);
	return H(() => {
		if (n.viewport && n.isPositioned) {
			let e = function() {
				let e = t.scrollTop > 0;
				a(e);
			};
			J(e, "handleScroll");
			let t = n.viewport;
			return e(), t.addEventListener("scroll", e), () => t.removeEventListener("scroll", e);
		}
	}, [n.viewport, n.isPositioned]), i ? /* @__PURE__ */ (0, h.jsx)(gl, {
		...e,
		ref: o,
		onAutoScroll: () => {
			let { viewport: e, selectedItem: t } = n;
			e && t && (e.scrollTop -= t.offsetHeight);
		}
	}) : null;
}, "SelectScrollUpButton")), ml = "SelectScrollDownButton", hl = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let n = qc(ml, e.__scopeSelect), r = $c(ml, e.__scopeSelect), [i, a] = m.useState(!1), o = c(t, r.onScrollButtonChange);
	return H(() => {
		if (n.viewport && n.isPositioned) {
			let e = function() {
				let e = t.scrollHeight - t.clientHeight, n = Math.ceil(t.scrollTop) < e;
				a(n);
			};
			J(e, "handleScroll");
			let t = n.viewport;
			return e(), t.addEventListener("scroll", e), () => t.removeEventListener("scroll", e);
		}
	}, [n.viewport, n.isPositioned]), i ? /* @__PURE__ */ (0, h.jsx)(gl, {
		...e,
		ref: o,
		onAutoScroll: () => {
			let { viewport: e, selectedItem: t } = n;
			e && t && (e.scrollTop += t.offsetHeight);
		}
	}) : null;
}, "SelectScrollDownButton")), gl = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function(e, t) {
	let { __scopeSelect: n, onAutoScroll: r, ...i } = e, a = qc("SelectScrollButton", n), o = m.useRef(null), s = wc(n), c = m.useCallback(() => {
		o.current !== null && (window.clearInterval(o.current), o.current = null);
	}, []);
	return m.useEffect(() => () => c(), [c]), H(() => {
		s().find((e) => e.ref.current === document.activeElement)?.ref.current?.scrollIntoView({ block: "nearest" });
	}, [s]), /* @__PURE__ */ (0, h.jsx)(R.div, {
		"aria-hidden": !0,
		...i,
		ref: t,
		style: {
			flexShrink: 0,
			...i.style
		},
		onPointerDown: V(i.onPointerDown, () => {
			o.current === null && (o.current = window.setInterval(r, 50));
		}),
		onPointerMove: V(i.onPointerMove, () => {
			a.onItemLeave?.(), o.current === null && (o.current = window.setInterval(r, 50));
		}),
		onPointerLeave: V(i.onPointerLeave, () => {
			c();
		})
	});
}, "SelectScrollButtonImpl")), _l = "SelectBubbleInput", vl = /* @__PURE__ */ m.forwardRef(/* @__PURE__ */ J(function({ __scopeSelect: e, ...t }, n) {
	let r = Ac(_l, e), { value: i, onValueChange: a, required: o, disabled: s, name: l, autoComplete: u, form: d } = r, { nativeOptions: f, nativeSelectKey: p } = r, g = m.useRef(null), _ = c(n, g), v = i ?? "", y = Ys(v), b = Array.from(f).some((e) => (e.props.value ?? "") === "");
	return m.useEffect(() => {
		let e = g.current;
		if (!e) return;
		let t = window.HTMLSelectElement.prototype, n = Object.getOwnPropertyDescriptor(t, "value").set;
		if (y !== v && n) {
			let t = new Event("change", { bubbles: !0 });
			n.call(e, v), e.dispatchEvent(t);
		}
	}, [y, v]), /* @__PURE__ */ (0, h.jsxs)(R.select, {
		"aria-hidden": !0,
		required: o,
		tabIndex: -1,
		name: l,
		autoComplete: u,
		disabled: s,
		form: d,
		onChange: (e) => a(e.target.value),
		...t,
		style: {
			...it,
			...t.style
		},
		ref: _,
		defaultValue: v,
		children: [bl(i) && !b ? /* @__PURE__ */ (0, h.jsx)("option", { value: "" }) : null, Array.from(f)]
	}, p);
}, "SelectBubbleInput"));
function yl(e) {
	return typeof e == "function";
}
J(yl, "isFunction");
function bl(e) {
	return e === "" || e === void 0;
}
J(bl, "shouldShowPlaceholder");
function xl(e) {
	let t = U(e), n = m.useRef(""), r = m.useRef(0), i = m.useCallback((e) => {
		let i = n.current + e;
		t(i), (/* @__PURE__ */ J((function e(t) {
			n.current = t, window.clearTimeout(r.current), t !== "" && (r.current = window.setTimeout(() => e(""), 1e3));
		}), "updateSearch"))(i);
	}, [t]), a = m.useCallback(() => {
		n.current = "", window.clearTimeout(r.current);
	}, []);
	return m.useEffect(() => () => window.clearTimeout(r.current), []), [
		n,
		i,
		a
	];
}
J(xl, "useTypeaheadSearch");
function Sl(e, t, n) {
	let r = t.length > 1 && Array.from(t).every((e) => e === t[0]) ? t[0] : t, i = n ? e.indexOf(n) : -1, a = Cl(e, Math.max(i, 0));
	r.length === 1 && (a = a.filter((e) => e !== n));
	let o = a.find((e) => e.textValue.toLowerCase().startsWith(r.toLowerCase()));
	return o === n ? void 0 : o;
}
J(Sl, "findNextItem");
function Cl(e, t) {
	return e.map((n, r) => e[(t + r) % e.length]);
}
J(Cl, "wrapArray");
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/arrow-up-down.mjs
var wl = {
	name: "arrow-up-down",
	size: 24,
	node: [
		["path", {
			d: "m21 16-4 4-4-4",
			key: "f6ql7i"
		}],
		["path", {
			d: "M17 20V4",
			key: "1ejh1v"
		}],
		["path", {
			d: "m3 8 4-4 4 4",
			key: "11wl7u"
		}],
		["path", {
			d: "M7 4v16",
			key: "1glfcx"
		}]
	]
};
wl.node;
var Tl = a(wl), El = {
	name: "check",
	size: 24,
	node: [["path", {
		d: "M20 6 9 17l-5-5",
		key: "1gmf2c"
	}]]
};
El.node;
var Dl = a(El), Ol = {
	name: "chevron-down",
	size: 24,
	node: [["path", {
		d: "m6 9 6 6 6-6",
		key: "qrunsl"
	}]]
};
Ol.node;
var kl = a(Ol), Al = {
	name: "chevron-right",
	size: 24,
	node: [["path", {
		d: "m9 18 6-6-6-6",
		key: "mthhwq"
	}]]
};
Al.node;
var jl = a(Al), Ml = {
	name: "chevron-left",
	size: 24,
	node: [["path", {
		d: "m15 18-6-6 6-6",
		key: "1wnfg3"
	}]]
};
Ml.node;
var Nl = a(Ml), Pl = {
	name: "chevron-up",
	size: 24,
	node: [["path", {
		d: "m18 15-6-6-6 6",
		key: "153udz"
	}]]
};
Pl.node;
var Fl = a(Pl), Il = {
	name: "circle-alert",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "12",
			r: "10",
			key: "1mglay"
		}],
		["line", {
			x1: "12",
			x2: "12",
			y1: "8",
			y2: "12",
			key: "1pkeuh"
		}],
		["line", {
			x1: "12",
			x2: "12.01",
			y1: "16",
			y2: "16",
			key: "4dfq90"
		}]
	],
	aliases: ["alert-circle"]
};
Il.node;
var Ll = a(Il), Rl = {
	name: "circle-check",
	size: 24,
	node: [["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}], ["path", {
		d: "m16 9-5.5 5.5L8 12",
		key: "xofnsj"
	}]],
	aliases: ["check-circle-2"]
};
Rl.node;
var zl = a(Rl), Bl = {
	name: "inbox",
	size: 24,
	node: [["polyline", {
		points: "22 12 16 12 14 15 10 15 8 12 2 12",
		key: "o97t9d"
	}], ["path", {
		d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
		key: "oot6mr"
	}]]
};
Bl.node;
var Vl = a(Bl), Hl = {
	name: "loader-circle",
	size: 24,
	node: [["path", {
		d: "M21 12a9 9 0 1 1-6.219-8.56",
		key: "13zald"
	}]],
	aliases: ["loader-2"]
};
Hl.node;
var Ul = a(Hl), Wl = {
	name: "plus",
	size: 24,
	node: [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "M12 5v14",
		key: "s699le"
	}]]
};
Wl.node;
var Gl = a(Wl), Kl = {
	name: "search",
	size: 24,
	node: [["path", {
		d: "m21 21-4.34-4.34",
		key: "14j7rj"
	}], ["circle", {
		cx: "11",
		cy: "11",
		r: "8",
		key: "4ej97u"
	}]]
};
Kl.node;
var ql = a(Kl), Jl = {
	name: "sparkles",
	size: 24,
	node: [
		["path", {
			d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
			key: "1s2grr"
		}],
		["path", {
			d: "M20 2v4",
			key: "1rf3ol"
		}],
		["path", {
			d: "M22 4h-4",
			key: "gwowj6"
		}],
		["circle", {
			cx: "4",
			cy: "20",
			r: "2",
			key: "6kqj1y"
		}]
	],
	aliases: ["stars"]
};
Jl.node;
var Yl = a(Jl), Xl = {
	name: "x",
	size: 24,
	node: [["path", {
		d: "M18 6 6 18",
		key: "1bl5f8"
	}], ["path", {
		d: "m6 6 12 12",
		key: "d8bk6v"
	}]]
};
Xl.node;
var Zl = a(Xl);
//#endregion
//#region node_modules/@tanstack/table-core/build/lib/index.mjs
function Ql(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function X(e, t) {
	return (n) => {
		t.setState((t) => ({
			...t,
			[e]: Ql(n, t[e])
		}));
	};
}
function $l(e) {
	return e instanceof Function;
}
function eu(e) {
	return Array.isArray(e) && e.every((e) => typeof e == "number");
}
function tu(e, t) {
	let n = [], r = (e) => {
		e.forEach((e) => {
			n.push(e);
			let i = t(e);
			i != null && i.length && r(i);
		});
	};
	return r(e), n;
}
function Z(e, t, n) {
	let r = [], i;
	return (a) => {
		let o;
		n.key && n.debug && (o = Date.now());
		let s = e(a);
		if (!(s.length !== r.length || s.some((e, t) => r[t] !== e))) return i;
		r = s;
		let c;
		if (n.key && n.debug && (c = Date.now()), i = t(...s), n == null || n.onChange == null || n.onChange(i), n.key && n.debug && n != null && n.debug()) {
			let e = Math.round((Date.now() - o) * 100) / 100, t = Math.round((Date.now() - c) * 100) / 100, r = t / 16, i = (e, t) => {
				for (e = String(e); e.length < t;) e = " " + e;
				return e;
			};
			console.info(`%c⏱ ${i(t, 5)} /${i(e, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * r, 120))}deg 100% 31%);`, n?.key);
		}
		return i;
	};
}
function Q(e, t, n, r) {
	return {
		debug: () => e?.debugAll ?? e[t],
		key: !1,
		onChange: r
	};
}
function nu(e, t, n, r) {
	let i = {
		id: `${t.id}_${n.id}`,
		row: t,
		column: n,
		getValue: () => t.getValue(r),
		renderValue: () => i.getValue() ?? e.options.renderFallbackValue,
		getContext: Z(() => [
			e,
			n,
			t,
			i
		], (e, t, n, r) => ({
			table: e,
			column: t,
			row: n,
			cell: r,
			getValue: r.getValue,
			renderValue: r.renderValue
		}), Q(e.options, "debugCells", "cell.getContext"))
	};
	return e._features.forEach((r) => {
		r.createCell == null || r.createCell(i, n, t, e);
	}, {}), i;
}
function ru(e, t, n, r) {
	let i = {
		...e._getDefaultColumnDef(),
		...t
	}, a = i.accessorKey, o = i.id ?? (a ? typeof String.prototype.replaceAll == "function" ? a.replaceAll(".", "_") : a.replace(/\./g, "_") : void 0) ?? (typeof i.header == "string" ? i.header : void 0), s;
	if (i.accessorFn ? s = i.accessorFn : a && (s = a.includes(".") ? (e) => {
		let t = e;
		for (let e of a.split(".")) t = t?.[e];
		return t;
	} : (e) => e[i.accessorKey]), !o) throw Error();
	let c = {
		id: `${String(o)}`,
		accessorFn: s,
		parent: r,
		depth: n,
		columnDef: i,
		columns: [],
		getFlatColumns: Z(() => [!0], () => [c, ...c.columns?.flatMap((e) => e.getFlatColumns())], Q(e.options, "debugColumns", "column.getFlatColumns")),
		getLeafColumns: Z(() => [e._getOrderColumnsFn()], (e) => {
			var t;
			return (t = c.columns) != null && t.length ? e(c.columns.flatMap((e) => e.getLeafColumns())) : [c];
		}, Q(e.options, "debugColumns", "column.getLeafColumns"))
	};
	for (let t of e._features) t.createColumn == null || t.createColumn(c, e);
	return c;
}
var $ = "debugHeaders";
function iu(e, t, n) {
	let r = {
		id: n.id ?? t.id,
		column: t,
		index: n.index,
		isPlaceholder: !!n.isPlaceholder,
		placeholderId: n.placeholderId,
		depth: n.depth,
		subHeaders: [],
		colSpan: 0,
		rowSpan: 0,
		headerGroup: null,
		getLeafHeaders: () => {
			let e = [], t = (n) => {
				n.subHeaders && n.subHeaders.length && n.subHeaders.map(t), e.push(n);
			};
			return t(r), e;
		},
		getContext: () => ({
			table: e,
			header: r,
			column: t
		})
	};
	return e._features.forEach((t) => {
		t.createHeader == null || t.createHeader(r, e);
	}), r;
}
var au = { createTable: (e) => {
	e.getHeaderGroups = Z(() => [
		e.getAllColumns(),
		e.getVisibleLeafColumns(),
		e.getState().columnPinning.left,
		e.getState().columnPinning.right
	], (t, n, r, i) => {
		let a = r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], o = i?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], s = n.filter((e) => !(r != null && r.includes(e.id)) && !(i != null && i.includes(e.id)));
		return ou(t, [
			...a,
			...s,
			...o
		], e);
	}, Q(e.options, $, "getHeaderGroups")), e.getCenterHeaderGroups = Z(() => [
		e.getAllColumns(),
		e.getVisibleLeafColumns(),
		e.getState().columnPinning.left,
		e.getState().columnPinning.right
	], (t, n, r, i) => (n = n.filter((e) => !(r != null && r.includes(e.id)) && !(i != null && i.includes(e.id))), ou(t, n, e, "center")), Q(e.options, $, "getCenterHeaderGroups")), e.getLeftHeaderGroups = Z(() => [
		e.getAllColumns(),
		e.getVisibleLeafColumns(),
		e.getState().columnPinning.left
	], (t, n, r) => ou(t, r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], e, "left"), Q(e.options, $, "getLeftHeaderGroups")), e.getRightHeaderGroups = Z(() => [
		e.getAllColumns(),
		e.getVisibleLeafColumns(),
		e.getState().columnPinning.right
	], (t, n, r) => ou(t, r?.map((e) => n.find((t) => t.id === e)).filter(Boolean) ?? [], e, "right"), Q(e.options, $, "getRightHeaderGroups")), e.getFooterGroups = Z(() => [e.getHeaderGroups()], (e) => [...e].reverse(), Q(e.options, $, "getFooterGroups")), e.getLeftFooterGroups = Z(() => [e.getLeftHeaderGroups()], (e) => [...e].reverse(), Q(e.options, $, "getLeftFooterGroups")), e.getCenterFooterGroups = Z(() => [e.getCenterHeaderGroups()], (e) => [...e].reverse(), Q(e.options, $, "getCenterFooterGroups")), e.getRightFooterGroups = Z(() => [e.getRightHeaderGroups()], (e) => [...e].reverse(), Q(e.options, $, "getRightFooterGroups")), e.getFlatHeaders = Z(() => [e.getHeaderGroups()], (e) => e.map((e) => e.headers).flat(), Q(e.options, $, "getFlatHeaders")), e.getLeftFlatHeaders = Z(() => [e.getLeftHeaderGroups()], (e) => e.map((e) => e.headers).flat(), Q(e.options, $, "getLeftFlatHeaders")), e.getCenterFlatHeaders = Z(() => [e.getCenterHeaderGroups()], (e) => e.map((e) => e.headers).flat(), Q(e.options, $, "getCenterFlatHeaders")), e.getRightFlatHeaders = Z(() => [e.getRightHeaderGroups()], (e) => e.map((e) => e.headers).flat(), Q(e.options, $, "getRightFlatHeaders")), e.getCenterLeafHeaders = Z(() => [e.getCenterFlatHeaders()], (e) => e.filter((e) => {
		var t;
		return !((t = e.subHeaders) != null && t.length);
	}), Q(e.options, $, "getCenterLeafHeaders")), e.getLeftLeafHeaders = Z(() => [e.getLeftFlatHeaders()], (e) => e.filter((e) => {
		var t;
		return !((t = e.subHeaders) != null && t.length);
	}), Q(e.options, $, "getLeftLeafHeaders")), e.getRightLeafHeaders = Z(() => [e.getRightFlatHeaders()], (e) => e.filter((e) => {
		var t;
		return !((t = e.subHeaders) != null && t.length);
	}), Q(e.options, $, "getRightLeafHeaders")), e.getLeafHeaders = Z(() => [
		e.getLeftHeaderGroups(),
		e.getCenterHeaderGroups(),
		e.getRightHeaderGroups()
	], (e, t, n) => [
		...e[0]?.headers ?? [],
		...t[0]?.headers ?? [],
		...n[0]?.headers ?? []
	].map((e) => e.getLeafHeaders()).flat(), Q(e.options, $, "getLeafHeaders"));
} };
function ou(e, t, n, r) {
	let i = 0, a = function(e, t) {
		t === void 0 && (t = 1), i = Math.max(i, t), e.filter((e) => e.getIsVisible()).forEach((e) => {
			var n;
			(n = e.columns) != null && n.length && a(e.columns, t + 1);
		}, 0);
	};
	a(e);
	let o = [], s = (e, t) => {
		let i = {
			depth: t,
			id: [r, `${t}`].filter(Boolean).join("_"),
			headers: []
		}, a = [];
		e.forEach((e) => {
			let o = [...a].reverse()[0], s = e.column.depth === i.depth, c, l = !1;
			if (s && e.column.parent ? c = e.column.parent : (c = e.column, l = !0), o && o?.column === c) o.subHeaders.push(e);
			else {
				let i = iu(n, c, {
					id: [
						r,
						t,
						c.id,
						e?.id
					].filter(Boolean).join("_"),
					isPlaceholder: l,
					placeholderId: l ? `${a.filter((e) => e.column === c).length}` : void 0,
					depth: t,
					index: a.length
				});
				i.subHeaders.push(e), a.push(i);
			}
			i.headers.push(e), e.headerGroup = i;
		}), o.push(i), t > 0 && s(a, t - 1);
	};
	s(t.map((e, t) => iu(n, e, {
		depth: i,
		index: t
	})), i - 1), o.reverse();
	let c = (e) => e.filter((e) => e.column.getIsVisible()).map((e) => {
		let t = 0, n = 0, r = [0];
		e.subHeaders && e.subHeaders.length ? (r = [], c(e.subHeaders).forEach((e) => {
			let { colSpan: n, rowSpan: i } = e;
			t += n, r.push(i);
		})) : t = 1;
		let i = Math.min(...r);
		return n += i, e.colSpan = t, e.rowSpan = n, {
			colSpan: t,
			rowSpan: n
		};
	});
	return c(o[0]?.headers ?? []), o;
}
var su = (e, t, n, r, i, a, o) => {
	let s = {
		id: t,
		index: r,
		original: n,
		depth: i,
		parentId: o,
		_valuesCache: {},
		_uniqueValuesCache: {},
		getValue: (t) => {
			if (s._valuesCache.hasOwnProperty(t)) return s._valuesCache[t];
			let n = e.getColumn(t);
			if (n != null && n.accessorFn) return s._valuesCache[t] = n.accessorFn(s.original, r), s._valuesCache[t];
		},
		getUniqueValues: (t) => {
			if (s._uniqueValuesCache.hasOwnProperty(t)) return s._uniqueValuesCache[t];
			let n = e.getColumn(t);
			if (n != null && n.accessorFn) return n.columnDef.getUniqueValues ? (s._uniqueValuesCache[t] = n.columnDef.getUniqueValues(s.original, r), s._uniqueValuesCache[t]) : (s._uniqueValuesCache[t] = [s.getValue(t)], s._uniqueValuesCache[t]);
		},
		renderValue: (t) => s.getValue(t) ?? e.options.renderFallbackValue,
		subRows: a ?? [],
		getLeafRows: () => tu(s.subRows, (e) => e.subRows),
		getParentRow: () => s.parentId ? e.getRow(s.parentId, !0) : void 0,
		getParentRows: () => {
			let e = [], t = s;
			for (;;) {
				let n = t.getParentRow();
				if (!n) break;
				e.push(n), t = n;
			}
			return e.reverse();
		},
		getAllCells: Z(() => [e.getAllLeafColumns()], (t) => t.map((t) => nu(e, s, t, t.id)), Q(e.options, "debugRows", "getAllCells")),
		_getAllCellsByColumnId: Z(() => [s.getAllCells()], (e) => e.reduce((e, t) => (e[t.column.id] = t, e), {}), Q(e.options, "debugRows", "getAllCellsByColumnId"))
	};
	for (let t = 0; t < e._features.length; t++) {
		let n = e._features[t];
		n == null || n.createRow == null || n.createRow(s, e);
	}
	return s;
}, cu = { createColumn: (e, t) => {
	e._getFacetedRowModel = t.options.getFacetedRowModel && t.options.getFacetedRowModel(t, e.id), e.getFacetedRowModel = () => e._getFacetedRowModel ? e._getFacetedRowModel() : t.getPreFilteredRowModel(), e._getFacetedUniqueValues = t.options.getFacetedUniqueValues && t.options.getFacetedUniqueValues(t, e.id), e.getFacetedUniqueValues = () => e._getFacetedUniqueValues ? e._getFacetedUniqueValues() : /* @__PURE__ */ new Map(), e._getFacetedMinMaxValues = t.options.getFacetedMinMaxValues && t.options.getFacetedMinMaxValues(t, e.id), e.getFacetedMinMaxValues = () => {
		if (e._getFacetedMinMaxValues) return e._getFacetedMinMaxValues();
	};
} }, lu = (e, t, n) => {
	var r, i;
	let a = n == null || (r = n.toString()) == null ? void 0 : r.toLowerCase();
	return !!((i = e.getValue(t)) != null && (i = i.toString()) != null && (i = i.toLowerCase()) != null && i.includes(a));
};
lu.autoRemove = (e) => yu(e);
var uu = (e, t, n) => {
	var r;
	return !!((r = e.getValue(t)) != null && (r = r.toString()) != null && r.includes(n));
};
uu.autoRemove = (e) => yu(e);
var du = (e, t, n) => {
	var r;
	return ((r = e.getValue(t)) == null || (r = r.toString()) == null ? void 0 : r.toLowerCase()) === n?.toLowerCase();
};
du.autoRemove = (e) => yu(e);
var fu = (e, t, n) => e.getValue(t)?.includes(n);
fu.autoRemove = (e) => yu(e);
var pu = (e, t, n) => !n.some((n) => {
	var r;
	return !((r = e.getValue(t)) != null && r.includes(n));
});
pu.autoRemove = (e) => yu(e) || !(e != null && e.length);
var mu = (e, t, n) => n.some((n) => e.getValue(t)?.includes(n));
mu.autoRemove = (e) => yu(e) || !(e != null && e.length);
var hu = (e, t, n) => e.getValue(t) === n;
hu.autoRemove = (e) => yu(e);
var gu = (e, t, n) => e.getValue(t) == n;
gu.autoRemove = (e) => yu(e);
var _u = (e, t, n) => {
	let [r, i] = n, a = e.getValue(t);
	return a >= r && a <= i;
};
_u.resolveFilterValue = (e) => {
	let [t, n] = e, r = typeof t == "number" ? t : parseFloat(t), i = typeof n == "number" ? n : parseFloat(n), a = t === null || Number.isNaN(r) ? -Infinity : r, o = n === null || Number.isNaN(i) ? Infinity : i;
	if (a > o) {
		let e = a;
		a = o, o = e;
	}
	return [a, o];
}, _u.autoRemove = (e) => yu(e) || yu(e[0]) && yu(e[1]);
var vu = {
	includesString: lu,
	includesStringSensitive: uu,
	equalsString: du,
	arrIncludes: fu,
	arrIncludesAll: pu,
	arrIncludesSome: mu,
	equals: hu,
	weakEquals: gu,
	inNumberRange: _u
};
function yu(e) {
	return e == null || e === "";
}
var bu = {
	getDefaultColumnDef: () => ({ filterFn: "auto" }),
	getInitialState: (e) => ({
		columnFilters: [],
		...e
	}),
	getDefaultOptions: (e) => ({
		onColumnFiltersChange: X("columnFilters", e),
		filterFromLeafRows: !1,
		maxLeafRowFilterDepth: 100
	}),
	createColumn: (e, t) => {
		e.getAutoFilterFn = () => {
			let n = t.getCoreRowModel().flatRows[0]?.getValue(e.id);
			return typeof n == "string" ? vu.includesString : typeof n == "number" ? vu.inNumberRange : typeof n == "boolean" || typeof n == "object" && n ? vu.equals : Array.isArray(n) ? vu.arrIncludes : vu.weakEquals;
		}, e.getFilterFn = () => $l(e.columnDef.filterFn) ? e.columnDef.filterFn : e.columnDef.filterFn === "auto" ? e.getAutoFilterFn() : t.options.filterFns?.[e.columnDef.filterFn] ?? vu[e.columnDef.filterFn], e.getCanFilter = () => (e.columnDef.enableColumnFilter ?? !0) && (t.options.enableColumnFilters ?? !0) && (t.options.enableFilters ?? !0) && !!e.accessorFn, e.getIsFiltered = () => e.getFilterIndex() > -1, e.getFilterValue = () => {
			var n;
			return (n = t.getState().columnFilters) == null || (n = n.find((t) => t.id === e.id)) == null ? void 0 : n.value;
		}, e.getFilterIndex = () => t.getState().columnFilters?.findIndex((t) => t.id === e.id) ?? -1, e.setFilterValue = (n) => {
			t.setColumnFilters((t) => {
				let r = e.getFilterFn(), i = t?.find((t) => t.id === e.id), a = Ql(n, i ? i.value : void 0);
				if (xu(r, a, e)) return t?.filter((t) => t.id !== e.id) ?? [];
				let o = {
					id: e.id,
					value: a
				};
				return i ? t?.map((t) => t.id === e.id ? o : t) ?? [] : t != null && t.length ? [...t, o] : [o];
			});
		};
	},
	createRow: (e, t) => {
		e.columnFilters = {}, e.columnFiltersMeta = {};
	},
	createTable: (e) => {
		e.setColumnFilters = (t) => {
			let n = e.getAllLeafColumns();
			e.options.onColumnFiltersChange == null || e.options.onColumnFiltersChange((e) => Ql(t, e)?.filter((e) => {
				let t = n.find((t) => t.id === e.id);
				return !(t && xu(t.getFilterFn(), e.value, t));
			}));
		}, e.resetColumnFilters = (t) => {
			e.setColumnFilters(t ? [] : e.initialState?.columnFilters ?? []);
		}, e.getPreFilteredRowModel = () => e.getCoreRowModel(), e.getFilteredRowModel = () => (!e._getFilteredRowModel && e.options.getFilteredRowModel && (e._getFilteredRowModel = e.options.getFilteredRowModel(e)), e.options.manualFiltering || !e._getFilteredRowModel ? e.getPreFilteredRowModel() : e._getFilteredRowModel());
	}
};
function xu(e, t, n) {
	return (e && e.autoRemove ? e.autoRemove(t, n) : !1) || t === void 0 || typeof t == "string" && !t;
}
var Su = {
	sum: (e, t, n) => n.reduce((t, n) => {
		let r = n.getValue(e);
		return t + (typeof r == "number" ? r : 0);
	}, 0),
	min: (e, t, n) => {
		let r;
		return n.forEach((t) => {
			let n = t.getValue(e);
			n != null && (r > n || r === void 0 && n >= n) && (r = n);
		}), r;
	},
	max: (e, t, n) => {
		let r;
		return n.forEach((t) => {
			let n = t.getValue(e);
			n != null && (r < n || r === void 0 && n >= n) && (r = n);
		}), r;
	},
	extent: (e, t, n) => {
		let r, i;
		return n.forEach((t) => {
			let n = t.getValue(e);
			n != null && (r === void 0 ? n >= n && (r = i = n) : (r > n && (r = n), i < n && (i = n)));
		}), [r, i];
	},
	mean: (e, t) => {
		let n = 0, r = 0;
		if (t.forEach((t) => {
			let i = t.getValue(e);
			i != null && (i = +i) >= i && (++n, r += i);
		}), n) return r / n;
	},
	median: (e, t) => {
		if (!t.length) return;
		let n = t.map((t) => t.getValue(e));
		if (!eu(n)) return;
		if (n.length === 1) return n[0];
		let r = Math.floor(n.length / 2), i = n.sort((e, t) => e - t);
		return n.length % 2 == 0 ? (i[r - 1] + i[r]) / 2 : i[r];
	},
	unique: (e, t) => Array.from(new Set(t.map((t) => t.getValue(e))).values()),
	uniqueCount: (e, t) => new Set(t.map((t) => t.getValue(e))).size,
	count: (e, t) => t.length
}, Cu = {
	getDefaultColumnDef: () => ({
		aggregatedCell: (e) => {
			var t;
			return ((t = e.getValue()) == null || t.toString == null ? void 0 : t.toString()) ?? null;
		},
		aggregationFn: "auto"
	}),
	getInitialState: (e) => ({
		grouping: [],
		...e
	}),
	getDefaultOptions: (e) => ({
		onGroupingChange: X("grouping", e),
		groupedColumnMode: "reorder"
	}),
	createColumn: (e, t) => {
		e.toggleGrouping = () => {
			t.setGrouping((t) => t != null && t.includes(e.id) ? t.filter((t) => t !== e.id) : [...t ?? [], e.id]);
		}, e.getCanGroup = () => (e.columnDef.enableGrouping ?? !0) && (t.options.enableGrouping ?? !0) && (!!e.accessorFn || !!e.columnDef.getGroupingValue), e.getIsGrouped = () => t.getState().grouping?.includes(e.id), e.getGroupedIndex = () => t.getState().grouping?.indexOf(e.id), e.getToggleGroupingHandler = () => {
			let t = e.getCanGroup();
			return () => {
				t && e.toggleGrouping();
			};
		}, e.getAutoAggregationFn = () => {
			let n = t.getCoreRowModel().flatRows[0]?.getValue(e.id);
			if (typeof n == "number") return Su.sum;
			if (Object.prototype.toString.call(n) === "[object Date]") return Su.extent;
		}, e.getAggregationFn = () => {
			if (!e) throw Error();
			return $l(e.columnDef.aggregationFn) ? e.columnDef.aggregationFn : e.columnDef.aggregationFn === "auto" ? e.getAutoAggregationFn() : t.options.aggregationFns?.[e.columnDef.aggregationFn] ?? Su[e.columnDef.aggregationFn];
		};
	},
	createTable: (e) => {
		e.setGrouping = (t) => e.options.onGroupingChange == null ? void 0 : e.options.onGroupingChange(t), e.resetGrouping = (t) => {
			e.setGrouping(t ? [] : e.initialState?.grouping ?? []);
		}, e.getPreGroupedRowModel = () => e.getFilteredRowModel(), e.getGroupedRowModel = () => (!e._getGroupedRowModel && e.options.getGroupedRowModel && (e._getGroupedRowModel = e.options.getGroupedRowModel(e)), e.options.manualGrouping || !e._getGroupedRowModel ? e.getPreGroupedRowModel() : e._getGroupedRowModel());
	},
	createRow: (e, t) => {
		e.getIsGrouped = () => !!e.groupingColumnId, e.getGroupingValue = (n) => {
			if (e._groupingValuesCache.hasOwnProperty(n)) return e._groupingValuesCache[n];
			let r = t.getColumn(n);
			return r != null && r.columnDef.getGroupingValue ? (e._groupingValuesCache[n] = r.columnDef.getGroupingValue(e.original), e._groupingValuesCache[n]) : e.getValue(n);
		}, e._groupingValuesCache = {};
	},
	createCell: (e, t, n, r) => {
		e.getIsGrouped = () => t.getIsGrouped() && t.id === n.groupingColumnId, e.getIsPlaceholder = () => !e.getIsGrouped() && t.getIsGrouped(), e.getIsAggregated = () => {
			var t;
			return !e.getIsGrouped() && !e.getIsPlaceholder() && !!((t = n.subRows) != null && t.length);
		};
	}
};
function wu(e, t, n) {
	if (!(t != null && t.length) || !n) return e;
	let r = e.filter((e) => !t.includes(e.id));
	return n === "remove" ? r : [...t.map((t) => e.find((e) => e.id === t)).filter(Boolean), ...r];
}
var Tu = {
	getInitialState: (e) => ({
		columnOrder: [],
		...e
	}),
	getDefaultOptions: (e) => ({ onColumnOrderChange: X("columnOrder", e) }),
	createColumn: (e, t) => {
		e.getIndex = Z((e) => [Iu(t, e)], (t) => t.findIndex((t) => t.id === e.id), Q(t.options, "debugColumns", "getIndex")), e.getIsFirstColumn = (n) => Iu(t, n)[0]?.id === e.id, e.getIsLastColumn = (n) => {
			let r = Iu(t, n);
			return r[r.length - 1]?.id === e.id;
		};
	},
	createTable: (e) => {
		e.setColumnOrder = (t) => e.options.onColumnOrderChange == null ? void 0 : e.options.onColumnOrderChange(t), e.resetColumnOrder = (t) => {
			e.setColumnOrder(t ? [] : e.initialState.columnOrder ?? []);
		}, e._getOrderColumnsFn = Z(() => [
			e.getState().columnOrder,
			e.getState().grouping,
			e.options.groupedColumnMode
		], (e, t, n) => (r) => {
			let i = [];
			if (!(e != null && e.length)) i = r;
			else {
				let t = [...e], n = [...r];
				for (; n.length && t.length;) {
					let e = t.shift(), r = n.findIndex((t) => t.id === e);
					r > -1 && i.push(n.splice(r, 1)[0]);
				}
				i = [...i, ...n];
			}
			return wu(i, t, n);
		}, Q(e.options, "debugTable", "_getOrderColumnsFn"));
	}
}, Eu = () => ({
	left: [],
	right: []
}), Du = {
	getInitialState: (e) => ({
		columnPinning: Eu(),
		...e
	}),
	getDefaultOptions: (e) => ({ onColumnPinningChange: X("columnPinning", e) }),
	createColumn: (e, t) => {
		e.pin = (n) => {
			let r = e.getLeafColumns().map((e) => e.id).filter(Boolean);
			t.setColumnPinning((e) => n === "right" ? {
				left: (e?.left ?? []).filter((e) => !(r != null && r.includes(e))),
				right: [...(e?.right ?? []).filter((e) => !(r != null && r.includes(e))), ...r]
			} : n === "left" ? {
				left: [...(e?.left ?? []).filter((e) => !(r != null && r.includes(e))), ...r],
				right: (e?.right ?? []).filter((e) => !(r != null && r.includes(e)))
			} : {
				left: (e?.left ?? []).filter((e) => !(r != null && r.includes(e))),
				right: (e?.right ?? []).filter((e) => !(r != null && r.includes(e)))
			});
		}, e.getCanPin = () => e.getLeafColumns().some((e) => (e.columnDef.enablePinning ?? !0) && (t.options.enableColumnPinning ?? t.options.enablePinning ?? !0)), e.getIsPinned = () => {
			let n = e.getLeafColumns().map((e) => e.id), { left: r, right: i } = t.getState().columnPinning, a = n.some((e) => r?.includes(e)), o = n.some((e) => i?.includes(e));
			return a ? "left" : o ? "right" : !1;
		}, e.getPinnedIndex = () => {
			var n;
			let r = e.getIsPinned();
			return r ? ((n = t.getState().columnPinning) == null || (n = n[r]) == null ? void 0 : n.indexOf(e.id)) ?? -1 : 0;
		};
	},
	createRow: (e, t) => {
		e.getCenterVisibleCells = Z(() => [
			e._getAllVisibleCells(),
			t.getState().columnPinning.left,
			t.getState().columnPinning.right
		], (e, t, n) => {
			let r = [...t ?? [], ...n ?? []];
			return e.filter((e) => !r.includes(e.column.id));
		}, Q(t.options, "debugRows", "getCenterVisibleCells")), e.getLeftVisibleCells = Z(() => [e._getAllVisibleCells(), t.getState().columnPinning.left], (e, t) => (t ?? []).map((t) => e.find((e) => e.column.id === t)).filter(Boolean).map((e) => ({
			...e,
			position: "left"
		})), Q(t.options, "debugRows", "getLeftVisibleCells")), e.getRightVisibleCells = Z(() => [e._getAllVisibleCells(), t.getState().columnPinning.right], (e, t) => (t ?? []).map((t) => e.find((e) => e.column.id === t)).filter(Boolean).map((e) => ({
			...e,
			position: "right"
		})), Q(t.options, "debugRows", "getRightVisibleCells"));
	},
	createTable: (e) => {
		e.setColumnPinning = (t) => e.options.onColumnPinningChange == null ? void 0 : e.options.onColumnPinningChange(t), e.resetColumnPinning = (t) => e.setColumnPinning(t ? Eu() : e.initialState?.columnPinning ?? Eu()), e.getIsSomeColumnsPinned = (t) => {
			let n = e.getState().columnPinning;
			return t ? !!n[t]?.length : !!(n.left?.length || n.right?.length);
		}, e.getLeftLeafColumns = Z(() => [e.getAllLeafColumns(), e.getState().columnPinning.left], (e, t) => (t ?? []).map((t) => e.find((e) => e.id === t)).filter(Boolean), Q(e.options, "debugColumns", "getLeftLeafColumns")), e.getRightLeafColumns = Z(() => [e.getAllLeafColumns(), e.getState().columnPinning.right], (e, t) => (t ?? []).map((t) => e.find((e) => e.id === t)).filter(Boolean), Q(e.options, "debugColumns", "getRightLeafColumns")), e.getCenterLeafColumns = Z(() => [
			e.getAllLeafColumns(),
			e.getState().columnPinning.left,
			e.getState().columnPinning.right
		], (e, t, n) => {
			let r = [...t ?? [], ...n ?? []];
			return e.filter((e) => !r.includes(e.id));
		}, Q(e.options, "debugColumns", "getCenterLeafColumns"));
	}
};
function Ou(e) {
	return e || (typeof document < "u" ? document : null);
}
var ku = {
	size: 150,
	minSize: 20,
	maxSize: 2 ** 53 - 1
}, Au = () => ({
	startOffset: null,
	startSize: null,
	deltaOffset: null,
	deltaPercentage: null,
	isResizingColumn: !1,
	columnSizingStart: []
}), ju = {
	getDefaultColumnDef: () => ku,
	getInitialState: (e) => ({
		columnSizing: {},
		columnSizingInfo: Au(),
		...e
	}),
	getDefaultOptions: (e) => ({
		columnResizeMode: "onEnd",
		columnResizeDirection: "ltr",
		onColumnSizingChange: X("columnSizing", e),
		onColumnSizingInfoChange: X("columnSizingInfo", e)
	}),
	createColumn: (e, t) => {
		e.getSize = () => {
			let n = t.getState().columnSizing[e.id];
			return Math.min(Math.max(e.columnDef.minSize ?? ku.minSize, n ?? e.columnDef.size ?? ku.size), e.columnDef.maxSize ?? ku.maxSize);
		}, e.getStart = Z((e) => [
			e,
			Iu(t, e),
			t.getState().columnSizing
		], (t, n) => n.slice(0, e.getIndex(t)).reduce((e, t) => e + t.getSize(), 0), Q(t.options, "debugColumns", "getStart")), e.getAfter = Z((e) => [
			e,
			Iu(t, e),
			t.getState().columnSizing
		], (t, n) => n.slice(e.getIndex(t) + 1).reduce((e, t) => e + t.getSize(), 0), Q(t.options, "debugColumns", "getAfter")), e.resetSize = () => {
			t.setColumnSizing((t) => {
				let { [e.id]: n, ...r } = t;
				return r;
			});
		}, e.getCanResize = () => (e.columnDef.enableResizing ?? !0) && (t.options.enableColumnResizing ?? !0), e.getIsResizing = () => t.getState().columnSizingInfo.isResizingColumn === e.id;
	},
	createHeader: (e, t) => {
		e.getSize = () => {
			let t = 0, n = (e) => {
				e.subHeaders.length ? e.subHeaders.forEach(n) : t += e.column.getSize() ?? 0;
			};
			return n(e), t;
		}, e.getStart = () => {
			if (e.index > 0) {
				let t = e.headerGroup.headers[e.index - 1];
				return t.getStart() + t.getSize();
			}
			return 0;
		}, e.getResizeHandler = (n) => {
			let r = t.getColumn(e.column.id), i = r?.getCanResize();
			return (a) => {
				if (!r || !i || (a.persist == null || a.persist(), Pu(a) && a.touches && a.touches.length > 1)) return;
				let o = e.getSize(), s = e ? e.getLeafHeaders().map((e) => [e.column.id, e.column.getSize()]) : [[r.id, r.getSize()]], c = Pu(a) ? Math.round(a.touches[0].clientX) : a.clientX, l = {}, u = (e, n) => {
					typeof n == "number" && (t.setColumnSizingInfo((e) => {
						let r = t.options.columnResizeDirection === "rtl" ? -1 : 1, i = (n - (e?.startOffset ?? 0)) * r, a = Math.max(i / (e?.startSize ?? 0), -.999999);
						return e.columnSizingStart.forEach((e) => {
							let [t, n] = e;
							l[t] = Math.round(Math.max(n + n * a, 0) * 100) / 100;
						}), {
							...e,
							deltaOffset: i,
							deltaPercentage: a
						};
					}), (t.options.columnResizeMode === "onChange" || e === "end") && t.setColumnSizing((e) => ({
						...e,
						...l
					})));
				}, d = (e) => u("move", e), f = (e) => {
					u("end", e), t.setColumnSizingInfo((e) => ({
						...e,
						isResizingColumn: !1,
						startOffset: null,
						startSize: null,
						deltaOffset: null,
						deltaPercentage: null,
						columnSizingStart: []
					}));
				}, p = Ou(n), m = {
					moveHandler: (e) => d(e.clientX),
					upHandler: (e) => {
						p?.removeEventListener("mousemove", m.moveHandler), p?.removeEventListener("mouseup", m.upHandler), f(e.clientX);
					}
				}, h = {
					moveHandler: (e) => (e.cancelable && (e.preventDefault(), e.stopPropagation()), d(e.touches[0].clientX), !1),
					upHandler: (e) => {
						p?.removeEventListener("touchmove", h.moveHandler), p?.removeEventListener("touchend", h.upHandler), e.cancelable && (e.preventDefault(), e.stopPropagation()), f(e.touches[0]?.clientX);
					}
				}, g = Nu() ? { passive: !1 } : !1;
				Pu(a) ? (p?.addEventListener("touchmove", h.moveHandler, g), p?.addEventListener("touchend", h.upHandler, g)) : (p?.addEventListener("mousemove", m.moveHandler, g), p?.addEventListener("mouseup", m.upHandler, g)), t.setColumnSizingInfo((e) => ({
					...e,
					startOffset: c,
					startSize: o,
					deltaOffset: 0,
					deltaPercentage: 0,
					columnSizingStart: s,
					isResizingColumn: r.id
				}));
			};
		};
	},
	createTable: (e) => {
		e.setColumnSizing = (t) => e.options.onColumnSizingChange == null ? void 0 : e.options.onColumnSizingChange(t), e.setColumnSizingInfo = (t) => e.options.onColumnSizingInfoChange == null ? void 0 : e.options.onColumnSizingInfoChange(t), e.resetColumnSizing = (t) => {
			e.setColumnSizing(t ? {} : e.initialState.columnSizing ?? {});
		}, e.resetHeaderSizeInfo = (t) => {
			e.setColumnSizingInfo(t ? Au() : e.initialState.columnSizingInfo ?? Au());
		}, e.getTotalSize = () => e.getHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getLeftTotalSize = () => e.getLeftHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getCenterTotalSize = () => e.getCenterHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0, e.getRightTotalSize = () => e.getRightHeaderGroups()[0]?.headers.reduce((e, t) => e + t.getSize(), 0) ?? 0;
	}
}, Mu = null;
function Nu() {
	if (typeof Mu == "boolean") return Mu;
	let e = !1;
	try {
		let t = { get passive() {
			return e = !0, !1;
		} }, n = () => {};
		window.addEventListener("test", n, t), window.removeEventListener("test", n);
	} catch {
		e = !1;
	}
	return Mu = e, Mu;
}
function Pu(e) {
	return e.type === "touchstart";
}
var Fu = {
	getInitialState: (e) => ({
		columnVisibility: {},
		...e
	}),
	getDefaultOptions: (e) => ({ onColumnVisibilityChange: X("columnVisibility", e) }),
	createColumn: (e, t) => {
		e.toggleVisibility = (n) => {
			e.getCanHide() && t.setColumnVisibility((t) => ({
				...t,
				[e.id]: n ?? !e.getIsVisible()
			}));
		}, e.getIsVisible = () => {
			let n = e.columns;
			return (n.length ? n.some((e) => e.getIsVisible()) : t.getState().columnVisibility?.[e.id]) ?? !0;
		}, e.getCanHide = () => (e.columnDef.enableHiding ?? !0) && (t.options.enableHiding ?? !0), e.getToggleVisibilityHandler = () => (t) => {
			e.toggleVisibility == null || e.toggleVisibility(t.target.checked);
		};
	},
	createRow: (e, t) => {
		e._getAllVisibleCells = Z(() => [e.getAllCells(), t.getState().columnVisibility], (e) => e.filter((e) => e.column.getIsVisible()), Q(t.options, "debugRows", "_getAllVisibleCells")), e.getVisibleCells = Z(() => [
			e.getLeftVisibleCells(),
			e.getCenterVisibleCells(),
			e.getRightVisibleCells()
		], (e, t, n) => [
			...e,
			...t,
			...n
		], Q(t.options, "debugRows", "getVisibleCells"));
	},
	createTable: (e) => {
		let t = (t, n) => Z(() => [n(), n().filter((e) => e.getIsVisible()).map((e) => e.id).join("_")], (e) => e.filter((e) => e.getIsVisible == null ? void 0 : e.getIsVisible()), Q(e.options, "debugColumns", t));
		e.getVisibleFlatColumns = t("getVisibleFlatColumns", () => e.getAllFlatColumns()), e.getVisibleLeafColumns = t("getVisibleLeafColumns", () => e.getAllLeafColumns()), e.getLeftVisibleLeafColumns = t("getLeftVisibleLeafColumns", () => e.getLeftLeafColumns()), e.getRightVisibleLeafColumns = t("getRightVisibleLeafColumns", () => e.getRightLeafColumns()), e.getCenterVisibleLeafColumns = t("getCenterVisibleLeafColumns", () => e.getCenterLeafColumns()), e.setColumnVisibility = (t) => e.options.onColumnVisibilityChange == null ? void 0 : e.options.onColumnVisibilityChange(t), e.resetColumnVisibility = (t) => {
			e.setColumnVisibility(t ? {} : e.initialState.columnVisibility ?? {});
		}, e.toggleAllColumnsVisible = (t) => {
			t ??= !e.getIsAllColumnsVisible(), e.setColumnVisibility(e.getAllLeafColumns().reduce((e, n) => ({
				...e,
				[n.id]: t || !(n.getCanHide != null && n.getCanHide())
			}), {}));
		}, e.getIsAllColumnsVisible = () => !e.getAllLeafColumns().some((e) => !(e.getIsVisible != null && e.getIsVisible())), e.getIsSomeColumnsVisible = () => e.getAllLeafColumns().some((e) => e.getIsVisible == null ? void 0 : e.getIsVisible()), e.getToggleAllColumnsVisibilityHandler = () => (t) => {
			e.toggleAllColumnsVisible(t.target?.checked);
		};
	}
};
function Iu(e, t) {
	return t ? t === "center" ? e.getCenterVisibleLeafColumns() : t === "left" ? e.getLeftVisibleLeafColumns() : e.getRightVisibleLeafColumns() : e.getVisibleLeafColumns();
}
var Lu = { createTable: (e) => {
	e._getGlobalFacetedRowModel = e.options.getFacetedRowModel && e.options.getFacetedRowModel(e, "__global__"), e.getGlobalFacetedRowModel = () => e.options.manualFiltering || !e._getGlobalFacetedRowModel ? e.getPreFilteredRowModel() : e._getGlobalFacetedRowModel(), e._getGlobalFacetedUniqueValues = e.options.getFacetedUniqueValues && e.options.getFacetedUniqueValues(e, "__global__"), e.getGlobalFacetedUniqueValues = () => e._getGlobalFacetedUniqueValues ? e._getGlobalFacetedUniqueValues() : /* @__PURE__ */ new Map(), e._getGlobalFacetedMinMaxValues = e.options.getFacetedMinMaxValues && e.options.getFacetedMinMaxValues(e, "__global__"), e.getGlobalFacetedMinMaxValues = () => {
		if (e._getGlobalFacetedMinMaxValues) return e._getGlobalFacetedMinMaxValues();
	};
} }, Ru = {
	getInitialState: (e) => ({
		globalFilter: void 0,
		...e
	}),
	getDefaultOptions: (e) => ({
		onGlobalFilterChange: X("globalFilter", e),
		globalFilterFn: "auto",
		getColumnCanGlobalFilter: (t) => {
			var n;
			let r = (n = e.getCoreRowModel().flatRows[0]) == null || (n = n._getAllCellsByColumnId()[t.id]) == null ? void 0 : n.getValue();
			return typeof r == "string" || typeof r == "number";
		}
	}),
	createColumn: (e, t) => {
		e.getCanGlobalFilter = () => (e.columnDef.enableGlobalFilter ?? !0) && (t.options.enableGlobalFilter ?? !0) && (t.options.enableFilters ?? !0) && ((t.options.getColumnCanGlobalFilter == null ? void 0 : t.options.getColumnCanGlobalFilter(e)) ?? !0) && !!e.accessorFn;
	},
	createTable: (e) => {
		e.getGlobalAutoFilterFn = () => vu.includesString, e.getGlobalFilterFn = () => {
			let { globalFilterFn: t } = e.options;
			return $l(t) ? t : t === "auto" ? e.getGlobalAutoFilterFn() : e.options.filterFns?.[t] ?? vu[t];
		}, e.setGlobalFilter = (t) => {
			e.options.onGlobalFilterChange == null || e.options.onGlobalFilterChange(t);
		}, e.resetGlobalFilter = (t) => {
			e.setGlobalFilter(t ? void 0 : e.initialState.globalFilter);
		};
	}
}, zu = {
	getInitialState: (e) => ({
		expanded: {},
		...e
	}),
	getDefaultOptions: (e) => ({
		onExpandedChange: X("expanded", e),
		paginateExpandedRows: !0
	}),
	createTable: (e) => {
		let t = !1, n = !1;
		e._autoResetExpanded = () => {
			if (!t) {
				e._queue(() => {
					t = !0;
				});
				return;
			}
			if (e.options.autoResetAll ?? e.options.autoResetExpanded ?? !e.options.manualExpanding) {
				if (n) return;
				n = !0, e._queue(() => {
					e.resetExpanded(), n = !1;
				});
			}
		}, e.setExpanded = (t) => e.options.onExpandedChange == null ? void 0 : e.options.onExpandedChange(t), e.toggleAllRowsExpanded = (t) => {
			t ?? !e.getIsAllRowsExpanded() ? e.setExpanded(!0) : e.setExpanded({});
		}, e.resetExpanded = (t) => {
			e.setExpanded(t ? {} : e.initialState?.expanded ?? {});
		}, e.getCanSomeRowsExpand = () => e.getPrePaginationRowModel().flatRows.some((e) => e.getCanExpand()), e.getToggleAllRowsExpandedHandler = () => (t) => {
			t.persist == null || t.persist(), e.toggleAllRowsExpanded();
		}, e.getIsSomeRowsExpanded = () => {
			let t = e.getState().expanded;
			return t === !0 || Object.values(t).some(Boolean);
		}, e.getIsAllRowsExpanded = () => {
			let t = e.getState().expanded;
			return typeof t == "boolean" ? t === !0 : !(!Object.keys(t).length || e.getRowModel().flatRows.some((e) => !e.getIsExpanded()));
		}, e.getExpandedDepth = () => {
			let t = 0;
			return (e.getState().expanded === !0 ? Object.keys(e.getRowModel().rowsById) : Object.keys(e.getState().expanded)).forEach((e) => {
				let n = e.split(".");
				t = Math.max(t, n.length);
			}), t;
		}, e.getPreExpandedRowModel = () => e.getSortedRowModel(), e.getExpandedRowModel = () => (!e._getExpandedRowModel && e.options.getExpandedRowModel && (e._getExpandedRowModel = e.options.getExpandedRowModel(e)), e.options.manualExpanding || !e._getExpandedRowModel ? e.getPreExpandedRowModel() : e._getExpandedRowModel());
	},
	createRow: (e, t) => {
		e.toggleExpanded = (n) => {
			t.setExpanded((r) => {
				let i = r === !0 || !!(r != null && r[e.id]), a = {};
				if (r === !0 ? Object.keys(t.getRowModel().rowsById).forEach((e) => {
					a[e] = !0;
				}) : a = r, n ??= !i, !i && n) return {
					...a,
					[e.id]: !0
				};
				if (i && !n) {
					let { [e.id]: t, ...n } = a;
					return n;
				}
				return r;
			});
		}, e.getIsExpanded = () => {
			let n = t.getState().expanded;
			return !!((t.options.getIsRowExpanded == null ? void 0 : t.options.getIsRowExpanded(e)) ?? (n === !0 || n?.[e.id]));
		}, e.getCanExpand = () => {
			var n;
			return (t.options.getRowCanExpand == null ? void 0 : t.options.getRowCanExpand(e)) ?? ((t.options.enableExpanding ?? !0) && !!((n = e.subRows) != null && n.length));
		}, e.getIsAllParentsExpanded = () => {
			let n = !0, r = e;
			for (; n && r.parentId;) r = t.getRow(r.parentId, !0), n = r.getIsExpanded();
			return n;
		}, e.getToggleExpandedHandler = () => {
			let t = e.getCanExpand();
			return () => {
				t && e.toggleExpanded();
			};
		};
	}
}, Bu = 0, Vu = 10, Hu = () => ({
	pageIndex: Bu,
	pageSize: Vu
}), Uu = {
	getInitialState: (e) => ({
		...e,
		pagination: {
			...Hu(),
			...e?.pagination
		}
	}),
	getDefaultOptions: (e) => ({ onPaginationChange: X("pagination", e) }),
	createTable: (e) => {
		let t = !1, n = !1;
		e._autoResetPageIndex = () => {
			if (!t) {
				e._queue(() => {
					t = !0;
				});
				return;
			}
			if (e.options.autoResetAll ?? e.options.autoResetPageIndex ?? !e.options.manualPagination) {
				if (n) return;
				n = !0, e._queue(() => {
					e.resetPageIndex(), n = !1;
				});
			}
		}, e.setPagination = (t) => e.options.onPaginationChange == null ? void 0 : e.options.onPaginationChange((e) => Ql(t, e)), e.resetPagination = (t) => {
			e.setPagination(t ? Hu() : e.initialState.pagination ?? Hu());
		}, e.setPageIndex = (t) => {
			e.setPagination((n) => {
				let r = Ql(t, n.pageIndex), i = e.options.pageCount === void 0 || e.options.pageCount === -1 ? 2 ** 53 - 1 : e.options.pageCount - 1;
				return r = Math.max(0, Math.min(r, i)), {
					...n,
					pageIndex: r
				};
			});
		}, e.resetPageIndex = (t) => {
			var n;
			e.setPageIndex(t ? Bu : ((n = e.initialState) == null || (n = n.pagination) == null ? void 0 : n.pageIndex) ?? Bu);
		}, e.resetPageSize = (t) => {
			var n;
			e.setPageSize(t ? Vu : ((n = e.initialState) == null || (n = n.pagination) == null ? void 0 : n.pageSize) ?? Vu);
		}, e.setPageSize = (t) => {
			e.setPagination((e) => {
				let n = Math.max(1, Ql(t, e.pageSize)), r = e.pageSize * e.pageIndex, i = Math.floor(r / n);
				return {
					...e,
					pageIndex: i,
					pageSize: n
				};
			});
		}, e.setPageCount = (t) => e.setPagination((n) => {
			let r = Ql(t, e.options.pageCount ?? -1);
			return typeof r == "number" && (r = Math.max(-1, r)), {
				...n,
				pageCount: r
			};
		}), e.getPageOptions = Z(() => [e.getPageCount()], (e) => {
			let t = [];
			return e && e > 0 && (t = [...Array(e)].fill(null).map((e, t) => t)), t;
		}, Q(e.options, "debugTable", "getPageOptions")), e.getCanPreviousPage = () => e.getState().pagination.pageIndex > 0, e.getCanNextPage = () => {
			let { pageIndex: t } = e.getState().pagination, n = e.getPageCount();
			return n === -1 || n !== 0 && t < n - 1;
		}, e.previousPage = () => e.setPageIndex((e) => e - 1), e.nextPage = () => e.setPageIndex((e) => e + 1), e.firstPage = () => e.setPageIndex(0), e.lastPage = () => e.setPageIndex(e.getPageCount() - 1), e.getPrePaginationRowModel = () => e.getExpandedRowModel(), e.getPaginationRowModel = () => (!e._getPaginationRowModel && e.options.getPaginationRowModel && (e._getPaginationRowModel = e.options.getPaginationRowModel(e)), e.options.manualPagination || !e._getPaginationRowModel ? e.getPrePaginationRowModel() : e._getPaginationRowModel()), e.getPageCount = () => e.options.pageCount ?? Math.ceil(e.getRowCount() / e.getState().pagination.pageSize), e.getRowCount = () => e.options.rowCount ?? e.getPrePaginationRowModel().rows.length;
	}
}, Wu = () => ({
	top: [],
	bottom: []
}), Gu = {
	getInitialState: (e) => ({
		rowPinning: Wu(),
		...e
	}),
	getDefaultOptions: (e) => ({ onRowPinningChange: X("rowPinning", e) }),
	createRow: (e, t) => {
		e.pin = (n, r, i) => {
			let a = r ? e.getLeafRows().map((e) => {
				let { id: t } = e;
				return t;
			}) : [], o = i ? e.getParentRows().map((e) => {
				let { id: t } = e;
				return t;
			}) : [], s = /* @__PURE__ */ new Set([
				...o,
				e.id,
				...a
			]);
			t.setRowPinning((e) => n === "bottom" ? {
				top: (e?.top ?? []).filter((e) => !(s != null && s.has(e))),
				bottom: [...(e?.bottom ?? []).filter((e) => !(s != null && s.has(e))), ...Array.from(s)]
			} : n === "top" ? {
				top: [...(e?.top ?? []).filter((e) => !(s != null && s.has(e))), ...Array.from(s)],
				bottom: (e?.bottom ?? []).filter((e) => !(s != null && s.has(e)))
			} : {
				top: (e?.top ?? []).filter((e) => !(s != null && s.has(e))),
				bottom: (e?.bottom ?? []).filter((e) => !(s != null && s.has(e)))
			});
		}, e.getCanPin = () => {
			let { enableRowPinning: n, enablePinning: r } = t.options;
			return typeof n == "function" ? n(e) : n ?? r ?? !0;
		}, e.getIsPinned = () => {
			let n = [e.id], { top: r, bottom: i } = t.getState().rowPinning, a = n.some((e) => r?.includes(e)), o = n.some((e) => i?.includes(e));
			return a ? "top" : o ? "bottom" : !1;
		}, e.getPinnedIndex = () => {
			let n = e.getIsPinned();
			return n ? ((n === "top" ? t.getTopRows() : t.getBottomRows())?.map((e) => {
				let { id: t } = e;
				return t;
			}))?.indexOf(e.id) ?? -1 : -1;
		};
	},
	createTable: (e) => {
		e.setRowPinning = (t) => e.options.onRowPinningChange == null ? void 0 : e.options.onRowPinningChange(t), e.resetRowPinning = (t) => e.setRowPinning(t ? Wu() : e.initialState?.rowPinning ?? Wu()), e.getIsSomeRowsPinned = (t) => {
			let n = e.getState().rowPinning;
			return t ? !!n[t]?.length : !!(n.top?.length || n.bottom?.length);
		}, e._getPinnedRows = (t, n, r) => (e.options.keepPinnedRows ?? !0 ? (n ?? []).map((t) => {
			let n = e.getRow(t, !0);
			return n.getIsAllParentsExpanded() ? n : null;
		}) : (n ?? []).map((e) => t.find((t) => t.id === e))).filter(Boolean).map((e) => ({
			...e,
			position: r
		})), e.getTopRows = Z(() => [e.getRowModel().rows, e.getState().rowPinning.top], (t, n) => e._getPinnedRows(t, n, "top"), Q(e.options, "debugRows", "getTopRows")), e.getBottomRows = Z(() => [e.getRowModel().rows, e.getState().rowPinning.bottom], (t, n) => e._getPinnedRows(t, n, "bottom"), Q(e.options, "debugRows", "getBottomRows")), e.getCenterRows = Z(() => [
			e.getRowModel().rows,
			e.getState().rowPinning.top,
			e.getState().rowPinning.bottom
		], (e, t, n) => {
			let r = /* @__PURE__ */ new Set([...t ?? [], ...n ?? []]);
			return e.filter((e) => !r.has(e.id));
		}, Q(e.options, "debugRows", "getCenterRows"));
	}
}, Ku = {
	getInitialState: (e) => ({
		rowSelection: {},
		...e
	}),
	getDefaultOptions: (e) => ({
		onRowSelectionChange: X("rowSelection", e),
		enableRowSelection: !0,
		enableMultiRowSelection: !0,
		enableSubRowSelection: !0
	}),
	createTable: (e) => {
		e.setRowSelection = (t) => e.options.onRowSelectionChange == null ? void 0 : e.options.onRowSelectionChange(t), e.resetRowSelection = (t) => e.setRowSelection(t ? {} : e.initialState.rowSelection ?? {}), e.toggleAllRowsSelected = (t) => {
			e.setRowSelection((n) => {
				t = t === void 0 ? !e.getIsAllRowsSelected() : t;
				let r = { ...n }, i = e.getPreGroupedRowModel().flatRows;
				return t ? i.forEach((e) => {
					e.getCanSelect() && (r[e.id] = !0);
				}) : i.forEach((e) => {
					delete r[e.id];
				}), r;
			});
		}, e.toggleAllPageRowsSelected = (t) => e.setRowSelection((n) => {
			let r = t === void 0 ? !e.getIsAllPageRowsSelected() : t, i = { ...n };
			return e.getRowModel().rows.forEach((t) => {
				qu(i, t.id, r, !0, e);
			}), i;
		}), e.getPreSelectedRowModel = () => e.getCoreRowModel(), e.getSelectedRowModel = Z(() => [e.getState().rowSelection, e.getCoreRowModel()], (t, n) => Object.keys(t).length ? Ju(e, n) : {
			rows: [],
			flatRows: [],
			rowsById: {}
		}, Q(e.options, "debugTable", "getSelectedRowModel")), e.getFilteredSelectedRowModel = Z(() => [e.getState().rowSelection, e.getFilteredRowModel()], (t, n) => Object.keys(t).length ? Ju(e, n) : {
			rows: [],
			flatRows: [],
			rowsById: {}
		}, Q(e.options, "debugTable", "getFilteredSelectedRowModel")), e.getGroupedSelectedRowModel = Z(() => [e.getState().rowSelection, e.getSortedRowModel()], (t, n) => Object.keys(t).length ? Ju(e, n) : {
			rows: [],
			flatRows: [],
			rowsById: {}
		}, Q(e.options, "debugTable", "getGroupedSelectedRowModel")), e.getIsAllRowsSelected = () => {
			let t = e.getFilteredRowModel().flatRows, { rowSelection: n } = e.getState(), r = !!(t.length && Object.keys(n).length);
			return r && t.some((e) => e.getCanSelect() && !n[e.id]) && (r = !1), r;
		}, e.getIsAllPageRowsSelected = () => {
			let t = e.getPaginationRowModel().flatRows.filter((e) => e.getCanSelect()), { rowSelection: n } = e.getState(), r = !!t.length;
			return r && t.some((e) => !n[e.id]) && (r = !1), r;
		}, e.getIsSomeRowsSelected = () => {
			let t = Object.keys(e.getState().rowSelection ?? {}).length;
			return t > 0 && t < e.getFilteredRowModel().flatRows.length;
		}, e.getIsSomePageRowsSelected = () => {
			let t = e.getPaginationRowModel().flatRows;
			return !e.getIsAllPageRowsSelected() && t.filter((e) => e.getCanSelect()).some((e) => e.getIsSelected() || e.getIsSomeSelected());
		}, e.getToggleAllRowsSelectedHandler = () => (t) => {
			e.toggleAllRowsSelected(t.target.checked);
		}, e.getToggleAllPageRowsSelectedHandler = () => (t) => {
			e.toggleAllPageRowsSelected(t.target.checked);
		};
	},
	createRow: (e, t) => {
		e.toggleSelected = (n, r) => {
			let i = e.getIsSelected();
			t.setRowSelection((a) => {
				if (n = n === void 0 ? !i : n, e.getCanSelect() && i === n) return a;
				let o = { ...a };
				return qu(o, e.id, n, r?.selectChildren ?? !0, t), o;
			});
		}, e.getIsSelected = () => {
			let { rowSelection: n } = t.getState();
			return Yu(e, n);
		}, e.getIsSomeSelected = () => {
			let { rowSelection: n } = t.getState();
			return Xu(e, n) === "some";
		}, e.getIsAllSubRowsSelected = () => {
			let { rowSelection: n } = t.getState();
			return Xu(e, n) === "all";
		}, e.getCanSelect = () => typeof t.options.enableRowSelection == "function" ? t.options.enableRowSelection(e) : t.options.enableRowSelection ?? !0, e.getCanSelectSubRows = () => typeof t.options.enableSubRowSelection == "function" ? t.options.enableSubRowSelection(e) : t.options.enableSubRowSelection ?? !0, e.getCanMultiSelect = () => typeof t.options.enableMultiRowSelection == "function" ? t.options.enableMultiRowSelection(e) : t.options.enableMultiRowSelection ?? !0, e.getToggleSelectedHandler = () => {
			let t = e.getCanSelect();
			return (n) => {
				t && e.toggleSelected(n.target?.checked);
			};
		};
	}
}, qu = (e, t, n, r, i) => {
	var a;
	let o = i.getRow(t, !0);
	n ? (o.getCanMultiSelect() || Object.keys(e).forEach((t) => delete e[t]), o.getCanSelect() && (e[t] = !0)) : delete e[t], r && (a = o.subRows) != null && a.length && o.getCanSelectSubRows() && o.subRows.forEach((t) => qu(e, t.id, n, r, i));
};
function Ju(e, t) {
	let n = e.getState().rowSelection, r = [], i = {}, a = function(e, t) {
		return e.map((e) => {
			var t;
			let o = Yu(e, n);
			if (o && (r.push(e), i[e.id] = e), (t = e.subRows) != null && t.length && (e = {
				...e,
				subRows: a(e.subRows)
			}), o) return e;
		}).filter(Boolean);
	};
	return {
		rows: a(t.rows),
		flatRows: r,
		rowsById: i
	};
}
function Yu(e, t) {
	return t[e.id] ?? !1;
}
function Xu(e, t, n) {
	var r;
	if (!((r = e.subRows) != null && r.length)) return !1;
	let i = !0, a = !1;
	return e.subRows.forEach((e) => {
		if ((!a || i) && (e.getCanSelect() && (Yu(e, t) ? a = !0 : i = !1), e.subRows && e.subRows.length)) {
			let n = Xu(e, t);
			n === "all" ? a = !0 : (n === "some" && (a = !0), i = !1);
		}
	}), i ? "all" : a ? "some" : !1;
}
var Zu = /([0-9]+)/gm, Qu = (e, t, n) => od(ad(e.getValue(n)).toLowerCase(), ad(t.getValue(n)).toLowerCase()), $u = (e, t, n) => od(ad(e.getValue(n)), ad(t.getValue(n))), ed = (e, t, n) => id(ad(e.getValue(n)).toLowerCase(), ad(t.getValue(n)).toLowerCase()), td = (e, t, n) => id(ad(e.getValue(n)), ad(t.getValue(n))), nd = (e, t, n) => {
	let r = e.getValue(n), i = t.getValue(n);
	return r > i ? 1 : r < i ? -1 : 0;
}, rd = (e, t, n) => id(e.getValue(n), t.getValue(n));
function id(e, t) {
	return e === t ? 0 : e > t ? 1 : -1;
}
function ad(e) {
	return typeof e == "number" ? isNaN(e) || e === Infinity || e === -Infinity ? "" : String(e) : typeof e == "string" ? e : "";
}
function od(e, t) {
	let n = e.split(Zu).filter(Boolean), r = t.split(Zu).filter(Boolean);
	for (; n.length && r.length;) {
		let e = n.shift(), t = r.shift(), i = parseInt(e, 10), a = parseInt(t, 10), o = [i, a].sort();
		if (isNaN(o[0])) {
			if (e > t) return 1;
			if (t > e) return -1;
			continue;
		}
		if (isNaN(o[1])) return isNaN(i) ? -1 : 1;
		if (i > a) return 1;
		if (a > i) return -1;
	}
	return n.length - r.length;
}
var sd = {
	alphanumeric: Qu,
	alphanumericCaseSensitive: $u,
	text: ed,
	textCaseSensitive: td,
	datetime: nd,
	basic: rd
}, cd = [
	au,
	Fu,
	Tu,
	Du,
	cu,
	bu,
	Lu,
	Ru,
	{
		getInitialState: (e) => ({
			sorting: [],
			...e
		}),
		getDefaultColumnDef: () => ({
			sortingFn: "auto",
			sortUndefined: 1
		}),
		getDefaultOptions: (e) => ({
			onSortingChange: X("sorting", e),
			isMultiSortEvent: (e) => e.shiftKey
		}),
		createColumn: (e, t) => {
			e.getAutoSortingFn = () => {
				let n = t.getFilteredRowModel().flatRows.slice(10), r = !1;
				for (let t of n) {
					let n = t?.getValue(e.id);
					if (Object.prototype.toString.call(n) === "[object Date]") return sd.datetime;
					if (typeof n == "string" && (r = !0, n.split(Zu).length > 1)) return sd.alphanumeric;
				}
				return r ? sd.text : sd.basic;
			}, e.getAutoSortDir = () => typeof t.getFilteredRowModel().flatRows[0]?.getValue(e.id) == "string" ? "asc" : "desc", e.getSortingFn = () => {
				if (!e) throw Error();
				return $l(e.columnDef.sortingFn) ? e.columnDef.sortingFn : e.columnDef.sortingFn === "auto" ? e.getAutoSortingFn() : t.options.sortingFns?.[e.columnDef.sortingFn] ?? sd[e.columnDef.sortingFn];
			}, e.toggleSorting = (n, r) => {
				let i = e.getNextSortingOrder(), a = n != null;
				t.setSorting((o) => {
					let s = o?.find((t) => t.id === e.id), c = o?.findIndex((t) => t.id === e.id), l = [], u, d = a ? n : i === "desc";
					return u = o != null && o.length && e.getCanMultiSort() && r ? s ? "toggle" : "add" : o != null && o.length && c !== o.length - 1 ? "replace" : s ? "toggle" : "replace", u === "toggle" && (a || i || (u = "remove")), u === "add" ? (l = [...o, {
						id: e.id,
						desc: d
					}], l.splice(0, l.length - (t.options.maxMultiSortColCount ?? 2 ** 53 - 1))) : l = u === "toggle" ? o.map((t) => t.id === e.id ? {
						...t,
						desc: d
					} : t) : u === "remove" ? o.filter((t) => t.id !== e.id) : [{
						id: e.id,
						desc: d
					}], l;
				});
			}, e.getFirstSortDir = () => e.columnDef.sortDescFirst ?? t.options.sortDescFirst ?? e.getAutoSortDir() === "desc" ? "desc" : "asc", e.getNextSortingOrder = (n) => {
				let r = e.getFirstSortDir(), i = e.getIsSorted();
				return i ? i !== r && (t.options.enableSortingRemoval ?? !0) && (!n || (t.options.enableMultiRemove ?? !0)) ? !1 : i === "desc" ? "asc" : "desc" : r;
			}, e.getCanSort = () => (e.columnDef.enableSorting ?? !0) && (t.options.enableSorting ?? !0) && !!e.accessorFn, e.getCanMultiSort = () => e.columnDef.enableMultiSort ?? t.options.enableMultiSort ?? !!e.accessorFn, e.getIsSorted = () => {
				let n = t.getState().sorting?.find((t) => t.id === e.id);
				return n ? n.desc ? "desc" : "asc" : !1;
			}, e.getSortIndex = () => t.getState().sorting?.findIndex((t) => t.id === e.id) ?? -1, e.clearSorting = () => {
				t.setSorting((t) => t != null && t.length ? t.filter((t) => t.id !== e.id) : []);
			}, e.getToggleSortingHandler = () => {
				let n = e.getCanSort();
				return (r) => {
					n && (r.persist == null || r.persist(), e.toggleSorting == null || e.toggleSorting(void 0, e.getCanMultiSort() ? t.options.isMultiSortEvent == null ? void 0 : t.options.isMultiSortEvent(r) : !1));
				};
			};
		},
		createTable: (e) => {
			e.setSorting = (t) => e.options.onSortingChange == null ? void 0 : e.options.onSortingChange(t), e.resetSorting = (t) => {
				e.setSorting(t ? [] : e.initialState?.sorting ?? []);
			}, e.getPreSortedRowModel = () => e.getGroupedRowModel(), e.getSortedRowModel = () => (!e._getSortedRowModel && e.options.getSortedRowModel && (e._getSortedRowModel = e.options.getSortedRowModel(e)), e.options.manualSorting || !e._getSortedRowModel ? e.getPreSortedRowModel() : e._getSortedRowModel());
		}
	},
	Cu,
	zu,
	Uu,
	Gu,
	Ku,
	ju
];
function ld(e) {
	let t = [...cd, ...e._features ?? []], n = { _features: t }, r = n._features.reduce((e, t) => Object.assign(e, t.getDefaultOptions == null ? void 0 : t.getDefaultOptions(n)), {}), i = (e) => n.options.mergeOptions ? n.options.mergeOptions(r, e) : {
		...r,
		...e
	}, a = { ...e.initialState ?? {} };
	n._features.forEach((e) => {
		a = (e.getInitialState == null ? void 0 : e.getInitialState(a)) ?? a;
	});
	let o = [], s = !1, c = {
		_features: t,
		options: {
			...r,
			...e
		},
		initialState: a,
		_queue: (e) => {
			o.push(e), s || (s = !0, Promise.resolve().then(() => {
				for (; o.length;) o.shift()();
				s = !1;
			}).catch((e) => setTimeout(() => {
				throw e;
			})));
		},
		reset: () => {
			n.setState(n.initialState);
		},
		setOptions: (e) => {
			let t = Ql(e, n.options);
			n.options = i(t);
		},
		getState: () => n.options.state,
		setState: (e) => {
			n.options.onStateChange == null || n.options.onStateChange(e);
		},
		_getRowId: (e, t, r) => (n.options.getRowId == null ? void 0 : n.options.getRowId(e, t, r)) ?? `${r ? [r.id, t].join(".") : t}`,
		getCoreRowModel: () => (n._getCoreRowModel ||= n.options.getCoreRowModel(n), n._getCoreRowModel()),
		getRowModel: () => n.getPaginationRowModel(),
		getRow: (e, t) => {
			let r = (t ? n.getPrePaginationRowModel() : n.getRowModel()).rowsById[e];
			if (!r && (r = n.getCoreRowModel().rowsById[e], !r)) throw Error();
			return r;
		},
		_getDefaultColumnDef: Z(() => [n.options.defaultColumn], (e) => (e ??= {}, {
			header: (e) => {
				let t = e.header.column.columnDef;
				return t.accessorKey ? t.accessorKey : t.accessorFn ? t.id : null;
			},
			cell: (e) => {
				var t;
				return ((t = e.renderValue()) == null || t.toString == null ? void 0 : t.toString()) ?? null;
			},
			...n._features.reduce((e, t) => Object.assign(e, t.getDefaultColumnDef == null ? void 0 : t.getDefaultColumnDef()), {}),
			...e
		}), Q(e, "debugColumns", "_getDefaultColumnDef")),
		_getColumnDefs: () => n.options.columns,
		getAllColumns: Z(() => [n._getColumnDefs()], (e) => {
			let t = function(e, r, i) {
				return i === void 0 && (i = 0), e.map((e) => {
					let a = ru(n, e, i, r), o = e;
					return a.columns = o.columns ? t(o.columns, a, i + 1) : [], a;
				});
			};
			return t(e);
		}, Q(e, "debugColumns", "getAllColumns")),
		getAllFlatColumns: Z(() => [n.getAllColumns()], (e) => e.flatMap((e) => e.getFlatColumns()), Q(e, "debugColumns", "getAllFlatColumns")),
		_getAllFlatColumnsById: Z(() => [n.getAllFlatColumns()], (e) => e.reduce((e, t) => (e[t.id] = t, e), {}), Q(e, "debugColumns", "getAllFlatColumnsById")),
		getAllLeafColumns: Z(() => [n.getAllColumns(), n._getOrderColumnsFn()], (e, t) => t(e.flatMap((e) => e.getLeafColumns())), Q(e, "debugColumns", "getAllLeafColumns")),
		getColumn: (e) => n._getAllFlatColumnsById()[e]
	};
	Object.assign(n, c);
	for (let e = 0; e < n._features.length; e++) {
		let t = n._features[e];
		t == null || t.createTable == null || t.createTable(n);
	}
	return n;
}
function ud() {
	return (e) => Z(() => [e.options.data], (t) => {
		let n = {
			rows: [],
			flatRows: [],
			rowsById: {}
		}, r = function(t, i, a) {
			i === void 0 && (i = 0);
			let o = [];
			for (let c = 0; c < t.length; c++) {
				let l = su(e, e._getRowId(t[c], c, a), t[c], c, i, void 0, a?.id);
				if (n.flatRows.push(l), n.rowsById[l.id] = l, o.push(l), e.options.getSubRows) {
					var s;
					l.originalSubRows = e.options.getSubRows(t[c], c), (s = l.originalSubRows) != null && s.length && (l.subRows = r(l.originalSubRows, i + 1, l));
				}
			}
			return o;
		};
		return n.rows = r(t), n;
	}, Q(e.options, "debugTable", "getRowModel", () => e._autoResetPageIndex()));
}
function dd(e) {
	let t = [], n = (e) => {
		var r;
		t.push(e), (r = e.subRows) != null && r.length && e.getIsExpanded() && e.subRows.forEach(n);
	};
	return e.rows.forEach(n), {
		rows: t,
		flatRows: e.flatRows,
		rowsById: e.rowsById
	};
}
function fd(e, t, n) {
	return n.options.filterFromLeafRows ? pd(e, t, n) : md(e, t, n);
}
function pd(e, t, n) {
	let r = [], i = {}, a = n.options.maxLeafRowFilterDepth ?? 100, o = function(e, s) {
		s === void 0 && (s = 0);
		let c = [];
		for (let u = 0; u < e.length; u++) {
			var l;
			let d = e[u], f = su(n, d.id, d.original, d.index, d.depth, void 0, d.parentId);
			if (f.columnFilters = d.columnFilters, (l = d.subRows) != null && l.length && s < a) {
				if (f.subRows = o(d.subRows, s + 1), d = f, t(d) && !f.subRows.length) {
					c.push(d), i[d.id] = d, r.push(d);
					continue;
				}
				if (t(d) || f.subRows.length) {
					c.push(d), i[d.id] = d, r.push(d);
					continue;
				}
			} else d = f, t(d) && (c.push(d), i[d.id] = d, r.push(d));
		}
		return c;
	};
	return {
		rows: o(e),
		flatRows: r,
		rowsById: i
	};
}
function md(e, t, n) {
	let r = [], i = {}, a = n.options.maxLeafRowFilterDepth ?? 100, o = function(e, s) {
		s === void 0 && (s = 0);
		let c = [];
		for (let u = 0; u < e.length; u++) {
			let d = e[u];
			if (t(d)) {
				var l;
				if ((l = d.subRows) != null && l.length && s < a) {
					let e = su(n, d.id, d.original, d.index, d.depth, void 0, d.parentId);
					e.subRows = o(d.subRows, s + 1), d = e;
				}
				c.push(d), r.push(d), i[d.id] = d;
			}
		}
		return c;
	};
	return {
		rows: o(e),
		flatRows: r,
		rowsById: i
	};
}
function hd() {
	return (e) => Z(() => [
		e.getPreFilteredRowModel(),
		e.getState().columnFilters,
		e.getState().globalFilter
	], (t, n, r) => {
		if (!t.rows.length || !(n != null && n.length) && !r) {
			for (let e = 0; e < t.flatRows.length; e++) t.flatRows[e].columnFilters = {}, t.flatRows[e].columnFiltersMeta = {};
			return t;
		}
		let i = [], a = [];
		(n ?? []).forEach((t) => {
			let n = e.getColumn(t.id);
			if (!n) return;
			let r = n.getFilterFn();
			r && i.push({
				id: t.id,
				filterFn: r,
				resolvedValue: (r.resolveFilterValue == null ? void 0 : r.resolveFilterValue(t.value)) ?? t.value
			});
		});
		let o = (n ?? []).map((e) => e.id), s = e.getGlobalFilterFn(), c = e.getAllLeafColumns().filter((e) => e.getCanGlobalFilter());
		r && s && c.length && (o.push("__global__"), c.forEach((e) => {
			a.push({
				id: e.id,
				filterFn: s,
				resolvedValue: (s.resolveFilterValue == null ? void 0 : s.resolveFilterValue(r)) ?? r
			});
		}));
		let l, u;
		for (let e = 0; e < t.flatRows.length; e++) {
			let n = t.flatRows[e];
			if (n.columnFilters = {}, i.length) for (let e = 0; e < i.length; e++) {
				l = i[e];
				let t = l.id;
				n.columnFilters[t] = l.filterFn(n, t, l.resolvedValue, (e) => {
					n.columnFiltersMeta[t] = e;
				});
			}
			if (a.length) {
				for (let e = 0; e < a.length; e++) {
					u = a[e];
					let t = u.id;
					if (u.filterFn(n, t, u.resolvedValue, (e) => {
						n.columnFiltersMeta[t] = e;
					})) {
						n.columnFilters.__global__ = !0;
						break;
					}
				}
				n.columnFilters.__global__ !== !0 && (n.columnFilters.__global__ = !1);
			}
		}
		return fd(t.rows, (e) => {
			for (let t = 0; t < o.length; t++) if (e.columnFilters[o[t]] === !1) return !1;
			return !0;
		}, e);
	}, Q(e.options, "debugTable", "getFilteredRowModel", () => e._autoResetPageIndex()));
}
function gd(e) {
	return (e) => Z(() => [
		e.getState().pagination,
		e.getPrePaginationRowModel(),
		e.options.paginateExpandedRows ? void 0 : e.getState().expanded
	], (t, n) => {
		if (!n.rows.length) return n;
		let { pageSize: r, pageIndex: i } = t, { rows: a, flatRows: o, rowsById: s } = n, c = r * i, l = c + r;
		a = a.slice(c, l);
		let u;
		u = e.options.paginateExpandedRows ? {
			rows: a,
			flatRows: o,
			rowsById: s
		} : dd({
			rows: a,
			flatRows: o,
			rowsById: s
		}), u.flatRows = [];
		let d = (e) => {
			u.flatRows.push(e), e.subRows.length && e.subRows.forEach(d);
		};
		return u.rows.forEach(d), u;
	}, Q(e.options, "debugTable", "getPaginationRowModel"));
}
function _d() {
	return (e) => Z(() => [e.getState().sorting, e.getPreSortedRowModel()], (t, n) => {
		if (!n.rows.length || !(t != null && t.length)) return n;
		let r = e.getState().sorting, i = [], a = r.filter((t) => e.getColumn(t.id)?.getCanSort()), o = {};
		a.forEach((t) => {
			let n = e.getColumn(t.id);
			n && (o[t.id] = {
				sortUndefined: n.columnDef.sortUndefined,
				invertSorting: n.columnDef.invertSorting,
				sortingFn: n.getSortingFn()
			});
		});
		let s = (e) => {
			let t = e.map((e) => ({ ...e }));
			return t.sort((e, t) => {
				for (let n = 0; n < a.length; n += 1) {
					let r = a[n], i = o[r.id], s = i.sortUndefined, c = r?.desc ?? !1, l = 0;
					if (s) {
						let n = e.getValue(r.id), i = t.getValue(r.id), a = n === void 0, o = i === void 0;
						if (a || o) {
							if (s === "first") return a ? -1 : 1;
							if (s === "last") return a ? 1 : -1;
							l = a && o ? 0 : a ? s : -s;
						}
					}
					if (l === 0 && (l = i.sortingFn(e, t, r.id)), l !== 0) return c && (l *= -1), i.invertSorting && (l *= -1), l;
				}
				return e.index - t.index;
			}), t.forEach((e) => {
				var t;
				i.push(e), (t = e.subRows) != null && t.length && (e.subRows = s(e.subRows));
			}), t;
		};
		return {
			rows: s(n.rows),
			flatRows: i,
			rowsById: n.rowsById
		};
	}, Q(e.options, "debugTable", "getSortedRowModel", () => e._autoResetPageIndex()));
}
//#endregion
//#region node_modules/@tanstack/react-table/build/lib/index.mjs
function vd(e, t) {
	return e ? yd(e) ? /*#__PURE__*/ m.createElement(e, t) : e : null;
}
function yd(e) {
	return bd(e) || typeof e == "function" || xd(e);
}
function bd(e) {
	return typeof e == "function" && (() => {
		let t = Object.getPrototypeOf(e);
		return t.prototype && t.prototype.isReactComponent;
	})();
}
function xd(e) {
	return typeof e == "object" && typeof e.$$typeof == "symbol" && ["react.memo", "react.forward_ref"].includes(e.$$typeof.description);
}
function Sd(e) {
	let t = {
		state: {},
		onStateChange: () => {},
		renderFallbackValue: null,
		...e
	}, [n] = m.useState(() => ({ current: ld(t) })), [r, i] = m.useState(() => n.current.initialState);
	return n.current.setOptions((t) => ({
		...t,
		...e,
		state: {
			...r,
			...e.state
		},
		onStateChange: (t) => {
			i(t), e.onStateChange == null || e.onStateChange(t);
		}
	})), n.current;
}
//#endregion
//#region frontend/components/ui/card.tsx
function Cd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "card",
		className: o("tw:flex tw:flex-col tw:gap-6 tw:rounded-xl tw:border tw:bg-card tw:py-6 tw:text-card-foreground tw:shadow-sm", e),
		...t
	});
}
function wd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "card-header",
		className: o("tw:@container/card-header tw:grid tw:auto-rows-min tw:grid-rows-[auto_auto] tw:items-start tw:gap-2 tw:px-6 tw:has-data-[slot=card-action]:grid-cols-[1fr_auto] tw:[.border-b]:pb-6", e),
		...t
	});
}
function Td({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "card-title",
		className: o("tw:leading-none tw:font-semibold", e),
		...t
	});
}
function Ed({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "card-description",
		className: o("tw:text-sm tw:text-muted-foreground", e),
		...t
	});
}
function Dd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "card-content",
		className: o("tw:px-6", e),
		...t
	});
}
//#endregion
//#region frontend/components/ui/input.tsx
function Od({ className: e, type: t, ...n }) {
	return /* @__PURE__ */ (0, h.jsx)("input", {
		type: t,
		"data-slot": "input",
		className: o("tw:h-9 tw:w-full tw:min-w-0 tw:rounded-md tw:border tw:border-input tw:bg-transparent tw:px-3 tw:py-1 tw:text-base tw:shadow-xs tw:transition-[color,box-shadow] tw:outline-none tw:selection:bg-primary tw:selection:text-primary-foreground tw:file:inline-flex tw:file:h-7 tw:file:border-0 tw:file:bg-transparent tw:file:text-sm tw:file:font-medium tw:file:text-foreground tw:placeholder:text-muted-foreground tw:disabled:pointer-events-none tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:md:text-sm tw:dark:bg-input/30", "tw:focus-visible:border-ring tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring/50", "tw:aria-invalid:border-destructive tw:aria-invalid:ring-destructive/20 tw:dark:aria-invalid:ring-destructive/40", e),
		...n
	});
}
//#endregion
//#region frontend/components/ui/textarea.tsx
function kd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("textarea", {
		"data-slot": "textarea",
		className: o("tw:flex tw:field-sizing-content tw:min-h-16 tw:w-full tw:rounded-md tw:border tw:border-input tw:bg-transparent tw:px-3 tw:py-2 tw:text-base tw:shadow-xs tw:transition-[color,box-shadow] tw:outline-none tw:placeholder:text-muted-foreground tw:focus-visible:border-ring tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring/50 tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:aria-invalid:border-destructive tw:aria-invalid:ring-destructive/20 tw:md:text-sm tw:dark:bg-input/30 tw:dark:aria-invalid:ring-destructive/40", e),
		...t
	});
}
//#endregion
//#region frontend/components/ui/badge.tsx
var Ad = n("tw:inline-flex tw:w-fit tw:shrink-0 tw:items-center tw:justify-center tw:gap-1 tw:overflow-hidden tw:rounded-full tw:border tw:border-transparent tw:px-2 tw:py-0.5 tw:text-xs tw:font-medium tw:whitespace-nowrap tw:transition-[color,box-shadow] tw:focus-visible:border-ring tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring/50 tw:aria-invalid:border-destructive tw:aria-invalid:ring-destructive/20 tw:dark:aria-invalid:ring-destructive/40 tw:[&>svg]:pointer-events-none tw:[&>svg]:size-3", {
	variants: { variant: {
		default: "tw:bg-primary tw:text-primary-foreground tw:[a&]:hover:bg-primary/90",
		secondary: "tw:bg-secondary tw:text-secondary-foreground tw:[a&]:hover:bg-secondary/90",
		destructive: "tw:bg-destructive tw:text-white tw:focus-visible:ring-destructive/20 tw:dark:bg-destructive/60 tw:dark:focus-visible:ring-destructive/40 tw:[a&]:hover:bg-destructive/90",
		outline: "tw:border-border tw:text-foreground tw:[a&]:hover:bg-accent tw:[a&]:hover:text-accent-foreground",
		ghost: "tw:[a&]:hover:bg-accent tw:[a&]:hover:text-accent-foreground",
		link: "tw:text-primary tw:underline-offset-4 tw:[a&]:hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function jd({ className: e, variant: t = "default", asChild: n = !1, ...r }) {
	let i = n ? f : "span";
	return /* @__PURE__ */ (0, h.jsx)(i, {
		"data-slot": "badge",
		"data-variant": t,
		className: o(Ad({ variant: t }), e),
		...r
	});
}
//#endregion
//#region frontend/components/ui/skeleton.tsx
function Md({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "skeleton",
		className: o("tw:animate-pulse tw:rounded-md tw:bg-accent", e),
		...t
	});
}
//#endregion
//#region frontend/components/ui/progress.tsx
function Nd({ className: e, value: t, ...n }) {
	return /* @__PURE__ */ (0, h.jsx)(_c, {
		"data-slot": "progress",
		className: o("tw:relative tw:h-2 tw:w-full tw:overflow-hidden tw:rounded-full tw:bg-primary/20", e),
		...n,
		children: /* @__PURE__ */ (0, h.jsx)(vc, {
			"data-slot": "progress-indicator",
			className: "tw:h-full tw:w-full tw:flex-1 tw:bg-primary tw:transition-all",
			style: { transform: `translateX(-${100 - (t || 0)}%)` }
		})
	});
}
//#endregion
//#region frontend/components/ui/dialog.tsx
function Pd({ ...e }) {
	return /* @__PURE__ */ (0, h.jsx)(gi, {
		"data-slot": "dialog",
		...e
	});
}
function Fd({ ...e }) {
	return /* @__PURE__ */ (0, h.jsx)(Si, {
		container: document.getElementById("ui-portal-root"),
		"data-slot": "dialog-portal",
		...e
	});
}
function Id({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)(wi, {
		"data-slot": "dialog-overlay",
		className: o("tw:fixed tw:inset-0 tw:z-50 tw:bg-black/50 tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:animate-in tw:data-[state=open]:fade-in-0", e),
		...t
	});
}
function Ld({ className: e, children: t, showCloseButton: n = !0, ...r }) {
	return /* @__PURE__ */ (0, h.jsxs)(Fd, {
		"data-slot": "dialog-portal",
		children: [/* @__PURE__ */ (0, h.jsx)(Id, {}), /* @__PURE__ */ (0, h.jsxs)(Oi, {
			"data-slot": "dialog-content",
			className: o("tw:fixed tw:top-[50%] tw:left-[50%] tw:z-50 tw:grid tw:w-full tw:max-w-[calc(100%-2rem)] tw:translate-x-[-50%] tw:translate-y-[-50%] tw:gap-4 tw:rounded-lg tw:border tw:bg-background tw:p-6 tw:shadow-lg tw:duration-200 tw:outline-none tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:animate-in tw:data-[state=open]:fade-in-0 tw:data-[state=open]:zoom-in-95 tw:sm:max-w-lg", e),
			...r,
			children: [t, n && /* @__PURE__ */ (0, h.jsxs)(Li, {
				"data-slot": "dialog-close",
				className: "tw:absolute tw:top-4 tw:right-4 tw:rounded-xs tw:opacity-70 tw:ring-offset-background tw:transition-opacity tw:hover:opacity-100 tw:focus:ring-2 tw:focus:ring-ring tw:focus:ring-offset-2 tw:focus:outline-hidden tw:disabled:pointer-events-none tw:data-[state=open]:bg-accent tw:data-[state=open]:text-muted-foreground tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4",
				children: [/* @__PURE__ */ (0, h.jsx)(Zl, {}), /* @__PURE__ */ (0, h.jsx)("span", {
					className: "tw:sr-only",
					children: "Close"
				})]
			})]
		})]
	});
}
function Rd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "dialog-header",
		className: o("tw:flex tw:flex-col tw:gap-2 tw:text-center tw:sm:text-left", e),
		...t
	});
}
function zd({ className: e, showCloseButton: t = !1, children: n, ...r }) {
	return /* @__PURE__ */ (0, h.jsxs)("div", {
		"data-slot": "dialog-footer",
		className: o("tw:flex tw:flex-col-reverse tw:gap-2 tw:sm:flex-row tw:sm:justify-end", e),
		...r,
		children: [n, t && /* @__PURE__ */ (0, h.jsx)(Li, {
			asChild: !0,
			children: /* @__PURE__ */ (0, h.jsx)(u, {
				variant: "outline",
				children: "Close"
			})
		})]
	});
}
function Bd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)(Ni, {
		"data-slot": "dialog-title",
		className: o("tw:text-lg tw:leading-none tw:font-semibold", e),
		...t
	});
}
function Vd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)(Fi, {
		"data-slot": "dialog-description",
		className: o("tw:text-sm tw:text-muted-foreground", e),
		...t
	});
}
//#endregion
//#region frontend/components/ui/alert-dialog.tsx
function Hd({ ...e }) {
	return /* @__PURE__ */ (0, h.jsx)(ea, {
		"data-slot": "alert-dialog",
		...e
	});
}
function Ud({ ...e }) {
	return /* @__PURE__ */ (0, h.jsx)(ta, {
		container: document.getElementById("ui-portal-root"),
		"data-slot": "alert-dialog-portal",
		...e
	});
}
function Wd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)(na, {
		"data-slot": "alert-dialog-overlay",
		className: o("tw:fixed tw:inset-0 tw:z-50 tw:bg-black/50 tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:animate-in tw:data-[state=open]:fade-in-0", e),
		...t
	});
}
function Gd({ className: e, size: t = "default", ...n }) {
	return /* @__PURE__ */ (0, h.jsxs)(Ud, { children: [/* @__PURE__ */ (0, h.jsx)(Wd, {}), /* @__PURE__ */ (0, h.jsx)(ra, {
		"data-slot": "alert-dialog-content",
		"data-size": t,
		className: o("tw:group/alert-dialog-content tw:fixed tw:top-[50%] tw:left-[50%] tw:z-50 tw:grid tw:w-full tw:max-w-[calc(100%-2rem)] tw:translate-x-[-50%] tw:translate-y-[-50%] tw:gap-4 tw:rounded-lg tw:border tw:bg-background tw:p-6 tw:shadow-lg tw:duration-200 tw:data-[size=sm]:max-w-xs tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:animate-in tw:data-[state=open]:fade-in-0 tw:data-[state=open]:zoom-in-95 tw:data-[size=default]:sm:max-w-lg", e),
		...n
	})] });
}
function Kd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "alert-dialog-header",
		className: o("tw:grid tw:grid-rows-[auto_1fr] tw:place-items-center tw:gap-1.5 tw:text-center tw:has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] tw:has-data-[slot=alert-dialog-media]:gap-x-6 tw:sm:group-data-[size=default]/alert-dialog-content:place-items-start tw:sm:group-data-[size=default]/alert-dialog-content:text-left tw:sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]", e),
		...t
	});
}
function qd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "alert-dialog-footer",
		className: o("tw:flex tw:flex-col-reverse tw:gap-2 tw:group-data-[size=sm]/alert-dialog-content:grid tw:group-data-[size=sm]/alert-dialog-content:grid-cols-2 tw:sm:flex-row tw:sm:justify-end", e),
		...t
	});
}
function Jd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)(aa, {
		"data-slot": "alert-dialog-title",
		className: o("tw:text-lg tw:font-semibold tw:sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2", e),
		...t
	});
}
function Yd({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)(oa, {
		"data-slot": "alert-dialog-description",
		className: o("tw:text-sm tw:text-muted-foreground", e),
		...t
	});
}
function Xd({ className: e, variant: t = "outline", size: n = "default", ...r }) {
	return /* @__PURE__ */ (0, h.jsx)(u, {
		variant: t,
		size: n,
		asChild: !0,
		children: /* @__PURE__ */ (0, h.jsx)(ia, {
			"data-slot": "alert-dialog-cancel",
			className: o(e),
			...r
		})
	});
}
//#endregion
//#region frontend/components/ui/select.tsx
function Zd({ ...e }) {
	return /* @__PURE__ */ (0, h.jsx)(Pc, {
		"data-slot": "select",
		...e
	});
}
function Qd({ ...e }) {
	return /* @__PURE__ */ (0, h.jsx)(Rc, {
		"data-slot": "select-value",
		...e
	});
}
function $d({ className: e, size: t = "default", children: n, ...r }) {
	return /* @__PURE__ */ (0, h.jsxs)(Ic, {
		"data-slot": "select-trigger",
		"data-size": t,
		className: o("tw:flex tw:w-fit tw:items-center tw:justify-between tw:gap-2 tw:rounded-md tw:border tw:border-input tw:bg-transparent tw:px-3 tw:py-2 tw:text-sm tw:whitespace-nowrap tw:shadow-xs tw:transition-[color,box-shadow] tw:outline-none tw:focus-visible:border-ring tw:focus-visible:ring-[3px] tw:focus-visible:ring-ring/50 tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:aria-invalid:border-destructive tw:aria-invalid:ring-destructive/20 tw:data-[placeholder]:text-muted-foreground tw:data-[size=default]:h-9 tw:data-[size=sm]:h-8 tw:*:data-[slot=select-value]:line-clamp-1 tw:*:data-[slot=select-value]:flex tw:*:data-[slot=select-value]:items-center tw:*:data-[slot=select-value]:gap-2 tw:dark:bg-input/30 tw:dark:hover:bg-input/50 tw:dark:aria-invalid:ring-destructive/40 tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4 tw:[&_svg:not([class*=text-])]:text-muted-foreground", e),
		...r,
		children: [n, /* @__PURE__ */ (0, h.jsx)(zc, {
			asChild: !0,
			children: /* @__PURE__ */ (0, h.jsx)(kl, { className: "tw:size-4 tw:opacity-50" })
		})]
	});
}
function ef({ className: e, children: t, position: n = "item-aligned", align: r = "center", ...i }) {
	return /* @__PURE__ */ (0, h.jsx)(Hc, {
		container: document.getElementById("ui-portal-root"),
		children: /* @__PURE__ */ (0, h.jsxs)(Wc, {
			"data-slot": "select-content",
			className: o("tw:relative tw:z-50 tw:max-h-(--radix-select-content-available-height) tw:min-w-[8rem] tw:origin-(--radix-select-content-transform-origin) tw:overflow-x-hidden tw:overflow-y-auto tw:rounded-md tw:border tw:bg-popover tw:text-popover-foreground tw:shadow-md tw:data-[side=bottom]:slide-in-from-top-2 tw:data-[side=left]:slide-in-from-right-2 tw:data-[side=right]:slide-in-from-left-2 tw:data-[side=top]:slide-in-from-bottom-2 tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:animate-in tw:data-[state=open]:fade-in-0 tw:data-[state=open]:zoom-in-95", n === "popper" && "tw:data-[side=bottom]:translate-y-1 tw:data-[side=left]:-translate-x-1 tw:data-[side=right]:translate-x-1 tw:data-[side=top]:-translate-y-1", e),
			position: n,
			align: r,
			...i,
			children: [
				/* @__PURE__ */ (0, h.jsx)(nf, {}),
				/* @__PURE__ */ (0, h.jsx)(tl, {
					className: o("tw:p-1", n === "popper" && "tw:h-[var(--radix-select-trigger-height)] tw:w-full tw:min-w-[var(--radix-select-trigger-width)] tw:scroll-my-1"),
					children: t
				}),
				/* @__PURE__ */ (0, h.jsx)(rf, {})
			]
		})
	});
}
function tf({ className: e, children: t, ...n }) {
	return /* @__PURE__ */ (0, h.jsxs)(sl, {
		"data-slot": "select-item",
		className: o("tw:relative tw:flex tw:w-full tw:cursor-default tw:items-center tw:gap-2 tw:rounded-sm tw:py-1.5 tw:pr-8 tw:pl-2 tw:text-sm tw:outline-hidden tw:select-none tw:focus:bg-accent tw:focus:text-accent-foreground tw:data-[disabled]:pointer-events-none tw:data-[disabled]:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg]:shrink-0 tw:[&_svg:not([class*=size-])]:size-4 tw:[&_svg:not([class*=text-])]:text-muted-foreground tw:*:[span]:last:flex tw:*:[span]:last:items-center tw:*:[span]:last:gap-2", e),
		...n,
		children: [/* @__PURE__ */ (0, h.jsx)("span", {
			"data-slot": "select-item-indicator",
			className: "tw:absolute tw:right-2 tw:flex tw:size-3.5 tw:items-center tw:justify-center",
			children: /* @__PURE__ */ (0, h.jsx)(dl, { children: /* @__PURE__ */ (0, h.jsx)(Dl, { className: "tw:size-4" }) })
		}), /* @__PURE__ */ (0, h.jsx)(ll, { children: t })]
	});
}
function nf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)(pl, {
		"data-slot": "select-scroll-up-button",
		className: o("tw:flex tw:cursor-default tw:items-center tw:justify-center tw:py-1", e),
		...t,
		children: /* @__PURE__ */ (0, h.jsx)(Fl, { className: "tw:size-4" })
	});
}
function rf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)(hl, {
		"data-slot": "select-scroll-down-button",
		className: o("tw:flex tw:cursor-default tw:items-center tw:justify-center tw:py-1", e),
		...t,
		children: /* @__PURE__ */ (0, h.jsx)(kl, { className: "tw:size-4" })
	});
}
//#endregion
//#region frontend/components/ui/table.tsx
function af({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"data-slot": "table-container",
		className: "tw:relative tw:w-full tw:overflow-x-auto",
		children: /* @__PURE__ */ (0, h.jsx)("table", {
			"data-slot": "table",
			className: o("tw:w-full tw:caption-bottom tw:text-sm", e),
			...t
		})
	});
}
function of({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("thead", {
		"data-slot": "table-header",
		className: o("tw:[&_tr]:border-b", e),
		...t
	});
}
function sf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("tbody", {
		"data-slot": "table-body",
		className: o("tw:[&_tr:last-child]:border-0", e),
		...t
	});
}
function cf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("tr", {
		"data-slot": "table-row",
		className: o("tw:border-b tw:transition-colors tw:hover:bg-muted/50 tw:has-aria-expanded:bg-muted/50 tw:data-[state=selected]:bg-muted", e),
		...t
	});
}
function lf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("th", {
		"data-slot": "table-head",
		className: o("tw:h-10 tw:px-2 tw:text-left tw:align-middle tw:font-medium tw:whitespace-nowrap tw:text-foreground tw:[&:has([role=checkbox])]:pr-0 tw:[&>[role=checkbox]]:translate-y-[2px]", e),
		...t
	});
}
function uf({ className: e, ...t }) {
	return /* @__PURE__ */ (0, h.jsx)("td", {
		"data-slot": "table-cell",
		className: o("tw:p-2 tw:align-middle tw:whitespace-nowrap tw:[&:has([role=checkbox])]:pr-0 tw:[&>[role=checkbox]]:translate-y-[2px]", e),
		...t
	});
}
//#endregion
//#region frontend/components/shared.tsx
var df = (0, m.createContext)(() => {}), ff = () => (0, m.useContext)(df);
function pf({ children: e }) {
	let [t, n] = (0, m.useState)([]);
	function r(e, t = !1) {
		let r = Date.now() + Math.random();
		n((n) => [...n.slice(-3), {
			id: r,
			message: e,
			error: t
		}]), setTimeout(() => n((e) => e.filter((e) => e.id !== r)), 6e3);
	}
	return /* @__PURE__ */ (0, h.jsxs)(df.Provider, {
		value: r,
		children: [e, /* @__PURE__ */ (0, h.jsx)("div", {
			className: "ui-toasts",
			"aria-label": "Notifications",
			children: t.map((e) => /* @__PURE__ */ (0, h.jsxs)("div", {
				role: e.error ? "alert" : "status",
				className: o("ui-toast", e.error && "is-error"),
				children: [
					e.error ? /* @__PURE__ */ (0, h.jsx)(Ll, { size: 18 }) : /* @__PURE__ */ (0, h.jsx)(zl, { size: 18 }),
					/* @__PURE__ */ (0, h.jsx)("span", { children: e.message }),
					/* @__PURE__ */ (0, h.jsx)("button", {
						"aria-label": "Dismiss notification",
						onClick: () => n((t) => t.filter((t) => t.id !== e.id)),
						children: /* @__PURE__ */ (0, h.jsx)(Zl, { size: 16 })
					})
				]
			}, e.id))
		})]
	});
}
function mf({ title: e, description: t, action: n, children: r, className: i }) {
	return /* @__PURE__ */ (0, h.jsxs)(Cd, {
		className: o("ui-section", i),
		children: [/* @__PURE__ */ (0, h.jsxs)(wd, {
			className: "ui-section-header tw:px-4 tw:sm:px-6",
			children: [/* @__PURE__ */ (0, h.jsxs)("div", { children: [/* @__PURE__ */ (0, h.jsx)(Td, { children: e }), t && /* @__PURE__ */ (0, h.jsx)(Ed, {
				className: "tw:mt-2",
				children: t
			})] }), n]
		}), /* @__PURE__ */ (0, h.jsx)(Dd, {
			className: "tw:px-4 tw:sm:px-6",
			children: r
		})]
	});
}
function hf({ label: e, value: t, hint: n, icon: r, tone: i = "blue" }) {
	return /* @__PURE__ */ (0, h.jsx)(Cd, {
		className: "ui-stat",
		children: /* @__PURE__ */ (0, h.jsxs)(Dd, {
			className: "tw:px-4 tw:sm:px-6",
			children: [
				/* @__PURE__ */ (0, h.jsxs)("div", {
					className: "ui-stat-top",
					children: [/* @__PURE__ */ (0, h.jsx)("span", { children: e }), /* @__PURE__ */ (0, h.jsx)("span", {
						className: `ui-stat-icon ${i}`,
						children: r
					})]
				}),
				/* @__PURE__ */ (0, h.jsx)("div", {
					className: "ui-stat-value",
					children: t
				}),
				/* @__PURE__ */ (0, h.jsx)("p", { children: n })
			]
		})
	});
}
function gf({ children: e }) {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		className: "ui-stat-grid",
		children: e
	});
}
function _f({ name: e, detail: t }) {
	return /* @__PURE__ */ (0, h.jsxs)("div", {
		className: "ui-person",
		children: [/* @__PURE__ */ (0, h.jsx)("span", {
			className: "ui-avatar",
			children: e.split(" ").map((e) => e[0]).slice(0, 2).join("").toUpperCase()
		}), /* @__PURE__ */ (0, h.jsxs)("div", { children: [/* @__PURE__ */ (0, h.jsx)("strong", { children: e }), t && /* @__PURE__ */ (0, h.jsx)("small", { children: t })] })]
	});
}
function vf({ value: e }) {
	let t = e || "Not specified", n = /^(active|available|completed|excellent|good|balanced|accepted)$/i.test(t), r = /^(unavailable|dissolved|needs improvement|overloaded|critical|rejected)$/i.test(t), i = /^(pending|busy|inactive|average|underloaded|warning)$/i.test(t);
	return /* @__PURE__ */ (0, h.jsxs)(jd, {
		variant: "outline",
		className: o("ui-status", n ? "positive" : r ? "negative" : i ? "warning" : "neutral"),
		children: [/* @__PURE__ */ (0, h.jsx)("span", { "aria-hidden": "true" }), t]
	});
}
function yf({ error: e, retry: t }) {
	return e ? /* @__PURE__ */ (0, h.jsxs)("div", {
		className: "ui-error",
		role: "alert",
		children: [
			/* @__PURE__ */ (0, h.jsx)(Ll, { size: 20 }),
			/* @__PURE__ */ (0, h.jsxs)("div", { children: [/* @__PURE__ */ (0, h.jsx)("strong", { children: e instanceof d && e.status === 403 ? "Access restricted" : "Something needs attention" }), /* @__PURE__ */ (0, h.jsx)("p", { children: e.message })] }),
			t && /* @__PURE__ */ (0, h.jsx)(u, {
				variant: "outline",
				size: "sm",
				onClick: t,
				children: "Try again"
			})
		]
	}) : null;
}
function bf() {
	return /* @__PURE__ */ (0, h.jsx)("div", {
		"aria-label": "Loading data",
		role: "status",
		className: "tw:space-y-4",
		children: [
			1,
			2,
			3
		].map((e) => /* @__PURE__ */ (0, h.jsx)(Md, { className: "tw:h-14 tw:w-full tw:rounded-lg" }, e))
	});
}
function xf({ queries: e, children: t }) {
	let n = e.find((e) => e.error);
	return n ? /* @__PURE__ */ (0, h.jsx)(yf, {
		error: n.error,
		retry: () => {
			n.refetch();
		}
	}) : e.some((e) => e.isLoading) ? /* @__PURE__ */ (0, h.jsx)(bf, {}) : /* @__PURE__ */ (0, h.jsx)(h.Fragment, { children: t });
}
function Sf({ title: e = "Nothing here yet", description: t = "Records will appear here when they are available." }) {
	return /* @__PURE__ */ (0, h.jsxs)("div", {
		className: "ui-empty",
		children: [
			/* @__PURE__ */ (0, h.jsx)("span", { children: /* @__PURE__ */ (0, h.jsx)(Vl, { size: 26 }) }),
			/* @__PURE__ */ (0, h.jsx)("strong", { children: e }),
			/* @__PURE__ */ (0, h.jsx)("p", { children: t })
		]
	});
}
function Cf({ children: e, busy: t, ...n }) {
	return /* @__PURE__ */ (0, h.jsxs)(u, {
		...n,
		disabled: t || n.disabled,
		"aria-busy": t,
		children: [t && /* @__PURE__ */ (0, h.jsx)(Ul, {
			size: 16,
			className: "tw:animate-spin"
		}), e]
	});
}
function wf({ children: e, onClick: t }) {
	return /* @__PURE__ */ (0, h.jsxs)(u, {
		onClick: t,
		children: [/* @__PURE__ */ (0, h.jsx)(Gl, { size: 16 }), e]
	});
}
var Tf = (e) => e.map((e) => ({
	value: e,
	label: e
}));
function Ef({ label: e, value: t, onChange: n, items: r, placeholder: i = "Choose an option", disabled: a, id: o }) {
	return /* @__PURE__ */ (0, h.jsxs)(Zd, {
		value: t || "__none__",
		onValueChange: (e) => n(e === "__none__" ? "" : e),
		disabled: a,
		children: [/* @__PURE__ */ (0, h.jsx)($d, {
			id: o,
			"aria-label": e,
			className: "tw:w-full tw:data-[size=default]:h-10",
			children: /* @__PURE__ */ (0, h.jsx)(Qd, { placeholder: i })
		}), /* @__PURE__ */ (0, h.jsxs)(ef, { children: [/* @__PURE__ */ (0, h.jsx)(tf, {
			value: "__none__",
			children: i
		}), r.filter((e) => e.value !== "").map((e) => /* @__PURE__ */ (0, h.jsx)(tf, {
			value: e.value,
			children: e.label
		}, e.value))] })]
	});
}
function Df({ label: e, value: t, onChange: n, type: r = "text", items: i, required: a, disabled: o, placeholder: s, min: c, max: l }) {
	let u = (0, m.useId)();
	return /* @__PURE__ */ (0, h.jsxs)("div", {
		className: "ui-field",
		children: [/* @__PURE__ */ (0, h.jsxs)("label", {
			htmlFor: u,
			children: [e, a && /* @__PURE__ */ (0, h.jsx)("span", {
				"aria-hidden": "true",
				children: " *"
			})]
		}), i ? /* @__PURE__ */ (0, h.jsx)(Ef, {
			id: u,
			label: e,
			value: t,
			onChange: n,
			items: i,
			placeholder: s,
			disabled: o
		}) : r === "textarea" ? /* @__PURE__ */ (0, h.jsx)(kd, {
			id: u,
			value: t,
			onChange: (e) => n(e.target.value),
			disabled: o,
			required: a,
			placeholder: s
		}) : /* @__PURE__ */ (0, h.jsx)(Od, {
			id: u,
			className: "tw:h-10",
			type: r,
			value: t,
			onChange: (e) => n(e.target.value),
			disabled: o,
			required: a,
			placeholder: s,
			min: c,
			max: l
		})]
	});
}
function Of({ open: e, onClose: t, title: n, description: r = "Update the details below. Required fields are marked with an asterisk.", children: i, onSubmit: a, busy: o, error: s, className: c }) {
	return /* @__PURE__ */ (0, h.jsx)(Pd, {
		open: e,
		onOpenChange: (e) => {
			!e && !o && t();
		},
		children: /* @__PURE__ */ (0, h.jsxs)(Ld, {
			className: `ui-dialog tw:flex tw:flex-col tw:overflow-hidden tw:p-0 ${c || ""}`,
			children: [/* @__PURE__ */ (0, h.jsxs)(Rd, {
				className: "tw:shrink-0 tw:px-6 tw:pt-6 tw:pr-12",
				children: [/* @__PURE__ */ (0, h.jsx)(Bd, { children: n }), /* @__PURE__ */ (0, h.jsx)(Vd, { children: r })]
			}), /* @__PURE__ */ (0, h.jsxs)("form", {
				className: "tw:flex tw:min-h-0 tw:flex-col",
				onSubmit: (e) => {
					e.preventDefault(), o || a();
				},
				children: [/* @__PURE__ */ (0, h.jsxs)("div", {
					className: "tw:min-h-0 tw:overflow-y-auto tw:px-6 tw:pb-6",
					children: [/* @__PURE__ */ (0, h.jsx)("div", {
						className: "ui-form-grid",
						children: i
					}), /* @__PURE__ */ (0, h.jsx)(yf, { error: s })]
				}), /* @__PURE__ */ (0, h.jsxs)(zd, {
					className: "tw:shrink-0 tw:border-t tw:bg-background tw:px-6 tw:py-4",
					children: [/* @__PURE__ */ (0, h.jsx)(u, {
						type: "button",
						variant: "outline",
						onClick: t,
						disabled: o,
						children: "Cancel"
					}), /* @__PURE__ */ (0, h.jsx)(Cf, {
						type: "submit",
						busy: o,
						children: "Save changes"
					})]
				})]
			})]
		})
	});
}
function kf({ open: e, onClose: t, onConfirm: n, title: r, description: i = "This action cannot be undone. Please confirm before continuing.", busy: a, error: o, destructive: s = !0 }) {
	return /* @__PURE__ */ (0, h.jsx)(Hd, {
		open: e,
		onOpenChange: (e) => {
			!e && !a && t();
		},
		children: /* @__PURE__ */ (0, h.jsxs)(Gd, { children: [
			/* @__PURE__ */ (0, h.jsxs)(Kd, { children: [/* @__PURE__ */ (0, h.jsx)(Jd, { children: r }), /* @__PURE__ */ (0, h.jsx)(Yd, { children: i })] }),
			/* @__PURE__ */ (0, h.jsx)(yf, { error: o }),
			/* @__PURE__ */ (0, h.jsxs)(qd, { children: [/* @__PURE__ */ (0, h.jsx)(Xd, {
				disabled: a,
				children: "Cancel"
			}), /* @__PURE__ */ (0, h.jsx)(Cf, {
				busy: a,
				variant: s ? "destructive" : "default",
				onClick: n,
				children: s ? "Confirm removal" : "Confirm assignment"
			})] })
		] })
	});
}
function Af({ value: e, label: t }) {
	let n = Math.max(0, Math.min(100, e));
	return /* @__PURE__ */ (0, h.jsxs)("div", {
		className: "ui-score",
		children: [/* @__PURE__ */ (0, h.jsx)(Nd, {
			value: n,
			"aria-label": t || "Progress"
		}), /* @__PURE__ */ (0, h.jsxs)("span", { children: [Math.round(n), "%"] })]
	});
}
function jf({ title: e, description: t, children: n }) {
	return /* @__PURE__ */ (0, h.jsx)(mf, {
		title: e,
		description: t,
		className: "ui-ai-panel",
		action: /* @__PURE__ */ (0, h.jsxs)("span", {
			className: "ui-ai-mark",
			children: [/* @__PURE__ */ (0, h.jsx)(Yl, { size: 16 }), "AI assistant"]
		}),
		children: n
	});
}
function Mf({ data: e, columns: t, searchLabel: n = "Search records", filter: r, initialSorting: i = [] }) {
	let [a, o] = (0, m.useState)(""), [s, c] = (0, m.useState)(i), l = Sd({
		data: e,
		columns: t,
		state: {
			globalFilter: a,
			sorting: s
		},
		onGlobalFilterChange: o,
		onSortingChange: c,
		getCoreRowModel: ud(),
		getSortedRowModel: _d(),
		getFilteredRowModel: hd(),
		getPaginationRowModel: gd(),
		initialState: { pagination: { pageSize: 10 } }
	});
	return /* @__PURE__ */ (0, h.jsxs)("div", {
		className: "ui-data-table",
		children: [
			/* @__PURE__ */ (0, h.jsxs)("div", {
				className: "ui-table-toolbar",
				children: [/* @__PURE__ */ (0, h.jsxs)("div", {
					className: "ui-search",
					children: [/* @__PURE__ */ (0, h.jsx)(ql, {
						size: 17,
						"aria-hidden": "true",
						className: "tw:pointer-events-none"
					}), /* @__PURE__ */ (0, h.jsx)(Od, {
						className: "tw:pl-10 tw:h-10",
						"aria-label": n,
						placeholder: n,
						value: a,
						onChange: (e) => o(e.target.value)
					})]
				}), /* @__PURE__ */ (0, h.jsx)("div", {
					className: "ui-table-filter",
					children: r
				})]
			}),
			/* @__PURE__ */ (0, h.jsx)("div", {
				className: "ui-table-scroll",
				children: /* @__PURE__ */ (0, h.jsxs)(af, {
					className: "tw:text-xs",
					children: [/* @__PURE__ */ (0, h.jsx)(of, { children: l.getHeaderGroups().map((e) => /* @__PURE__ */ (0, h.jsx)(cf, { children: e.headers.map((e) => /* @__PURE__ */ (0, h.jsx)(lf, {
						className: "tw:px-4 tw:py-3",
						children: e.isPlaceholder ? null : e.column.getCanSort() ? /* @__PURE__ */ (0, h.jsxs)("button", {
							className: "ui-sort",
							onClick: e.column.getToggleSortingHandler(),
							"aria-label": `Sort ${String(e.column.columnDef.header)}`,
							"aria-pressed": !!e.column.getIsSorted(),
							children: [vd(e.column.columnDef.header, e.getContext()), /* @__PURE__ */ (0, h.jsx)(Tl, { size: 13 })]
						}) : vd(e.column.columnDef.header, e.getContext())
					}, e.id)) }, e.id)) }), /* @__PURE__ */ (0, h.jsx)(sf, { children: l.getRowModel().rows.map((e) => /* @__PURE__ */ (0, h.jsx)(cf, { children: e.getVisibleCells().map((e) => /* @__PURE__ */ (0, h.jsx)(uf, {
						className: "tw:px-4 tw:py-4",
						children: vd(e.column.columnDef.cell, e.getContext())
					}, e.id)) }, e.id)) })]
				})
			}),
			!l.getRowModel().rows.length && /* @__PURE__ */ (0, h.jsx)(Sf, {
				title: a || r ? "No matching records" : "No records yet",
				description: "Try another search or add a record to get started."
			}),
			/* @__PURE__ */ (0, h.jsxs)("div", {
				className: "ui-table-footer",
				children: [/* @__PURE__ */ (0, h.jsxs)("span", { children: [
					l.getFilteredRowModel().rows.length,
					" records · Page",
					" ",
					l.getState().pagination.pageIndex + 1,
					" of ",
					Math.max(1, l.getPageCount())
				] }), /* @__PURE__ */ (0, h.jsxs)("div", {
					className: "ui-pagination",
					children: [
						/* @__PURE__ */ (0, h.jsx)(Ef, {
							label: "Rows per page",
							value: String(l.getState().pagination.pageSize),
							onChange: (e) => l.setPageSize(Number(e || 10)),
							items: Tf([
								"10",
								"25",
								"50"
							])
						}),
						/* @__PURE__ */ (0, h.jsx)(u, {
							size: "icon",
							variant: "outline",
							"aria-label": "Previous page",
							disabled: !l.getCanPreviousPage(),
							onClick: () => l.previousPage(),
							children: /* @__PURE__ */ (0, h.jsx)(Nl, { size: 16 })
						}),
						/* @__PURE__ */ (0, h.jsx)(u, {
							size: "icon",
							variant: "outline",
							"aria-label": "Next page",
							disabled: !l.getCanNextPage(),
							onClick: () => l.nextPage(),
							children: /* @__PURE__ */ (0, h.jsx)(jl, { size: 16 })
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region frontend/lib/hooks.ts
function Nf(e, t = !0) {
	return Xe({
		queryKey: [e],
		queryFn: ({ signal: t }) => l(e, t),
		enabled: t && s(window.APP_CONFIG, e === "roles" ? "users.view" : `${e}.view`),
		staleTime: 3e4,
		retry: !1
	});
}
function Pf(e, t = []) {
	let n = _(), r = (0, m.useRef)(!1), i = Ze({
		mutationFn: e,
		onSuccess: async () => {
			await Promise.all(t.map((e) => n.invalidateQueries({ queryKey: [e] })));
		}
	});
	async function a(e) {
		if (!r.current) {
			r.current = !0;
			try {
				return await i.mutateAsync(e);
			} finally {
				r.current = !1;
			}
		}
	}
	return {
		...i,
		run: a
	};
}
//#endregion
export { Si as $, Pd as A, C as At, zl as B, ff as C, fe as Ct, lf as D, A as Dt, uf as E, j as Et, Od as F, Gs as G, Dl as H, Zl as I, gi as J, Us as K, Yl as L, Vd as M, D as Mt, Rd as N, ae as Nt, of as O, k as Ot, Bd as P, v as Pt, wi as Q, Gl as R, Tf as S, he as St, sf as T, w as Tt, Ws as U, kl as V, Ks as W, Oi as X, Li as Y, Fi as Z, mf as _, R as _t, jf as a, En as at, gf as b, Te as bt, Sf as c, on as ct, Of as d, Lt as dt, Ni as et, bf as f, H as ft, Af as g, at as gt, xf as h, ct as ht, wf as i, zn as it, Ld as j, M as jt, cf as k, O as kt, yf as l, tn as lt, _f as m, dt as mt, Nf as n, ei as nt, kf as o, hn as ot, pf as p, V as pt, Ds as q, Cf as r, Gn as rt, Mf as s, U as st, Pf as t, li as tt, Df as u, Gt as ut, Ef as v, tt as vt, af as w, de as wt, vf as x, ge as xt, hf as y, Fe as yt, Ul as z };
