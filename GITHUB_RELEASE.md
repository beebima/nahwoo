# GitHub Commit — Nahwoo V0.1.8.7

## Summary
Nahwoo V0.1.8.7 — Inject 50 Mufradat Draf, Smart Search Arab–Indonesia & Inventaris 1.816 Bentuk

## Description
- Mengganti 24 entri demo Kamus Mini dengan 50 entri mufradat bersumber dari paket DRAFT_REVIEW yang diberikan.
- Mempertahankan arti Indonesia, kelas kata, Arab berharakat, dan contoh Arab beserta terjemahan dari sumber tanpa menulis ulang isinya.
- Mempertahankan smart search dua arah hanya pada lema/alias, tanpa pencarian di contoh kalimat.
- Menampilkan label Draf — menunggu review guru pada kartu kosakata.
- Menyimpan inventaris 1.683 kandidat inti dan 1.816 bentuk Arab keseluruhan dalam folder editorial untuk kurasi, bukan langsung masuk hasil kamus.
- Menyimpan data JSON dan laporan QA sumber sebagai berkas editorial.
- Mempertahankan seluruh 24 level, 240 sublevel, 4.800 soal, pengaturan font, dan navigasi.
- Android versionCode 14, versionName 0.1.8.7.

## QA
- Struktur 50/50 entri lengkap dan unik; checksum manifest sumber lolos.
- Pencarian Arab/Indonesia dan pengecualian teks contoh diuji.
- JavaScript sintaks dan integritas ZIP diperiksa.
- APK/perangkat fisik belum diuji dan peninjauan bahasa Arab independen belum selesai.
- Target 10.000 belum tercapai; 1.816 kandidat bukan lema tervalidasi.