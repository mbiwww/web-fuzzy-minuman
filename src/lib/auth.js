// Login admin sisi front end (tahap MVP, belum ada backend).
//
// PENTING: semua kode di folder src ikut terkirim ke browser, jadi username dan
// kata sandi di bawah ini bisa dibaca siapa saja yang membuka kode situsnya.
// Ini cukup untuk demo/MVP, tetapi BUKAN pengamanan sungguhan. Untuk produksi,
// ganti isi fungsi `login` dengan pemanggilan API ke server (cek di server,
// kembalikan token/sesi), dan jangan simpan kata sandi di front end.
//
// Kredensial bawaan:  admin / admin123  (atau admin@contoh.com / admin123)
// Bisa diganti lewat file .env:
//   VITE_ADMIN_USER=...   VITE_ADMIN_EMAIL=...   VITE_ADMIN_PASSWORD=...

const ADMIN = {
  username: import.meta.env.VITE_ADMIN_USER ?? 'admin',
  email: import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@contoh.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin123',
}

// sessionStorage: sesi hilang saat tab/browser ditutup
const KEY = 'fuzzy-admin-session'

export const isLoggedIn = () => {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

// Dibuat async supaya nanti mudah diganti dengan pemanggilan API.
// Mengembalikan true bila berhasil.
export async function login(identity, password) {
  const id = identity.trim().toLowerCase()
  const ok = (id === ADMIN.username.toLowerCase() || id === ADMIN.email.toLowerCase()) && password === ADMIN.password
  if (ok) {
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* penyimpanan diblokir: sesi hanya berlaku selama halaman terbuka */
    }
  }
  return ok
}

export function logout() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* abaikan */
  }
}
