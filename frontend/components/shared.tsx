import { createContext, useContext, useId, useState, type ReactNode } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Search,
  Sparkles,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  X,
} from "lucide-react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ApiError } from "@/lib/api"

type Toast = { id: number; message: string; error?: boolean }
const NoticeContext = createContext<(message: string, error?: boolean) => void>(() => {})
export const useNotice = () => useContext(NoticeContext)
export function NoticeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  function notify(message: string, error = false) {
    const id = Date.now() + Math.random()
    setItems((previous) => [...previous.slice(-3), { id, message, error }])
    setTimeout(() => setItems((previous) => previous.filter((item) => item.id !== id)), 6000)
  }
  return (
    <NoticeContext.Provider value={notify}>
      {children}
      <div className="ui-toasts" aria-label="Notifications">
        {items.map((item) => (
          <div
            key={item.id}
            role={item.error ? "alert" : "status"}
            className={cn("ui-toast", item.error && "is-error")}
          >
            {item.error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{item.message}</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setItems((previous) => previous.filter((t) => t.id !== item.id))}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NoticeContext.Provider>
  )
}
export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cn("ui-section", className)}>
      <CardHeader className="ui-section-header tw:px-4 tw:sm:px-6">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="tw:mt-2">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="tw:px-4 tw:sm:px-6">{children}</CardContent>
    </Card>
  )
}
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "blue",
}: {
  label: string
  value: ReactNode
  hint: string
  icon: ReactNode
  tone?: string
}) {
  return (
    <Card className="ui-stat">
      <CardContent className="tw:px-4 tw:sm:px-6">
        <div className="ui-stat-top">
          <span>{label}</span>
          <span className={`ui-stat-icon ${tone}`}>{icon}</span>
        </div>
        <div className="ui-stat-value">{value}</div>
        <p>{hint}</p>
      </CardContent>
    </Card>
  )
}
export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="ui-stat-grid">{children}</div>
}
export function Person({ name, detail }: { name: string; detail?: string }) {
  return (
    <div className="ui-person">
      <span className="ui-avatar">
        {name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()}
      </span>
      <div>
        <strong>{name}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  )
}
export function StatusBadge({ value }: { value?: string | null }) {
  const text = value || "Not specified"
  const positive = /^(active|available|completed|excellent|good|balanced|accepted)$/i.test(text)
  const negative = /^(unavailable|dissolved|needs improvement|overloaded|critical|rejected)$/i.test(
    text,
  )
  const warning = /^(pending|busy|inactive|average|underloaded|warning)$/i.test(text)
  return (
    <Badge
      variant="outline"
      className={cn(
        "ui-status",
        positive ? "positive" : negative ? "negative" : warning ? "warning" : "neutral",
      )}
    >
      <span aria-hidden="true" />
      {text}
    </Badge>
  )
}
export function ErrorNotice({ error, retry }: { error?: Error | null; retry?: () => void }) {
  if (!error) return null
  return (
    <div className="ui-error" role="alert">
      <AlertCircle size={20} />
      <div>
        <strong>
          {error instanceof ApiError && error.status === 403
            ? "Access restricted"
            : "Something needs attention"}
        </strong>
        <p>{error.message}</p>
      </div>
      {retry && (
        <Button variant="outline" size="sm" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  )
}
export function LoadingState() {
  return (
    <div aria-label="Loading data" role="status" className="tw:space-y-4">
      {[1, 2, 3].map((n) => (
        <Skeleton key={n} className="tw:h-14 tw:w-full tw:rounded-lg" />
      ))}
    </div>
  )
}
export function QueryState({
  queries,
  children,
}: {
  queries: { isLoading: boolean; error: Error | null; refetch: () => unknown }[]
  children: ReactNode
}) {
  const failed = queries.find((q) => q.error)
  if (failed)
    return (
      <ErrorNotice
        error={failed.error}
        retry={() => {
          void failed.refetch()
        }}
      />
    )
  if (queries.some((q) => q.isLoading)) return <LoadingState />
  return <>{children}</>
}
export function EmptyState({
  title = "Nothing here yet",
  description = "Records will appear here when they are available.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="ui-empty">
      <span>
        <Inbox size={26} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}
export function ActionButton({
  children,
  busy,
  ...props
}: React.ComponentProps<typeof Button> & { busy?: boolean }) {
  return (
    <Button {...props} disabled={busy || props.disabled} aria-busy={busy}>
      {busy && <Loader2 size={16} className="tw:animate-spin" />}
      {children}
    </Button>
  )
}
export function AddButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <Plus size={16} />
      {children}
    </Button>
  )
}
export type Option = { value: string; label: string }
export const options = (values: string[]): Option[] =>
  values.map((value) => ({ value, label: value }))
export function SelectBox({
  label,
  value,
  onChange,
  items,
  placeholder = "Choose an option",
  disabled,
  id,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  items: Option[]
  placeholder?: string
  disabled?: boolean
  id?: string
}) {
  return (
    <Select
      value={value || "__none__"}
      onValueChange={(next) => onChange(next === "__none__" ? "" : next)}
      disabled={disabled}
    >
      <SelectTrigger id={id} aria-label={label} className="tw:w-full tw:data-[size=default]:h-10">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__none__">{placeholder}</SelectItem>
        {items
          .filter((item) => item.value !== "")
          .map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
export function Field({
  label,
  value,
  onChange,
  type = "text",
  items,
  required,
  disabled,
  placeholder,
  min,
  max,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  items?: Option[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  min?: number
  max?: number
}) {
  const id = useId()
  return (
    <div className="ui-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {items ? (
        <SelectBox
          id={id}
          label={label}
          value={value}
          onChange={onChange}
          items={items}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : type === "textarea" ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <Input
          id={id}
          className="tw:h-10"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          min={min}
          max={max}
        />
      )}
    </div>
  )
}
export function FormDialog({
  open,
  onClose,
  title,
  description = "Update the details below. Required fields are marked with an asterisk.",
  children,
  onSubmit,
  busy,
  error,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  onSubmit: () => void
  busy: boolean
  error?: Error | null
  className?: string
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onClose()
      }}
    >
      <DialogContent
        className={`ui-dialog tw:flex tw:flex-col tw:overflow-hidden tw:p-0 ${className || ""}`}
      >
        <DialogHeader className="tw:shrink-0 tw:px-6 tw:pt-6 tw:pr-12">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          className="tw:flex tw:min-h-0 tw:flex-col"
          onSubmit={(e) => {
            e.preventDefault()
            if (!busy) onSubmit()
          }}
        >
          <div className="tw:min-h-0 tw:overflow-y-auto tw:px-6 tw:pb-6">
            <div className="ui-form-grid">{children}</div>
            <ErrorNotice error={error} />
          </div>
          <DialogFooter className="tw:shrink-0 tw:border-t tw:bg-background tw:px-6 tw:py-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <ActionButton type="submit" busy={busy}>
              Save changes
            </ActionButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description = "This action cannot be undone. Please confirm before continuing.",
  busy,
  error,
  destructive = true,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  busy: boolean
  error?: Error | null
  destructive?: boolean
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onClose()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <ErrorNotice error={error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <ActionButton
            busy={busy}
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {destructive ? "Confirm removal" : "Confirm assignment"}
          </ActionButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export function ScoreBar({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value))
  return (
    <div className="ui-score">
      <Progress value={safe} aria-label={label || "Progress"} />
      <span>{Math.round(safe)}%</span>
    </div>
  )
}
export function AiPanel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Section
      title={title}
      description={description}
      className="ui-ai-panel"
      action={
        <span className="ui-ai-mark">
          <Sparkles size={16} />
          AI assistant
        </span>
      }
    >
      {children}
    </Section>
  )
}
export function DataTable<T>({
  data,
  columns,
  searchLabel = "Search records",
  filter,
  initialSorting = [],
}: {
  data: T[]
  columns: ColumnDef<T>[]
  searchLabel?: string
  filter?: ReactNode
  initialSorting?: SortingState
}) {
  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter: search, sorting },
    onGlobalFilterChange: setSearch,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })
  return (
    <div className="ui-data-table">
      <div className="ui-table-toolbar">
        <div className="ui-search">
          <Search size={17} aria-hidden="true" className="tw:pointer-events-none" />
          <Input
            className="tw:pl-10 tw:h-10"
            aria-label={searchLabel}
            placeholder={searchLabel}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ui-table-filter">{filter}</div>
      </div>
      <div className="ui-table-scroll">
        <Table className="tw:text-xs">
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="tw:px-4 tw:py-3">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className="ui-sort"
                        onClick={header.column.getToggleSortingHandler()}
                        aria-label={`Sort ${String(header.column.columnDef.header)}`}
                        aria-pressed={!!header.column.getIsSorted()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown size={13} />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="tw:px-4 tw:py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!table.getRowModel().rows.length && (
        <EmptyState
          title={search || filter ? "No matching records" : "No records yet"}
          description="Try another search or add a record to get started."
        />
      )}
      <div className="ui-table-footer">
        <span>
          {table.getFilteredRowModel().rows.length} records · Page{" "}
          {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
        </span>
        <div className="ui-pagination">
          <SelectBox
            label="Rows per page"
            value={String(table.getState().pagination.pageSize)}
            onChange={(value) => table.setPageSize(Number(value || 10))}
            items={options(["10", "25", "50"])}
          />
          <Button
            size="icon"
            variant="outline"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
