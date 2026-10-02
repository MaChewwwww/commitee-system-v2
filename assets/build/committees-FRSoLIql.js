import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { h as n, i as r, l as i, n as a, o, s } from "./api-DVPVP-g0.js";
import { A as c, B as l, C as u, H as d, M as f, N as p, P as m, R as h, S as g, b as _, h as v, j as y, l as b, n as x, o as S, t as C, u as w, v as T, x as E, y as D, z as O } from "./hooks-CGjnItOC.js";
import { t as k } from "./archive-wn--b_zA.js";
import { t as A } from "./trash-C6NxJFw3.js";
import { t as j } from "./management-B8pQyXgv.js";
import { l as M, n as N } from "./app-B8tnWQbD.js";
import { t as P } from "./calculations-Pe71IOFb.js";
//#region node_modules/lucide-react/dist/esm/icons/pause.mjs
var F = {
	name: "pause",
	size: 24,
	node: [["rect", {
		x: "14",
		y: "3",
		width: "5",
		height: "18",
		rx: "1",
		key: "kaeet6"
	}], ["rect", {
		x: "5",
		y: "3",
		width: "5",
		height: "18",
		rx: "1",
		key: "1wsw3u"
	}]]
};
F.node;
var I = i(F), L = {
	name: "rotate-ccw",
	size: 24,
	node: [["path", {
		d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
		key: "1357e3"
	}], ["path", {
		d: "M3 3v5h5",
		key: "1xhq8a"
	}]]
};
L.node;
var R = i(L), z = {
	name: "save",
	size: 24,
	node: [
		["path", {
			d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
			key: "1c8476"
		}],
		["path", {
			d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
			key: "1ydtos"
		}],
		["path", {
			d: "M7 3v4a1 1 0 0 0 1 1h7",
			key: "t51u73"
		}]
	]
};
z.node;
var B = i(z), V = /* @__PURE__ */ e(t(), 1), H = n(), U = g([
	"Member",
	"Chairperson",
	"Vice Chairperson",
	"Secretary",
	"Treasurer"
]);
function W({ committeeId: e }) {
	let t = x("assignments"), n = x("members"), [i, c] = (0, V.useState)(""), [l, f] = (0, V.useState)("Member"), [p, m] = (0, V.useState)({}), [g, _] = (0, V.useState)(), y = u(), E = C((e) => e.method === "DELETE" ? r("assignments", e.body.id) : o("assignments", e.body, e.method === "PUT"), ["assignments"]), D = (t.data || []).filter((t) => t.committee_id === e), k = (n.data || []).filter((e) => !D.some((t) => t.member_id === e.id)), j = window.APP_CONFIG;
	async function M(e, t) {
		try {
			let n = await E.run({
				method: e,
				body: t
			});
			if (!n) return;
			if (y(n.message || "Committee membership saved."), e === "PUT" || e === "DELETE") {
				let e = t.id;
				m((t) => {
					let n = { ...t };
					return delete n[e], n;
				});
			}
			e === "POST" && (c(""), f("Member")), e === "DELETE" && _(void 0);
		} catch {}
	}
	return /* @__PURE__ */ (0, H.jsxs)("section", {
		className: "tw:col-span-full tw:border-t tw:pt-5 tw:space-y-4",
		"aria-label": "Committee members",
		children: [
			/* @__PURE__ */ (0, H.jsxs)("div", { children: [/* @__PURE__ */ (0, H.jsxs)("div", {
				className: "tw:flex tw:items-center tw:gap-2",
				children: [
					/* @__PURE__ */ (0, H.jsx)(N, { size: 18 }),
					/* @__PURE__ */ (0, H.jsx)("h3", {
						className: "tw:font-semibold",
						children: "Committee members"
					}),
					/* @__PURE__ */ (0, H.jsxs)("span", {
						className: "tw:ml-auto tw:rounded-full tw:bg-muted tw:px-3 tw:py-1 tw:text-xs",
						children: [D.length, " / 5 members"]
					})
				]
			}), /* @__PURE__ */ (0, H.jsx)("p", {
				className: "tw:text-xs tw:text-muted-foreground",
				children: "Membership changes save immediately, separately from committee details. Maximum five members."
			})] }),
			!a(j, "assignments.view") || !a(j, "members.view") ? /* @__PURE__ */ (0, H.jsx)("p", { children: "Permission to view members and assignments is required." }) : /* @__PURE__ */ (0, H.jsxs)(v, {
				queries: [t, n],
				children: [
					D.length === 0 && /* @__PURE__ */ (0, H.jsx)("p", {
						className: "tw:text-sm tw:text-muted-foreground",
						children: "No members assigned yet."
					}),
					D.map((e) => {
						let t = n.data?.find((t) => t.id === e.member_id), r = n.data?.find((t) => t.id === e.member_id)?.full_name || "Unknown member", i = p[e.id] ?? e.role, o = i !== e.role, c = E.isPending && E.variables?.method === "PUT" && E.variables.body.id === e.id;
						return /* @__PURE__ */ (0, H.jsxs)("div", {
							className: "tw:grid tw:items-center tw:gap-3 tw:rounded-xl tw:border tw:bg-card tw:p-4 tw:sm:grid-cols-[minmax(0,1fr)_180px_auto]",
							children: [
								/* @__PURE__ */ (0, H.jsxs)("div", {
									className: "tw:flex tw:min-w-0 tw:items-center tw:gap-3",
									children: [/* @__PURE__ */ (0, H.jsx)("span", {
										className: "ui-avatar",
										"aria-hidden": "true",
										children: r.split(" ").map((e) => e[0]).slice(0, 2).join("")
									}), /* @__PURE__ */ (0, H.jsxs)("div", {
										className: "tw:min-w-0",
										children: [/* @__PURE__ */ (0, H.jsx)("strong", {
											className: "tw:block tw:break-words tw:text-sm",
											children: r
										}), /* @__PURE__ */ (0, H.jsx)("span", {
											className: "tw:text-xs tw:text-muted-foreground",
											children: t?.position || "Committee member"
										})]
									})]
								}),
								/* @__PURE__ */ (0, H.jsx)(T, {
									label: `Role for ${r}`,
									value: i,
									items: U,
									disabled: !a(j, "assignments.update") || E.isPending,
									onChange: (t) => m((n) => ({
										...n,
										[e.id]: t
									}))
								}),
								/* @__PURE__ */ (0, H.jsxs)("div", {
									className: "tw:flex tw:items-center tw:justify-end tw:gap-1",
									children: [
										a(j, "assignments.update") && o && /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsxs)(s, {
											type: "button",
											size: "sm",
											"aria-label": `Save role for ${r}`,
											disabled: E.isPending,
											onClick: () => void M("PUT", {
												id: e.id,
												role: i
											}),
											children: [c ? /* @__PURE__ */ (0, H.jsx)(O, {
												size: 14,
												className: "tw:animate-spin"
											}) : /* @__PURE__ */ (0, H.jsx)(B, { size: 14 }), c ? "Saving" : "Save"]
										}), /* @__PURE__ */ (0, H.jsx)(s, {
											type: "button",
											size: "icon-sm",
											variant: "ghost",
											"aria-label": `Undo role change for ${r}`,
											disabled: E.isPending,
											onClick: () => m((t) => ({
												...t,
												[e.id]: e.role
											})),
											children: /* @__PURE__ */ (0, H.jsx)(R, { size: 14 })
										})] }),
										!o && /* @__PURE__ */ (0, H.jsxs)("span", {
											className: "tw:flex tw:items-center tw:gap-1 tw:px-2 tw:text-xs tw:text-muted-foreground",
											role: "status",
											children: [/* @__PURE__ */ (0, H.jsx)(d, { size: 13 }), " Saved"]
										}),
										a(j, "assignments.delete") && /* @__PURE__ */ (0, H.jsxs)(s, {
											type: "button",
											size: "sm",
											variant: "ghost",
											className: "tw:text-destructive",
											"aria-label": `Remove ${r}`,
											disabled: E.isPending,
											onClick: () => {
												E.reset(), _(e);
											},
											children: [/* @__PURE__ */ (0, H.jsx)(A, { size: 14 }), " Remove"]
										})
									]
								})
							]
						}, e.id);
					}),
					a(j, "assignments.create") && /* @__PURE__ */ (0, H.jsxs)("div", {
						className: "tw:grid tw:items-end tw:gap-3 tw:rounded-xl tw:border tw:border-dashed tw:p-4 tw:sm:grid-cols-[minmax(0,1fr)_180px_auto]",
						children: [
							/* @__PURE__ */ (0, H.jsx)(w, {
								label: "Add committee member",
								value: i,
								items: k.map((e) => ({
									value: e.id,
									label: e.full_name
								})),
								onChange: c,
								disabled: E.isPending || D.length >= 5
							}),
							/* @__PURE__ */ (0, H.jsx)(w, {
								label: "New member role",
								value: l,
								items: U,
								onChange: f,
								disabled: E.isPending || D.length >= 5
							}),
							/* @__PURE__ */ (0, H.jsxs)(s, {
								type: "button",
								variant: "outline",
								disabled: !i || !l || E.isPending || D.length >= 5,
								onClick: () => void M("POST", {
									committee_id: e,
									member_id: i,
									role: l
								}),
								children: [/* @__PURE__ */ (0, H.jsx)(h, { size: 14 }), " Assign member"]
							}),
							D.length >= 5 && /* @__PURE__ */ (0, H.jsx)("p", {
								className: "tw:col-span-full tw:text-xs",
								children: "This committee has reached its five-member limit."
							})
						]
					}),
					/* @__PURE__ */ (0, H.jsx)(b, { error: E.error })
				]
			}),
			/* @__PURE__ */ (0, H.jsx)(S, {
				open: !!g,
				onClose: () => _(void 0),
				title: "Remove this committee member?",
				description: `Remove ${n.data?.find((e) => e.id === g?.member_id)?.full_name || "this member"} from this committee? Their member record and assignments to other committees will be retained.`,
				busy: E.isPending,
				error: E.error,
				onConfirm: () => {
					g && M("DELETE", { id: g.id });
				}
			})
		]
	});
}
//#endregion
//#region frontend/pages/committees.tsx
function G() {
	let e = x("committees"), t = x("jurisdictions"), n = x("assignments"), r = x("members"), [i, o] = (0, V.useState)(), s = new Set((t.data || []).map((e) => e.committee_id)), u = (e.data || []).filter((e) => s.has(e.id)).map((e) => e.name), [d, h] = (0, V.useState)("");
	return /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsx)(j, {
		resource: "committees",
		singular: "Committee",
		onView: o,
		dialogClassName: "tw:sm:max-w-4xl",
		queries: a(window.APP_CONFIG, "jurisdictions.view") ? [t] : [],
		editContent: (e) => /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [/* @__PURE__ */ (0, H.jsxs)("section", {
			className: "tw:col-span-full tw:rounded-lg tw:bg-muted tw:p-4 tw:space-y-2",
			"aria-label": "Linked jurisdiction",
			children: [/* @__PURE__ */ (0, H.jsx)("h3", {
				className: "tw:font-semibold",
				children: "Jurisdiction / ordinance coverage"
			}), a(window.APP_CONFIG, "jurisdictions.view") ? /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [
				(t.data || []).filter((t) => t.committee_id === e.id).map((e) => /* @__PURE__ */ (0, H.jsxs)("p", {
					className: "tw:text-sm",
					children: [
						e.area_name,
						" · ",
						e.category
					]
				}, e.id)),
				!s.has(e.id) && /* @__PURE__ */ (0, H.jsx)("p", {
					className: "tw:text-sm",
					children: "No jurisdiction linked to this committee yet."
				}),
				/* @__PURE__ */ (0, H.jsx)("a", {
					className: "tw:text-sm tw:underline",
					href: window.APP_CONFIG.navigation.find((e) => e.key === "jurisdiction")?.href,
					children: "Manage jurisdiction coverage"
				})
			] }) : /* @__PURE__ */ (0, H.jsx)("p", {
				className: "tw:text-sm",
				children: "Permission to view jurisdiction is required."
			})]
		}), /* @__PURE__ */ (0, H.jsx)(W, { committeeId: e.id }, e.id)] }),
		defaults: {
			name: "",
			type: "",
			purpose: "",
			mandate: "",
			qualification_requirements: "",
			status: "active"
		},
		fields: (e, t) => [
			{
				name: "name",
				label: "Committee name",
				fullWidth: !0,
				required: !0,
				items: [.../* @__PURE__ */ new Set([...u, ...t ? [t.name] : []])].map((e) => ({
					value: e,
					label: e
				})),
				disabled: !a(window.APP_CONFIG, "jurisdictions.view"),
				placeholder: "Select a committee linked to Jurisdiction"
			},
			{
				name: "type",
				label: "Committee type"
			},
			{
				name: "purpose",
				label: "Purpose",
				type: "textarea"
			},
			{
				name: "mandate",
				label: "Mandate",
				type: "textarea"
			},
			{
				name: "qualification_requirements",
				label: "Qualification requirements",
				type: "textarea"
			},
			{
				name: "status",
				label: "Status",
				required: !0,
				items: g([
					"active",
					"inactive",
					"dissolved"
				])
			}
		],
		columns: [
			{
				accessorKey: "name",
				header: "Committee",
				cell: ({ row: e }) => /* @__PURE__ */ (0, H.jsx)("strong", {
					className: "tw:font-semibold",
					children: e.original.name
				})
			},
			{
				accessorKey: "type",
				header: "Type"
			},
			{
				id: "members",
				header: "Members",
				accessorFn: (e) => a(window.APP_CONFIG, "assignments.view") && n.data ? n.data.filter((t) => t.committee_id === e.id).length : void 0,
				cell: ({ row: e }) => a(window.APP_CONFIG, "assignments.view") ? n.error ? "Unavailable" : n.data ? /* @__PURE__ */ (0, H.jsxs)("span", {
					className: "tw:font-semibold",
					children: [n.data.filter((t) => t.committee_id === e.original.id).length, " / 5"]
				}) : "Loading…" : "Restricted"
			},
			{
				accessorKey: "purpose",
				header: "Purpose",
				cell: ({ row: e }) => /* @__PURE__ */ (0, H.jsx)("span", {
					className: "tw:line-clamp-2 tw:max-w-64",
					children: e.original.purpose || "No purpose defined"
				})
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: ({ row: e }) => /* @__PURE__ */ (0, H.jsx)(E, { value: e.original.status })
			},
			{
				accessorKey: "created_at",
				header: "Created",
				cell: ({ row: e }) => P(e.original.created_at)
			}
		],
		filter: /* @__PURE__ */ (0, H.jsx)(T, {
			label: "Filter committee status",
			value: d,
			onChange: h,
			items: g([
				"active",
				"inactive",
				"dissolved"
			]),
			placeholder: "All statuses"
		}),
		filteredData: (e) => d ? e.filter((e) => e.status === d) : e,
		before: /* @__PURE__ */ (0, H.jsx)(_, { children: [
			{
				label: "All committees",
				value: e.data?.length,
				icon: M,
				hint: "Organized around shared goals",
				tone: "blue"
			},
			{
				label: "Active",
				value: e.data?.filter((e) => e.status === "active").length,
				icon: l,
				hint: "Moving the community forward",
				tone: "green"
			},
			{
				label: "Inactive",
				value: e.data?.filter((e) => e.status === "inactive").length,
				icon: I,
				hint: "Paused for the moment",
				tone: "gold"
			},
			{
				label: "Dissolved",
				value: e.data?.filter((e) => e.status === "dissolved").length,
				icon: k,
				hint: "Part of the community record",
				tone: "purple"
			}
		].map((e) => /* @__PURE__ */ (0, H.jsx)(D, {
			...e,
			value: e.value ?? "—",
			icon: /* @__PURE__ */ (0, H.jsx)(e.icon, { size: 16 })
		}, e.label)) })
	}), /* @__PURE__ */ (0, H.jsx)(c, {
		open: !!i,
		onOpenChange: (e) => {
			e || o(void 0);
		},
		children: /* @__PURE__ */ (0, H.jsxs)(y, {
			className: "ui-dialog tw:sm:max-w-3xl",
			children: [/* @__PURE__ */ (0, H.jsxs)(p, { children: [/* @__PURE__ */ (0, H.jsx)(m, {
				className: "tw:pr-6 tw:break-words",
				children: i?.name
			}), /* @__PURE__ */ (0, H.jsx)(f, { children: "Committee details, linked jurisdiction, and assigned members." })] }), i && /* @__PURE__ */ (0, H.jsxs)("div", {
				className: "tw:space-y-5",
				children: [
					/* @__PURE__ */ (0, H.jsxs)("div", {
						className: "tw:flex tw:gap-3 tw:items-center",
						children: [/* @__PURE__ */ (0, H.jsx)(E, { value: i.status }), /* @__PURE__ */ (0, H.jsx)("span", { children: i.type || "No type specified" })]
					}),
					/* @__PURE__ */ (0, H.jsx)("dl", {
						className: "tw:grid tw:gap-4 tw:sm:grid-cols-2",
						children: [
							["Purpose", i.purpose],
							["Mandate", i.mandate],
							["Qualification requirements", i.qualification_requirements]
						].map(([e, t]) => /* @__PURE__ */ (0, H.jsxs)("div", { children: [/* @__PURE__ */ (0, H.jsx)("dt", {
							className: "tw:text-xs tw:text-muted-foreground",
							children: e
						}), /* @__PURE__ */ (0, H.jsx)("dd", {
							className: "tw:mt-1 tw:ml-0 tw:whitespace-pre-wrap tw:break-words tw:text-sm",
							children: t || "Not specified"
						})] }, e))
					}),
					/* @__PURE__ */ (0, H.jsxs)("section", {
						className: "tw:border-t tw:pt-4 tw:space-y-2",
						children: [/* @__PURE__ */ (0, H.jsx)("h3", {
							className: "tw:font-semibold",
							children: "Jurisdiction coverage"
						}), a(window.APP_CONFIG, "jurisdictions.view") ? t.error ? /* @__PURE__ */ (0, H.jsx)("p", { children: "Coverage unavailable. Please try again." }) : t.data ? /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [t.data.filter((e) => e.committee_id === i.id).map((e) => /* @__PURE__ */ (0, H.jsxs)("p", {
							className: "tw:text-sm",
							children: [
								e.area_name,
								" · ",
								e.category
							]
						}, e.id)), !s.has(i.id) && /* @__PURE__ */ (0, H.jsx)("p", { children: "No jurisdiction linked yet." })] }) : /* @__PURE__ */ (0, H.jsx)("p", { children: "Loading coverage…" }) : /* @__PURE__ */ (0, H.jsx)("p", { children: "Permission required." })]
					}),
					/* @__PURE__ */ (0, H.jsxs)("section", {
						className: "tw:border-t tw:pt-4 tw:space-y-3",
						children: [/* @__PURE__ */ (0, H.jsx)("h3", {
							className: "tw:font-semibold",
							children: "Assigned members"
						}), !a(window.APP_CONFIG, "assignments.view") || !a(window.APP_CONFIG, "members.view") ? /* @__PURE__ */ (0, H.jsx)("p", { children: "Permission required." }) : n.error || r.error ? /* @__PURE__ */ (0, H.jsx)("p", { children: "Membership unavailable. Please try again." }) : !n.data || !r.data ? /* @__PURE__ */ (0, H.jsx)("p", { children: "Loading members…" }) : /* @__PURE__ */ (0, H.jsxs)(H.Fragment, { children: [n.data.filter((e) => e.committee_id === i.id).map((e) => /* @__PURE__ */ (0, H.jsxs)("div", {
							className: "tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-2 tw:rounded-lg tw:border tw:p-3",
							children: [/* @__PURE__ */ (0, H.jsx)("strong", {
								className: "tw:text-sm",
								children: r.data?.find((t) => t.id === e.member_id)?.full_name || "Unknown member"
							}), /* @__PURE__ */ (0, H.jsx)(E, { value: e.role })]
						}, e.id)), !n.data.some((e) => e.committee_id === i.id) && /* @__PURE__ */ (0, H.jsx)("p", { children: "No members assigned yet." })] })]
					})
				]
			})]
		})
	})] });
}
//#endregion
export { G as default };
