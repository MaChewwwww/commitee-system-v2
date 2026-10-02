import { useState, type ReactNode } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  AddButton,
  ConfirmDialog,
  DataTable,
  Field,
  FormDialog,
  QueryState,
  Section,
  useNotice,
  type Option,
} from "./shared"
import { can, remove, save } from "@/lib/api"
import { useAction, useResource } from "@/lib/hooks"
import type { Entity, Resource, Resources } from "@/lib/types"
export type FormValues = Record<string, string>
export interface FieldSpec {
  name: string
  label: string
  type?: string
  items?: Option[]
  required?: boolean
  disabled?: boolean
  placeholder?: string
  onlyEdit?: boolean
  fullWidth?: boolean
}
export function ManagementPage<K extends Exclude<Resource, "roles">>({
  resource,
  singular,
  columns,
  fields,
  defaults,
  transform,
  before,
  queries = [],
  canDelete,
  describe,
  filter,
  filteredData,
  editContent,
  dialogClassName,
  onView,
}: {
  resource: K
  singular: string
  columns: ColumnDef<Resources[K]>[]
  fields: (editing: boolean, row?: Resources[K]) => FieldSpec[]
  defaults: FormValues
  transform?: (values: FormValues, editing: boolean) => object
  before?: ReactNode
  queries?: { isLoading: boolean; error: Error | null; refetch: () => unknown }[]
  canDelete?: (row: Resources[K]) => boolean
  describe?: string
  filter?: ReactNode
  filteredData?: (data: Resources[K][]) => Resources[K][]
  editContent?: (row: Resources[K]) => ReactNode
  dialogClassName?: string
  onView?: (row: Resources[K]) => void
}) {
  const data = useResource(resource)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Resources[K] | undefined>()
  const [values, setValues] = useState<FormValues>(defaults)
  const [validation, setValidation] = useState<Error | null>(null)
  const [deleting, setDeleting] = useState<Resources[K] | undefined>()
  const notice = useNotice()
  const saveAction = useAction(
    (payload: { body: object; editing: boolean }) => save(resource, payload.body, payload.editing),
    [resource],
  )
  const deleteAction = useAction((id: string) => remove(resource, id), [resource])
  function edit(row?: Resources[K]) {
    setEditing(row)
    setValidation(null)
    saveAction.reset()
    const next = { ...defaults }
    if (row)
      fields(true, row).forEach((field) => {
        const value = row[field.name as keyof typeof row]
        next[field.name] = Array.isArray(value)
          ? value.join(", ")
          : value == null
            ? ""
            : String(value)
      })
    setValues(next)
    setOpen(true)
  }
  async function submit() {
    const missing = fields(!!editing, editing).find(
      (field) => field.required && !field.disabled && !values[field.name]?.trim(),
    )
    if (missing) {
      setValidation(new Error(`${missing.label} is required.`))
      return
    }
    setValidation(null)
    try {
      const body = transform ? transform(values, !!editing) : { ...values }
      const result = await saveAction.run({
        body: { ...body, ...(editing ? { id: (editing as Entity).id } : {}) },
        editing: !!editing,
      })
      if (result) {
        setOpen(false)
        notice(result.message || `${singular} saved.`)
      }
    } catch {
      /* Preserve values and display mutation error. */
    }
  }
  const tableColumns: ColumnDef<Resources[K]>[] = [
    ...columns,
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="ui-actions">
          {onView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`View ${singular}`}
                  onClick={() => onView(row.original)}
                >
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View {singular.toLowerCase()}</TooltipContent>
            </Tooltip>
          )}
          {can(window.APP_CONFIG, `${resource}.update`) && resource !== "assignments" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`Edit ${singular}`}
                  onClick={() => edit(row.original)}
                >
                  <Pencil size={13} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit {singular.toLowerCase()}</TooltipContent>
            </Tooltip>
          )}
          {can(window.APP_CONFIG, `${resource}.delete`) &&
            (!canDelete || canDelete(row.original)) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="tw:text-destructive"
                    aria-label={`Remove ${singular}`}
                    onClick={() => {
                      setDeleting(row.original)
                      deleteAction.reset()
                    }}
                  >
                    <Trash2 size={13} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove {singular.toLowerCase()}</TooltipContent>
              </Tooltip>
            )}
        </div>
      ),
    },
  ]
  return (
    <>
      <div className="ui-page-actions">
        <p>{describe || `Manage ${resource} and keep your workspace up to date.`}</p>
        {can(window.APP_CONFIG, `${resource}.create`) && (
          <AddButton onClick={() => edit()}>Add {singular.toLowerCase()}</AddButton>
        )}
      </div>
      {before}
      <Section
        title={`${resource === "jurisdictions" ? "Jurisdiction" : resource.charAt(0).toUpperCase() + resource.slice(1)} directory`}
        description="Find the details you need. Keep the work moving."
      >
        <QueryState queries={[data, ...queries]}>
          <DataTable
            data={filteredData ? filteredData(data.data || []) : data.data || []}
            columns={tableColumns}
            searchLabel={`Search ${resource}…`}
            filter={filter}
          />
        </QueryState>
      </Section>
      <FormDialog
        className={dialogClassName}
        open={open}
        onClose={() => setOpen(false)}
        title={`${editing ? "Edit" : "Add"} ${singular.toLowerCase()}`}
        onSubmit={() => void submit()}
        busy={saveAction.isPending}
        error={validation || saveAction.error}
      >
        {fields(!!editing, editing)
          .filter((field) => !field.onlyEdit || editing)
          .map((field) => (
            <div key={field.name} className={field.fullWidth ? "tw:col-span-full" : undefined}>
              <Field
                {...field}
                value={values[field.name] || ""}
                onChange={(value) => {
                  setValues((previous) => ({ ...previous, [field.name]: value }))
                  setValidation(null)
                }}
              />
            </div>
          ))}
        {editing && editContent?.(editing)}
      </FormDialog>
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        title={`Remove this ${singular.toLowerCase()}?`}
        busy={deleteAction.isPending}
        error={deleteAction.error}
        onConfirm={() => {
          if (deleting)
            void deleteAction
              .run((deleting as Entity).id)
              .then((result) => {
                if (result) {
                  setDeleting(undefined)
                  notice(result.message || `${singular} removed.`)
                }
              })
              .catch(() => {})
        }}
      />
    </>
  )
}
