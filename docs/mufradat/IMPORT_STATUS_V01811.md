# Nahwoo — Injeksi mufradat parsial

Target pembahasan: **7.200**. Data sumber asli yang tersedia dan tervalidasi: **1.200** (RUN03 1.000, RUN08 200). Data live sebelumnya: **50**, dipertahankan. Total mentah terduga 1.250 dan indeks unik setelah deduplikasi normalized Arabic + arti: **1.249**. Tidak ada pengisian fiktif untuk RUN yang belum ada.

- RUN01–02 (kecuali 50 sampel yang sudah aktif), RUN04–07 tidak ditemukan; tidak boleh mengklaim 7.200 telah diinjeksikan.
- RUN03 menggunakan klasifikasi umum 1.000 kata; subjenis belum tersedia. RUN08 sudah membawa `word_subtype` untuk 200 kata. Tidak ditebak/dikarang.
- Seluruh data draf, perlu review leksikal dan contoh kalimat.
- Pencarian tetap hanya mencari kata Arab dan arti Indonesia, bukan contoh.
- TITIK di akhir contoh Arab & terjemahan dihilangkan dalam *lapisan tampilan* saja, sumber tetap utuh untuk audit.
- Kartu Beranda otomatis mengambil kumpulan indeks yang sama dengan Kamus Mini. Rotasi setiap menit, ukuran frame tetap.
- Source: lihat `IMPORT_QA.json` dan ZIP asli.

## Checklist QA manual

1. Kamus Mini menampilkan ~1.249 entri unik.
2. Cari `عِفَّةٌ`/`عفة` dan `طِرْسٌ`/`طرس` serta arti Indonesia.
3. Coba teks contoh panjang/pendek; tidak ada titik di akhir pada Kamus Mini & Beranda.
4. Pastikan hasil tidak muncul hanya karena kata terdapat di contoh.
5. Tekan bintang & Ganti, tunggu >60 detik, pindah tab dan kembali; kartu tidak melar.
6. Periksa mode gelap, scroll dan ukuran font.
7. Jangan klaim APK/UI lolos bila baru source/CI yang diperiksa.