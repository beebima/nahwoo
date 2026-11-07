/* NAHWOO V5: all old questions archived. New question bank NOT YET AVAILABLE.
 * This file deliberately does not load legacy banks or user answers.
 */
window.NW_QBANK24={};
var nw24State={level:1};
function nw24CountLevel(n){return 0;}
function nw24TotalProgress(){return 0;}
function nw24OpenLevel(n){
 n=Number(n);if(!Number.isInteger(n)||n<1||n>24)return;
 if(typeof isLocked==='function'&&isLocked(n)){lockInfo(n);return;}
 nw24State.level=n;openView('qbank24');
}
function nw24SetLevel(n){
 n=Number(n);if(!Number.isInteger(n)||n<1||n>24)return;
 if(typeof isLocked==='function'&&isLocked(n)){lockInfo(n);return;}
 nw24State.level=n;nw24Draw();
}
function nw24Markup(){
 return '<button class="back" onclick="back()">← Kembali ke Latihan</button>'+
 '<div class="nw24-title"><span class="eyebrow">LATIHAN AKHIR LEVEL · BANK SOAL BARU BELUM TERSEDIA</span>'+
 '<h1>Latihan Nahwoo V5</h1><p>Target: 1.000 soal baru per level, total 24 level dengan 50 paket × 20 soal per level.</p>'+
 '<p class="nw24-disclaimer"><b>0 soal tersedia saat ini.</b> Seluruh bank soal lama sudah disimpan sebagai arsip terpisah, tidak lagi dipakai di aplikasi. Soal V5 baru akan ditulis dari kurikulum terbaru.</p></div>'+
 '<div id="nw24-root" class="nw24-root"></div>';
}
function nw24Draw(){
 var root=document.getElementById('nw24-root');if(!root)return;
 var n=nw24State.level;
 var options=Array.from({length:24},function(_,i){var v=i+1;return '<option value="'+v+'" '+(v===n?'selected':'')+'>Level '+String(v).padStart(2,'0')+'</option>';}).join('');
 root.innerHTML='<div class="card nw24-entry"><span class="eyebrow">LEVEL '+String(n).padStart(2,'0')+'</span>'+
 '<h2>Belum tersedia — 0 dari 1.000 soal</h2><p>Bank latihan akan dibuat ulang mengikuti materi V5. Tidak ada soal dari kurikulum sebelumnya yang ditampilkan.</p>'+
 '<label for="nw24-new-level" class="setting-label">Pilih level</label><select id="nw24-new-level" class="search" onchange="nw24SetLevel(this.value)">'+options+'</select>'+
 '<div class="bar"><span style="width:0%"></span></div>'+
 '<p class="muted">Rencana: 50 paket × 20 soal; seluruh paket belum tersedia.</p></div>';
}
