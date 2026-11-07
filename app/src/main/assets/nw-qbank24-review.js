/* NAHWOO 24.000 soal — pemeriksaan langsung dalam aplikasi. Bank publik saja, tanpa kunci. */
window.NW_QBANK24=window.NW_QBANK24||{};
var nw24Key='nahwoo_bank24000_review_v1';
var nw24State={level:1,pack:1,pos:0,selected:{},flags:{},notes:{}};
try{
 var nw24Saved=JSON.parse(localStorage.getItem(nw24Key)||'{}');
 if(nw24Saved&&typeof nw24Saved==='object')Object.assign(nw24State,nw24Saved);
 nw24State.selected=nw24State.selected||{};nw24State.flags=nw24State.flags||{};nw24State.notes=nw24State.notes||{};
 nw24State.level=Math.max(1,Math.min(24,Number(nw24State.level)||1));
 nw24State.pack=Math.max(1,Math.min(50,Number(nw24State.pack)||1));
 nw24State.pos=Math.max(0,Math.min(19,Number(nw24State.pos)||0));
}catch(e){}
var nw24Pending={};
function nw24Save(){try{localStorage.setItem(nw24Key,JSON.stringify(nw24State))}catch(e){}}
function nw24CountLevel(n){var k='-L'+String(n).padStart(2,'0')+'-';return Object.keys(nw24State.selected).filter(function(id){return id.includes(k)&&Number.isInteger(nw24State.selected[id])}).length;}
function nw24TotalProgress(){return Object.keys(nw24State.selected).filter(function(id){return /^N(?:W|B)-L\d{2}-/.test(id)&&Number.isInteger(nw24State.selected[id])}).length;}
function nw24OpenLevel(n){if(typeof isLocked==='function'&&isLocked(n)){lockInfo(n);return}nw24State.level=n;nw24State.pack=1;nw24State.pos=0;nw24Save();openView('qbank24');}

function nw24Markup(){
 return '<button class="back" onclick="back()">← Kembali ke Latihan</button>'+
 '<div class="nw24-title"><span class="eyebrow">LATIHAN AKHIR LEVEL · DRAFT REVIEW</span>'+
 '<h1>24.000 Soal Nahwu</h1><p>24 level · 50 paket/level · 20 soal/paket. Soal hanya tersedia di latihan akhir level, bukan di materi.</p>'+
 '<p class="nw24-disclaimer">Mode review: 20 soal per paket, opsi A–F, dua petunjuk, dan catatan koreksi. Bank ini belum memiliki kunci/pembahasan dalam aplikasi sehingga penilaian benar-salah belum aktif.</p></div>'+
 '<div id="nw24-root" class="nw24-root"><p>Menyiapkan bank soal…</p></div>';
}
function nw24SetLevel(x){x=Number(x);if(!Number.isInteger(x)||x<1||x>24)return;if(typeof isLocked==='function'&&isLocked(x)){lockInfo(x);nw24Draw();return;}nw24State.level=x;nw24State.pack=1;nw24State.pos=0;nw24Save();nw24Draw();}
function nw24SetPack(x){x=Number(x);if(!Number.isInteger(x)||x<1||x>50)return;nw24State.pack=x;nw24State.pos=0;nw24Save();nw24Draw();}
/* V0.1.8.25: return to the 1–20 navigation and question heading on every question change.
   Keep answer selection and review notes at their current scroll position. */
