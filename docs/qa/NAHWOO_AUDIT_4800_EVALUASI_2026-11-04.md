# NAHWOO — Audit evaluasi 4.800 soal sublevel
**Tanggal:** 4 November 2026 · **Basis:** `main`, V0.1.8.26 (Level 01–24)  
**Status:** SELESAI untuk saringan konsistensi berbasis data; **BELUM LOLOS validasi akademik menyeluruh**.

## Cakupan yang benar-benar diperiksa
- **24 level × 10 sublevel × 20 soal = 4.800**, terdiri dari 2.880 pengharakatan, 960 terjemahan, dan 960 penalaran/pemahaman.
- Seluruh soal diperiksa secara terprogram untuk identitas soal/kunci, enam opsi berbeda, kecocokan indeks jawaban dengan kutipan pembahasan, bentuk huruf dasar Arab pada soal pengharakatan, dan keberadaan sasaran dalam konteks Arab.
- Seluruh 960 soal terjemahan dibandingkan dengan kutipan terjemahan dalam pembahasan, serta 960 penalaran disaring untuk ketiadaan pembahasan yang terlalu pendek.
- Pemeriksaan menitikberatkan metode **ciri kata → wazan → fungsi dan ‘amil → i‘rab → harakat → uji model**, sesuai metode yang sudah dicatat dalam `V0.1.8.26.md`. **Scan buku asli Muhammad Abdul Fatah tidak tersedia dalam sesi audit ini** untuk pembandingan halaman demi halaman.

## Hasil saringan
| Jenis | Jumlah | Temuan |
|---|---:|---|
| Pengharakatan (`choose_vowelled`) | 2.880 | **2.880 kunci cocok** dengan kutipan bacaan di penjelasan sebelum pembetulan; bentuk huruf sasaran juga cocok. Hanya **dua** pembahasan yang kini menyebut sebab gramatikal spesifik setelah perbaikan; **2.878** masih memakai kalimat umum/template. |
| Terjemahan (`choose_translation`) | 960 | **960/960** opsi benar menurut indeks cocok *secara teks* dengan kutipan terjemahan pada pembahasan; belum membuktikan terjemahan substantif benar. |
| Penalaran (`reasoning`) | 960 | **960** memiliki pembahasan berisi setidaknya 40 karakter; belum memvalidasi tiap inferensi dan keberterimaan opsi alternatif. |
| Kunci tak ditemukan / opsi persis sama / kutipan berbeda / huruf dasar sasaran berbeda | 4.800 disaring | **0 kandidat** pada saringan ini. |
| Sasaran soal melompati batas tanda baca | 4.800 disaring | **2 kandidat**, keduanya diperbaiki pada Level 22 Sublevel 05. |

## Perbaikan yang sudah diterapkan ke `main`
- `L22-S05-Q09` dan `L22-S05-Q11`: pada teks **مَنْ حَضَرَ الِاجْتِمَاعَ؟ الْمُدِيرُ** ditambahkan kembali tanda tanya ke fokus dan enam pilihan; soal tidak lagi menganggap `الاجتماع المدير` sebagai satu frasa berurutan.
- Kedua petunjuk dan pembahasan kunci dijelaskan menurut *maf‘ul bih* (`الِاجْتِمَاعَ`) dan jawaban yang ditaksir (`الْمُدِيرُ`) berstatus marfu‘. **Nomor soal, opsi A–F, indeks benar, dan progres tidak diubah.**
- Dua soal diperiksa ulang setelah commit, termasuk kesamaan opsi kunci dengan kutipan baru: **lulus cek setempat**.
- Skrip baru `scripts/qa-evaluasi-akademik.js` memungkinkan saringan dan daftar seluruh 2.878 pembahasan generik direproduksi. Ketika dijalankan dengan Node dari root repo, hasil disimpan ke `reports/qa-evaluasi-sublevel-4800.json`. **Belum ada bukti eksekusi skrip baru oleh GitHub Actions.**

## Masalah substansial yang belum boleh ditutup
1. **2.878 pembahasan soal harakat belum menjelaskan sebab i‘rab/sharaf untuk butirnya**, meskipun indeks jawaban cocok dengan teks rujukan. Ini prioritas perbaikan akademik utama. Menambahkan rumus umum secara otomatis tidak membuktikan alasan kaidah tiap soal.
2. **Belum ada pemeriksaan pakar per butir** terhadap benar-salah tata bahasa 4.800 jawaban, ambiguitas alternatif yang sama-sama sah, penerjemahan makna, dan konteks contoh. Pemeriksaan pola tidak menggantikan tashih nahwu/sharaf.
3. **Belum ada validasi langsung seluruh 4.800 butir ke scan asli buku rujukan** pada sesi ini; dokumen rilis hanya menyatakan pendekatan/metode yang diadaptasi.
4. **Pengacakan opsi jawaban belum ada pada tampilan evaluasi:** source `index.html` mengacak *urutan pertanyaan* melalui `nwEvalNewOrder`, tetapi `nwEvalButtons` tetap menampilkan opsi A–F dengan urutan sumber. Pada empat sampel level (1, 12, 22, 24), indeks kunci berputar 0–5 secara berurutan di tiap sublevel; evaluasi kerentanan tebak pola disarankan sebelum rilis, tanpa merusak riwayat jawaban.
5. **Belum ada pengujian build/perangkat setelah dua perubahan Level 22.**

## Status akhir dan keputusan rilis
- **PASS:** pemeriksaan statis/tekstual 4.800, koherensi rujukan kunci, dan perbaikan dua soal pemisahan kalimat.
- **HOLD_FOR_REVIEW:** ketepatan gramatikal setiap jawaban, 2.878 penjelasan yang masih generik, potensi jawaban alternatif, kelayakan pedagogis, pembandingan buku asli, uji build dan perangkat.
- **Jangan menyebut 4.800 soal sudah tervalidasi akademik, atau memulai audit Bank 24.000 sebagai pengganti penyelesaian temuan ini.** Bank 24.000 adalah pekerjaan terpisah (poin 2) dan boleh dijalankan ketika diminta.

## Jejak reproduksi
```bash
node scripts/qa-evaluasi-akademik.js
```
Skrip mengembalikan kode error bila terdeteksi persoalan konsistensi kritis; temuan editorial nonblokir tetap dicatat dalam JSON. Laporan ini berdasarkan pemeriksaan terprogram langsung via GitHub Connector ditambah pemeriksaan manual kasus Level 22, **bukan** klaim skrip baru sudah berjalan di CI.
