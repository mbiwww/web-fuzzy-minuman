export default function Sidebar({ activeMenu = 'sampel', onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand__logo" aria-hidden="true" />
        <div>
          <p className="brand__name">[Nama Web]</p>
          <p className="brand__role">Panel Admin</p>
        </div>
      </div>

      <nav className="nav" aria-label="Menu admin">
        <a
          href="#/admin"
          className={`nav__item ${activeMenu === 'sampel' ? 'nav__item--active' : ''}`}
          aria-current={activeMenu === 'sampel' ? 'page' : undefined}
        >
          Kelola Sampel
        </a>
        <a href="#/" className="nav__item">
          Lihat Situs
        </a>
        <button type="button" className="nav__item nav__item--button" onClick={onLogout}>
          Keluar
        </button>
      </nav>
    </aside>
  )
}
