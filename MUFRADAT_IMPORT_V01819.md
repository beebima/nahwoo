# NAHWOO V0.1.8.19 — Mufradat 10.000

Sumber: delapan ZIP yang diserahkan pengguna (100 berkas JSON, VOC-00001 sampai VOC-10000).

- 10.000 baris sumber dengan tujuh kolom wajib terisi; ID semuanya unik.
- Isim: 8.305; fi'il: 1.680; huruf: 15.
- 9.976 tulisan Arab unik di 10.000 baris; **kata/arti berulang dipertahankan** sesuai sumber, bukan dihapus tanpa izin.
- Data dipetakan tanpa mengubah ejaan ke ar, meaning, kind, word_type, word_subtype, example, translation.
- Tampilan Kamus Mini menggunakan 10 chunk lokal (1000 entri/chunk), pencarian Arab/Indonesia dan pembatasan render yang sudah ada.
- Home Mufradat dan bookmark membaca bank yang sama setelah load.
- Data 10.000 merupakan konten dari pengguna; **validasi linguistik kata-per-kata belum dilakukan**. Audit ini adalah audit struktur dan integritas input.
- Sample 50 kata dan RUN03/RUN08 sebelumnya tetap di repo sebagai arsip tetapi tidak digabung ke bank aktif 10.000.
- Materi Level 1–25, evaluasi 4.800 soal dan kode monetisasi demo tidak diubah.
- Jalankan `node scripts/qa-mufradat-10000.js` sebelum Android build. Rilis debug: versionCode 26, versionName 0.1.8.19.
