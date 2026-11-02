# Dokumentasi Proyek — Nahwoo

**Mulai diberlakukan:** 2026-11-02  
**Repo:** `beebima/nahwoo`  
**Tujuan:** Riwayat pengembangan dan trial/error menjadi milik repositori, bukan bergantung pada ingatan percakapan.

## Urutan bacaan saat membuka chat baru atau membuat versi

1. **`DEVELOPMENT_LEDGER.md`** — status yang benar-benar terverifikasi, versi sumber, keputusan, pekerjaan berikutnya.
2. **`BUG_REGISTER.md`** — bug lama, tanda, penyebab yang diketahui, solusi, status, dan langkah pencegahan regresi.
3. **`RELEASE_SOP.md`** — aturan wajib untuk setiap perubahan, ZIP, commit GitHub, build, pengujian, rollback, dan catatan error.
4. **`ALHIKAM_LESSONS.md`** — pelajaran teknis lintas aplikasi dari enam note Al-Hikam, **bukan** dokumen status Al-Hikam terkini.
5. **`releases/V0.1.8.8_BASELINE.md`** — snapshot terakhir Nahwoo yang diperiksa saat SOP dibuat.
6. **`releases/TEMPLATE.md`** — wajib digandakan sebagai `releases/Vx.y.z.md` untuk setiap rilis berikutnya.

## Prinsip bukti

Label status selalu terpisah: `TERENCANA` → `KODE SELESAI` → `SINTAKS/UNIT QA LULUS` → `GITHUB COMMIT TERVERIFIKASI` → `GITHUB ACTIONS HIJAU` → `APK TERPASANG & DIUJI` → `PLAY INTERNAL/TERTUTUP TERKONFIRMASI`. Jangan melompati status.

Dokumen lama **tidak dihapus** ketika ada revisi. Tambahkan koreksi dengan tanggal dan link commit, pertahankan kronologi. Bila bukti tidak tersedia: tulis **BELUM DIVERIFIKASI**, bukan menebak.

**Keamanan:** Jangan pernah menyimpan API key, Firebase service-account JSON, token OAuth, purchase token, keystore, signing password, identitas penguji, atau data pengguna pribadi dalam repo, ZIP publik, log, dan screenshot. File Al-Hikam asli #note1–#note6 adalah referensi terpisah dan **tidak dipublikasikan utuh di repositori Nahwoo**.