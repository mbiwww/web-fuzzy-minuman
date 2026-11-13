// Grafik fungsi keanggotaan fuzzy (SVG, tanpa library).
// Garis dibedakan lewat pola (solid, putus-putus, titik-titik) agar terbaca tanpa warna.

const W = 480
const H = 230
const M = { l: 40, r: 16, t: 28, b: 40 }
const DASHES = ['', '8 5', '2 5']

// Titik sudut trapesium [a, b, c, d] -> daftar [x, mu].
// a = b berarti bahu kiri, c = d berarti bahu kanan.
function shape([a, b, c, d]) {
  const pts = a === b ? [[a, 1]] : [[a, 0], [b, 1]]
  if (c > b) pts.push([c, 1])
  if (d !== c) pts.push([d, 0])
  return pts
}

export default function MembershipChart({
  sets,
  domain,
  ticks,
  tickFormat = (v) => v,
  marker, // { value, label }
  composed, // [{ x, y }] hasil komposisi aturan
  thin = false,
  ariaLabel,
}) {
  const [d0, d1] = domain
  const px = (v) => M.l + ((v - d0) / (d1 - d0)) * (W - M.l - M.r)
  const py = (v) => M.t + (1 - v) * (H - M.t - M.b)

  const composedPath = composed
    ? `M ${px(composed[0].x)} ${py(0)} ` +
      composed.map((p) => `L ${px(p.x)} ${py(p.y)}`).join(' ') +
      ` L ${px(composed[composed.length - 1].x)} ${py(0)} Z`
    : null

  const markerX = marker ? px(marker.value) : null
  const markerAnchor = marker && markerX > W - 120 ? 'end' : 'start'
  const markerDx = markerAnchor === 'end' ? -6 : 6

  return (
    <svg
      className={`chart ${thin ? 'chart--thin' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
    >
      {/* garis bantu mendatar */}
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line className="chart__grid" x1={M.l} x2={W - M.r} y1={py(v)} y2={py(v)} />
          <text className="chart__axis" x={M.l - 8} y={py(v) + 4} textAnchor="end">
            {v}
          </text>
        </g>
      ))}

      {/* hasil komposisi (area abu-abu) */}
      {composedPath && <path className="chart__area" d={composedPath} />}

      {/* tiap himpunan */}
      {sets.map((s, i) => {
        const pts = shape(s.points)
        const [, b, c] = s.points
        const mid = (b + c) / 2
        const ratio = (px(mid) - M.l) / (W - M.l - M.r)
        const anchor = ratio < 0.12 ? 'start' : ratio > 0.88 ? 'end' : 'middle'
        const labelX = anchor === 'start' ? px(mid) + 4 : anchor === 'end' ? px(mid) - 4 : px(mid)
        return (
          <g key={s.key}>
            <polyline
              className="chart__set"
              strokeDasharray={DASHES[i % DASHES.length]}
              points={pts.map(([x, m]) => `${px(x)},${py(m)}`).join(' ')}
            />
            <text className="chart__label" x={labelX} y={py(1) - 8} textAnchor={anchor}>
              {s.label}
            </text>
          </g>
        )
      })}

      {/* garis input / titik hasil */}
      {marker && (
        <g>
          <line className="chart__marker" x1={markerX} x2={markerX} y1={py(1)} y2={py(0)} />
          <text
            className="chart__marker-label"
            x={markerX + markerDx}
            y={py(0) - 8}
            textAnchor={markerAnchor}
          >
            {marker.label}
          </text>
        </g>
      )}

      {/* sumbu x */}
      <line className="chart__axis-line" x1={M.l} x2={W - M.r} y1={py(0)} y2={py(0)} />
      {ticks.map((t, i) => (
        <text
          key={t}
          className="chart__axis"
          x={px(t)}
          y={H - 14}
          textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}
        >
          {tickFormat(t)}
        </text>
      ))}
    </svg>
  )
}
