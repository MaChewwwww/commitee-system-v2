import { r as e } from "./rolldown-runtime-B0aSnxlc.js";
import { t } from "./react-B4u1yd7E.js";
import { a as n, h as r, l as i, s as a } from "./api-DVPVP-g0.js";
import { C as o, I as s, R as c, l, r as u, t as d, u as f } from "./hooks-BlRndFBy.js";
import { n as p, r as m } from "./app-BANjibti.js";
//#region node_modules/lucide-react/dist/esm/icons/arrow-left.mjs
var h = {
	name: "arrow-left",
	size: 24,
	node: [["path", {
		d: "m12 19-7-7 7-7",
		key: "1l729n"
	}], ["path", {
		d: "M19 12H5",
		key: "x3x0zl"
	}]]
};
h.node;
var g = i(h), _ = {
	name: "arrow-right",
	size: 24,
	node: [["path", {
		d: "M5 12h14",
		key: "1ays0h"
	}], ["path", {
		d: "m12 5 7 7-7 7",
		key: "xquz4c"
	}]]
};
_.node;
var v = i(_), y = {
	name: "lock-keyhole",
	size: 24,
	node: [
		["circle", {
			cx: "12",
			cy: "16",
			r: "1",
			key: "1au0dj"
		}],
		["rect", {
			x: "3",
			y: "10",
			width: "18",
			height: "12",
			rx: "2",
			key: "6s8ecr"
		}],
		["path", {
			d: "M7 10V7a5 5 0 0 1 10 0v3",
			key: "1pqi11"
		}]
	]
};
y.node;
var b = i(y), x = {
	name: "mail",
	size: 24,
	node: [["path", {
		d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
		key: "132q7q"
	}], ["rect", {
		x: "2",
		y: "4",
		width: "20",
		height: "16",
		rx: "2",
		key: "izxlao"
	}]]
};
x.node;
var S = i(x), C = /* @__PURE__ */ e(t(), 1), w = r();
function T() {
	let [e, t] = (0, C.useState)(""), [r, i] = (0, C.useState)(""), [h, _] = (0, C.useState)("email"), [y, x] = (0, C.useState)(null), T = o(), E = d(() => n("send_otp.php", "POST", { email: e.trim() })), D = d(() => n("verify_otp.php", "POST", {
		email: e.trim(),
		otp: r
	})), O = E.isPending || D.isPending;
	async function k() {
		if (x(null), h === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())) {
			x(/* @__PURE__ */ Error("Enter a valid email address."));
			return;
		}
		if (h === "otp" && !/^\d{6}$/.test(r)) {
			x(/* @__PURE__ */ Error("Enter the six-digit code from your email."));
			return;
		}
		try {
			h === "email" ? await E.run() && (_("otp"), T("Your code has been sent. Check your email.")) : await D.run() && window.location.assign(window.APP_CONFIG.navigation.find((e) => e.key === "dashboard").href);
		} catch {}
	}
	function A() {
		_("email"), i(""), x(null), E.reset(), D.reset();
	}
	return /* @__PURE__ */ (0, w.jsxs)("main", {
		id: "main-content",
		className: "ui-login",
		children: [/* @__PURE__ */ (0, w.jsxs)("section", {
			className: "ui-login-brand",
			children: [
				/* @__PURE__ */ (0, w.jsxs)("div", {
					className: "ui-brand",
					children: [/* @__PURE__ */ (0, w.jsx)("span", {
						className: "ui-brand-emblem",
						children: "SP"
					}), /* @__PURE__ */ (0, w.jsxs)("span", { children: [/* @__PURE__ */ (0, w.jsxs)("strong", { children: ["Committee", /* @__PURE__ */ (0, w.jsx)("span", {
						className: "ui-brand-dot",
						children: "."
					})] }), /* @__PURE__ */ (0, w.jsx)("small", { children: "SANGGUNIANG KABATAAN" })] })]
				}),
				/* @__PURE__ */ (0, w.jsxs)("div", {
					className: "ui-login-brand-content",
					children: [
						/* @__PURE__ */ (0, w.jsx)("p", {
							className: "ui-eyebrow",
							children: "YOUTH LEADERSHIP, CONNECTED"
						}),
						/* @__PURE__ */ (0, w.jsxs)("h1", { children: [
							"Better together.",
							/* @__PURE__ */ (0, w.jsx)("br", {}),
							/* @__PURE__ */ (0, w.jsx)("span", { children: "Stronger communities." })
						] }),
						/* @__PURE__ */ (0, w.jsx)("p", { children: "A purposeful workspace for the people shaping the next generation of local governance." }),
						/* @__PURE__ */ (0, w.jsxs)("div", {
							className: "ui-login-values",
							children: [/* @__PURE__ */ (0, w.jsxs)("span", { children: [/* @__PURE__ */ (0, w.jsx)(p, { size: 16 }), "Connected teams"] }), /* @__PURE__ */ (0, w.jsxs)("span", { children: [/* @__PURE__ */ (0, w.jsx)(c, { size: 16 }), "Intelligent insights"] })]
						})
					]
				}),
				/* @__PURE__ */ (0, w.jsx)("p", {
					className: "ui-login-brand-footer",
					children: "SP Committee Management System · San Jose del Monte, Bulacan"
				})
			]
		}), /* @__PURE__ */ (0, w.jsx)("section", {
			className: "ui-login-main",
			children: /* @__PURE__ */ (0, w.jsxs)("div", {
				className: "ui-login-card",
				children: [
					/* @__PURE__ */ (0, w.jsxs)("div", {
						className: "ui-city-brand",
						children: [/* @__PURE__ */ (0, w.jsx)("img", {
							src: `${window.APP_CONFIG.assets}/logo.jpg`,
							alt: "Official seal of San Jose del Monte"
						}), /* @__PURE__ */ (0, w.jsxs)("span", { children: [/* @__PURE__ */ (0, w.jsx)("strong", { children: "City of San Jose del Monte" }), "Official SP Committee Workspace"] })]
					}),
					/* @__PURE__ */ (0, w.jsxs)("div", {
						className: "ui-login-step",
						"aria-label": h === "email" ? "Step 1 of 2: Email" : "Step 2 of 2: Verify code",
						children: [/* @__PURE__ */ (0, w.jsx)("span", { className: "active" }), /* @__PURE__ */ (0, w.jsx)("span", { className: h === "otp" ? "active" : "" })]
					}),
					/* @__PURE__ */ (0, w.jsx)("h2", { children: h === "email" ? "Welcome back." : "Check your inbox." }),
					/* @__PURE__ */ (0, w.jsx)("p", {
						className: "ui-login-description",
						children: h === "email" ? "Sign in to your workspace with a secure one-time code sent to your registered email." : /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [
							"We sent a six-digit code to ",
							/* @__PURE__ */ (0, w.jsx)("strong", { children: e }),
							". Enter it below to continue."
						] })
					}),
					/* @__PURE__ */ (0, w.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault(), O || k();
						},
						children: [
							h === "email" ? /* @__PURE__ */ (0, w.jsx)(f, {
								label: "Email address",
								type: "email",
								value: e,
								onChange: t,
								placeholder: "you@example.com",
								required: !0,
								disabled: O
							}) : /* @__PURE__ */ (0, w.jsxs)("div", {
								className: "ui-field",
								children: [/* @__PURE__ */ (0, w.jsx)("label", {
									htmlFor: "otp-code",
									children: "Verification code"
								}), /* @__PURE__ */ (0, w.jsx)(s, {
									id: "otp-code",
									className: "ui-otp tw:h-12 tw:text-2xl tw:md:text-2xl",
									value: r,
									onChange: (e) => i(e.target.value.replace(/\D/g, "").slice(0, 6)),
									autoComplete: "one-time-code",
									inputMode: "numeric",
									maxLength: 6,
									autoFocus: !0,
									required: !0,
									disabled: O
								})]
							}),
							/* @__PURE__ */ (0, w.jsx)(l, { error: y || E.error || D.error }),
							/* @__PURE__ */ (0, w.jsx)(u, {
								type: "submit",
								busy: O,
								className: "tw:h-12",
								children: h === "email" ? /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [
									/* @__PURE__ */ (0, w.jsx)(S, { size: 16 }),
									"Send verification code",
									/* @__PURE__ */ (0, w.jsx)(v, { size: 16 })
								] }) : /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [
									/* @__PURE__ */ (0, w.jsx)(m, { size: 16 }),
									"Verify and sign in",
									/* @__PURE__ */ (0, w.jsx)(v, { size: 16 })
								] })
							}),
							h === "otp" && /* @__PURE__ */ (0, w.jsxs)(a, {
								type: "button",
								variant: "ghost",
								onClick: A,
								disabled: O,
								children: [/* @__PURE__ */ (0, w.jsx)(g, { size: 15 }), "Change email or resend code"]
							})
						]
					}),
					/* @__PURE__ */ (0, w.jsxs)("p", {
						className: "ui-login-security",
						children: [/* @__PURE__ */ (0, w.jsx)(b, { size: 12 }), "Secure email verification · No password required"]
					})
				]
			})
		})]
	});
}
//#endregion
export { T as default };
