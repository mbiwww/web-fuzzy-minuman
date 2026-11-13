// Mesin logika fuzzy Mamdani untuk rekomendasi minuman kaleng.
// Semua parameter ada di bagian atas file ini supaya mudah disesuaikan.

// ---------- Himpunan fuzzy ----------
// Setiap himpunan berbentuk trapesium [a, b, c, d]:
//   naik dari a ke b, datar 1 dari b ke c, turun dari c ke d.
// Bahu kiri  : a = b   (nilai 1 sejak awal)
// Bahu kanan : c = d   (nilai 1 sampai akhir)

export const HARGA_RANGE = [0, 10000]
export const GIZI_RANGE = [0, 350]

export const HARGA_SETS = [
  { key: 'murah', label: 'Murah', points: [0, 0, 0, 4000] },
  { key: 'normal', label: 'Normal', points: [1000, 5000, 5000, 9000] },
  { key: 'mahal', label: 'Mahal', points: [6000, 10000, 10000, 10000] },
]

export const GIZI_SETS = [
  { key: 'rendah', label: 'Rendah', points: [0, 0, 0, 150] },
  { key: 'sedang', label: 'Sedang', points: [35, 175, 175, 315] },
  { key: 'tinggi', label: 'Tinggi', points: [210, 350, 350, 350] },
]

export const OUTPUT_SETS = [
  { key: 'tidak', label: 'Tidak Dibeli', points: [0, 0, 0, 0.4] },
  { key: 'pertimbangkan', label: 'Dipertimbangkan', points: [0.1, 0.5, 0.5, 0.9] },
  { key: 'dibeli', label: 'Dibeli', points: [0.6, 1, 1, 1] },
]

// ---------- 9 aturan IF-THEN ----------
// Urutan: harga (murah, normal, mahal) x gizi (rendah, sedang, tinggi) -> R1..R9
export const RULES = [
  { id: 'R1', harga: 'murah', gizi: 'rendah', output: 'tidak' },
  { id: 'R2', harga: 'murah', gizi: 'sedang', output: 'pertimbangkan' },
  { id: 'R3', harga: 'murah', gizi: 'tinggi', output: 'dibeli' },
  { id: 'R4', harga: 'normal', gizi: 'rendah', output: 'tidak' },
  { id: 'R5', harga: 'normal', gizi: 'sedang', output: 'pertimbangkan' },
  { id: 'R6', harga: 'normal', gizi: 'tinggi', output: 'dibeli' },
  { id: 'R7', harga: 'mahal', gizi: 'rendah', output: 'tidak' },
  { id: 'R8', harga: 'mahal', gizi: 'sedang', output: 'tidak' },
  { id: 'R9', harga: 'mahal', gizi: 'tinggi', output: 'pertimbangkan' },
]

// Resolusi titik pada himpunan keluaran saat defuzzifikasi (centroid)
const STEP = 0.01

// ---------- Kategori hasil ----------
export const CATEGORIES = {
  dibeli: { key: 'dibeli', label: 'Dibeli', range: '0.6 sampai 1' },
  pertimbangkan: { key: 'pertimbangkan', label: 'Dipertimbangkan', range: '0.1 sampai 0.9' },
  tidak: { key: 'tidak', label: 'Tidak Dibeli', range: '0 sampai 0.4' },
}

export function categoryOf(degree) {
  if (degree >= 0.6) return CATEGORIES.dibeli
  if (degree <= 0.4) return CATEGORIES.tidak
  return CATEGORIES.pertimbangkan
}

// ---------- Fungsi keanggotaan ----------
export function membership(x, [a, b, c, d]) {
  const up = b === a ? (x >= a ? 1 : 0) : (x - a) / (b - a)
  const down = d === c ? (x <= d ? 1 : 0) : (d - x) / (d - c)
  return Math.max(0, Math.min(1, up, down))
}

const byKey = (sets) => Object.fromEntries(sets.map((s) => [s.key, s]))
const HARGA = byKey(HARGA_SETS)
const GIZI = byKey(GIZI_SETS)
const OUTPUT = byKey(OUTPUT_SETS)

const label = (sets, key) => byKey(sets)[key].label

// ---------- Proses Mamdani ----------
export function evaluate(harga, gizi) {
  // 1. Fuzzifikasi
  const muHarga = Object.fromEntries(HARGA_SETS.map((s) => [s.key, membership(harga, s.points)]))
  const muGizi = Object.fromEntries(GIZI_SETS.map((s) => [s.key, membership(gizi, s.points)]))

  // 2. Aplikasi aturan (operator AND = min)
  const rules = RULES.map((r) => ({
    id: r.id,
    kondisi: `${label(HARGA_SETS, r.harga)} dan ${label(GIZI_SETS, r.gizi)}`,
    alpha: Math.min(muHarga[r.harga], muGizi[r.gizi]),
    output: r.output,
    outputLabel: OUTPUT[r.output].label,
  }))

  // 3. Komposisi aturan (max dari himpunan keluaran yang dipotong alpha)
  const alphaByOutput = { tidak: 0, pertimbangkan: 0, dibeli: 0 }
  rules.forEach((r) => {
    alphaByOutput[r.output] = Math.max(alphaByOutput[r.output], r.alpha)
  })

  const steps = Math.round(1 / STEP)
  const curve = []
  for (let i = 0; i <= steps; i++) {
    const x = i * STEP
    const y = Math.max(
      ...OUTPUT_SETS.map((s) => Math.min(alphaByOutput[s.key], membership(x, s.points))),
    )
    curve.push({ x, y })
  }

  // 4. Defuzzifikasi (centroid)
  let num = 0
  let den = 0
  curve.forEach(({ x, y }) => {
    num += x * y
    den += y
  })
  const degree = den === 0 ? 0 : num / den

  return {
    harga,
    gizi,
    muHarga,
    muGizi,
    rules,
    activeRules: rules.filter((r) => r.alpha > 0),
    alphaByOutput,
    curve,
    degree,
    category: categoryOf(degree),
  }
}

// ---------- Peringkat seluruh sampel ----------
// Mengembalikan sampel + derajat + kategori + peringkat (1 = terbaik).
export function rankSamples(samples) {
  return samples
    .map((s) => {
      const { degree, category } = evaluate(s.harga, s.gt)
      return { ...s, degree, category }
    })
    .sort((a, b) => b.degree - a.degree || a.no - b.no)
    .map((s, i) => ({ ...s, rank: i + 1 }))
}

// Peringkat untuk input pengguna jika disisipkan ke daftar sampel
export function rankOfDegree(degree, rankedSamples) {
  return 1 + rankedSamples.filter((s) => s.degree > degree).length
}

// ---------- Format ----------
export const formatDegree = (d) => String(Number(d.toFixed(3)))
export const formatRupiah = (n) => Number(n).toLocaleString('id-ID')
