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

| N-016 | Tanda `**` kode Bold tampil mentah dalam kartu **Tiga Keluarga Kata**, terlihat di Android (2 Nov 2026) | Akar terkonfirmasi: teks sumber mencampur Markdown `**...**` dengan rich-text runs; pembuka/penutup `**` dapat berada di run berbeda. `nwSegments` lama hanya membaca `marks` per-run dan tidak mengenali delimiter Markdown lintas run. Ditemukan juga di Level 02, 16, 19, 23. | V0.1.8.9: parser inline menangani `**bold**`, `*italic*`, melintasi runs, mempertahankan Arab berharakat, dan melakukan HTML escaping. CI wajib menjalankan `node scripts/qa-richtext.js` sebelum build. | **PATCH DIBUAT + UNIT TEST LOKAL LULUS**; Android & GitHub Actions belum dibuktikan. Jangan tandai SELESAI sebelum APK retest. |

### N-016 — Langkah reproduksi dan pencegahan

- **Reproduksi:** buka Level 01 sublevel dengan bagian `Tiga Keluarga Kata`, lihat quote berawalan _Sebelum sibuk dengan harakat akhir…_. Pada V0.1.8.8 terlihat tanda `**` di sekitar frasa yang harus bold.
- **Penyebab:** memaksa data produksi ke potongan `segments` yang memiliki `marks` _dan_ karakter penanda Markdown; parser menganggap `**` sebagai karakter biasa. Contoh lain: `Perhatikan **` + `<b>قَالَ</b>` + `**. Di sinilah…`.
- **Yang tidak boleh diulang:** sekadar mengganti string spesifik atau menghapus semua `*` di file sumber. Cara tersebut merusak penekanan, bisa bocor lagi di level lain.
- **Solusi:** normalisasi _saat render_ berdasarkan seluruh teks pada satu blok, kemudian terapkan gaya asli pada masing-masing run. Test setiap block/soal untuk `**` mentah dan pastikan renderer menggunakan `<strong>/<em>` secara aman.
- **Bukti:** screenshot Android Gus 2026-11-02; unit test renderer lokal. Bukti APK final masih menunggu.
### N-017 — Nama artifact APK tertinggal di versi lama (2026-11-02)

- **Gejala:** GitHub Actions untuk commit V0.1.8.9 berhasil, tetapi artifact terunggah masih bernama `nahwoo-v0.1.3-debug-apk`.
- **Akar masalah:** nama artifact di `.github/workflows/android-debug.yml` ditulis statis pada versi awal; tidak mengikuti `versionName` Gradle.
- **Solusi:** baca `versionName` dari `app/build.gradle` setelah build, gunakan output langkah tersebut untuk nama artifact. Perubahan CI-only **tidak menaikkan versi APK**.
- **Tes:** Actions build berikutnya harus menghasilkan label `nahwoo-v0.1.8.9-debug-apk`. Status sementara **PATCH DIBUAT / PERLU VERIFIKASI CI**.
- **Jangan diulang:** jangan mengunci nama APK debug/ZIP/artifact dengan angka versi statis; ambil dari sumber Gradle yang terverifikasi.


## N-018 — Tinggi Kartu Mufradat Beranda Berubah Saat Rotasi (2026-11-02)

- **Keluhan:** kartu Mufradat yang disejajarkan dengan Lanjut Belajar + Lisensi tampak naik-turun saat kata atau contoh kalimat panjang.
- **Penyebab teknis:** versi sebelumnya masih memiliki aturan `height:auto` dan ukuran font statis besar, sehingga konten Arab/terjemahan memengaruhi tinggi grid. Tidak ada transisi dua tahap; isi ditukar langsung.
- **Solusi V0.1.8.10:** tinggi pasangan kartu dikunci dari tinggi kolom kiri pada saat pengukuran Beranda, **bukan** dari panjang kata. Ukuran 5 jenis teks dalam kartu disesuaikan bertahap agar muat. Saat Ganti/rotasi, konten fade-out lalu fade-in tanpa animasi dimensi kartu. Tombol simpan tidak membuat ulang Beranda.
- **Tipografi:** hanya teks dalam kartu Beranda yang disesuaikan; ukuran font reader pengguna dan isi Kamus Mini tidak disentuh.
- **Tanda baca:** buang tanda titik hanya di akhir contoh Arab/Indonesia dalam kartu Beranda. Sumber bank, terjemahan di Kamus Mini, dan tanda baca internal tetap dipertahankan.
- **Regresi wajib:** 30 kata pendek/panjang berurutan pada layar 320/360/390 px; periksa tinggi kartu sama sebelum/sesudah, posisi grid tidak berubah, bintang & Ganti, rotasi 60 detik, pergantian tab, mode gelap, reduced-motion, dan font ekstrem.
- **Status:** SOURCE PATCH + unit syntax/dot check; tes nyata Android belum dilakukan. **Jangan tandai selesai tanpa APK diperiksa.**

