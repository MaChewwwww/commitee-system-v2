import { useState } from "react"
import { ManagementPage } from "@/components/management"
import { SelectBox, StatusBadge, options } from "@/components/shared"
import { useResource } from "@/lib/hooks"
import { dateLabel } from "@/lib/calculations"
import { can } from "@/lib/api"

const levels = ["Decision-making", "Recommendatory", "Monitoring"]

export default function Jurisdiction() {
  const committees = useResource("committees")
  const jurisdictions = useResource("jurisdictions")
  const [committee, setCommittee] = useState("")
  const [level, setLevel] = useState("")
  const committeeItems = (committees.data || []).map((c) => ({ value: c.id, label: c.name }))
  const levelItems = options([
    ...new Set([
      ...levels,
      ...(jurisdictions.data || []).flatMap((j) => (j.level ? [j.level] : [])),
    ]),
  ])
  return (
    <>
      <ManagementPage
        resource="jurisdictions"
        singular="Jurisdiction"
        sectionTitle="Jurisdiction matrix"
        describe="Set each committee’s level, legal basis, area, and term end date. Decision-making applies only within its authorized mandate."
        defaults={{
          committee_id: "",
          area_name: "",
          level: "Decision-making",
          legal_basis: "",
          effectivity_date: "",
          effective_until: "",
        }}
        queries={[committees]}
        fields={(_, row) => [
          {
            name: "committee_id",
            label: "Committee",
            required: true,
            items: committeeItems,
            disabled: !can(window.APP_CONFIG, "committees.view"),
          },
          {
            name: "level",
            label: "Level",
            required: true,
            items: options(
              row?.level && !levels.includes(row.level) ? [...levels, row.level] : levels,
            ),
          },
          {
            name: "legal_basis",
            label: "Legal basis",
            required: true,
            placeholder: "e.g. Ordinance number or resolution",
            fullWidth: true,
          },
          { name: "area_name", label: "Area", required: true, placeholder: "Barangay or area" },
          { name: "effectivity_date", label: "Effective from", type: "date" },
          { name: "effective_until", label: "Effective until", type: "date" },
        ]}
        columns={[
          {
            accessorFn: (row) =>
              committees.data?.find((c) => c.id === row.committee_id)?.name ||
              "Committee unavailable",
            id: "committee",
            header: "Committee",
          },
          {
            accessorKey: "level",
            header: "Level",
            cell: ({ row }) => <StatusBadge value={row.original.level} />,
          },
          {
            accessorKey: "legal_basis",
            header: "Legal basis",
            cell: ({ row }) => row.original.legal_basis || "Not specified",
          },
          { accessorKey: "area_name", header: "Area" },
          {
            accessorKey: "effective_until",
            header: "Effectivity",
            cell: ({ row }) =>
              committees.data?.find((c) => c.id === row.original.committee_id)?.effective_until ||
              row.original.effective_until
                ? dateLabel(
                    committees.data?.find((c) => c.id === row.original.committee_id)
                      ?.effective_until || row.original.effective_until,
                  )
                : "No end date recorded",
          },
        ]}
        filter={
          <div className="tw:flex tw:flex-wrap tw:gap-2">
            <div className="tw:min-w-44">
              <SelectBox
                label="Filter by committee"
                value={committee}
                onChange={setCommittee}
                items={committeeItems}
                placeholder="All committees"
              />
            </div>
            <div className="tw:min-w-40">
              <SelectBox
                label="Filter by level"
                value={level}
                onChange={setLevel}
                items={levelItems}
                placeholder="All levels"
              />
            </div>
          </div>
        }
        filteredData={(data) =>
          data.filter(
            (row) =>
              (!committee || row.committee_id === committee) && (!level || row.level === level),
          )
        }
      />
      <ManagementPage
        resource="penalties"
        singular="Penalty"
        sectionTitle="Penalty matrix"
        describe="Record the applicable penalty for each offense."
        defaults={{
          violation: "",
          legal_basis: "",
          first_offense: "",
          second_offense: "",
          third_offense: "",
        }}
        fields={(_, row) => [
          { name: "violation", label: "Violation", required: true, fullWidth: true },
          {
            name: "legal_basis",
            label: "Legal basis",
            required: true,
            fullWidth: true,
            placeholder: "Ordinance and section authorizing this penalty",
          },
          {
            name: "first_offense",
            label: "1st offense",
            required: true,
            placeholder: "Warning, amount, or other penalty",
          },
          { name: "second_offense", label: "2nd offense", required: true },
          { name: "third_offense", label: "3rd offense", required: true },
        ]}
        columns={[
          { accessorKey: "violation", header: "Violation" },
          { accessorKey: "legal_basis", header: "Legal basis" },
          { accessorKey: "first_offense", header: "1st offense" },
          { accessorKey: "second_offense", header: "2nd offense" },
          { accessorKey: "third_offense", header: "3rd offense" },
        ]}
      />
    </>
  )
}
