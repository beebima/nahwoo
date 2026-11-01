# NAHWOO Mufradat — Inventaris dan format awal

**Status: DRAFT_REVIEW. Paket ini BUKAN 10.000 mufradat final.**

## Isi
- INVENTARIS: 1.683 bentuk Arab tanpa harakat yang terdeteksi dalam blok ARABIC_TEXT materi dan stimulus soal publik pada ZIP induk Level 01–24 V2. Ini adalah **candidate surface forms**, bukan 1.683 lemma verified.
- 50 contoh entri terisi sebagai contoh editorial, dengan Arab berharakat, arti Indonesia, kelas kata, dan contoh Arab+terjemah. Contoh ini ditulis baru, belum mendapat review ahli.
- QA_PREPRODUKSI.json berisi jumlah serta keterbatasan.

- INVENTARIS_SEMUA: semua bentuk tulisan Arab yang muncul pada materi/soal publik, termasuk opsi dan inline; hasil ekstraksi lebih luas dan mungkin memuat token pengecoh yang bukan lema valid.

## Kontrak 10.000 entri
- 10 DOCX × 1.000 entri; ID VOC-00001 ... VOC-10000 setelah lematisasi dan QA.
- Kunci deduplikasi berdasarkan lema berharakat + kelas kata + sense; ejaan gundul seperti عَلِمَ dan عِلْمٌ tidak boleh digabung sembarangan. Bentuk berimbuhan/bentuk tashrif tidak otomatis dihitung sebagai lema baru.
- Wajib arabic_harakat, lemma_unvowelled, meaning_id, word_class, example_arabic, example_translation, tags, level_hint; root/pattern hanya bila dapat dibuktikan.
- Semua kata dari materi/soal yang sudah digunakan dipetakan ke VOC_ID melalui tabel relasi, bukan menghitung semua kemunculan sebagai kata berbeda.
- Satu instruksi produksi boleh mengelola seluruh proses, tetapi validasi tetap dilakukan secara internal dalam batch 100–250 dan sampel manual >=10% tiap batch sebagaimana pedoman.
- Hindari penggunaan database kamus eksternal secara massal sebelum lisensi untuk aplikasi komersial diperiksa.
- Jangan menginjeksi konten DRAFT_REVIEW; kunci ID permanen ketika diterima.

## Tahap berikutnya
1. Normalisasi dan lematisasi 1.683 kandidat sumber; tentukan ambiguitas seperti كتب, علم, dan بابه.
2. Kurasi tambahan sampai 10.000 lema non-duplikat termasuk seluruh lema yang digunakan dalam materi dan soal.
3. Tulis contoh spesifik untuk setiap lema; pastikan contoh benar-benar mengandung lema dalam bentuk yang sesuai, terjemah tepat, dan tidak mekanis.
4. QA berlapis, keluarkan 10 DOCX final dan JSON injeksi.