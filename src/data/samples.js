// Kolom numerik pada tabel sampel
export const FIELDS = [
  { key: 'et', label: 'ET', name: 'Energi total' },
  { key: 'el', label: 'EL', name: 'Energi lemak' },
  { key: 'lt', label: 'LT', name: 'Lemak total' },
  { key: 'lj', label: 'LJ', name: 'Lemak jenuh' },
  { key: 'p', label: 'P', name: 'Protein' },
  { key: 'kt', label: 'KT', name: 'Karbohidrat total' },
  { key: 'gl', label: 'GL', name: 'Gula' },
  { key: 'ga', label: 'GA', name: 'Garam' },
  { key: 'gt', label: 'GT', name: 'Gizi total' },
  { key: 'harga', label: 'Harga', name: 'Harga' },
]

// Rentang yang dipakai sebagai input fuzzy
export const LIMITS = {
  harga: { min: 0, max: 10000 },
  gt: { min: 0, max: 350 },
}

// Gizi total (GT) = jumlah ET + EL + LT + LJ + P + KT + GL + GA,
// sama seperti pada data di desain (mis. sampel 1: 110+50+6+3+6+8+8+95 = 286).
const row = (no, et, el, lt, lj, p, kt, gl, ga, harga) => ({
  no,
  et,
  el,
  lt,
  lj,
  p,
  kt,
  gl,
  ga,
  gt: et + el + lt + lj + p + kt + gl + ga,
  harga,
})

// Sampel 1-6, 7, 8, 9, 12, 13, 19, 20 mengikuti angka harga dan gizi total di desain.
// Rincian gizi sampel selain 1-6 dan 19 adalah data contoh.
export const initialSamples = [
  row(1, 110, 50, 6, 3, 6, 8, 8, 95, 7475),
  row(2, 100, 0, 0, 0, 0, 25, 25, 40, 6200),
  row(3, 110, 0, 0, 0, 0, 27, 23, 95, 7435),
  row(4, 90, 0, 0, 0, 0, 21, 18, 130, 7435),
  row(5, 110, 0, 0, 0, 0, 27, 25, 15, 5820),
  row(6, 100, 0, 0, 0, 1, 25, 7, 20, 5820),
  row(7, 90, 20, 2, 1, 3, 24, 15, 40, 8890),
  row(8, 120, 0, 0, 0, 2, 30, 28, 126, 5820),
  row(9, 15, 0, 0, 0, 0, 8, 5, 2, 5490),
  row(10, 115, 40, 5, 2, 4, 10, 9, 60, 6350),
  row(11, 100, 0, 0, 0, 0, 22, 20, 35, 5600),
  row(12, 125, 0, 0, 0, 0, 35, 30, 135, 5935),
  row(13, 100, 0, 0, 0, 0, 28, 22, 70, 5100),
  row(14, 110, 0, 0, 0, 0, 26, 22, 80, 6800),
  row(15, 80, 10, 1, 0, 1, 15, 10, 30, 9200),
  row(16, 105, 0, 0, 0, 0, 23, 19, 65, 6450),
  row(17, 70, 0, 0, 0, 0, 18, 12, 25, 8900),
  row(18, 120, 0, 0, 0, 0, 28, 24, 110, 7900),
  row(19, 130, 0, 0, 0, 0, 40, 40, 125, 4505),
  row(20, 105, 0, 0, 0, 0, 33, 30, 85, 3769),
]
