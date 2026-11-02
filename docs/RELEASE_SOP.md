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