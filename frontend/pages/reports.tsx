import { useState } from "react"
import { Archive, Download, FileText, Printer, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ActionButton,
  AiPanel,
  DataTable,
  ErrorNotice,
  Field,
  QueryState,
  Section,
  StatusBadge,
  options,
  useNotice,
} from "@/components/shared"
import { useAction, useResource } from "@/lib/hooks"
import { can, request, save } from "@/lib/api"
import { dateLabel, localDate } from "@/lib/calculations"
import { downloadCsv, printDocument, type ReportDocument, type ReportType } from "@/lib/reports"
import type { ApiResult } from "@/lib/types"
export default function Reports() {
  const members = useResource("members"),
    committees = useResource("committees"),
    tasks = useResource("tasks"),
    assignments = useResource("assignments"),
    history = useResource("reports")
  const [type, setType] = useState<ReportType | "">("")
  const [committee, setCommittee] = useState("")
  const [from, setFrom] = useState(localDate(new Date(Date.now() - 30 * 86400000))),
    [to, setTo] = useState(localDate())
  const [preview, setPreview] = useState<ReportDocument | null>(null),
    [aiText, setAiText] = useState("")
  const [validation, setValidation] = useState<Error | null>(null)
  const notice = useNotice()
  const creation = useAction((body: object) => save("reports", body), ["reports"])
  const ai = useAction(
    () => request<ApiResult & { report_text: string }>("ai/report.php", "POST", {}),
    ["reports"],
  )
  const archive = useAction((id: string) =>
    request<ApiResult & { archive_reference?: string }>("reports/export_to_archives.php", "POST", {
      report_id: id,
    }),
  )
  const session = useAction(() =>
    request<ApiResult>("performance/send_to_session.php", "POST", {
      committee_id: committee || null,
    }),
  )
  const canExport = can(window.APP_CONFIG, "reports.export")
  const canArchive = canExport || can(window.APP_CONFIG, "archives.create")
  async function generate() {
    if (!type) {
      setValidation(new Error("Choose a report type."))
      return
    }
    if (from && to && from > to) {
      setValidation(new Error("The start date must not be after the end date."))
      return
    }
    setValidation(null)
    const title = {
      committee: "Committee Report",
      member: "Member Report",
      performance: "Performance Report",
      workload: "Workload Distribution Report",
      full: "Full System Report",
    }[type]
    try {
      const result = await creation.run({
        title,
        report_type: type,
        committee_id: committee || null,
        date_from: from || null,
        date_to: to || null,
      })
      if (result) {
        const snapshot = (result.data as { snapshot?: ReportDocument } | undefined)?.snapshot
        if (!snapshot || !Array.isArray(snapshot.headers) || !Array.isArray(snapshot.rows)) {
          setValidation(
            new Error(
              "The report was recorded but its saved figures are unavailable. Reload report history to retrieve it.",
            ),
          )
          return
        }
        setPreview(snapshot)
        notice("Report generated and recorded in history.")
      }
    } catch {}
  }
  function print(title: string, content: ReportDocument | string) {
    try {
      printDocument(title, content)
    } catch (error) {
      notice((error as Error).message, true)
    }
  }
  return (
    <>
      <Tabs defaultValue="builder">
        <TabsList className="tw:mb-6">
          <TabsTrigger value="builder">Report builder</TabsTrigger>
          <TabsTrigger value="history">Report history</TabsTrigger>
        </TabsList>
        <TabsContent value="builder" className="tw:space-y-6">
          <Section
            title="Turn your work into a clear report"
            description="Choose a report, review the preview, and share the progress."
          >
            <QueryState queries={[committees]}>
              <div className="ui-form-grid">
                <Field
                  label="Report type"
                  value={type}
                  onChange={(value) => setType(value as ReportType)}
                  items={[
                    { value: "committee", label: "Committee report" },
                    { value: "member", label: "Member report" },
                    { value: "performance", label: "Performance report" },
                    { value: "workload", label: "Workload report" },
                    { value: "full", label: "Full system report" },
                  ]}
                  required
                />
                <Field
                  label="Committee"
                  value={committee}
                  onChange={setCommittee}
                  items={(committees.data || []).map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="All accessible committees"
                />
                <Field
                  label="Reporting period · From"
                  type="date"
                  value={from}
                  onChange={setFrom}
                />
                <Field label="Reporting period · To" type="date" value={to} onChange={setTo} />
              </div>
              <p className="tw:mt-3 tw:text-xs tw:text-muted-foreground">
                Dates select tasks created in the period and attendance reporting months. Committee
                reports use issuance dates. Rosters reflect the generation date; saved figures
                remain unchanged.
              </p>
              <ErrorNotice error={validation || creation.error} />
              <div className="ui-actions tw:mt-5">
                {can(window.APP_CONFIG, "reports.create") && (
                  <ActionButton
                    busy={
                      creation.isPending ||
                      [members, committees, tasks, assignments].some((q) => q.isLoading)
                    }
                    onClick={() => void generate()}
                  >
                    <FileText size={15} />
                    Generate report
                  </ActionButton>
                )}
                {can(window.APP_CONFIG, "ai.use") && (
                  <ActionButton
                    variant="outline"
                    busy={ai.isPending}
                    onClick={() => {
                      void ai
                        .run()
                        .then((result) => {
                          if (result?.report_text) {
                            setAiText(result.report_text)
                            notice("AI summary generated.")
                          }
                        })
                        .catch(() => {})
                    }}
                  >
                    <Sparkles size={15} />
                    Generate AI summary
                  </ActionButton>
                )}
              </div>
            </QueryState>
          </Section>
          <ErrorNotice error={ai.error} />
          {preview && (
            <Section
              title={preview.title}
              description={`Generated ${dateLabel(localDate())} · ${preview.rows.length} records`}
              action={
                <div className="ui-actions">
                  <Button variant="outline" size="sm" onClick={() => print(preview.title, preview)}>
                    <Printer size={14} />
                    Print
                  </Button>
                  {canExport && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCsv(preview, localDate())}
                    >
                      <Download size={14} />
                      CSV
                    </Button>
                  )}
                </div>
              }
            >
              <div className="ui-table-scroll">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {preview.headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.rows.map((values, index) => (
                      <TableRow key={index}>
                        {values.map((value, column) => (
                          <TableCell key={column}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Section>
          )}
          {aiText && (
            <AiPanel
              title="AI-generated system report"
              description="Review this advisory summary before sharing it."
            >
              <div className="ui-actions tw:mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => print("AI-Generated System Report", aiText)}
                >
                  <Printer size={14} />
                  Print summary
                </Button>
              </div>
              <div className="ui-report-output">{aiText}</div>
            </AiPanel>
          )}
        </TabsContent>
        <TabsContent value="history">
          <Section
            title="Your reporting record"
            description="A history of the reports generated in your workspace."
            action={
              can(window.APP_CONFIG, "session.create") && (
                <ActionButton
                  variant="outline"
                  size="sm"
                  busy={session.isPending}
                  onClick={() => {
                    void session
                      .run()
                      .then((result) => {
                        if (result)
                          notice(result.message || "Performance sent to session management.")
                      })
                      .catch(() => {})
                  }}
                >
                  <Send size={14} />
                  Send performance to sessions
                </ActionButton>
              )
            }
          >
            <ErrorNotice error={archive.error || session.error} />
            {can(window.APP_CONFIG, "session.create") && (
              <div className="tw:mb-5 tw:max-w-sm">
                <Field
                  label="Session export committee"
                  value={committee}
                  onChange={setCommittee}
                  items={(committees.data || []).map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="All accessible committees"
                />
              </div>
            )}
            <QueryState queries={[history]}>
              <DataTable
                data={history.data || []}
                columns={[
                  {
                    accessorKey: "title",
                    header: "Report",
                    cell: ({ row }) => <strong>{row.original.title}</strong>,
                  },
                  {
                    accessorKey: "report_type",
                    header: "Type",
                    cell: ({ row }) => (
                      <StatusBadge value={row.original.report_type.replace(/_/g, " ")} />
                    ),
                  },
                  {
                    accessorFn: (report) =>
                      `${dateLabel(report.date_from)} – ${dateLabel(report.date_to)}`,
                    id: "period",
                    header: "Period",
                  },
                  {
                    accessorKey: "created_at",
                    header: "Generated",
                    cell: ({ row }) => dateLabel(row.original.created_at),
                  },
                  {
                    id: "actions",
                    header: "Actions",
                    cell: ({ row }) => (
                      <div className="ui-actions">
                        {row.original.snapshot && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPreview(row.original.snapshot!)
                              print(row.original.title, row.original.snapshot!)
                            }}
                          >
                            View / print
                          </Button>
                        )}
                        {canArchive && (
                          <ActionButton
                            variant="ghost"
                            size="sm"
                            busy={archive.isPending}
                            onClick={() => {
                              void archive
                                .run(row.original.id)
                                .then((result) => {
                                  if (result)
                                    notice(
                                      `Report archived${result.archive_reference ? ` · ${result.archive_reference}` : ""}.`,
                                    )
                                })
                                .catch(() => {})
                            }}
                          >
                            <Archive size={14} />
                            Archive
                          </ActionButton>
                        )}
                      </div>
                    ),
                  },
                ]}
                searchLabel="Search report history…"
              />
            </QueryState>
          </Section>
        </TabsContent>
      </Tabs>
      <ErrorNotice error={[members, tasks, assignments].find((query) => query.error)?.error} />
    </>
  )
}
