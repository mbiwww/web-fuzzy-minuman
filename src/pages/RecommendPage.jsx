import { useMemo, useState } from 'react'
import CategoryBadge from '../components/public/CategoryBadge'
import MembershipChart from '../components/public/MembershipChart'
import Stepper from '../components/public/Stepper'
import {
  GIZI_RANGE,
  GIZI_SETS,
  HARGA_RANGE,
  HARGA_SETS,
  OUTPUT_SETS,
  evaluate,
  formatDegree,
  formatRupiah,
  rankOfDegree,
  rankSamples,
} from '../lib/fuzzy'

const toNumber = (v) => (v.trim() === '' ? NaN : Number(v))
const inRange = (n, [min, max]) => !Number.isNaN(n) && n >= min && n <= max
const pct = (n, [min, max]) => `${Math.min(100, Math.max(0, ((n - min) / (max - min)) * 100))}%`

const describeSets = (sets) =>
  sets.map((s) => `${s.label} ${s.points[0]} sampai ${s.points[3]}`).join(' · ')

/* ---------- Langkah 1: input ---------- */
function InputStep({ samples, form, setForm, onSubmit }) {
  const [error, setError] = useState('')
  const { harga, gizi, pick } = form

  const hargaNum = toNumber(harga)
  const giziNum = toNumber(gizi)

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))

  const handlePick = (value) => {
    const s = samples.find((x) => String(x.no) === value)
    update(s ? { pick: value, harga: String(s.harga), gizi: String(s.gt) } : { pick: value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inRange(hargaNum, HARGA_RANGE)) {
      setError(`Harga harus berupa angka antara 0 dan ${formatRupiah(HARGA_RANGE[1])}.`)
      return
    }
    if (!inRange(giziNum, GIZI_RANGE)) {
      setError(`Nilai gizi total harus berupa angka antara 0 dan ${GIZI_RANGE[1]}.`)
      return
    }
    setError('')
    onSubmit(hargaNum, giziNum)
  }

  return (
    <>
      <header className="page__head">
        <Stepper current={1} />
        <h1 className="page-title">Cek rekomendasi minuman kaleng</h1>
        <p className="page-subtitle">Tanpa login. Isi harga dan nilai gizi total, lalu tekan hitung.</p>
      </header>

      <div className="recommend-grid">
        <form className="card" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="pilih-sampel">
              Isi cepat dari sampel (opsional)
            </label>
            <select
              id="pilih-sampel"
              className="input input--large"
              value={pick}
              onChange={(e) => handlePick(e.target.value)}
            >
              <option value="">Pilih sampel 1 sampai {samples.length}</option>
              {samples.map((s) => (
                <option key={s.no} value={s.no}>
                  Sampel {s.no} · Rp {formatRupiah(s.harga)} · Gizi {s.gt}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="harga">
              Harga (Rp)
            </label>
            <input
              id="harga"
              className="input input--large"
              type="number"
              min={HARGA_RANGE[0]}
              max={HARGA_RANGE[1]}
              step="any"
              placeholder="Contoh: 4505"
              value={harga}
              onChange={(e) => update({ harga: e.target.value, pick: '' })}
            />
            <input
              className="slider"
              type="range"
              min={HARGA_RANGE[0]}
              max={HARGA_RANGE[1]}
              step="5"
              aria-label="Geser harga"
              value={Number.isNaN(hargaNum) ? 0 : Math.min(hargaNum, HARGA_RANGE[1])}
              style={{ '--fill': pct(Number.isNaN(hargaNum) ? 0 : hargaNum, HARGA_RANGE) }}
              onChange={(e) => update({ harga: e.target.value, pick: '' })}
            />
            <div className="slider-labels">
              <span>0 · Murah</span>
              <span>Normal</span>
              <span>Mahal · {formatRupiah(HARGA_RANGE[1])}</span>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="gizi">
              Nilai gizi total
            </label>
            <input
              id="gizi"
              className="input input--large"
              type="number"
              min={GIZI_RANGE[0]}
              max={GIZI_RANGE[1]}
              step="any"
              placeholder="Contoh: 335"
              value={gizi}
              onChange={(e) => update({ gizi: e.target.value, pick: '' })}
            />
            <input
              className="slider"
              type="range"
              min={GIZI_RANGE[0]}
              max={GIZI_RANGE[1]}
              step="1"
              aria-label="Geser nilai gizi total"
              value={Number.isNaN(giziNum) ? 0 : Math.min(giziNum, GIZI_RANGE[1])}
              style={{ '--fill': pct(Number.isNaN(giziNum) ? 0 : giziNum, GIZI_RANGE) }}
              onChange={(e) => update({ gizi: e.target.value, pick: '' })}
            />
            <div className="slider-labels">
              <span>0 · Rendah</span>
              <span>Sedang</span>
              <span>Tinggi · {GIZI_RANGE[1]}</span>
            </div>
          </div>

          {error && (
            <div className="form-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-actions form-actions--left">
            <button type="submit" className="btn btn--primary">
              Hitung Rekomendasi
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setForm({ harga: '', gizi: '', pick: '' })
                setError('')
              }}
            >
              Reset
            </button>
          </div>
        </form>

        <div className="stack">
          <section className="card">
            <h2 className="card__title">Himpunan fuzzy harga</h2>
            <MembershipChart
              sets={HARGA_SETS}
              domain={HARGA_RANGE}
              ticks={[0, 2500, 5000, 7500, 10000]}
              tickFormat={formatRupiah}
              marker={
                inRange(hargaNum, HARGA_RANGE)
                  ? { value: hargaNum, label: `Rp ${formatRupiah(hargaNum)}` }
                  : null
              }
              ariaLabel="Grafik keanggotaan harga: murah, normal, mahal"
            />
            <p className="card__note">{describeSets(HARGA_SETS)}</p>
          </section>

          <section className="card">
            <h2 className="card__title">Himpunan fuzzy nilai gizi</h2>
            <MembershipChart
              sets={GIZI_SETS}
              domain={GIZI_RANGE}
              ticks={[0, 100, 200, 300, 350]}
              marker={inRange(giziNum, GIZI_RANGE) ? { value: giziNum, label: `${giziNum}` } : null}
              ariaLabel="Grafik keanggotaan nilai gizi: rendah, sedang, tinggi"
            />
            <p className="card__note">{describeSets(GIZI_SETS)}</p>
          </section>
        </div>
      </div>
    </>
  )
}

/* ---------- Langkah 2: hasil ---------- */
function ProcessItem({ title, right, open, onToggle, children }) {
  return (
    <div className="process__item">
      <button type="button" className="process__head" aria-expanded={open} onClick={onToggle}>
        <span className="process__title">{title}</span>
        <span className="process__status">{right ?? (open ? 'terbuka' : 'tertutup')}</span>
      </button>
      {open && <div className="process__body">{children}</div>}
    </div>
  )
}

function ResultStep({ result, samples, onRetry }) {
  const [open, setOpen] = useState({ 1: false, 2: true, 3: false, 4: false })
  const toggle = (n) => setOpen((prev) => ({ ...prev, [n]: !prev[n] }))

  const ranked = useMemo(() => rankSamples(samples), [samples])
  const rank = rankOfDegree(result.degree, ranked)
  const fmt = formatDegree

  const nonZero = (sets, mu) =>
    sets
      .filter((s) => mu[s.key] > 0)
      .map((s) => `μ ${s.label} ${fmt(mu[s.key])}`)
      .join(', ') || '—'

  const fuzzSummary = `Harga: ${nonZero(HARGA_SETS, result.muHarga)} · Gizi: ${nonZero(GIZI_SETS, result.muGizi)}`

  return (
    <>
      <header className="page__head">
        <Stepper current={2} />
        <h1 className="page-title">Hasil rekomendasi</h1>
      </header>

      <section className="card card--result">
        <div>
          <p className="result__eyebrow">Rekomendasi untuk minuman Anda</p>
          <CategoryBadge category={result.category.key} size="xl" />
          <p className="result__degree">
            Derajat keanggotaan <strong>{fmt(result.degree)}</strong>
          </p>
          <p className="result__meta">
            Harga Rp {formatRupiah(result.harga)} · Nilai gizi total {result.gizi}
            <br />
            Peringkat {rank} dari {samples.length} sampel
          </p>
        </div>

        <div className="scale">
          <p className="scale__title">Posisi pada skala 0 sampai 1</p>
          <div className="scale__bar" role="img" aria-label={`Derajat ${fmt(result.degree)} dari 1`}>
            <span className="scale__seg scale__seg--tidak" />
            <span className="scale__seg scale__seg--pertimbangkan" />
            <span className="scale__seg scale__seg--dibeli" />
            <span className="scale__marker" style={{ left: `${result.degree * 100}%` }} />
          </div>
          <div className="scale__labels">
            <span>Tidak Dibeli 0 sampai 0.4</span>
            <span>Dipertimbangkan</span>
            <span>Dibeli 0.6 sampai 1</span>
          </div>
        </div>
      </section>

      <div className="result-grid">
        <section className="card">
          <h2 className="card__title">Proses perhitungan</h2>

          <ProcessItem title="1. Fuzzifikasi" right={fuzzSummary} open={open[1]} onToggle={() => toggle(1)}>
            <table className="table table--grid">
              <thead>
                <tr>
                  <th>Variabel</th>
                  <th>Himpunan</th>
                  <th>μ</th>
                </tr>
              </thead>
              <tbody>
                {HARGA_SETS.map((s) => (
                  <tr key={s.key}>
                    <td>Harga</td>
                    <td>{s.label}</td>
                    <td>{fmt(result.muHarga[s.key])}</td>
                  </tr>
                ))}
                {GIZI_SETS.map((s) => (
                  <tr key={s.key}>
                    <td>Gizi total</td>
                    <td>{s.label}</td>
                    <td>{fmt(result.muGizi[s.key])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ProcessItem>

          <ProcessItem title="2. Aturan yang aktif" open={open[2]} onToggle={() => toggle(2)}>
            {result.activeRules.length === 0 ? (
              <p className="process__text">Tidak ada aturan yang aktif.</p>
            ) : (
              <table className="table table--grid">
                <thead>
                  <tr>
                    <th>Aturan</th>
                    <th>Kondisi</th>
                    <th>α</th>
                    <th>Keluaran</th>
                  </tr>
                </thead>
                <tbody>
                  {result.activeRules.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.kondisi}</td>
                      <td>{fmt(r.alpha)}</td>
                      <td>{r.outputLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </ProcessItem>

          <ProcessItem title="3. Komposisi aturan" open={open[3]} onToggle={() => toggle(3)}>
            <p className="process__text">
              Tiap aturan memotong himpunan keluarannya setinggi α, lalu semuanya digabung dengan
              operator maksimum.
            </p>
            <ul className="process__list">
              {OUTPUT_SETS.map((s) => (
                <li key={s.key}>
                  {s.label}: α = {fmt(result.alphaByOutput[s.key])}
                </li>
              ))}
            </ul>
          </ProcessItem>

          <ProcessItem
            title="4. Defuzzifikasi"
            right={`Nilai tegas ${fmt(result.degree)}`}
            open={open[4]}
            onToggle={() => toggle(4)}
          >
            <p className="process__text">
              Nilai tegas dihitung dengan titik pusat (centroid) himpunan gabungan: Σ(x · μ) / Σμ ={' '}
              {fmt(result.degree)}, termasuk kategori {result.category.label}.
            </p>
          </ProcessItem>
        </section>

        <section className="card">
          <h2 className="card__title">Grafik himpunan keluaran</h2>
          <MembershipChart
            sets={OUTPUT_SETS}
            domain={[0, 1]}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            composed={result.curve}
            thin
            marker={{ value: result.degree, label: fmt(result.degree) }}
            ariaLabel="Grafik komposisi aturan dan titik hasil defuzzifikasi"
          />
          <p className="card__note">
            Area abu-abu adalah hasil komposisi aturan, garis tegak adalah titik hasil defuzzifikasi.
          </p>
        </section>
      </div>

      <div className="form-actions form-actions--left">
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Hitung Ulang
        </button>
        <a href="#/sampel" className="btn btn--link">
          Lihat Daftar Sampel
        </a>
      </div>
    </>
  )
}

/* ---------- Halaman ---------- */
export default function RecommendPage({ samples }) {
  const [form, setForm] = useState({ harga: '', gizi: '', pick: '' })
  const [result, setResult] = useState(null)

  const handleSubmit = (harga, gizi) => {
    setResult(evaluate(harga, gizi))
    window.scrollTo(0, 0)
  }

  return (
    <section className="page">
      <div className="container">
        {result ? (
          <ResultStep
            result={result}
            samples={samples}
            onRetry={() => {
              setResult(null)
              window.scrollTo(0, 0)
            }}
          />
        ) : (
          <InputStep samples={samples} form={form} setForm={setForm} onSubmit={handleSubmit} />
        )}
      </div>
    </section>
  )
}
