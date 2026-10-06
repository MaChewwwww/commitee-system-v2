import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n, n as r } from "./api-DVPVP-g0.js";
import { S as i, n as a, v as o, x as s } from "./hooks-BlRndFBy.js";
import { t as c } from "./management-Z1Cs2zh-.js";
import { n as l } from "./calculations-ZvWekKcJ.js";
//#region frontend/pages/jurisdiction.tsx
var u = /* @__PURE__ */ e(t(), 1), d = n(), f = [
	"Decision-making",
	"Recommendatory",
	"Monitoring"
];
function p() {
	let e = a("committees"), t = a("jurisdictions"), [n, p] = (0, u.useState)(""), [m, h] = (0, u.useState)(""), g = (e.data || []).map((e) => ({
		value: e.id,
		label: e.name
	})), _ = i([.../* @__PURE__ */ new Set([...f, ...(t.data || []).flatMap((e) => e.level ? [e.level] : [])])]);
	return /* @__PURE__ */ (0, d.jsxs)(d.Fragment, { children: [/* @__PURE__ */ (0, d.jsx)(c, {
		resource: "jurisdictions",
		singular: "Jurisdiction",
		sectionTitle: "Jurisdiction matrix",
		describe: "Set each committee’s level, legal basis, area, and term end date. Decision-making applies only within its authorized mandate.",
		defaults: {
			committee_id: "",
			area_name: "",
			level: "Decision-making",
			legal_basis: "",
			effectivity_date: "",
			effective_until: ""
		},
		queries: [e],
		fields: (e, t) => [
			{
				name: "committee_id",
				label: "Committee",
				required: !0,
				items: g,
				disabled: !r(window.APP_CONFIG, "committees.view")
			},
			{
				name: "level",
				label: "Level",
				required: !0,
				items: i(t?.level && !f.includes(t.level) ? [...f, t.level] : f)
			},
			{
				name: "legal_basis",
				label: "Legal basis",
				required: !0,
				placeholder: "e.g. Ordinance number or resolution",
				fullWidth: !0
			},
			{
				name: "area_name",
				label: "Area",
				required: !0,
				placeholder: "Barangay or area"
			},
			{
				name: "effectivity_date",
				label: "Effective from",
				type: "date"
			},
			{
				name: "effective_until",
				label: "Effective until",
				type: "date"
			}
		],
		columns: [
			{
				accessorFn: (t) => e.data?.find((e) => e.id === t.committee_id)?.name || "Committee unavailable",
				id: "committee",
				header: "Committee"
			},
			{
				accessorKey: "level",
				header: "Level",
				cell: ({ row: e }) => /* @__PURE__ */ (0, d.jsx)(s, { value: e.original.level })
			},
			{
				accessorKey: "legal_basis",
				header: "Legal basis",
				cell: ({ row: e }) => e.original.legal_basis || "Not specified"
			},
			{
				accessorKey: "area_name",
				header: "Area"
			},
			{
				accessorKey: "effective_until",
				header: "Effectivity",
				cell: ({ row: t }) => e.data?.find((e) => e.id === t.original.committee_id)?.effective_until || t.original.effective_until ? l(e.data?.find((e) => e.id === t.original.committee_id)?.effective_until || t.original.effective_until) : "No end date recorded"
			}
		],
		filter: /* @__PURE__ */ (0, d.jsxs)("div", {
			className: "tw:flex tw:flex-wrap tw:gap-2",
			children: [/* @__PURE__ */ (0, d.jsx)("div", {
				className: "tw:min-w-44",
				children: /* @__PURE__ */ (0, d.jsx)(o, {
					label: "Filter by committee",
					value: n,
					onChange: p,
					items: g,
					placeholder: "All committees"
				})
			}), /* @__PURE__ */ (0, d.jsx)("div", {
				className: "tw:min-w-40",
				children: /* @__PURE__ */ (0, d.jsx)(o, {
					label: "Filter by level",
					value: m,
					onChange: h,
					items: _,
					placeholder: "All levels"
				})
			})]
		}),
		filteredData: (e) => e.filter((e) => (!n || e.committee_id === n) && (!m || e.level === m))
	}), /* @__PURE__ */ (0, d.jsx)(c, {
		resource: "penalties",
		singular: "Penalty",
		sectionTitle: "Penalty matrix",
		describe: "Record the applicable penalty for each offense.",
		defaults: {
			violation: "",
			legal_basis: "",
			first_offense: "",
			second_offense: "",
			third_offense: ""
		},
		fields: (e, t) => [
			{
				name: "violation",
				label: "Violation",
				required: !0,
				fullWidth: !0
			},
			{
				name: "legal_basis",
				label: "Legal basis",
				required: !0,
				fullWidth: !0,
				placeholder: "Ordinance and section authorizing this penalty"
			},
			{
				name: "first_offense",
				label: "1st offense",
				required: !0,
				placeholder: "Warning, amount, or other penalty"
			},
			{
				name: "second_offense",
				label: "2nd offense",
				required: !0
			},
			{
				name: "third_offense",
				label: "3rd offense",
				required: !0
			}
		],
		columns: [
			{
				accessorKey: "violation",
				header: "Violation"
			},
			{
				accessorKey: "legal_basis",
				header: "Legal basis"
			},
			{
				accessorKey: "first_offense",
				header: "1st offense"
			},
			{
				accessorKey: "second_offense",
				header: "2nd offense"
			},
			{
				accessorKey: "third_offense",
				header: "3rd offense"
			}
		]
	})] });
}
//#endregion
export { p as default };
