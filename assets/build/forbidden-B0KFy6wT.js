import { h as e, l as t, n, s as r } from "./api-DVPVP-g0.js";
//#region node_modules/lucide-react/dist/esm/icons/shield-alert.mjs
var i = {
	name: "shield-alert",
	size: 24,
	node: [
		["path", {
			d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
			key: "oel41y"
		}],
		["path", {
			d: "M12 8v4",
			key: "1got3b"
		}],
		["path", {
			d: "M12 16h.01",
			key: "1drbdi"
		}]
	]
};
i.node;
var a = t(i), o = e();
function s() {
	let e = window.APP_CONFIG.navigation.find((e) => n(window.APP_CONFIG, e.permission))?.href || window.APP_CONFIG.login;
	return /* @__PURE__ */ (0, o.jsxs)("div", {
		className: "ui-forbidden",
		children: [
			/* @__PURE__ */ (0, o.jsx)("span", { children: /* @__PURE__ */ (0, o.jsx)(a, { size: 40 }) }),
			/* @__PURE__ */ (0, o.jsx)("p", {
				className: "ui-eyebrow",
				children: "ACCESS RESTRICTED"
			}),
			/* @__PURE__ */ (0, o.jsx)("h2", { children: "This space needs permission" }),
			/* @__PURE__ */ (0, o.jsx)("p", { children: "Your account does not have access to this page. Contact your administrator if you need access." }),
			/* @__PURE__ */ (0, o.jsx)(r, {
				asChild: !0,
				children: /* @__PURE__ */ (0, o.jsx)("a", {
					href: e,
					children: "Return to workspace"
				})
			})
		]
	});
}
//#endregion
export { s as default };
