// category: 'dibeli' | 'pertimbangkan' | 'tidak'
const LABELS = {
  dibeli: 'Dibeli',
  pertimbangkan: 'Dipertimbangkan',
  tidak: 'Tidak Dibeli',
}

export default function CategoryBadge({ category, size }) {
  return (
    <span className={`badge badge--${category} ${size ? `badge--${size}` : ''}`}>
      {LABELS[category]}
    </span>
  )
}
