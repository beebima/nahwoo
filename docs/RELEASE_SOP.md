# SOP Wajib Setiap Versi Nahwoo / Sejuta Santri Apps

**Efektif:** 2026-11-02. Gunakan bersama Development Ledger, Bug Register, dan lessons learned Al-Hikam.

## A. Sebelum mulai

1. Baca `docs/README.md`, `docs/DEVELOPMENT_LEDGER.md`, `docs/BUG_REGISTER.md` dan catatan rilis terakhir.
2. Periksa `main` terbaru, `versionCode`, `versionName`, daftar berkas konten dan status build. **Jangan menggunakan ZIP lama hanya karena namanya mirip.**
3. Tetapkan tujuan perubahan, ruang lingkup, batasan yang harus dipertahankan, dan checklist reproduksi bug yang relevan.
4. Catat sumber perubahan, versi dataset/kualitas editorial, beserta jumlah level/sublevel/soal/bank mufradat. Jangan mengarang hasil review guru.

## B. Saat membuat paket

- Satu perubahan logis per versi; jika perubahan besar, lakukan checkpoint dan QA untuk tiap fase.
- Jangan mengubah Android `applicationId`, Play Console, OAuth, AdMob IDs, Billing product, signing, dan data safety tanpa kebutuhan jelas dan verifikasi.
- Tambahkan rilis **`docs/releases/Vx.y.z.md`** dari template serta update bug log dan development ledger.
- Sertakan **salinan catatan** dalam paket ZIP source lengkap dengan source aplikasi terbaru. Pertahankan arsip catatan lama di repo.
- Selalu buat **GitHub Summary & Description siap klik Copy**, dan simpan teks yang sama pada paket (`GITHUB_RELEASE.md`).
- Jika update hanya dokumentasi, **tidak perlu menaikkan `versionCode/versionName` aplikasi**; gunakan commit docs-only.
- Untuk versi kode aplikasi, konsistensikan versi `app/build.gradle`, label About, changelog, dan nama ZIP. Jika Play Console pernah menerima `versionCode`, jangan pakai ulang.

## C. Checklist QA berlapis — status tidak boleh dicampur

| Lapisan | Bukti | Status default sampai ada bukti |
|---|---|---|
| ZIP | file lengkap, path benar, CRC/susunan sukses | BELUM DIUJI |
| Sintaks data/code | valid JSON/XML/JS, build graph, ID key/Q cocok | BELUM DIUJI |
| UI browser | screenshot + uji 320/360/390px, dark mode/font ekstrem | BELUM DIUJI |
| GitHub commit | HEAD `main`, SHA commit, diff/berkas lengkap | BELUM DIUJI |
| GitHub Actions | URL run hijau, artifact APK/AAB benar | BELUM DIUJI |
| APK di Android | instalasi nyata, cold launch/gesture/back/status bar/banner | BELUM DIUJI |
| Pembayaran/iklan | uji test ads, hak beli, refund/revoke, restore sesuai fitur nyata | BELUM DIUJI |
| Play Console | status review/akses tester berdasarkan screenshot portal | BELUM DIUJI |

Tidak boleh menyatakan "sukses end-to-end" hanya karena syntax/ZIP/GitHub commit lolos. Pisahkan **patch dibuat** vs **test browser** vs **build** vs **tes perangkat**.

## D. Tes regresi minimum setiap revisi

- Cold start → splash → tutorial atau Beranda tanpa error.
- Back/gesture dari beberapa halaman; keluar dua kali hanya di Beranda.
- Free/Freemium/Premium: banner tidak menutupi status bar; warna bar tepat; gesture bar tidak punya spacer ganda; upgrade tidak menyisakan ruang kosong.
- 320/360/390px, mode gelap, ukuran font min/max, Arab panjang, scroll, tab switching berulang.
- Smart Reader tag dan 20 soal: 6 opsi, hint 1/2, jawaban disembunyikan sebelum submit, pembahasan setelah submit, progres tidak hilang.
- Search Kamus Mini dalam bahasa Arab dengan/tanpa harakat dan arti Indonesia; pastikan teks contoh **tidak ikut search**.
- Mufradat Beranda: data bank sama, putar 1 menit, Ganti/Simpan, tidak menyebabkan lompatan layout; ulangi tes setelah 10.000 entri.
- Koneksi offline, update aplikasi tanpa hilang local data, file izin/lisensi, serta Android edge-to-edge.

## E. Catatan wajib pada setiap rilis

1. Versi sebelum → sesudah, branch, commit, waktu, sumber baseline dan versi data.
2. Ringkasan fitur/perubahan (termasuk yang **tidak** berubah).
3. Bug baru, error lengkap yang disanitasi, diagnosis, akar masalah, percobaan **yang gagal**, perubahan yang berhasil.
4. Hasil tes berbukti per lapisan, plus apa yang **belum** diuji.
5. Risiko regresi, daftar masalah terbuka, rollback commit/file yang aman.
6. Next action paling dekat dan format kebutuhan data berikutnya.
7. Perubahan proteksi keamanan/biaya/SDK (kalau ada) dan dampaknya.

## F. Alur GitHub

- Buat commit versi dengan source + data + catatan rilis dalam satu tree jika mungkin; cek tidak ada symlink/binary/secret tak sengaja.
- Setelah update ref, fetch ulang HEAD/versi/file relevan untuk memverifikasi **bukan hanya berhasil membuat commit object**.
- Bila repo berubah di tengah proses, berhenti dan rekonsiliasi dengan HEAD terbaru. Jangan force push tanpa izin.
- Simpan SHA commit, URL workflow, status dan artifact pada release note setelah bukti didapat. Jangan menulis placeholder sebagai sukses.
- Jangan pernah menaruh **enam NOTE Al-Hikam asli** dalam repo Nahwoo publik; gunakan ringkasan praktik generik tanpa token/ID rahasia.

