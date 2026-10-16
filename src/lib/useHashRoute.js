import { useEffect, useState } from 'react'

// Routing sederhana berbasis hash (tanpa library):
//   #/                 Beranda
//   #/rekomendasi      Cek rekomendasi
//   #/sampel           Daftar & peringkat sampel
//   #/admin ...        Panel admin
const read = () => window.location.hash.replace(/^#/, '') || '/'

export default function useHashRoute() {
  const [path, setPath] = useState(read)

  useEffect(() => {
    const onChange = () => setPath(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return path
}

export const navigate = (to) => {
  window.location.hash = to
}
