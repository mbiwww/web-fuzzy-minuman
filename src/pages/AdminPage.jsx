import { useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import SampleTable from '../components/SampleTable'
import Pagination from '../components/Pagination'
import SampleForm from '../components/SampleForm'
import { navigate } from '../lib/useHashRoute'

const PAGE_SIZE = 6

// Rute admin:
//   #/admin           daftar sampel
//   #/admin/tambah    form tambah
//   #/admin/edit/<no> form edit
export default function AdminPage({ samples, setSamples, path, onLogout }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim()
    return q ? samples.filter((s) => String(s.no).includes(q)) : samples
  }, [samples, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const rows = filtered.slice(start, start + PAGE_SIZE)

  const handleSearch = (value) => {
    setQuery(value)
    setPage(1)
  }

  // originalNo = nomor sebelum diedit (null saat menambah)
  const handleSave = (values, originalNo) => {
    setSamples((prev) => {
      const next =
        originalNo === null
          ? [...prev, values]
          : prev.map((s) => (s.no === originalNo ? values : s))
      return [...next].sort((a, b) => a.no - b.no)
    })
    navigate('#/admin')
  }

  const handleDelete = (row) => {
    if (!window.confirm(`Hapus sampel No ${row.no}?`)) return
    setSamples((prev) => prev.filter((s) => s.no !== row.no))
  }

  const editMatch = path.match(/^\/admin\/edit\/(\d+)$/)
  const editing = editMatch ? samples.find((s) => s.no === Number(editMatch[1])) : null
  const showForm = path === '/admin/tambah' || Boolean(editing)

  let content
  if (showForm) {
    content = (
      <SampleForm
        key={editing ? `edit-${editing.no}` : 'tambah'}
        sample={editing}
        existingNos={samples.map((s) => s.no)}
        onSave={handleSave}
        onCancel={() => navigate('#/admin')}
      />
    )
  } else {
    content = (
      <>
        <header className="page-header">
          <div>
            <h1 className="page-title">Kelola sampel minuman</h1>
            <p className="page-subtitle">
              Tambah, ubah, atau hapus data. Peringkat dihitung ulang setelah data berubah.
            </p>
          </div>
          <a href="#/admin/tambah" className="btn btn--primary btn--link">
            Tambah Sampel
          </a>
        </header>

        <div className="search">
          <label htmlFor="cari" className="search__label">
            Cari sampel
          </label>
          <div className="search__row">
            <input
              id="cari"
              className="input input--large"
              type="search"
              inputMode="numeric"
              placeholder="Nomor sampel"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <span className="search__total">Total {samples.length} sampel</span>
          </div>
        </div>

        <SampleTable
          rows={rows}
          onEdit={(row) => navigate(`#/admin/edit/${row.no}`)}
          onDelete={handleDelete}
        />

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
          from={filtered.length === 0 ? 0 : start + 1}
          to={start + rows.length}
          total={filtered.length}
        />
      </>
    )
  }

  return (
    <div className="layout">
      <Sidebar activeMenu="sampel" onLogout={onLogout} />
      <main className="content">{content}</main>
    </div>
  )
}
