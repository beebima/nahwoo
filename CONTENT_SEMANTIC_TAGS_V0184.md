# NAHWOO V0.1.8.4 — Kontrak Konten Semantik

Standar produksi konten Nahwoo berikutnya. Bukan isi materi untuk murid.

## Pengaturan tipografi
Sistem: 16px (12–24), konten Latin: 16px (12–26), konten Arab: 45px (26–54).
Judul Utama: 28px (20–40), Subjudul: 21px (16–30), Quote: 23px (18–36).
Semua slider terpisah, tersimpan lokal, dan diperlihatkan pada kartu preview.

## Contoh blok JSON
```json
{"sublevel_id":"L13-S01","title":"Dari Kata Menuju Pesan","blocks":[
 {"type":"MAIN_HEADING","text":"Dari Kata Menuju Pesan"},
 {"type":"SUBHEADING","segments":[{"text":"Perhatikan Hubungannya","marks":[]}]},
 {"type":"ARABIC_TEXT","arabic":"كَتَبَ زَيْدٌ الرِّسَالَةَ"},
 {"type":"BODY","segments":[{"text":"Zaid telah menulis surat. ","marks":[]},{"text":"Perhatikan hubungannya.","marks":["bold"]}]},
 {"type":"QUOTE","segments":[{"text":"Membaca kata adalah awal. Memahami pesan adalah tujuan.","marks":["bold"]}]}
]}
```

- MAIN_HEADING ditampilkan satu kali di judul sublevel; tanpa tag memakai judul materi sebelumnya.
- SUBHEADING adalah judul bagian; BODY adalah penjelasan biasa dengan bold/italic selektif.
- ARABIC_TEXT adalah tulisan Arab berharakat, tanpa transliterasi otomatis; tata letak RTL.
- QUOTE adalah pesan inti terpilih, bukan paragraf rutin. Boleh memakai attribution hanya bila sumbernya benar-benar terverifikasi.
- Blok lama HOOK, TARGET, ARABIC_EXAMPLE, WORD_BREAKDOWN, CONCEPT, COMPARISON, INSIGHT, PRACTICE, QUICK_CHECK, WARNING, TAKEAWAY, NEXT_STEP tetap didukung.
- Evaluasi 20 soal A–F dengan dua hint tidak berubah; jangan tampilkan kunci sebelum submit.
- Review ilmiah bahasa Arab, kualitas materi, kejelasan penanda, serta responsivitas tetap wajib sebelum publikasi.