## G. Aturan penggunaan catatan saat berpindah chat

Instruksi awal: "Baca docs/README.md, docs/DEVELOPMENT_LEDGER.md, docs/BUG_REGISTER.md, docs/RELEASE_SOP.md, dan rilis terakhir. Bandingkan dengan branch GitHub, temukan masalah terbuka sebelum coding. Jangan ulang eksperimen yang sudah gagal kecuali ada bukti kondisi berubah. Perbarui catatan dan Summary/Description bersama setiap ZIP dan commit."

## H. Pencegahan kebocoran kode Markdown di materi (N-016, wajib semua aplikasi)

1. Semua teks yang terlihat user harus melalui komponen/renderer rich-text **aman**, bukan menampilkan kode Markdown mentah sebagai plain text.
2. Konversi `**bold**`, `*italic*`, dan style `segments[].marks` **sebelum** HTML dirender; delimiter dapat melewati beberapa runs, termasuk teks Arab. Pertahankan Arab RTL, harakat, dan font.
3. Uji 24 level + soal, bukan hanya screenshot satu quote; jalankan `node scripts/qa-richtext.js` pada setiap commit kode maupun konten.
4. Lakukan HTML escaping untuk teks materi dan input; jangan mengganti Markdown dengan `innerHTML` mentah dari sumber.
5. Tambahkan tes `**bold**` di satu run, `**...**` lintas runs, Arab dengan mark bold, `*italic*`, string berisi `<script>`, dan penanda tidak berpasangan.
6. Build GitHub Actions wajib gagal lebih awal bila tes rich-text gagal. Android tetap harus di-review langsung setelah build.
7. Bila sumber berisi delimiter tidak berpasangan, catat sebagai QA editorial; jangan diam-diam merombak kaidah atau terjemahan Arab.
## I. Penamaan artifact Android otomatis (N-017)

- Nama artifact GitHub Actions **harus diambil dari `app/build.gradle` `versionName`**, bukan string versi statis di workflow.
- Setiap versi cek kesesuaian label artifact, `versionCode`, `versionName`, dan commit HEAD; label lama tidak otomatis berarti binari lama.
- Bedakan keberhasilan *upload artifact* dari keberhasilan install APK dan perilaku pada perangkat.


## J. Tes wajib kartu Beranda berukuran tetap (N-018)

- Rotasi mufradat **tidak boleh mengubah tinggi kartu** ataupun mendorong tombol grid ke bawah. Ambil tinggi acuan dari Lanjut Belajar + Lisensi; jangan mengukur tinggi dari jumlah baris mufradat.
- Teks Arab, arti, jenis kata, contoh Arab, dan terjemahannya wajib menyesuaikan ukuran di dalam kartu; lakukan tes frasa pendek dan panjang pada 320/360/390 px serta variasi tinggi layar dan ukuran font pengguna.
- Transisi Ganti/manual maupun rotasi otomatis harus memudar lembut; kartu luar tetap diam. Hormati `prefers-reduced-motion`.
- Buang titik **hanya pada tampilan akhir contoh kalimat** Beranda, jangan modifikasi bank sumber/kamus dan jangan hapus titik internal.
- Periksa tidak ada pergeseran saat bintang disentuh atau setelah kembali dari menu lain; ukur tinggi elemen sebelum/sesudah pada browser/perangkat.

- Gate CI khusus N-018: jalankan `node scripts/qa-home-vocab.js` sebelum Gradle. Gate ini **bukan** pengganti tes tampilan Android.

## K. Aturan injeksi bank mufradat parsial (N-019)

- Validasi jumlah **rekaman yang benar-benar dibaca** dari berkas sumber; rentang nomor VOC atau klaim jumlah dalam nama ZIP bukan bukti jumlah aktif.
- Bila sumber baru tidak lengkap, gabungkan hanya yang valid dengan bank saat ini, laporkan ID hilang dan jumlah unik setelah deduplikasi, serta tandai DRAFT_REVIEW.
- Pelabelan subjenis harus berasal dari sumber, **bukan** menebak dari bentuk kata.
- Jangan hapus 50 entri lama atau reset bookmark. Contoh kalimat tetap tampil tanpa titik terakhir baik pada Beranda maupun Kamus Mini.
- Jalankan tes otomatis `node scripts/qa-mufradat-partial.js` serta QA perangkat untuk ukuran kartu dan pencarian; lakukan backup sumber dan catat commit.

## L. SOP wajib pergantian materi dan soal V4 (N-020–N-023)
- Jangan menyalin JSON V4 mentah langsung ke `window.NW_LEVEL_DATA`; konversi `material_blocks.text` ke `blocks.segments` dan `questions.options.text` ke `options.segments` agar pembaca/opsi tampil.
- Validasi 10 sublevel × 20 soal × 6 opsi × 2 hint per level, ID unik, kunci 1:1 dan indeks jawaban sah, tanpa kunci di JS publik.
- Untuk pembaruan soal, namespace state jawaban harus baru hanya pada level yang diganti, sedangkan progres dan level lain jangan direset.
- Quick Check tanpa jawaban sumber hanya boleh menampilkan pertanyaan, jangan membuat umpan balik rekaan.
- Di GitHub Actions, wajib jalankan `node scripts/qa-v4-level01-08.js` sebelum Gradle; QA keilmuan dan perangkat Android tetap terpisah.
- Pertahankan file level 09–24 dan seluruh Mufradat/AdMob tanpa perubahan di diff.
