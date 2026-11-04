'use strict';
/* NAHWOO 0.1.8.26 — Penguatan harakat sublevel 01–24.
 * Rujukan metode pengajaran: M. Abdul Fatah, Panduan Praktis Membaca dan
 * Menerjemah Kitab Arab, bagian mengenal ciri kata, isim mu'rab, fi'il,
 * huruf jar, pola ma'lum-majhul, dan 'amil mudhari'.
 * Disusun ulang sesuai tingkat dan contoh yang sudah ada di NAHWOO.
 * Level 25, soal, kunci, serta progres lama tidak dimodifikasi. */
function nwHarakatRule(n,i){
 var rows=window.NW_HARAKAT_DATA&&window.NW_HARAKAT_DATA[n];
 if(!rows||!rows[i]||rows[i].length!==3)return null;
 return rows[i];
}
function nwHarakatModel(n,i){
 var lesson=window.NW_LEVEL_DATA&&window.NW_LEVEL_DATA[n]?.materials?.[i];
 if(!lesson)return '';
 var vm=lesson.v4_meta?.vowelled_model||lesson.source_meta?.vowelled_model||'';
 if(vm)return vm;
 var ar=(lesson.blocks||[]).filter(function(b){return b.type==='ARABIC_TEXT'&&/[ًٌٍَُِّْٰ]/.test(b.arabic||'')});
 return ar.length?String(ar[0].arabic||''):'';
}
function nwHarakatMethodMarkup(n,i){
 if(n<1||n>24)return '';
 var row=nwHarakatRule(n,i);if(!row)return '';
 var model=nwHarakatModel(n,i), id='L'+String(n).padStart(2,'0')+'-S'+String(i+1).padStart(2,'0');
 return '<section class="nw-harakat-method" aria-label="Ciri kata dan metode menentukan harakat '+id+'">'+
 '<div class="nw-harakat-method-head"><span class="nw-harakat-icon" aria-hidden="true">۞</span><div><span class="nw-harakat-eyebrow">LATIHAN PENGHARAKATAN · '+id+'</span><h2>Kenali cirinya, lalu cari sebab harakatnya</h2></div></div>'+
 '<p><strong>① Ciri kata / bentuk:</strong> '+nwV5Text(row[0])+'</p>'+
 '<p><strong>② Yang memengaruhi harakat:</strong> '+nwV5Text(row[1])+'</p>'+
 (model?'<div class="nw-harakat-model" lang="ar" dir="rtl">'+nwEscape(model)+'</div>':'')+
 '<blockquote class="nwv5-quote nw-harakat-quote" aria-label="Kaidah harakat paling penting"><span class="nw-harakat-quote-label">✦ KAIDAH HARAKAT — WAJIB DIINGAT</span><span>'+nwV5Text(row[2])+'</span></blockquote>'+
 '<p class="nw-harakat-check"><strong>Cara mengecek:</strong> Sebutkan jenis kata → amati pola/wazan → cari fungsi dan ‘amil → bedakan mu‘rab atau mabni → pilih tanda yang sesuai bentuk. Untuk bacaan sambung, periksa pula waqaf/washal.</p>'+
 '</section>';
}
function nwHarakatConclusionMarkup(n,i,conclusion){
 var existing=nwV5Conclusion(conclusion||'');
 var row=nwHarakatRule(n,i);
 if(!row)return existing;
 var extra='<p class="nw-harakat-conclusion-extra"><strong>✦ Pegangan harakat:</strong> '+nwV5Text(row[2])+' <strong>Alasannya:</strong> '+nwV5Text(row[1])+'</p>';
 return existing?existing.replace('</aside>',extra+'</aside>'):'<aside class="nwv5-conclusion">'+extra+'</aside>';
}
function nwHarakatResumeMarkup(n){
 if(!Number.isInteger(n)||n<1||n>24)return '';
 var rows=window.NW_HARAKAT_DATA&&window.NW_HARAKAT_DATA[n];
 if(!rows||rows.length!==10)return '';
 var titles=(typeof sublevels!=='undefined'&&sublevels[n-1])||[];
 var items=rows.map(function(r,i){
  return '<li><span class="nw-harakat-resume-item-title">S'+String(i+1).padStart(2,'0')+' · '+nwV5Text(titles[i]||'Sublevel '+(i+1))+'</span><span>'+nwV5Text(r[2])+'</span></li>';
 }).join('');
 return '<section class="nw-harakat-resume" aria-label="Resume Level '+n+' sebelum latihan">'+
 '<div class="nw-harakat-resume-header"><span class="nw-harakat-resume-icon">📌</span><div><span class="nw-harakat-eyebrow">SELESAI 10 SUBLEVEL · SEBELUM BANK LATIHAN</span><h2>Resume Level '+String(n).padStart(2,'0')+' — Ciri Kata & Harakat</h2></div></div>'+
 '<p class="nw-harakat-resume-lead">Ringkaslah 10 kaidah yang sudah dipelajari sebelum menjawab soal. Fokus bukan cuma pada bunyi akhirnya, melainkan <strong>jenis kata, bentuk, sebab perubahan, dan tanda yang tepat</strong>.</p>'+
 '<ol class="nw-harakat-resume-list">'+items+'</ol>'+
 '<div class="nw-harakat-resume-final"><strong>Rumus kerja membaca kitab:</strong> (1) Kenali isim/fi‘il/huruf; (2) periksa wazan dan vokal bentuk; (3) temukan ‘amil serta jabatan; (4) tentukan status i‘rab dan tanda asal/pengganti; (5) cocokkan dengan kalimat berharakat dan artinya.</div>'+
 '</section>';
}
