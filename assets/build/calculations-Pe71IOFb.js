//#region frontend/lib/calculations.ts
function e(e, t) {
	return e.filter((e) => e.member_id === t && e.status === "pending").length;
}
function t(e) {
	return e > 5 ? "Overloaded" : e < 2 ? "Underloaded" : "Balanced";
}
function n(e) {
	return e >= 90 ? "Excellent" : e >= 75 ? "Good" : e >= 60 ? "Average" : "Needs Improvement";
}
function r(e, t, r) {
	return e.map((e) => {
		let i = t.filter((t) => t.member_id === e.id), a = i.filter((e) => e.status === "completed"), o = a.filter((e) => e.due_date && e.updated_at && new Date(e.updated_at) <= new Date(e.due_date)), s = Number(r.find((t) => t.member_id === e.id)?.attendance_rate || 0), c = i.length ? Math.round(a.length / i.length * 100) : 0, l = a.length ? Math.round(o.length / a.length * 100) : 0, u = Math.round(c * .5 + s * .2 + l * .3);
		return {
			...e,
			total_tasks: i.length,
			completed_tasks: a.length,
			task_completion_rate: c,
			attendance_rate: s,
			on_time_rate: l,
			final_score: u,
			grade: n(u)
		};
	}).sort((e, t) => t.final_score - e.final_score);
}
function i(e) {
	let t = /* @__PURE__ */ new Map();
	return e.forEach((e) => t.set(e.area_name, (t.get(e.area_name) || 0) + 1)), [...t].filter(([, e]) => e > 1).map(([e]) => e);
}
function a(e) {
	if (!e) return "—";
	let t = new Date(/^\d{4}-\d{2}-\d{2}$/.test(e) ? `${e}T00:00:00+08:00` : /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(e) ? `${e.replace(" ", "T")}+08:00` : e);
	return Number.isNaN(t.getTime()) ? "—" : t.toLocaleDateString("en-PH", {
		timeZone: "Asia/Manila",
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function o(e = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Manila",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(e);
}
//#endregion
export { e as a, i, n, r as o, o as r, t as s, a as t };
