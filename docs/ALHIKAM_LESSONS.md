# Pelajaran Al-Hikam Digital yang Dapat Dipakai di Nahwoo

**Dihimpun 2026-11-02** dari enam berkas `#note1`–`#note6` Al-Hikam tanggal 24–27 Oktober 2026 yang tersedia dalam konteks proyek. Ini **ringkasan lintas-proyek**, bukan salinan lengkap, bukan bukti status Al-Hikam sekarang, dan **tidak boleh mengganti keputusan Nahwoo tanpa verifikasi implementasi aktual**.

## Pelajaran teknis yang relevan

1. **Beda source ZIP, build hijau, artefak APK/AAB, instal Play, hasil uji fitur, dan status review.** Keberhasilan satu tahap tidak membuktikan tahap lain. Pada Al-Hikam source ZIP pernah disangka sudah memuat AAB; padahal AAB ada di GitHub Actions → Artifacts.
2. **Pertahankan baseline kerja yang sudah diuji dan baca catatan terbaru.** Pada #note1 status Billing masih belum teruji; #note5 kemudian punya bukti pengujian transaksi tertentu; #note6 menunjukkan Code 22 telah diajukan ke peninjauan tertutup, bukan disetujui. Catatan terbaru berbukti mengoreksi catatan lama, tanpa menghapus histori.
3. **Uji tampilan Android nyata:** banner di bawah status bar; footer di bawah menu navigasi; jangan membuat padding navigation gesture ganda. Overlay native banner yang mengikuti scroll pernah membuat lag, teks tertutup, dan teleprompter rusak. Sederhanakan arsitektur, jangan mengulang eksperimen tersebut.
4. **Error JavaScript/Java/Gradle dicek sebelum ZIP:** Al-Hikam pernah gagal build karena fungsi dipanggil dengan parameter salah dan karena tanda kutip Java. Perubahan source harus lolos syntax/build bila alat tersedia.
5. **Versi Google Play tidak boleh menggunakan `versionCode` yang pernah diunggah.** Nama versi dan code mesti dicatat agar bisa ditelusuri. Persyaratan `minSdk`, `targetSdk`, `compileSdk`, Gradle dan SDK diverifikasi menurut tanggal/target aplikasi, tidak disalin membabi buta.
6. **Billing bukan boolean di local storage.** Hak Premium seharusnya diverifikasi dengan layanan Google Play; pahami perbedaan refund dan revoke, restore, dan dua akun penguji. Test backend, acknowledgement dan UI dengan bukti yang jelas, bukan hanya "checkout muncul".
7. **Jangan tertukar identitas/token.** Google Cloud IAM, Firebase ID token, OAuth Google Play Developer API adalah lapisan berbeda. HTTP 401/403/503 perlu ditelusuri ke sumbernya. Jangan log token atau kredensial.
8. **Cloud Run/Firebase**: pastikan project dan service account benar; API enabled tidak selalu berarti IAM/Play permission selesai. Jangan membuat duplikat project. Budget alert tidak sama dengan pembatas biaya keras. Setiap eksperimen dicatat lengkap agar tidak mengulang perubahan IAM tanpa sebab.
9. **Play Console**: deklarasi Advertising ID perlu sesuai SDK/manifest, privasi dan Data Safety harus sesuai aplikasi aktual. CSV Data Safety yang diekspor dari Console harus mempertahankan header/Question ID/Response ID; catatan Al-Hikam mendapati masalah encoding BOM. Jangan menggunakan jawaban Al-Hikam sebagai default Nahwoo tanpa audit.
10. **Closed Testing:** status jalur aktif atau perubahan terkirim **tidak otomatis** berarti rilis disetujui, 12 penguji ikut, atau masa uji mulai. Catat bukti screen/halaman untuk tiap milestone.

## Historis Al-Hikam (jangan disalahartikan sebagai status saat ini)

- Catatan `#note5` mendokumentasikan pengujian Code 14 oleh penguji kedua, termasuk pembelian, refund+revoke, pengembalian status GRATIS, dan checkout yang terbuka lagi. Itu hasil uji **kasus spesifik**, bukan bukti semua skenario pembelian lulus.
- Catatan `#note6` menyebut Code 22 (`v1.1.22`) berada pada status **perubahan sedang ditinjau** pada 27 Oktober 2026; belum ada bukti persetujuan review atau 12 penguji ikut pada snapshot tersebut.
- Status Al-Hikam yang lebih baru harus ditelusuri tersendiri dari GitHub/Play Console jika dibutuhkan. Jangan mengasumsikan data 27 Oktober adalah status terkini.

## Checklist anti-trial-error lintas aplikasi

- [ ] Baca note/history terbaru sebelum edit.
- [ ] Pisahkan hipotesis dari bukti.
- [ ] Jangan ulang arsitektur iklan scroll-follow yang gagal.
- [ ] Periksa status bar, banner, nav gesture dengan perangkat asli.
- [ ] Bedakan build hijau dari hasil uji Billing/Play.
- [ ] Verifikasi entitlements dengan sumber tepercaya, bukan boolean lokal.
- [ ] Jangan mengubah signing keys/secrets atau mempublikasikan data privat.
- [ ] Review deklarasi kebijakan Play untuk fitur Nahwoo aktual.
- [ ] Dokumentasikan langkah yang gagal juga, bukan cuma solusi yang akhirnya dipakai.