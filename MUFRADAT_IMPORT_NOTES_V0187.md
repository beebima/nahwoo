# Kamus Mini Nahwoo — Injeksi Mufradat V0.1.8.7

- **Sumber aktif:** 50 entri JSON dalam `MUFRADAT_50_CONTOH_TERISI_DRAFT_REVIEW.json`, semuanya berstatus DRAFT_REVIEW.
- **Bukan 10.000 kata final.** Data aktif menggantikan dataset contoh 24 entri sebelumnya. Kata yang belum ada di 50 draf tidak bisa dicari di Kamus Mini.
- **Inventaris editorial:** `INVENTARIS_1683_BENTUK_DARI_MATERI_SOAL.csv` (1.683 bentuk inti) dan `INVENTARIS_SEMUA_BENTUK_ARAB_PUBLIC_24_LEVEL.csv` (1.816 bentuk total) belum didefinisikan, diperiksa sebagai lema, atau ditampilkan dalam pencarian.
- Pencarian menggunakan hanya `ar`, `forms_ar`, `meaning`, dan `aliases`, bukan `example` atau `translation`. Harakat Arab dinormalisasi saat indeks dibuat.
- Contoh Arab dan terjemahan tampil di kartu, namun tidak digunakan sebagai kata kunci.
- `VOC-00001` ... `VOC-00050` masih ID draf; belum dikunci sebagai ID akhir.
- `root`, `pattern`, dan bagian kosong lainnya tidak diisi secara mengarang.
- Folder `editorial/mufradat/source_review_v2/` memuat data dan QA asli untuk produksi berikutnya.
- Saat penggantian bank besar berikutnya, pertahankan ID lema yang telah disahkan dan pastikan seluruh kosakata materi/soal memiliki relasi ke ID tersebut.