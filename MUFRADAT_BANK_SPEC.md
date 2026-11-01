# NAHWOO — Kamus Mini V0.1.8.6

## Status
Kamus Mini aktif pada tombol cepat di **Beranda** menggantikan tombol Pengaturan. Menu Pengaturan **navigasi bawah** tidak berubah.

Data awal adalah **24 entri contoh** yang diperiksa secara editorial awal, belum 10.000 entri final. Proyek menyediakan inventaris kata Arab yang muncul pada 24 level, termasuk materi dan 4.800 soal, pada `MUFRADAT_PENDING_COVERAGE.csv` untuk pengembangan data berikutnya. Inventaris bukan kamus final; tidak boleh diterbitkan sebagai terjemahan tanpa review.

## Kontrak data bank mufradat

Lokasi: `app/src/main/assets/content/mufradat_bank.js`. Definisikan array `window.NW_MINI_DICTIONARY_ENTRIES`. Tiap entri memuat:

```json
{
  "id": "m-00001",
  "ar": "كَتَبَ",
  "meaning": "telah menulis",
  "aliases": ["menulis"],
  "forms_ar": ["يَكْتُبُ", "كَتَبْتُ"],
  "kind": "Fi‘il madhi",
  "example": "كَتَبَ زَيْدٌ الرِّسَالَةَ",
  "translation": "Zaid telah menulis surat.",
  "source": "editorial-reviewed"
}
```

**Pencarian hanya** memindai `ar`, `meaning`, dan `aliases` (alias arti Indonesia). Kolom `forms_ar` berisi variasi bentuk Arab yang diverifikasi, dan boleh ikut pencarian kepala kata (bukan kalimat). Kolom `kind`, `example`, `translation` dan `source` sama sekali **tidak dipakai untuk search**. Contoh kalimat hanya ditampilkan pada kartu hasil.

Normalisasi Arab menghapus harakat/tatweel dan menggabungkan variasi alif (أ، إ، آ، ٱ); ya akhir ى menjadi ي. Pencarian Indonesia menerima kata sebagian dan salah ketik ringan.

Untuk 10.000+ entri, penerbit cukup mengganti file bank, tanpa mengubah HTML. Sistem mengindeks satu kali dan membatasi jumlah kartu hasil yang dirender (30 per batch), serta debounce 110ms.

Inventaris kata Arab perlu disunting: satu lema dan bentuk berimbuhan/berharakat tidak selalu satu entri, sehingga jumlah token tidak sama dengan jumlah mufradat. Semua bentuk dalam materi dan soal tetap harus diaudit untuk cakupan kamus final.