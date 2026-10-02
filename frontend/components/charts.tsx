export function DistributionChart({
  segments,
  label,
}: {
  segments: { label: string; value: number; color: string }[]
  label: string
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  let offset = 0
  return (
    <div className="ui-distribution">
      <div className="ui-donut">
        <svg
          viewBox="0 0 120 120"
          role="img"
          aria-label={`${label}: ${segments.map((s) => `${s.label} ${s.value}`).join(", ")}`}
        >
          <circle cx="60" cy="60" r="48" fill="none" stroke="#edf1f7" strokeWidth="10" />
          {segments.map((segment) => {
            const size = total ? (segment.value / total) * 100 : 0
            const position = offset
            offset += size
            return (
              <circle
                key={segment.label}
                cx="60"
                cy="60"
                r="48"
                pathLength="100"
                fill="none"
                stroke={segment.color}
                strokeWidth="10"
                strokeDasharray={`${size} ${100 - size}`}
                strokeDashoffset={-position}
              />
            )
          })}
        </svg>
        <div className="ui-donut-center">
          <strong>{total}</strong>
          <small>{label}</small>
        </div>
      </div>
      <div className="ui-chart-legend">
        {segments.map((segment) => (
          <div className="ui-legend-row" key={segment.label}>
            <span style={{ backgroundColor: segment.color }} />
            <span>{segment.label}</span>
            <strong>{segment.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
