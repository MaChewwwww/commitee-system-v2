//#region frontend/lib/calculations.ts
function e(e, t) {
	return e.filter((e) => e.member_id === t && e.status !== "completed").length;
}
function t(e) {
	return e >= 90 ? "Excellent" : e >= 75 ? "Good" : e >= 60 ? "Average" : "Needs Improvement";
}
function n(e, n, r) {
	return e.map((e) => {
		let a = n.filter((t) => t.member_id === e.id), o = a.filter((e) => e.status === "completed"), s = o.filter((e) => {
			let t = e.completed_at;
			return !e.due_date || !t ? !1 : (/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?$/.test(t) ? t.slice(0, 10) : i(new Date(t))) <= e.due_date;
		}), c = r.filter((t) => t.member_id === e.id).sort((e, t) => (/^\d{4}-\d{2}$/.test(t.period || "") ? `${t.period}-01` : (t.created_at || "").slice(0, 10)).localeCompare(/^\d{4}-\d{2}$/.test(e.period || "") ? `${e.period}-01` : (e.created_at || "").slice(0, 10)) || (t.created_at || "").localeCompare(e.created_at || "") || t.id.localeCompare(e.id))[0], l = Number(c?.attendance_rate || 0), u = a.length ? Math.round(o.length / a.length * 100) : 0, d = o.length ? Math.round(s.length / o.length * 100) : 0, f = Math.round(u * .5 + l * .2 + d * .3);
		return {
			...e,
			total_tasks: a.length,
			completed_tasks: o.length,
			task_completion_rate: u,
			attendance_rate: l,
			on_time_rate: d,
			final_score: f,
			grade: t(f)
		};
	}).sort((e, t) => t.final_score - e.final_score);
}
function r(e) {
	if (!e) return "—";
	let t = new Date(/^\d{4}-\d{2}-\d{2}$/.test(e) ? `${e}T00:00:00+08:00` : /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(e) ? `${e.replace(" ", "T")}+08:00` : e);
	return Number.isNaN(t.getTime()) ? "—" : t.toLocaleDateString("en-PH", {
		timeZone: "Asia/Manila",
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function i(e = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Manila",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(e);
}
function a(e) {
	return e.status === "active" && (!e.effective_until || e.effective_until >= i());
}
var o = (e) => ({
	pending: "Open",
	in_progress: "In progress",
	awaiting_approval: "Awaiting approval",
	completed: "Completed"
})[e] || e;
//#endregion
export { n as a, e as i, r as n, o, i as r, a as t };