**N-018 QA otomatis:** `scripts/qa-home-vocab.js` memeriksa kontrak frame, resize teks, fade transition, aksesibilitas reduced-motion, dan penghilangan titik akhir. Dijalankan di GitHub Actions sebelum build. Tes ukuran nyata dan kelancaran animasi di APK tetap manual.

### N-019 — Target 7.200 belum mempunyai seluruh berkas sumber (2 November 2026)

- **Gejala:** penomoran checkpoint sudah mencapai VOC-07200, tetapi ZIP RUN 01–02 dan RUN 04–07 tidak tersedia pada sesi ini. Compiler kit yang dilampirkan bukan 7.000 data.
- **Tindakan:** injeksikan hanya RUN 03 (1.000) + RUN 08 checkpoint (200), pertahankan 50 contoh yang telah ada. Terdapat satu pasangan lema dan arti duplikat; indeks otomatis dedup menjadi perkiraan 1.249 mufradat aktif.
- **Larangan:** jangan menampilkan angka 7.200 sebagai jumlah entri aktif, jangan mengarang 6.000 entri yang berkasnya tidak tersedia.
- **Klasifikasi:** RUN 03 hanya menyimpan jenis kata umum, RUN 08 menyimpan subjenis spesifik. Subjenis RUN 03 tidak boleh ditebak tanpa review.
- **Tanda baca:** titik terminal contoh Arab dan terjemahan disembunyikan dalam tampilan Beranda **dan Kamus Mini**; berkas sumber tetap utuh.
- **Tes wajib:** file 12 bagian, jumlah 1.200, ID unik, bank awal tidak hilang, pencarian Arab/Indonesia hanya kepala kata dan arti, rotasi kartu setiap menit, frame tetap, CI & build, tinjauan guru.
- **Status:** injeksi parsial untuk pengujian, seluruh konten DRAFT_REVIEW; pemeriksaan ilmiah belum dilakukan.

### N-020 — Materi V4 dengan schema baru dapat tampil kosong (2026-11-02)
- **Sumber:** NAHWOO_V4_LEVEL_01-08_KOMPILASI_LENGKAP; blok V4 berbentuk `{type,text}`, renderer lama membutuhkan `{type,segments:[{text,marks}]}` untuk BODY/SUBHEADING/QUOTE.
- **Pencegahan:** converter ke schema runtime dan `scripts/qa-v4-level01-08.js` memeriksa semua 80 sublevel dan 1.600 soal.
- **Status:** patch dibuat; uji browser/Android setelah build tetap diperlukan.

### N-021 — Jawaban tersimpan salah setelah soal Level 01–08 diganti (2026-11-02)
- **Gejala potensial:** `localStorage` lama tetap menyimpan jawaban bernomor opsi untuk soal lama.
- **Solusi:** namespace jawaban V4 `nahwoo_eval_v4_01812` khusus Level 01–08; data/progres level lain tidak dihapus.
- **Status:** patch + QA source; perlu uji upgrade Android nyata.

### N-022 — Quick Check Level 07–08 tanpa jawaban di sumber (2026-11-02)
- **Temuan:** seluruh 20 Quick Check pada Level 07–08 hanya memiliki pertanyaan, tidak punya kolom answer/reason.
- **Tindakan:** tampilkan pertanyaan saja, jangan mengarang pembahasannya. Level 01–06 memakai feedback persis dari sumber.
- **Status:** batasan sumber, terbuka untuk review guru.

### N-023 — Paket V4 belum lolos telaah ahli nahwu (2026-11-02)
- **Temuan:** QA sumber menilai struktur, ID, kunci, dan editorial; bukan audit independen semua contoh Arab.
- **Tindakan:** rilis berlabel sumber Editorial/DRAFT; validasi guru sebelum klaim keilmuan atau publikasi final.
- **Status:** editorial terbuka.

