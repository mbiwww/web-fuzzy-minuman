import { useEffect, useState } from 'react'
import { login } from '../lib/auth'
import { navigate } from '../lib/useHashRoute'

export default function LoginPage({ loggedIn, onLogin }) {
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Sudah masuk? langsung ke panel admin
  useEffect(() => {
    if (loggedIn) window.location.replace('#/admin')
  }, [loggedIn])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (identity.trim() === '' || password === '') {
      setError('Isi username atau email dan kata sandi.')
      return
    }

    setLoading(true)
    setError('')
    const ok = await login(identity, password)
    setLoading(false)

    if (!ok) {
      setError('Username atau kata sandi salah.')
      return
    }
    onLogin()
    navigate('#/admin')
  }

  return (
    <div className="login">
      <header className="site-header">
        <div className="container site-header__inner">
          <a href="#/" className="site-brand">
            <span className="site-brand__logo" aria-hidden="true" />
            <span className="site-brand__name">[Nama Web]</span>
          </a>
          <a href="#/" className="link-underline">
            Kembali ke beranda
          </a>
        </div>
      </header>

      <main className="login__main">
        <form className="login__card" onSubmit={handleSubmit} noValidate>
          <h1 className="login__title">Masuk Admin</h1>
          <p className="login__lead">
            Halaman ini khusus admin untuk mengelola data sampel minuman. Pengunjung biasa tidak
            perlu masuk.
          </p>

          <div className="field">
            <label className="field__label" htmlFor="identity">
              Username atau email
            </label>
            <input
              id="identity"
              className="input input--large"
              type="text"
              autoComplete="username"
              placeholder="admin@contoh.com"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="password">
              Kata sandi
            </label>
            <div className="password-row">
              <input
                id="password"
                className="input input--large"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn--small password-row__toggle"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          {error && (
            <div className="form-message" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn--primary login__submit" disabled={loading}>
            {loading ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>
      </main>
    </div>
  )
}
