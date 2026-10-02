import { h as e } from "./api-DVPVP-g0.js";
//#region frontend/components/charts.tsx
var t = e();
function n({ segments: e, label: n }) {
	let r = e.reduce((e, t) => e + t.value, 0), i = 0;
	return /* @__PURE__ */ (0, t.jsxs)("div", {
		className: "ui-distribution",
		children: [/* @__PURE__ */ (0, t.jsxs)("div", {
			className: "ui-donut",
			children: [/* @__PURE__ */ (0, t.jsxs)("svg", {
				viewBox: "0 0 120 120",
				role: "img",
				"aria-label": `${n}: ${e.map((e) => `${e.label} ${e.value}`).join(", ")}`,
				children: [/* @__PURE__ */ (0, t.jsx)("circle", {
					cx: "60",
					cy: "60",
					r: "48",
					fill: "none",
					stroke: "#edf1f7",
					strokeWidth: "10"
				}), e.map((e) => {
					let n = r ? e.value / r * 100 : 0, a = i;
					return i += n, /* @__PURE__ */ (0, t.jsx)("circle", {
						cx: "60",
						cy: "60",
						r: "48",
						pathLength: "100",
						fill: "none",
						stroke: e.color,
						strokeWidth: "10",
						strokeDasharray: `${n} ${100 - n}`,
						strokeDashoffset: -a
					}, e.label);
				})]
			}), /* @__PURE__ */ (0, t.jsxs)("div", {
				className: "ui-donut-center",
				children: [/* @__PURE__ */ (0, t.jsx)("strong", { children: r }), /* @__PURE__ */ (0, t.jsx)("small", { children: n })]
			})]
		}), /* @__PURE__ */ (0, t.jsx)("div", {
			className: "ui-chart-legend",
			children: e.map((e) => /* @__PURE__ */ (0, t.jsxs)("div", {
				className: "ui-legend-row",
				children: [
					/* @__PURE__ */ (0, t.jsx)("span", { style: { backgroundColor: e.color } }),
					/* @__PURE__ */ (0, t.jsx)("span", { children: e.label }),
					/* @__PURE__ */ (0, t.jsx)("strong", { children: e.value })
				]
			}, e.label))
		})]
	});
}
//#endregion
export { n as t };
