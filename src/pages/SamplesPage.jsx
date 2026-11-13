import { Fragment, useMemo, useState } from 'react'
import CategoryBadge from '../components/public/CategoryBadge'
import Pagination from '../components/Pagination'
import { FIELDS } from '../data/samples'
import { CATEGORIES, formatDegree, formatRupiah, rankSamples } from '../lib/fuzzy'

const PAGE_SIZE = 9

const SORTS = {
  'derajat-desc': { label: 'Derajat tertinggi', fn: (a, b) => a.rank - b.rank },
  'derajat-asc': { label: 'Derajat terendah', fn: (a, b) => b.rank - a.rank },
  'harga-asc': { label: 'Harga termurah', fn: (a, b) => a.harga - b.harga || a.rank - b.rank },
  'harga-desc': { label: 'Harga termahal', fn: (a, b) => b.harga - a.harga || a.rank - b.rank },
  'gizi-desc': { label: 'Gizi total tertinggi', fn: (a, b) => b.gt - a.gt || a.rank - b.rank },
  'no-asc': { label: 'Nomor sampel', fn: (a, b) => a.no - b.no },
}

const nutritionLabel = (f) => (f.key === 'kt' ? 'Karbohidrat' : f.name)

export default function SamplesPage({ samples }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('semua')
  const [sort, setSort] = useState('derajat-desc')
  const [page, setPage] = useState(1)
  const [openNo, setOpenNo] = useState(null)

  // Peringkat dihitung dari seluruh data, bukan dari hasil filter
  const ranked = useMemo(() => rankSamples(samples), [samples])

  const counts = useMemo(() => {
    const c = { dibeli: 0, pertimbangkan: 0, tidak: 0 }
    ranked.forEach((s) => {
      c[s.category.key] += 1
    })
    return c
  }, [ranked])

  const filtered = useMemo(() => {
    const q = query.trim()
    return ranked
      .filter((s) => (q ? String(s.no).includes(q) : true))
      .filter((s) => (category === 'semua' ? true : s.category.key === category))
      .sort(SORTS[sort].fn)
  }, [ranked, query, category, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const rows = filtered.slice(start, start + PAGE_SIZE)

  const resetPage = () => {
    setPage(1)
    setOpenNo(null)
  }

  return (
    <section className="page">
      <div className="container">
        <header className="page__head">
          <h1 className="page-title">Daftar dan peringkat sampel</h1>
          <p className="page-subtitle">
            Data minuman kaleng yang dipakai sistem, diurutkan dari derajat keanggotaan tertinggi.
          </p>
        </header>

        <ul className="summary">
          {[CATEGORIES.dibeli, CATEGORIES.pertimbangkan, CATEGORIES.tidak].map((c) => (
            <li key={c.key} className="summary__item">
              <CategoryBadge category={c.key} />
              <span>{counts[c.key]} sampel</span>
            </li>
          ))}
        </ul>

        <div className="filters">
          <div className="field">
            <label className="field__label" htmlFor="cari">
              Cari sampel
            </label>
            <input
              id="cari"
              className="input input--large"
              type="search"
              inputMode="numeric"
              placeholder="Nomor sampel"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                resetPage()
              }}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="kategori">
              Kategori
            </label>
            <select
              id="kategori"
              className="input input--large"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                resetPage()
              }}
            >
              <option value="semua">Semua</option>
              <option value="dibeli">Dibeli</option>
              <option value="pertimbangkan">Dipertimbangkan</option>
              <option value="tidak">Tidak Dibeli</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="urutkan">
              Urutkan
            </label>
            <select
              id="urutkan"
              className="input input--large"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                resetPage()
              }}
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Peringkat</th>
                <th>Sampel</th>
                <th>Harga (Rp)</th>
                <th>Gizi total</th>
                <th>Derajat</th>
                <th>Kategori</th>
                <th>
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="table__empty">
                    Tidak ada sampel yang cocok.
                  </td>
                </tr>
              )}

              {rows.map((s) => {
                const open = openNo === s.no
                return (
                  <Fragment key={s.no}>
                    <tr>
                      <td>{s.rank}</td>
                      <td>{s.no}</td>
                      <td>{formatRupiah(s.harga)}</td>
                      <td>{s.gt}</td>
                      <td>{formatDegree(s.degree)}</td>
                      <td>
                        <CategoryBadge category={s.category.key} />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn--small"
                          aria-expanded={open}
                          onClick={() => setOpenNo(open ? null : s.no)}
                        >
                          {open ? 'Tutup' : 'Detail'}
                        </button>
                      </td>
                    </tr>

                    {open && (
                      <tr className="table__detail">
                        <td colSpan={7}>
                          <p className="detail__title">Kandungan gizi sampel {s.no}</p>
                          <ul className="detail__list">
                            {FIELDS.filter((f) => f.key !== 'harga').map((f) => (
                              <li key={f.key}>
                                {nutritionLabel(f)} {s[f.key]}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={(p) => {
            setPage(p)
            setOpenNo(null)
          }}
          from={filtered.length === 0 ? 0 : start + 1}
          to={start + rows.length}
          total={filtered.length}
        />
      </div>
    </section>
  )
}
