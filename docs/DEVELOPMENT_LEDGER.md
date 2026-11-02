# NAHWOO — Development Ledger / Sumber Kebenaran Proyek

**Dibuat:** 2026-11-02. **Status:** dokumentasi baseline historis, bukan hasil build Android baru.

## 1. Baseline yang sudah diverifikasi lewat repository

- Repository: `beebima/nahwoo`, branch `main`.
- HEAD yang diperiksa pada 2026-11-02: `2d645df7f95f507d46b3f11aa5d6850a710b99c8` (perbaikan rotasi mufradat Beranda).
- `app/build.gradle` pada HEAD tersebut: `versionName '0.1.8.8'`, `versionCode 15`.
- Perubahan dokumentasi ini **tidak menaikkan versi APK**, karena tidak mengubah kode aplikasi.
- **Belum ada hasil GitHub Actions/APK/Play Console terbaru yang diperiksa bersamaan dengan penulisan dokumen ini.** Status build dan perangkat tidak otomatis dianggap sukses.

## 2. Fitur/keputusan yang tidak boleh berubah tanpa permintaan

- Materi lengkap: 24 level × 10 sublevel, 240 sublevel; evaluasi sublevel 20 soal A–F = 4.800 soal. Bank latihan utama 24.000 soal adalah **target terpisah**, bukan bagian otomatis dari 4.800 soal ini.
- Smart Reader: semantik `MAIN_HEADING`, `SUBHEADING`, `BODY`, `ARABIC_TEXT`, `QUOTE`, serta blok pedagogis legacy; teks Arab RTL dan harakat, bold/italic selektif.
- Enam pengaturan font independen dan persistent: Sistem 16, Latin 16, Arab 45, Judul Utama 28, Subjudul 21, Quote 23 px (default).
- Beranda: tombol cepat **Kamus Mini** menggantikan tombol cepat Pengaturan, tetapi **tab Pengaturan di navigasi bawah tetap ada**.
- Kamus Mini: pencarian Arab/Indonesia hanya di kepala kosakata, arti/alias; **bukan di contoh kalimat ataupun terjemahan contohnya**.
- Mufradat Hari Ini: memakai **bank yang sama** dengan Kamus Mini dan rotasi setiap pergantian menit (60 detik), tombol Ganti/Simpan. Perubahan isi kartu tidak boleh menyebabkan perubahan ukuran/overflow Beranda.
- Data bank yang dinyatakan aktif pada riwayat V0.1.8.8: 50 mufradat contoh **DRAFT REVIEW**, bukan bank 10.000 final. Cakupan seluruh bentuk materi/soal belum lengkap.
- Tutorial: smooth, kontrol lain tidak aktif saat tutorial berjalan, dan setelah splash langsung tutorial tanpa jeda. Urutan tutorial mengikuti perubahan grid Beranda.
- Back/gesture Back: navigasi mundur pada halaman lain; khusus Beranda konfirmasi dua kali Back untuk keluar. Jangan menganggap satu kali Back pada tab selain Beranda harus keluar.
- Status bar Android tidak boleh tertutupi oleh banner/header. Navigation gesture sistem tidak mendapat spacer ekstra. Perlu pengujian nyata Free/Freemium/Premium.
- Paket Android memakai GitHub Actions; source ZIP ≠ APK; artifact APK harus diambil dari Actions setelah run hijau.

## 3. Baseline konten & data (status tidak dibesar-besarkan)

| Area | Yang tersedia menurut riwayat / source | Status mutu | Pekerjaan berikutnya |
|---|---|---|---|
| Level 01–24 | 240 sublevel injeksi | Paket **Draft Review**, review keilmuan belum final | Audit guru, contoh/kaidah/harakat |
| Evaluasi sublevel | 4.800 soal × 6 opsi, 2 hint/soal | QA struktural; beberapa pengulangan stimulus/hint pernah tercatat | Review pedagogis, anti-pengulangan |
| Bank 10.000 mufradat | 50 entri contoh aktif pada riwayat V0.1.8.8 | Draft Review | Produksi, kurasi, cakupan setiap kata materi/soal |
| Kamus Mini | Search Arab–Indonesia, contoh display saja | Uji browser sebelumnya; hasil APK terbaru belum ditetapkan | Tes performa 10.000 entri, di HP |
| Mufradat Beranda | Terhubung ke bank dan timer 60 detik sejak commit baseline | Implementasi/tes statis; timer Android belum dibuktikan | Uji nyata 1–3 menit, tombol Ganti/Simpan |
| AdMob dan lisensi | UI/placeholder dan rencana integrasi | Keberhasilan backend/Play Billing Nahwoo **belum dibuktikan di dokumen ini** | Uji per lisensi, test ads/test billing |
| GitHub Actions | Workflow penghasil APK di repo | Hasil terbaru **belum diperiksa saat dokumen ini disusun** | Cek log build & artifacts |

## 4. Aturan lanjut proyek

