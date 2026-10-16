import { FIELDS } from '../data/samples'

const formatValue = (key, value) =>
  key === 'harga' ? Number(value).toLocaleString('id-ID') : value

export default function SampleTable({ rows, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            {FIELDS.map((f) => (
              <th key={f.key}>{f.label}</th>
            ))}
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={FIELDS.length + 2} className="table__empty">
                Tidak ada sampel yang cocok.
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.no}>
              <td>{row.no}</td>
              {FIELDS.map((f) => (
                <td key={f.key}>{formatValue(f.key, row[f.key])}</td>
              ))}
              <td>
                <div className="table__actions">
                  <button type="button" className="btn btn--small" onClick={() => onEdit(row)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn--small btn--dashed"
                    onClick={() => onDelete(row)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
