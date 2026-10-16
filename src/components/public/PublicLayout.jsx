const NAV = [
  { to: '/', label: 'Beranda' },
  { to: '/rekomendasi', label: 'Rekomendasi' },
  { to: '/sampel', label: 'Daftar Sampel' },
]

export default function PublicLayout({ path, children }) {
  return (
    <div className="site">
      <header className="site-header">
        <div className="container site-header__inner">
          <a href="#/" className="site-brand">
            <span className="site-brand__logo" aria-hidden="true" />
            <span className="site-brand__name">[Nama Web]</span>
          </a>

          <nav className="site-nav" aria-label="Menu utama">
            {NAV.map((item) => (
              <a
                key={item.to}
                href={`#${item.to}`}
                className={`site-nav__link ${path === item.to ? 'site-nav__link--active' : ''}`}
                aria-current={path === item.to ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="site__main">{children}</main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>Penerapan logika fuzzy Mamdani untuk pemilihan minuman kaleng</p>
          <a href="#/admin">Masuk Admin</a>
        </div>
      </footer>
    </div>
  )
}
