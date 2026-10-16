// current: 1 = Input data, 2 = Hasil rekomendasi
export default function Stepper({ current }) {
  const steps = [
    { n: 1, label: 'Input data' },
    { n: 2, label: 'Hasil rekomendasi' },
  ]

  return (
    <ol className="stepper" aria-label="Langkah">
      {steps.map((s, i) => (
        <li
          key={s.n}
          className={`stepper__item ${current === s.n ? 'stepper__item--active' : ''}`}
          aria-current={current === s.n ? 'step' : undefined}
        >
          <span className="stepper__num">{s.n}</span>
          <span className="stepper__label">{s.label}</span>
          {i < steps.length - 1 && <span className="stepper__line" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}
