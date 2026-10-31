# Nahwoo Android V0.1.8.3 — Preview Materi Level 01–12 V2.4

Proyek Android WebView offline untuk pengujian materi Smart Reader. Bangun dengan workflow GitHub Actions yang tersedia dalam `.github/workflows/android-debug.yml`.

## Perubahan pada revisi ini

- Mengganti materi 12 level dengan sumber `NAHWOO_LEVEL_01-12_REVISI_ANTI_PENGULANGAN_V2.4(1).zip`.
- Perbaikan pengulangan narasi terutama Level 09–12, dengan penyesuaian Level 08.
- 120 sublevel dan 2.400 soal Guided Discovery tetap tersedia. Revisi sumber tidak mengubah bank soal maupun kunci.
- Perbaikan aplikasi terdahulu seperti tombol/gesture Back, pengaturan font, penyimpanan progres, dan layout dipertahankan.
- Level 13–24 belum diisi; bank soal utama 24.000 masih terpisah.

## Keterbatasan penting

Ini proyek **preview**, bukan konten final yang telah lolos validasi ahli. Baca `CONTENT_REPLACEMENT_V24_REPORT.json` untuk audit injeksi. Laporan sumber V2.4 menyatakan Level 08 masih mengandung bukti Arab yang diulang di beberapa soal. Review pedagogis, akurasi nahwu-sharaf, variasi soal dan pengujian Android tetap diperlukan sebelum publikasi.

Kunci evaluasi berada pada file terpisah `content/level_XX_keys.js` yang hanya dimuat ke WebView setelah 20 jawaban dikirim. Karena aplikasinya offline, metode ini bukan perlindungan anticurang absolut.

## Versi Android

`versionCode 10`, `versionName 0.1.8.3`.

## GitHub

Teks Summary dan Description disediakan di `GITHUB_RELEASE.md`.
