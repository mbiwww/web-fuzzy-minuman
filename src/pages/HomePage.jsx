import { useMemo } from 'react'
import CategoryBadge from '../components/public/CategoryBadge'
import { CATEGORIES, formatDegree, formatRupiah, rankSamples } from '../lib/fuzzy'

const STEPS = [
  {
    title: 'Fuzzifikasi',
    text: 'Harga dan nilai gizi diubah menjadi himpunan fuzzy: murah, normal, mahal dan rendah, sedang, tinggi.',
  },
  {
    title: 'Aplikasi aturan',
    text: '9 aturan IF-THEN menghubungkan harga dan gizi dengan tingkat rekomendasi.',
  },
  {
    title: 'Komposisi aturan',
    text: 'Hasil semua aturan digabung menjadi satu himpunan keluaran fuzzy.',
  },
  {
    title: 'Defuzzifikasi',
    text: 'Himpunan keluaran diubah menjadi satu nilai tegas antara 0 dan 1.',
  },
]

export default function HomePage({ samples }) {
  const top = useMemo(() => rankSamples(samples).slice(0, 3), [samples])

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">Logika fuzzy Mamdani</p>
            <h1 className="hero__title">Pilih minuman kaleng yang sehat dan hemat</h1>
            <p className="hero__lead">
              Masukkan harga dan nilai gizi total. Sistem menghitung derajat keanggotaan lalu
              memberi rekomendasi: Dibeli, Dipertimbangkan, atau Tidak Dibeli.
            </p>
            <div className="hero__actions">
              <a href="#/rekomendasi" className="btn btn--primary btn--link">
                Mulai Rekomendasi
              </a>
              <a href="#/sampel" className="btn btn--link">
                Lihat Daftar Sampel
              </a>
            </div>
          </div>

          <div className="placeholder" role="img" aria-label="Tempat ilustrasi minuman kaleng">
            [Ilustrasi / foto minuman kaleng]
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section className="section section--white">
        <div className="container">
          <h2 className="section__title">Cara kerja rekomendasi</h2>

          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step-card">
                <span className="step-card__num">{i + 1}</span>
                <h3 className="step-card__title">{s.title}</h3>
                <p className="step-card__text">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="legend">
            <strong>Kategori hasil:</strong>
            {[CATEGORIES.dibeli, CATEGORIES.pertimbangkan, CATEGORIES.tidak].map((c) => (
              <span className="legend__item" key={c.key}>
                <CategoryBadge category={c.key} />
                <span>{c.range}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Rekomendasi teratas */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">Rekomendasi teratas dari data sampel</h2>
            <a href="#/sampel" className="link-strong">
              Lihat semua sampel
            </a>
          </div>

          <ul className="top-grid">
            {top.map((s) => (
              <li key={s.no} className="top-card">
                <div className="top-card__head">
                  <span className="top-card__name">Sampel {s.no}</span>
                  <CategoryBadge category={s.category.key} />
                </div>
                <p className="top-card__value">{formatDegree(s.degree)}</p>
                <p className="top-card__meta">
                  Harga Rp {formatRupiah(s.harga)} · Gizi total {s.gt}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
