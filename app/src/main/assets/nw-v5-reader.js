/* NAHWOO V5 integrated reader; sublevel conclusions preserved, no internal quiz. */
(function(){
'use strict';
window.NW_V5_TITLES={"1":"Masuk Kitab Gundul dari Nol","2":"Dua Isim Bisa Jadi Kalimat: Mubtada–Khabar","3":"Isim Punya Identitas: Ma‘rifat, Gender, dan Jumlah","4":"Kata Ganti dan Kata Tunjuk: Siapa yang Dimaksud?","5":"Idhafah dan Na‘at: Dua Kata, Dua Hubungan Berbeda","6":"Huruf Jar dan Zharaf: Frasa Kecil yang Mengubah Arah","7":"Peta I‘rab: Kenapa Ujung Kata Bisa Berubah?","8":"Fi‘il Madhi dan Jumlah Fi‘liyah: Siapa Melakukan Apa?","9":"Fi‘il Mudhari‘ dan Amr: Sedang, Akan, dan Perintah","10":"Fa‘il, Maf‘ul Bih, dan Na'ibul Fa‘il: Peran dalam Peristiwa","11":"Kana dan Saudara-saudaranya: Kalimat Isim Berubah Suasana","12":"Inna, La, dan Saudara-saudaranya: Penegasan dan Penafian","13":"Tawabi‘: Na‘at, ‘Athaf, Taukid, dan Badal","14":"Zharaf, Hal, dan Tamyiz: Keterangan yang Membuat Makna Lengkap","15":"Istitsna, Nida, dan Ragam Maf‘ul: Konstruksi yang Sering Muncul","16":"Akar Kata dan Wazan: Membuka Pintu Sharaf","17":"Fi‘il Mazid: Tambahan Huruf, Tambahan Nuansa","18":"Fi‘il Mu‘tal: Saat Huruf ‘Illat Bikin Bentuk Berubah","19":"Bentuk Isim Khusus: Jangan Terkecoh Ujung Katanya","20":"Klausa dan Konstruksi Khusus: Saat Kalimat Mulai Bertingkat","21":"Sistem Fi‘il Lengkap: Lazim, Muta‘addi, Aktif, Pasif","22":"Kamus dan Makna: Satu Kata Bisa Punya Banyak Jalan","23":"Membaca Kalimat Panjang dan Paragraf Kitab","24":"Baca Kitab Mandiri: Dari Teks Baru sampai Terjemahan Utuh"};window.NW_V5_LEVELS=window.NW_V5_LEVELS||{};
const e=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=v=>String(v==null?'':v);
const cell=v=>rich(v.html||e(v.raw||''));
const cells=b=>(b.cells||[]).map(row=>Array.isArray(row)?row:[]);
function block(b){
 const rows=cells(b);
 if(b.kind==='paragraph')return '<p class="nwv5c-paragraph">'+rich(b.html||e(b.raw))+'</p>';
 if(b.kind==='heading')return '<h2 class="nwv5c-heading">'+rich(b.html||e(b.raw))+'</h2>';
 if(b.kind==='arabic')return '<figure class="nwv5c-arab">'+rows.map(row=>'<div class="nwv5c-arab-row">'+row.filter(v=>v.is_ar).map(v=>'<div class="nwv5c-arab-text" dir="rtl" lang="ar">'+cell(v)+'</div>').join('')+row.filter(v=>!v.is_ar).map(v=>'<div class="nwv5c-arab-meaning">'+cell(v)+'</div>').join('')+'</div>').join('')+'</figure>';
 if(b.kind==='term'){const card=b.card||{};return '<aside class="nwv5c-term"><h3>🔎 '+e(card.title||'Kenali istilah')+'</h3>'+(card.terms||[]).map(t=>'<div class="nwv5c-term-row"><strong>'+e(t.name)+'</strong>'+(t.arabic?'<div class="nwv5c-arab-text" dir="rtl" lang="ar">'+e(t.arabic)+'</div>':'')+'<p>'+e(t.definition)+'</p>'+(t.example?'<small>'+e(t.example)+'</small>':'')+'</div>').join('')+'</aside>';}
 if(b.kind==='compare')return '<aside class="nwv5c-compare">'+rows.map(row=>'<div class="nwv5c-compare-item">'+row.map(v=>'<div class="'+(v.is_ar?'nwv5c-compare-ar':'nwv5c-compare-text')+'">'+cell(v)+'</div>').join('')+'</div>').join('')+'</aside>';
 if(b.kind==='quote')return '<blockquote class="nwv5c-quote">'+rows.flat().filter(v=>v.raw!=='“'&&v.raw!=='”').map(cell).join(' ')+'</blockquote>';
 if(b.kind==='mission'||b.kind==='warning'){let t=rows.flat(),type=b.kind==='mission'?'nwv5c-observation':'nwv5c-warning';return '<aside class="'+type+'"><strong>'+ (t.length?cell(t[0]):'')+'</strong><p>'+t.slice(1).map(cell).join(' ')+'</p></aside>';}
 if(b.kind==='summary')return '<aside class="nwv5c-conclusion"><h2>✦ Kesimpulan Sublevel</h2><p>'+rich(b.body_html||e(b.body))+'</p>'+(b.key_html?'<p class="nwv5c-conclusion-key">'+rich(b.key_html)+'</p>':'')+'</aside>';
 return '';
}
window.nwV5LessonMarkup=function(n,i){
 const m=window.NW_V5_LEVELS[n]?.[i];if(!m)return '<p>Materi V5 belum tersedia untuk sublevel ini.</p>';
 let h='<article class="nwv5c-reader" data-v5-level="'+n+'" data-v5-sublevel="'+(i+1)+'">'+m.blocks.map(block).join('')+'</article>';
 if(i===9){let complete=typeof progress==='function'&&progress(n)===10;h+='<section class="nwv5c-final"><div class="nwv5c-label">SETELAH 10 SUBLEVEL</div><h2>Latihan Akhir Level '+n+'</h2><p>1.000 soal, 50 paket × 20 soal. Tidak ada soal di dalam materi.</p><button type="button" onclick="startQuiz('+n+')" '+(complete?'':'disabled')+'>'+(complete?'Buka 1.000 Soal Level '+n:'Tandai selesai seluruh 10 sublevel dahulu')+'</button></section>';}
 return h;
};
})();