import { useState } from "react"
import { MapPinned, Map, Layers, Building2 } from "lucide-react"
import { ManagementPage } from "@/components/management"
import { SelectBox, StatGrid, StatCard, StatusBadge, options } from "@/components/shared"
import { useResource } from "@/lib/hooks"
import { dateLabel, overlappingAreas } from "@/lib/calculations"
export default function Jurisdiction() {
  const committees = useResource("committees"),
    jurisdictions = useResource("jurisdictions")
  const [committee, setCommittee] = useState("")
  const overlaps = overlappingAreas(jurisdictions.data || [])
  const committeeItems = (committees.data || []).map((c) => ({ value: c.id, label: c.name }))
  return (
    <ManagementPage
      resource="jurisdictions"
      singular="Jurisdiction"
      defaults={{ committee_id: "", area_name: "", category: "" }}
      queries={[committees]}
      fields={() => [
        { name: "committee_id", label: "Committee", required: true, items: committeeItems },
        {
          name: "area_name",
          label: "Area name",
          required: true,
          placeholder: "e.g. Barangay Poblacion",
        },
        {
          name: "category",
          label: "Category",
          required: true,
          items: options([
            "Education",
            "Health",
            "Environment",
            "Sports",
            "Livelihood",
            "Peace and Order",
            "Culture and Arts",
            "Infrastructure",
            "Social Services",
            "Other",
          ]),
        },
      ]}
      columns={[
        {
          accessorFn: (row) =>
            committees.data?.find((c) => c.id === row.committee_id)?.name || "Unknown committee",
          id: "committee",
          header: "Committee",
        },
        {
          accessorKey: "area_name",
          header: "Area",
          cell: ({ row }) => <strong>{row.original.area_name}</strong>,
        },
        {
          accessorKey: "category",
          header: "Category",
          cell: ({ row }) => <StatusBadge value={row.original.category} />,
        },
        {
          accessorKey: "created_at",
          header: "Created",
          cell: ({ row }) => dateLabel(row.original.created_at),
        },
      ]}
      filter={
        <SelectBox
          label="Filter by committee"
          value={committee}
          onChange={setCommittee}
          items={committeeItems}
          placeholder="All committees"
        />
      }
      filteredData={(data) =>
        committee ? data.filter((row) => row.committee_id === committee) : data
      }
      before={
        <>
          <StatGrid>
            <StatCard
              label="Jurisdictions"
              value={jurisdictions.data?.length ?? "—"}
              hint="Areas connected to committees"
              icon={<MapPinned size={16} />}
            />
            <StatCard
              label="Unique areas"
              value={
                jurisdictions.data ? new Set(jurisdictions.data.map((j) => j.area_name)).size : "—"
              }
              hint="Your community coverage"
              icon={<Map size={16} />}
              tone="green"
            />
            <StatCard
              label="Overlapping areas"
              value={jurisdictions.data ? overlaps.length : "—"}
              hint="Shared responsibilities to review"
              icon={<Layers size={16} />}
              tone="gold"
            />
            <StatCard
              label="Committees involved"
              value={
                jurisdictions.data
                  ? new Set(jurisdictions.data.map((j) => j.committee_id)).size
                  : "—"
              }
              hint="Working across your community"
              icon={<Building2 size={16} />}
              tone="purple"
            />
          </StatGrid>
          {overlaps.length > 0 && (
            <div className="ui-info ui-warning" role="status">
              <strong>Shared coverage needs a closer look.</strong>
              <p className="tw:mt-2">
                {overlaps.join(", ")} {overlaps.length === 1 ? "is" : "are"} covered by multiple
                records. Coordinate responsibilities across the relevant committees.
              </p>
            </div>
          )}
        </>
      }
    />
  )
}
