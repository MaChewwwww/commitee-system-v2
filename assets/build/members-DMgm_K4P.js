import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n, l as r } from "./api-DVPVP-g0.js";
import { S as i, b as a, g as o, m as s, n as c, v as l, x as u, y as d } from "./hooks-CGjnItOC.js";
import { t as f } from "./clock-3-DqrQmDOW.js";
import { t as p } from "./management-B_sQlv9E.js";
import { n as m } from "./app-4em4_PaO.js";
//#region node_modules/lucide-react/dist/esm/icons/user-check.mjs
var h = {
	name: "user-check",
	size: 24,
	node: [
		["path", {
			d: "m16 11 2 2 4-4",
			key: "9rsbq5"
		}],
		["path", {
			d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
			key: "1yyitq"
		}],
		["circle", {
			cx: "9",
			cy: "7",
			r: "4",
			key: "nufk8"
		}]
	]
};
h.node;
var g = r(h), _ = {
	name: "user-round",
	size: 24,
	node: [["circle", {
		cx: "12",
		cy: "8",
		r: "5",
		key: "1hypcn"
	}], ["path", {
		d: "M20 21a8 8 0 0 0-16 0",
		key: "rfgkzh"
	}]],
	aliases: ["user-2"]
};
_.node;
var v = r(_), y = /* @__PURE__ */ e(t(), 1), b = n(), x = i([
	"SK Chairman",
	"SK Kagawad",
	"SK Secretary",
	"SK Treasurer",
	"SK Member"
]);
function S() {
	let e = c("members"), [t, n] = (0, y.useState)("");
	return /* @__PURE__ */ (0, b.jsx)(p, {
		resource: "members",
		singular: "Member",
		defaults: {
			full_name: "",
			email: "",
			phone: "",
			position: "",
			skills: "",
			availability: "available"
		},
		fields: () => [
			{
				name: "full_name",
				label: "Full name",
				required: !0
			},
			{
				name: "email",
				label: "Email address",
				type: "email"
			},
			{
				name: "phone",
				label: "Phone number",
				type: "tel"
			},
			{
				name: "position",
				label: "Position",
				items: x
			},
			{
				name: "skills",
				label: "Skills",
				placeholder: "Leadership, communication…"
			},
			{
				name: "availability",
				label: "Availability",
				required: !0,
				items: i([
					"available",
					"busy",
					"unavailable"
				])
			}
		],
		transform: (e) => ({
			...e,
			full_name: e.full_name.trim(),
			skills: e.skills.split(",").map((e) => e.trim()).filter(Boolean)
		}),
		columns: [
			{
				accessorKey: "full_name",
				header: "Member",
				cell: ({ row: e }) => /* @__PURE__ */ (0, b.jsx)(s, { name: e.original.full_name })
			},
			{
				accessorKey: "position",
				header: "Position"
			},
			{
				accessorFn: (e) => e.email || e.phone || "—",
				id: "contact",
				header: "Contact"
			},
			{
				accessorKey: "availability",
				header: "Availability",
				cell: ({ row: e }) => /* @__PURE__ */ (0, b.jsx)(u, { value: e.original.availability })
			},
			{
				accessorKey: "workload_score",
				header: "Workload",
				cell: ({ row: e }) => /* @__PURE__ */ (0, b.jsx)(o, {
					value: Number(e.original.workload_score || 0),
					label: `${e.original.full_name} workload`
				})
			}
		],
		filter: /* @__PURE__ */ (0, b.jsx)(l, {
			label: "Filter availability",
			value: t,
			onChange: n,
			items: i([
				"available",
				"busy",
				"unavailable"
			]),
			placeholder: "All availability"
		}),
		filteredData: (e) => t ? e.filter((e) => e.availability === t) : e,
		before: /* @__PURE__ */ (0, b.jsxs)(a, { children: [
			/* @__PURE__ */ (0, b.jsx)(d, {
				label: "Team members",
				value: e.data?.length ?? "—",
				hint: "Your community of contributors",
				icon: /* @__PURE__ */ (0, b.jsx)(m, { size: 16 })
			}),
			/* @__PURE__ */ (0, b.jsx)(d, {
				label: "Available",
				value: e.data?.filter((e) => e.availability === "available").length ?? "—",
				hint: "Ready for new opportunities",
				icon: /* @__PURE__ */ (0, b.jsx)(g, { size: 16 }),
				tone: "green"
			}),
			/* @__PURE__ */ (0, b.jsx)(d, {
				label: "Busy",
				value: e.data?.filter((e) => e.availability === "busy").length ?? "—",
				hint: "Focused on current priorities",
				icon: /* @__PURE__ */ (0, b.jsx)(f, { size: 16 }),
				tone: "gold"
			}),
			/* @__PURE__ */ (0, b.jsx)(d, {
				label: "Positions",
				value: e.data ? new Set(e.data.map((e) => e.position).filter(Boolean)).size : "—",
				hint: "Different strengths, shared purpose",
				icon: /* @__PURE__ */ (0, b.jsx)(v, { size: 16 }),
				tone: "purple"
			})
		] })
	});
}
//#endregion
export { S as default };
