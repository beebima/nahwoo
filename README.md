# Nahwoo — Android V0.1.1

**Belajar Baca Kitab dari Nol** · Sejuta Santri Apps

Versi awal aplikasi Android berbasis WebView offline yang membungkus prototipe HTML Nahwoo terakhir yang disepakati. **Versi aplikasi Android 0.1.1 berbeda dari nomor versi prototipe HTML 1.0.7.**

## Cara build di GitHub (tanpa instal Android Studio)

1. Buat repository GitHub baru (misalnya `nahwoo-android`).
2. Unggah **isi folder ZIP ini ke root repository** (bukan folder pembungkusnya).
3. Buka tab **Actions** → **Build Nahwoo Android Debug APK** → **Run workflow**.
4. Setelah workflow selesai, unduh artifact `nahwoo-v0.1.1-debug-apk`.
5. Ekstrak artifact lalu instal `app-debug.apk` pada perangkat Android untuk pengujian.

Workflow juga berjalan otomatis ketika perubahan di-push ke branch `main` atau `master`.

## Ruang lingkup V0.1.1

- Android native wrapper Java + WebView dengan konten HTML tersimpan di APK.
- UI Nahwoo terbaru: Beranda fit screen, belajar, latihan, catatan, smart search, lisensi demo, dan tutorial.
- LocalStorage aktif untuk menyimpan progres dan catatan pada perangkat.
- Link eksternal dibuka melalui aplikasi browser.
- Belum ada integrasi AdMob sungguhan, Google Sign-In, Google Play Billing, Firebase, atau WhatsApp API.

## Penting sebelum produksi

- APK dari workflow adalah **debug build**, bukan release Play Store/AAB.
- Data disimpan lokal; menghapus data aplikasi dapat menghapus progres dan catatan.
- Konten belajar, soal, mufradat, dan tips dalam HTML masih berupa data demo.
- Tampilan login, lisensi, dan iklan saat ini adalah simulasi; **tidak boleh dianggap verifikasi pembayaran/akun nyata**.
- Domain web yang direncanakan: `nahwoo.sejutasantri.id`; belum disambungkan pada versi ini.
- Integrasi WhatsApp harus memakai backend/Firebase yang memverifikasi status, bukan hanya tombol HTML.

## Versi

`versionName = 0.1.1` · `versionCode = 1` · `applicationId = id.sejutasantri.nahwoo`

## GitHub release

Lihat `GITHUB_RELEASE.md` untuk ringkasan dan deskripsi siap tempel.


## V0.1.2
Ikon Android resmi, logo Tentang Aplikasi baru, navbar Free/Freemium lebih ringkas, dan status bar/notch biru.