1. Sebelum mengubah kode, periksa `HEAD`, `versionName`, `versionCode`, APK/rilis terakhir yang **terverifikasi** dan log masalah terbuka.
2. Catat permintaan Gus, cakupan perubahan, hal yang **tidak boleh diubah**, dan rencana regresi.
3. Setiap output: source ZIP lengkap, commit GitHub bila diminta, Summary dan Description **siap klik Copy**, berkas `releases/Vx.y.z.md` serta bug log.
4. Kalau ada kegagalan, **jangan mengulang solusi yang sudah gagal** tanpa bukti penyebab berubah. Periksa `BUG_REGISTER.md`.
5. Jika fitur belum diuji di APK Android, sebut persis **BELUM DIUJI**, walaupun browser/JavaScript sudah lulus.
6. Setelah pengguna memberi screenshot/log dari HP, catat hasil nyata dalam dokumen status baru/append entri, bukan mengganti bukti lama.

## 5. Status pencatatan

Dokumen ini dibuat setelah commit V0.1.8.8; **bukan** pernyataan versi V0.1.8.9. Perubahan dokumentasi yang berdiri sendiri boleh memakai commit GitHub tanpa menaikkan angka versi app.

## 6. Rencana V0.1.8.9 — Pencegahan Raw Markdown

- **Permintaan:** screenshot 2026-11-02 memperlihatkan `**` di kartu Tiga Keluarga Kata.
- **Baseline GitHub sebelum perubahan:** `main` HEAD `b6e9ee3eb096152c42a5da980d819bacfb28be29`, versi 0.1.8.8 / code 15.
- **Target:** 0.1.8.9 / code 16, patch renderer global dan QA rich-text sebagai syarat build; jangan mengubah 24 level/soal, mufradat, lisensi, toolbar atau layout.
- **QA yang diperlukan:** unit-test renderer + scan 24 level di CI; tes aktual di Android setelah APK tersedia.
- **Rollback:** commit baseline di atas; gunakan revert commit, jangan force-push.
## Update 2026-11-02 — V0.1.8.10
- Perubahan khusus kartu Mufradat Beranda: frame tetap, ukuran isi otomatis, fade transition, contoh tanpa titik terakhir pada tampilan.
- Data bank mufradat dan Kamus Mini tidak diubah. Bug N-018 tercatat di BUG_REGISTER.
- Pastikan pengujian Android sebelum menandai rilis stabil.

## 2 November 2026 — V0.1.8.11: 1.200 mufradat parsial
- 1.000 dari RUN03 dan 200 dari RUN08; 50 data awal dipertahankan, 1.249 indeks unik diperkirakan setelah dedup.
- Belum tersedia sumber 6.000 entri dari RUN01–02/RUN04–07. Tidak boleh mengklaim sudah memuat 7.200.
- Subjenis RUN08 dipertahankan, RUN03 tetap kategori umum; status DRAFT_REVIEW.
- Pembaruan Kamus Mini, auto-playlist Beranda, dan terminal dot pada kedua tampilan; catatan N-019.

## Update 2026-11-02 — V0.1.8.12 V4 Reading-First Level 01–08
- Sumber: ZIP kompilasi lengkap V4 Level 01–08, 80 sublevel, 1.600 soal, 3.200 hint, 1.600 kunci.
- Replaced: Level 01–08 public & keys scripts; Level 09–24 (3.200 soal) untouched.
- Schema JSON V4 diadaptasi ke reader/evaluator lama; 80 judul sublevel dan 8 judul level diperbarui.
- Namespace jawaban untuk Level 01–08 baru; progres/notes/other levels tetap.
- Batasan: Quick Check L07–L08 tanpa jawaban; telaah akademik eksternal belum dilakukan.
- Bug baru N-020/N-021/N-022/N-023; QA otomatis.

## 2026-11-02 — V0.1.8.13 Premium Smart Reader
- V0.1.8.12 sudah menginjeksikan seluruh V4 Level 01–08. Data level dibiarkan utuh; QA SHA parity memastikan tidak ada materi/soal yang berubah.
- Menghapus kartu berdasarkan indeks section; map eksplisit heading aktual + 80 competency sumber; latihan cek cepat jawaban dikunci details.
- Preview Chromium 320/360/390px tidak mengalami horizontal overflow. Android fisik belum dites.
- Bug N-024/N-025, SOP & release notes diperbarui.

## 2 November 2026 — V0.1.8.14: V4 Level 09–16
- Ganti 8 level / 80 sublevel / 2.840 blok materi / 1.600 soal lengkap 9.600 opsi, 3.200 hint dan kunci privat sesuai ZIP.
- Target pembelajaran kuning tanpa duplikasi, metadata heading semantik 416 pasangan heading-level; paragraf biasa tetap terbuka, Arab terjaga.
- Namespace evaluasi 09–16 baru, progres tidak direset; Level 01–08 dan 17–24, Mufradat & AdMob dipertahankan.
- Perbedaan schema kunci Level 16 distandarkan; manifest SHA256 dan QA CI ditambahkan.
- Bug N-026 sampai N-028, lihat docs/releases/V0.1.8.14.md.