## N-024 — Kartu Smart Reader disimpulkan dari urutan seksi (2026-11-02)

- **Gejala:** Level 01–08 V4 berisi 12–16 seksi tergantung level, sedangkan renderer V0.1.8.12 mengaktifkan kartu hanya untuk tepat 13 seksi. Pada level lain isi menjadi hampir semua narasi polos; pada 13 seksi warna bisa salah karena posisi tidak selalu menjelaskan fungsi konten.
- **Akar masalah terverifikasi:** `complete13?j:-1` dan pemetaan `{1:'target',2:'example',3:'breakdown',6:'compare',8:'practice',10:'warning'}` di `nwSemanticSectionMarkup`.
- **Perbaikan:** pemetaan heading V4 yang eksplisit dari paket sumber + default naratif terbuka; Target Pembelajaran diambil dari `competency` asli setiap sublevel (tidak direkayasa); warna contoh/analisis/latihan/peringatan/inti sesuai master prompt.
- **Perlindungan isi:** integritas sumber V4 dibuktikan oleh manifest fingerprint untuk materi, soal dan kunci/penjelasan; jangan mengubah materi demi mempercantik UI.
- **QA:** tes template mobile statis 320/360/390px lulus tanpa overflow; CI harus lulus source parity, semantic-reader gate dan build Android. Testing Android langsung masih wajib.
- **Status:** SOURCE PATCH / QA statis, **belum lulus Android device** hingga diuji di WebView asli.

## N-025 — Jawaban “Cek Cepat” tampil sebelum dicoba (2026-11-02)

- **Gejala:** sejumlah konten V4 menyimpan pertanyaan dan “Jawaban dan alasan” sebagai dua blok BODY berurutan dalam seksi “Cek Cepat”. Pembaca langsung melihat jawaban tanpa kesempatan mencoba.
- **Solusi:** jawabannya dibungkus `<details>` yang bisa dibuka pengguna; teks sumber tetap persis sama dan urutannya terjaga.
- **Fallback:** jika tidak ada penanda jawaban eksplisit, renderer tidak menyembunyikan atau memindahkan paragraf lain secara spekulatif.
- **Status:** patch dibuat / butuh verifikasi Android.

### N-026 — Pergantian konten V4 Level 09–16 tanpa merusak progres (2026-11-02)

- **Akar risiko:** materi/soal lama mempunyai schema evaluator berbeda dengan JSON V4 dan opsi teks baru tidak bisa langsung dibaca renderer lawas
- **Perbaikan:** konversi sumber `material_blocks[].text` menjadi `blocks[].segments`, `ARABIC_TEXT` ke `.arabic`, `options[].text` ke `.segments`, kunci terpisah, judul dan kompetensi dari sumber; namespace evaluasi Level 09–16 terpisah
- **Jangan diulang:** dilarang menyalin mentah JSON V4 sebagai `NW_LEVEL_DATA`; wajib tes 20 soal + enam opsi + dua hint per sublevel, sumber penuh dan kelas font Arab
- **Status:** data diproses, perlu bukti GitHub CI dan tes APK nyata

### N-027 — Format file kunci privat antarlevel tidak seragam (2026-11-02)

- **Gejala:** `KUNCI_INTERNAL.json` Level 09–15 menggunakan `answers[]`, tetapi Level 16 menggunakan `sublevels[].questions[]`
- **Solusi:** baca kedua format tanpa mengarang kunci; cocokan semua 1.600 ID soal dan jawaban enam pilihan, jangan menyisipkan kunci dalam JS publik
- **Tes:** QA parity dan tidak ada `correct_index`/`explanation` di JS publik

### N-028 — Risiko kartu target ganda & pemetaan warna berdasarkan urutan (2026-11-02)

- **Akar risiko:** Level 13–16 sudah memiliki subjudul target belajar di sumber; menambahkan kartu target global lagi akan menggandakan isi. Judul seksi antarlevel tidak mempunyai posisi tetap
- **Solusi:** klasifikasi berdasarkan daftar heading berpasangan nomor level, bukan indeks. Kartu target sumber di-render in situ; target dari metadata kompetensi hanya ditampilkan bila tidak ada judul target. Narasi tetap terbuka
- **Tes:** preview Level 09–S01, sampel Level 13/15/16, dark mode, Arab inline, tinggi baris, dan scrolling pada Android