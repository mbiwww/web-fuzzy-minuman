import { useEffect, useState } from 'react'
import './App.css'
import './public.css'
import useHashRoute, { navigate } from './lib/useHashRoute'
import { isLoggedIn, logout } from './lib/auth'
import { initialSamples } from './data/samples'
import PublicLayout from './components/public/PublicLayout'
import HomePage from './pages/HomePage'
import RecommendPage from './pages/RecommendPage'
import SamplesPage from './pages/SamplesPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'

function App() {
  const path = useHashRoute()
  // Data sampel dipakai bersama oleh halaman pengguna dan panel admin
  const [samples, setSamples] = useState(initialSamples)
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)

  const isAdminRoute = path.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  // Penjaga rute: panel admin hanya untuk yang sudah masuk
  useEffect(() => {
    if (isAdminRoute && !loggedIn) window.location.replace('#/login')
  }, [isAdminRoute, loggedIn])

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    navigate('#/')
  }

  // Halaman login
  if (path === '/login') {
    return <LoginPage loggedIn={loggedIn} onLogin={() => setLoggedIn(true)} />
  }

  // Panel admin (perlu login)
  if (isAdminRoute) {
    if (!loggedIn) return null // sedang dialihkan ke halaman login
    return (
      <AdminPage samples={samples} setSamples={setSamples} path={path} onLogout={handleLogout} />
    )
  }

  // Halaman pengguna (tanpa login)
  let page
  if (path === '/rekomendasi') page = <RecommendPage samples={samples} />
  else if (path === '/sampel') page = <SamplesPage samples={samples} />
  else page = <HomePage samples={samples} />

  return <PublicLayout path={path}>{page}</PublicLayout>
}

export default App
