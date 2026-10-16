export default function Pagination({ page, totalPages, onChange, from, to, total }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="pagination">
      <p className="pagination__info">
        {total === 0
          ? 'Tidak ada sampel'
          : `Menampilkan ${from} sampai ${to} dari ${total} sampel`}
      </p>

      <div className="pagination__buttons">
        <button
          type="button"
          className="page-btn"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
        >
          &lt;
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`page-btn ${p === page ? 'page-btn--active' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="page-btn"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
        >
          &gt;
        </button>
      </div>
    </div>
  )
}
