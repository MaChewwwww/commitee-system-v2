import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n, l as r } from "./api-DVPVP-g0.js";
import { S as i, b as a, n as o, v as s, x as c, y as l } from "./hooks-CGjnItOC.js";
import { t as u } from "./management-B_sQlv9E.js";
import { a as d, l as f } from "./app-4em4_PaO.js";
import { i as p, t as m } from "./calculations-Pe71IOFb.js";
//#region node_modules/lucide-react/dist/esm/icons/layers.mjs
var h = {
	name: "layers",
	size: 24,
	node: [
		["path", {
			d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
			key: "zw3jo"
		}],
		["path", {
			d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
			key: "1wduqc"
		}],
		["path", {
			d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
			key: "kqbvx6"
		}]
	],
	aliases: ["layers-3"]
};
h.node;
var g = r(h), _ = {
	name: "map",
	size: 24,
	node: [
		["path", {
			d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
			key: "169xi5"
		}],
		["path", {
			d: "M15 5.764v15",
			key: "1pn4in"
		}],
		["path", {
			d: "M9 3.236v15",
			key: "1uimfh"
		}]
	]
};
_.node;
var v = r(_), y = /* @__PURE__ */ e(t(), 1), b = n();
function x() {
	let e = o("committees"), t = o("jurisdictions"), [n, r] = (0, y.useState)(""), h = p(t.data || []), _ = (e.data || []).map((e) => ({
		value: e.id,
		label: e.name
	}));
	return /* @__PURE__ */ (0, b.jsx)(u, {
		resource: "jurisdictions",
		singular: "Jurisdiction",
		defaults: {
			committee_id: "",
			area_name: "",
			category: ""
		},
		queries: [e],
		fields: () => [
			{
				name: "committee_id",
				label: "Committee",
				required: !0,
				items: _
			},
			{
				name: "area_name",
				label: "Area name",
				required: !0,
				placeholder: "e.g. Barangay Poblacion"
			},
			{
				name: "category",
				label: "Category",
				required: !0,
				items: i([
					"Education",
					"Health",
					"Environment",
					"Sports",
					"Livelihood",
					"Peace and Order",
					"Culture and Arts",
					"Infrastructure",
					"Social Services",
					"Other"
				])
			}
		],
		columns: [
			{
				accessorFn: (t) => e.data?.find((e) => e.id === t.committee_id)?.name || "Unknown committee",
				id: "committee",
				header: "Committee"
			},
			{
				accessorKey: "area_name",
				header: "Area",
				cell: ({ row: e }) => /* @__PURE__ */ (0, b.jsx)("strong", { children: e.original.area_name })
			},
			{
				accessorKey: "category",
				header: "Category",
				cell: ({ row: e }) => /* @__PURE__ */ (0, b.jsx)(c, { value: e.original.category })
			},
			{
				accessorKey: "created_at",
				header: "Created",
				cell: ({ row: e }) => m(e.original.created_at)
			}
		],
		filter: /* @__PURE__ */ (0, b.jsx)(s, {
			label: "Filter by committee",
			value: n,
			onChange: r,
			items: _,
			placeholder: "All committees"
		}),
		filteredData: (e) => n ? e.filter((e) => e.committee_id === n) : e,
		before: /* @__PURE__ */ (0, b.jsxs)(b.Fragment, { children: [/* @__PURE__ */ (0, b.jsxs)(a, { children: [
			/* @__PURE__ */ (0, b.jsx)(l, {
				label: "Jurisdictions",
				value: t.data?.length ?? "—",
				hint: "Areas connected to committees",
				icon: /* @__PURE__ */ (0, b.jsx)(d, { size: 16 })
			}),
			/* @__PURE__ */ (0, b.jsx)(l, {
				label: "Unique areas",
				value: t.data ? new Set(t.data.map((e) => e.area_name)).size : "—",
				hint: "Your community coverage",
				icon: /* @__PURE__ */ (0, b.jsx)(v, { size: 16 }),
				tone: "green"
			}),
			/* @__PURE__ */ (0, b.jsx)(l, {
				label: "Overlapping areas",
				value: t.data ? h.length : "—",
				hint: "Shared responsibilities to review",
				icon: /* @__PURE__ */ (0, b.jsx)(g, { size: 16 }),
				tone: "gold"
			}),
			/* @__PURE__ */ (0, b.jsx)(l, {
				label: "Committees involved",
				value: t.data ? new Set(t.data.map((e) => e.committee_id)).size : "—",
				hint: "Working across your community",
				icon: /* @__PURE__ */ (0, b.jsx)(f, { size: 16 }),
				tone: "purple"
			})
		] }), h.length > 0 && /* @__PURE__ */ (0, b.jsxs)("div", {
			className: "ui-info ui-warning",
			role: "status",
			children: [/* @__PURE__ */ (0, b.jsx)("strong", { children: "Shared coverage needs a closer look." }), /* @__PURE__ */ (0, b.jsxs)("p", {
				className: "tw:mt-2",
				children: [
					h.join(", "),
					" ",
					h.length === 1 ? "is" : "are",
					" covered by multiple records. Coordinate responsibilities across the relevant committees."
				]
			})]
		})] })
	});
}
//#endregion
export { x as default };
