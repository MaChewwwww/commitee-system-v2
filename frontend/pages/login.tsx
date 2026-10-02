import { useState } from "react"
import {
  ArrowRight,
  Mail,
  ShieldCheck,
  Users,
  Sparkles,
  LockKeyhole,
  ArrowLeft,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ActionButton, ErrorNotice, Field, useNotice } from "@/components/shared"
import { request } from "@/lib/api"
import { useAction } from "@/lib/hooks"
import type { ApiResult } from "@/lib/types"
export default function Login() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [validation, setValidation] = useState<Error | null>(null)
  const notify = useNotice()
  const send = useAction(() => request<ApiResult>("send_otp.php", "POST", { email: email.trim() }))
  const verify = useAction(() =>
    request<ApiResult>("verify_otp.php", "POST", { email: email.trim(), otp }),
  )
  const busy = send.isPending || verify.isPending
  async function submit() {
    setValidation(null)
    if (step === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidation(new Error("Enter a valid email address."))
      return
    }
    if (step === "otp" && !/^\d{6}$/.test(otp)) {
      setValidation(new Error("Enter the six-digit code from your email."))
      return
    }
    try {
      if (step === "email") {
        const result = await send.run()
        if (result) {
          setStep("otp")
          notify("Your code has been sent. Check your email.")
        }
      } else {
        const result = await verify.run()
        if (result)
          window.location.assign(
            window.APP_CONFIG.navigation.find((item) => item.key === "dashboard")!.href,
          )
      }
    } catch {
      /* The mutation retains its error for inline feedback. */
    }
  }
  function back() {
    setStep("email")
    setOtp("")
    setValidation(null)
    send.reset()
    verify.reset()
  }
  return (
    <main id="main-content" className="ui-login">
      <section className="ui-login-brand">
        <div className="ui-brand">
          <span className="ui-brand-emblem">SK</span>
          <span>
            <strong>
              Committee<span className="ui-brand-dot">.</span>
            </strong>
            <small>SANGGUNIANG KABATAAN</small>
          </span>
        </div>
        <div className="ui-login-brand-content">
          <p className="ui-eyebrow">YOUTH LEADERSHIP, CONNECTED</p>
          <h1>
            Better together.
            <br />
            <span>Stronger communities.</span>
          </h1>
          <p>
            A purposeful workspace for the people shaping the next generation of local governance.
          </p>
          <div className="ui-login-values">
            <span>
              <Users size={16} />
              Connected teams
            </span>
            <span>
              <Sparkles size={16} />
              Intelligent insights
            </span>
          </div>
        </div>
        <p className="ui-login-brand-footer">
          SK Committee Management System · San Jose del Monte, Bulacan
        </p>
      </section>
      <section className="ui-login-main">
        <div className="ui-login-card">
          <div className="ui-city-brand">
            <img
              src={`${window.APP_CONFIG.assets}/logo.jpg`}
              alt="Official seal of San Jose del Monte"
            />
            <span>
              <strong>City of San Jose del Monte</strong>Official SK Committee Workspace
            </span>
          </div>
          <div
            className="ui-login-step"
            aria-label={step === "email" ? "Step 1 of 2: Email" : "Step 2 of 2: Verify code"}
          >
            <span className="active" />
            <span className={step === "otp" ? "active" : ""} />
          </div>
          <h2>{step === "email" ? "Welcome back." : "Check your inbox."}</h2>
          <p className="ui-login-description">
            {step === "email" ? (
              "Sign in to your workspace with a secure one-time code sent to your registered email."
            ) : (
              <>
                We sent a six-digit code to <strong>{email}</strong>. Enter it below to continue.
              </>
            )}
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!busy) void submit()
            }}
          >
            {step === "email" ? (
              <Field
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                required
                disabled={busy}
              />
            ) : (
              <div className="ui-field">
                <label htmlFor="otp-code">Verification code</label>
                <Input
                  id="otp-code"
                  className="ui-otp tw:h-12 tw:text-2xl tw:md:text-2xl"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  required
                  disabled={busy}
                />
              </div>
            )}
            <ErrorNotice error={validation || send.error || verify.error} />
            <ActionButton type="submit" busy={busy} className="tw:h-12">
              {step === "email" ? (
                <>
                  <Mail size={16} />
                  Send verification code
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Verify and sign in
                  <ArrowRight size={16} />
                </>
              )}
            </ActionButton>
            {step === "otp" && (
              <Button type="button" variant="ghost" onClick={back} disabled={busy}>
                <ArrowLeft size={15} />
                Change email or resend code
              </Button>
            )}
          </form>
          <p className="ui-login-security">
            <LockKeyhole size={12} />
            Secure email verification · No password required
          </p>
        </div>
      </section>
    </main>
  )
}
