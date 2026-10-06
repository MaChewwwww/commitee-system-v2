import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
//#region frontend/main.tsx
var t = document.getElementById("ui-root");
t && Promise.all([
	import("./client-DW5QUoJC.js").then((t) => /* @__PURE__ */ e(t.default, 1)),
	import("./app-4em4_PaO.js").then((e) => e.t),
	import("./react-B4u1yd7E.js").then((t) => /* @__PURE__ */ e(t.t(), 1))
]).then(([{ createRoot: e }, { App: n }, { createElement: r }]) => {
	t.dataset.uiReady = "true", e(t).render(r(n));
}).catch(() => {
	let e = document.getElementById("ui-startup-message");
	e && (e.textContent = "The interface could not load. Reload this page or check that all frontend assets were uploaded.");
});
//#endregion
