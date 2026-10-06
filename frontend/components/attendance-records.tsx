import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FormDialog, useNotice } from "./shared"
import { can, save } from "@/lib/api"
import { useAction, useResource } from "@/lib/hooks"
import { localDate } from "@/lib/calculations"

export function AttendanceRecords() {
  const members = useResource("members"),
    committees = useResource("committees"),
    assignments = useResource("assignments")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    member_id: "",
    committee_id: "",
    attendance_rate: "",
    period: localDate().slice(0, 7),
  })
  const [validation, setValidation] = useState<Error | null>(null)
  const notice = useNotice()
  const action = useAction(
    () =>
      save("performance", {
        ...form,
        committee_id: form.committee_id || null,
        attendance_rate: Number(form.attendance_rate),
      }),
    ["performance"],
  )
  if (!can(window.APP_CONFIG, "performance.create")) return null
  async function submit() {
    const rate = Number(form.attendance_rate)
    if (
      !form.member_id ||
      !form.period ||
      !form.attendance_rate.trim() ||
      !Number.isFinite(rate) ||
      rate < 0 ||
      rate > 100
    ) {
      setValidation(
        new Error("Select a member, reporting month, and attendance percentage from 0 to 100."),
      )
      return
    }
    try {
      const result = await action.run()
      if (result) {
        setOpen(false)
        notice("Attendance recorded for the reporting month.")
      }
    } catch {}
  }
  return (
    <div className="tw:mb-5">
      <Button
        variant="outline"
        onClick={() => {
          action.reset()
          setValidation(null)
          setOpen(true)
        }}
      >
        Record attendance
      </Button>
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Record attendance"
        description="Enter attendance from the official attendance record. This saves a monthly summary, not a meeting certification."
        busy={action.isPending}
        error={validation || action.error}
        onSubmit={() => void submit()}
      >
        <Field
          label="Attendance committee"
          value={form.committee_id}
          onChange={(value) => setForm({ ...form, committee_id: value, member_id: "" })}
          items={(committees.data || []).map((c) => ({ value: c.id, label: c.name }))}
          placeholder="Council-wide attendance"
        />
        <Field
          label="Attendance member"
          required
          value={form.member_id}
          onChange={(value) => setForm({ ...form, member_id: value })}
          items={(members.data || [])
            .filter(
              (m) =>
                !form.committee_id ||
                assignments.data?.some(
                  (a) => a.committee_id === form.committee_id && a.member_id === m.id,
                ),
            )
            .map((m) => ({ value: m.id, label: m.full_name }))}
        />
        <Field
          label="Reporting month"
          type="month"
          required
          value={form.period}
          onChange={(value) => setForm({ ...form, period: value })}
        />
        <Field
          label="Attendance rate (%)"
          type="number"
          min={0}
          max={100}
          required
          value={form.attendance_rate}
          onChange={(value) => setForm({ ...form, attendance_rate: value })}
        />
      </FormDialog>
    </div>
  )
}
