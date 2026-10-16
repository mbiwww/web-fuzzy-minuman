import { useState } from 'react'
import { FIELDS, LIMITS } from '../data/samples'

const NUTRITION = FIELDS.filter((f) => f.key !== 'harga')
const fmt = (n) => n.toLocaleString('id-ID')

const buildInitial = (sample) => ({
  no: sample ? String(sample.no) : '',
  ...Object.fromEntries(FIELDS.map((f) => [f.key, sample ? String(sample[f.key]) : ''])),
})

// Halaman yang sama dipakai untuk tambah (sample = null) dan edit.
export default function SampleForm({ sample, existingNos, onSave, onCancel }) {
  const isEdit = Boolean(sample)
  const [form, setForm] = useState(() => buildInitial(sample))
  const [errors, setErrors] = useState([])

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const validate = () => {
    const list = []

    const no = Number(form.no)
    if (form.no.trim() === '' || !Number.isInteger(no) || no < 1) {
      list.push('Nomor sampel harus berupa bilangan bulat positif.')
    } else if (existingNos.includes(no) && (!isEdit || no !== sample.no)) {
      list.push(`Nomor sampel ${no} sudah dipakai.`)
    }

    const harga = Number(form.harga)
    if (form.harga.trim() === '' || Number.isNaN(harga)) {
      list.push('Harga wajib diisi dengan angka.')
    } else if (harga < LIMITS.harga.min || harga > LIMITS.harga.max) {
      list.push(
        `Harga di luar rentang (${LIMITS.harga.min} sampai ${fmt(LIMITS.harga.max)}).`,
      )
    }

    NUTRITION.forEach((f) => {
      const raw = form[f.key]
      const v = Number(raw)
      if (raw.trim() === '' || Number.isNaN(v) || v < 0) {
        list.push(`${f.name} (${f.label}) harus berupa angka 0 atau lebih.`)
      } else if (f.key === 'gt' && v > LIMITS.gt.max) {
        list.push(`Gizi total (GT) di luar rentang (${LIMITS.gt.min} sampai ${LIMITS.gt.max}).`)
      }
    })

    return list
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const list = validate()
    setErrors(list)
    if (list.length > 0) return

    onSave(
      {
        no: Number(form.no),
        ...Object.fromEntries(FIELDS.map((f) => [f.key, Number(form[f.key])])),
      },
      sample ? sample.no : null,
    )
  }

  return (
    <>
      <header className="form-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="#/admin">Kelola Sampel</a>
          <span> / </span>
          <span>{isEdit ? 'Edit sampel' : 'Tambah sampel'}</span>
        </nav>
        <h1 className="page-title">{isEdit ? 'Edit sampel minuman' : 'Tambah sampel minuman'}</h1>
        <p className="page-subtitle">
          {isEdit
            ? 'Ubah data sampel, lalu simpan. Peringkat dihitung ulang setelah data berubah.'
            : 'Isi data sampel baru, lalu simpan. Peringkat dihitung ulang setelah data berubah.'}
        </p>
      </header>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <section>
          <h2 className="form-section-title">Informasi umum</h2>
          <div className="form-grid form-grid--2">
            <div className="field">
              <label className="field__label" htmlFor="no">
                Nomor sampel
              </label>
              <input
                id="no"
                className="input input--large"
                type="number"
                min="1"
                step="1"
                placeholder="Contoh: 21"
                value={form.no}
                onChange={(e) => handleChange('no', e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="harga">
                Harga (Rp)
              </label>
              <input
                id="harga"
                className="input input--large"
                type="number"
                min={LIMITS.harga.min}
                max={LIMITS.harga.max}
                step="any"
                placeholder="Contoh: 4505"
                value={form.harga}
                onChange={(e) => handleChange('harga', e.target.value)}
                aria-describedby="harga-hint"
              />
              <p className="field__hint" id="harga-hint">
                Dipakai sebagai input fuzzy, rentang {LIMITS.harga.min} sampai{' '}
                {fmt(LIMITS.harga.max)}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="form-section-title">Kandungan nilai gizi</h2>
          <div className="form-grid form-grid--3">
            {NUTRITION.map((f) => (
              <div className="field" key={f.key}>
                <label className="field__label" htmlFor={f.key}>
                  {f.name} ({f.label})
                </label>
                <input
                  id={f.key}
                  className="input input--large"
                  type="number"
                  min="0"
                  max={f.key === 'gt' ? LIMITS.gt.max : undefined}
                  step="any"
                  placeholder="0"
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  aria-describedby={f.key === 'gt' ? 'gt-hint' : undefined}
                />
                {f.key === 'gt' && (
                  <p className="field__hint" id="gt-hint">
                    Dipakai sebagai input fuzzy, rentang {LIMITS.gt.min} sampai {LIMITS.gt.max}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {errors.length > 0 && (
          <div className="form-message" role="alert">
            <ul>
              {errors.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn" onClick={onCancel}>
            Batal
          </button>
          <button type="submit" className="btn btn--primary">
            Simpan
          </button>
        </div>
      </form>
    </>
  )
}