function nw24ScrollToNavigation(){
 requestAnimationFrame(function(){
  var target=document.getElementById('nw24-scroll-anchor');
  if(!target)return;
  var reduced=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start',inline:'nearest'});
 });
}
function nw24SetPos(x){x=Number(x);if(!Number.isInteger(x)||x<0||x>19)return;nw24State.pos=x;nw24Save();nw24Draw();nw24ScrollToNavigation();}
function nw24Ref(){
 var data=window.NW_QBANK24[nw24State.level];if(!data)return null;
 if(!data._byId){data._byId={};data.questions.forEach(function(q){data._byId[q.id]=q})}
 var pack=data.packs[nw24State.pack-1];if(!pack)return null;
 var id=pack.ids[nw24State.pos];return {data:data,pack:pack,id:id,q:data._byId[id]};
}
function nw24Pick(i){var r=nw24Ref();if(!r||i<0||i>5)return;nw24State.selected[r.id]=i;nw24Save();nw24Draw();}
function nw24Flag(){var r=nw24Ref();if(!r)return;if(nw24State.flags[r.id])delete nw24State.flags[r.id];else nw24State.flags[r.id]=true;nw24Save();nw24Draw();}
function nw24Note(s){var r=nw24Ref();if(!r)return;if(s)nw24State.notes[r.id]=String(s).slice(0,3000);else delete nw24State.notes[r.id];nw24Save();}
function nw24Export(){
 var ids=Array.from(new Set(Object.keys(nw24State.flags).filter(function(id){return nw24State.flags[id]}).concat(Object.keys(nw24State.notes)))).sort();
 var lines=['NAHWOO — CATATAN REVIEW 24.000 SOAL','Jumlah temuan: '+ids.length,''];
 ids.forEach(function(id){lines.push(id+' | '+(nw24State.flags[id]?'PERLU REVISI | ':'')+(nw24State.notes[id]||'(tanpa keterangan)'))});
 var host=document.getElementById('nw24-export');if(!host)return;
 host.innerHTML='<p class="muted">Salin catatan ini untuk bahan revisi:</p><textarea id="nw24-export-text" class="nw24-note" rows="7" readonly></textarea>';
 var field=document.getElementById('nw24-export-text');field.value=lines.join('\n');field.focus();field.select();try{document.execCommand('copy')}catch(e){}
}
function nw24Load(){
 var n=nw24State.level;if(window.NW_QBANK24[n]){nw24Draw();return;}
 if(nw24Pending[n]==='loading')return;
 nw24Pending[n]='loading';
 nwAssetLoad('content/qbank24/level_'+String(n).padStart(2,'0')+'.js',
 function(){nw24Pending[n]='ready';if(view==='qbank24')nw24Draw()},
 function(){nw24Pending[n]='failed';if(view==='qbank24')nw24Draw()});
}
function nw24Draw(){
 var root=document.getElementById('nw24-root');if(!root)return;
 var level=nw24State.level,data=window.NW_QBANK24[level];
 if(!data){
  root.innerHTML='<div class="card"><b>Level '+String(level).padStart(2,'0')+'</b><p>'+(nw24Pending[level]==='failed'?'Gagal memuat aset level.':'Memuat 1.000 soal dari paket aplikasi…')+'</p>'+
  (nw24Pending[level]==='failed'?'<button class="btn" onclick="delete nw24Pending[nw24State.level];nw24Load()">Coba lagi</button>':'')+'</div>';
  if(nw24Pending[level]!=='failed')nw24Load();return;
 }
 var ref=nw24Ref();if(!ref||!ref.q){root.innerHTML='<div class="card">ID soal dan paket tidak cocok.</div>';return;}
 var q=ref.q,chosen=nw24State.selected[q.id],flag=!!nw24State.flags[q.id];
 var n2=function(n){return String(n).padStart(2,'0')};
 var levelOpts=Array.from({length:24},function(_,i){return '<option value="'+(i+1)+'" '+(i+1===level?'selected':'')+'>Level '+n2(i+1)+'</option>'}).join('');
 var packOpts=Array.from({length:50},function(_,i){return '<option value="'+(i+1)+'" '+(i+1===nw24State.pack?'selected':'')+'>Paket '+n2(i+1)+'</option>'}).join('');
 var opt=q.options.map(function(t,i){return '<button class="nw24-choice '+(chosen===i?'is-chosen':'')+'" onclick="nw24Pick('+i+')"><b>'+('ABCDEF'[i])+'.</b><span>'+safe(t)+'</span></button>'}).join('');
 var numberBtns=ref.pack.ids.map(function(id,i){return '<button class="nw24-num '+(i===nw24State.pos?'active':'')+' '+(Number.isInteger(nw24State.selected[id])?'has-choice':'')+'" onclick="nw24SetPos('+i+')">'+(i+1)+'</button>'}).join('');
 var answered=ref.pack.ids.filter(function(id){return Number.isInteger(nw24State.selected[id])}).length;
 root.innerHTML=
 '<div class="nw24-top"><span>Level '+n2(level)+' · '+safe(data.title||'Bank Latihan')+'</span><b>1.000 soal</b></div>'+
 '<div class="nw24-selects"><label>Level<select onchange="nw24SetLevel(this.value)">'+levelOpts+'</select></label><label>Paket<select onchange="nw24SetPack(this.value)">'+packOpts+'</select></label></div>'+
 '<div class="nw24-top" id="nw24-scroll-anchor"><span>Paket '+nw24State.pack+'/50 · Dipilih '+answered+'/20</span><span>Soal '+(nw24State.pos+1)+'/20</span></div>'+
 '<div class="nw24-nums">'+numberBtns+'</div>'+
 '<article class="card nw24-question"><div class="nw24-top"><span class="eyebrow">'+safe(q.sublevel||'')+' · '+safe(q.difficulty||'LATIHAN')+'</span><small>'+safe(q.id)+'</small></div>'+
 '<div class="nw24-arabic" lang="ar" dir="rtl">'+safe(q.arabic||'')+'</div>'+
 (q.focus?'<div class="nw24-focus" lang="ar" dir="rtl">'+safe(q.focus)+'</div>':'')+
 '<h2>'+safe(q.prompt)+'</h2><p class="muted">'+safe(q.topic||'')+'</p>'+
 '<div class="nw24-options">'+opt+'</div>'+
 '<p class="muted">'+(Number.isInteger(chosen)?'Pilihan '+('ABCDEF'[chosen])+' tersimpan. ':'Pilih jawaban untuk mencatat respons. ')+'Belum dinilai pada mode review.</p>'+
 '<details><summary>Petunjuk 1</summary><p>'+safe(q.hint1)+'</p></details>'+
 '<details><summary>Petunjuk 2</summary><p>'+safe(q.hint2)+'</p></details>'+
 '<div class="nw24-editor"><button class="btn '+(flag?'':'alt')+'" onclick="nw24Flag()">'+(flag?'★ Ditandai perlu revisi':'☆ Tandai perlu revisi')+'</button>'+
 '<label>Catatan koreksi<textarea class="nw24-note" rows="3" maxlength="3000" oninput="nw24Note(this.value)" placeholder="Contoh: opsi ganda, harakat, redaksi, petunjuk…">'+safe(nw24State.notes[q.id]||'')+'</textarea></label></div></article>'+
 '<div class="nw24-nav"><button class="btn alt" '+(nw24State.pos===0?'disabled':'')+' onclick="nw24SetPos(nw24State.pos-1)">← Sebelumnya</button>'+
 '<button class="btn" '+(nw24State.pos===19?'disabled':'')+' onclick="nw24SetPos(nw24State.pos+1)">Berikutnya →</button></div>'+
 '<div class="card"><div class="row"><b>Catatan review lokal</b><button class="btn alt" onclick="nw24Export()">Salin catatan</button></div>'+
 '<p class="muted">'+Object.keys(nw24State.flags).filter(function(id){return nw24State.flags[id]}).length+' soal bertanda. Disimpan di perangkat ini; tidak dikirim otomatis.</p><div id="nw24-export"></div></div>';
}
