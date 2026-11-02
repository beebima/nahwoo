# NAHWOO — Bug, Trial & Error, dan Pencegahan Regresi

**Dibuat:** 2026-11-02. **Sumber:** riwayat pengembangan Nahwoo pada proyek, screenshot/laporan Gus, serta status commit diketahui. Setiap bug baru wajib ditambahkan, bukan menimpa yang lama.

**Kode status:** `TERLAPOR`, `DIAGNOSIS`, `PATCH DIBUAT`, `LULUS UJI BROWSER`, `LULUS UJI ANDROID`, `SELESAI DENGAN BUKTI`, `PERLU RETEST`. Status yang tidak terbukti tetap `PERLU RETEST`.

| ID | Masalah yang pernah ditemui | Penyebab/dugaan saat itu | Perubahan yang pernah dibuat | Status sekarang / tes anti-regresi |
|---|---|---|---|---|
| N-001 | Splash screen macet, tidak melewati loading | `ReferenceError: Cannot access 'saved' before initialization` (dari Console pada HTML sebelumnya) | Perbaikan urutan inisialisasi | **PERLU RETEST** startup bersih dan setelah update; tidak boleh klaim sudah normal di semua HP |
| N-002 | Konten sublevel pecah/overflow pada lebar mobile 360px | Teks, kartu, tombol dan flex melebihi viewport | Perbaikan responsif beberapa iterasi | **PERLU RETEST** 320/360/390px, font ekstrem, Arab panjang |
| N-003 | Beranda normal saat pertama dibuka tetapi melebar ke kanan setelah pindah tab | Layout reflow/overflow pada navigasi kembali | Revisi CSS/fit layar pada seri V1.0.x UI | **PERLU RETEST** minimal 10 kali pindah Beranda–Belajar–Pengaturan |
| N-004 | Tekan bintang Simpan/Ganti membuat layout bergeser sedikit | Konten kartu/perubahan ukuran elemen memicu reflow | Perbaikan layout dan aksi kartu | **PERLU RETEST** bintang/Ganti/rotasi sambil mengamati lebar |
| N-005 | Ikon SVG Nahwoo tidak terlihat di header | Ekspor SVG dari CorelDRAW awal bermasalah, diperbaiki sumber oleh Gus | Ganti dengan aset SVG yang sudah direvisi | **PERLU RETEST** semua density/tema/splash/About |
| N-006 | Status bar/notifikasi Android hitam atau tertutup banner/header | Edge-to-edge/inset dan pengaturan warna native | Revisi penempatan banner/status bar | **PERLU RETEST** Free/Freemium/Premium pada Android nyata; status bar biru sesuai header |
| N-007 | Ruang kosong ekstra untuk gesture navigation bawah | Insets/padding ganda pada native/WebView/slot banner | Revisi penimpaan gesture bar atas area bawah | **PERLU RETEST** tanpa spacer ganda di mode iklan dan premium |
| N-008 | Tombol/gesture Back langsung keluar, bukan mundur | Android back bridge/stack navigasi belum tepat | Navigasi internal + Back dua kali untuk keluar di Beranda | **PERLU RETEST** baca sublevel → list → tab; toast di Beranda |
| N-009 | Menu dropdown turun kasar/animasi tab mengejutkan | CSS transition berbeda ketika buka dan tutup | Transisi turun/naik dan efek press diperbaiki | **PERLU RETEST** 60fps pada perangkat sebenarnya, reduced motion |
| N-010 | Logo di Tentang Aplikasi dengan margin terlalu besar | Dimensi/box logo dan container | Perapian area About | **PERLU RETEST** berbagai font & viewport |
| N-011 | Materi injeksi pertama tampil seperti paragraf rata dan bocor teks draft/prompt | Parser/format dokumen tidak menyimpan hierarki visual | Master materi berblok, Smart Reader, bold/italic dan Arab khusus | **PERLU RETEST** minimal sublevel 1, 12, 24 & tag QUOTE |
| N-012 | Soal terlalu mudah karena hint memberi jawaban atau terlalu repetitif | Perancangan soal dan hint kurang pedagogis; source Draft Review | Guided Discovery, 6 opsi, 2 hint, data 24 level | **MASALAH EDITORIAL TERBUKA**: audit kualitas dan contoh berulang, bukan cukup pemeriksaan teknis |
| N-013 | Beranda Mufradat berputar hanya pada 4 dummy walau bank 50 terpasang | Array `const words` terpisah dari `NW_MINI_DICTIONARY_ENTRIES`; tidak ada timer | V0.1.8.8: satu sumber bank, jam menit, tombol Ganti/Simpan | **PATCH GITHUB TERVERIFIKASI**; rotasi 60 detik pada APK belum diuji langsung |
| N-014 | Smart Search mufradat berpotensi mencari dari contoh kalimat | Filter lama memakai `translation`/contoh saat mencari | V0.1.8.6: search hanya kepala Arab, arti dan alias | **LULUS UJI BROWSER** sebelumnya; tes ulang setelah impor bank 10.000 |
| N-015 | Build GitHub Actions setup Android gagal (`sdkmanager ... tools`, exit 1) | SDK package/request bermasalah pada workflow lama | Iterasi workflow/Gradle di versi berikutnya | **HISTORIS — CEK ACTIONS TERBARU**, jangan asumsi build sekarang merah/hijau |

## Format laporan bug baru (wajib)

```text
BUG-ID: N-016
Tanggal ditemukan:
Versi/commit/aplikasi yang terpasang:
Perangkat dan Android / ukuran layar / status lisensi:
Gejala (apa yang dilihat):
Langkah reproduksi (1, 2, 3):
Harapan vs kenyataan:
Bukti (screenshot/log dan timestamp tanpa token/PII):
Hipotesis penyebab (bukan fakta bila belum diuji):
Akar masalah yang terkonfirmasi:
Percobaan 1: hasil + mengapa gagal/berhasil
Solusi yang diterapkan (file/fungsi/commit):
Uji regresi dan hasil (browser, APK, Play):
Status dan penanggung jawab:
Risiko tersisa / jangan diulang:
```

Catatan: **penutupan bug membutuhkan bukti reproduksi sudah tidak muncul pada lingkungan target**. Jangan menandai "fix" final hanya dari perubahan source.