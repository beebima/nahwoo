'use strict';
/* NAHWOO V0.1.8.18: semantic Editorial V5 1–24 + reference Level 25.
   Uses the original content data; does not mutate lessons or evaluation keys. */
function nwV5Text(x){return nwSegments(x);}
function nwV5BlockText(b){return typeof b.text==='string'?b.text:(b.segments||[]).map(x=>x.text||'').join('');}
function nwV5Meaning(a,meta){
 const raw=String(a||'').replace(/\s+/g,' ').trim();
 if(!meta)return '';
 const models=[meta.unvowelled_example,meta.vowelled_model].filter(Boolean).map(s=>String(s).replace(/\s+/g,' ').trim());
 return models.includes(raw)?(meta.natural_translation||''):'';
}

function nwV5Kind(t){
 const s=String(t||'').trim(),low=s.toLowerCase();
 if(!s||s.length>650)return '';
 if(/^(hati.hati|awas|waspada|jangan sampai|jebakan|kesalahan|salah baca|yang perlu diwaspadai)/i.test(s))return 'warning';
 if(/^(bandingkan|coba bandingkan|lihat perbedaannya|bedanya|perbedaan|dua bentuk)/i.test(s))return 'compare';
 if(/^(pecah|urai|kita bongkar|coba urai|petakan|mari kita urai)/i.test(s))return 'breakdown';
 if(/^(sekarang uji|latihan kecil|coba tandai|sekarang giliran kita|uji sendiri|coba kerjakan)/i.test(s))return 'practice';
 if(/^(ingat|intinya|yang penting kita ingat|pegangan kita)/i.test(s))return 'insight';
 if(s.length>=100&&s.length<=450&&/^(pada|dalam|kata|bentuk|di sini|dari contoh|perhatikan bagaimana)/i.test(s)&&/(berfungsi|berperan|menandai|menunjukkan|sebagai|berarti|karena|dibentuk|menjadi|berhubungan|menyatakan|membedakan)/i.test(low))return 'breakdown';
 if(s.length>=95&&s.length<=310&&/(jangan|keliru|salah kaprah|tidak boleh asal|nggak boleh asal)/i.test(low))return 'warning';
 return '';
}
function nwV5IsTranslation(block){
 if(!block||block.type!=='BODY')return false;
 const s=nwV5BlockText(block).trim();
 if(!s||s.length>150||/[\n\r]/.test(s))return false;
 if(/^(terjemahan?(?: natural)?|artinya|maknanya)\s*:/i.test(s))return true;
 if(/[\u0600-\u06FF]|[*?؟«»“”]/.test(s))return false;
 if(/^(coba|lihat|nah|pada|dalam|dari|sekarang|kalau|jadi|ini|tadi|kita|perhatikan|sebelum|setelah|yang|berikut|awali|catat|kenali|buat|untuk)\b/i.test(s))return false;
 return s.split(/\s+/).length<=17&&(s.match(/[.!]/g)||[]).length<=1;
}
function nwV5Mission(m){
 const val=m.v4_meta?.competency||m.source_competency||'';
 return val?'<section class="nwv5-mission" aria-label="Misi Belajar"><div class="nwv5-mission-icon" aria-hidden="true">✓</div><div><h2>Misi Belajar</h2><p>'+nwV5Text(val)+'</p></div></section>':'';
}
function nwV5Conclusion(value){
 return value?'<aside class="nwv5-conclusion"><div class="nwv5-conclusion-head"><span aria-hidden="true">✦</span><h2>Kesimpulan</h2></div><p>'+nwV5Text(value)+'</p></aside>':'';
}
function nwV5Arabic(block,pair,meta){
 const arab=String(block.arabic||block.text||'');
 const companion=pair?nwV5BlockText(pair):'';
 const meaning=nwV5Meaning(arab,meta);
 const normal=x=>String(x||'').replace(/\*\*|[“”"'.?!؟،]/g,'').trim().toLowerCase();
 const showMeaning=meaning&&!normal(companion).includes(normal(meaning));
 return '<figure class="nwv5-arab'+(/[ًٌٍَُِّْٰ]/.test(arab)?'':' nwv5-arab-plain')+'">'
  +'<div class="nwv5-arab-text" lang="ar" dir="rtl">'+nwEscape(arab)+'</div>'
  +(showMeaning?'<div class="nwv5-arab-meaning">'+nwV5Text(meaning)+'</div>':'')
  +(companion?'<figcaption class="nwv5-arab-description nwv5-arab-brief">'+nwV5Text(pair.segments||companion)+'</figcaption>':'')+'</figure>';
}
function nwV5TransitionHeading(t){
 const s=String(t||'').trim();
 return s.length>14&&s.length<=85&&/^(kita lihat|coba lihat|lihat dua|lihat tiga|sekarang lihat|sekarang kita bandingkan|mari kita lihat|perhatikan dua|perhatikan tiga|kita bandingkan)/i.test(s)&&!/[؟?]/.test(s)&&s.split(/[.!]/).length<=2;
}
function nwEditorialReaderMarkup(n,i){
 const m=nwGetLesson(n,i);
 if(!m)return '<p>Materi belum tersedia.</p>';
 const blocks=(m.blocks||[]).filter(b=>b.type!=='MAIN_HEADING');
 const intro=Math.max(1,Math.min(3,Number(m.editorial_v5?.intro_count)||2));
 let body=0,mission=false,quick=false,headings=0,panels=0,breakdowns=0,warnings=0;
 let content='';
 for(let j=0;j<blocks.length;j++){
  const b=blocks[j],type=b.type;
  if(!mission&&body>=intro){content+=nwV5Mission(m);mission=true;}
  if(type==='ARABIC_TEXT'){
   const pair=nwV5IsTranslation(blocks[j+1])?blocks[j+1]:null;
   content+=nwV5Arabic(b,pair,m.v4_meta||m.source_meta||{});
   if(pair){j++;body++;}
  }else if(type==='BODY'){
   const value=nwV5BlockText(b);
   if(body>=intro+2&&headings<2&&nwV5TransitionHeading(value)){
    content+='<h2 class="nwv5-heading">'+nwV5Text(b.segments||value)+'</h2>';headings++;
   }else{
    let kind=body>=intro+1&&panels<4?nwV5Kind(value):'';
    if(kind==='breakdown'&&breakdowns>=2)kind='';
    if(kind==='warning'&&warnings>=1)kind='';
    const p='<p class="nwv5-paragraph'+(body<intro?' nwv5-opening':'')+'">'+nwV5Text(b.segments||value)+'</p>';
    if(kind){content+='<aside class="nwv5-panel nwv5-panel-'+kind+'">'+p+'</aside>';panels++;if(kind==='breakdown')breakdowns++;if(kind==='warning')warnings++;}
    else content+=p;
   }
   body++;
  }else if(type==='QUOTE'){
   content+='<blockquote class="nwv5-quote">'+nwV5Text(b.segments||nwV5BlockText(b))+'</blockquote>';
  }else if(type==='SUBHEADING'){
   content+='<h2 class="nwv5-heading">'+nwV5Text(b.segments||nwV5BlockText(b))+'</h2>';
  }else if(type==='QUICK_CHECK'){
   quick=true;
   content+='<section class="nwv5-quick"><strong>Cek Pemahaman</strong><p>'+nwV5Text(b.segments||nwV5BlockText(b))+'</p>'
    +(b.feedback?'<details><summary>Lihat jawaban dan penjelasan</summary><p>'+nwV5Text(b.feedback)+'</p></details>':'')+'</section>';
  }else if(type==='TARGET'){
   content+=nwV5Mission({source_competency:nwV5BlockText(b)});mission=true;
  }else if(type==='HOOK'||type==='NOTE'||type==='EXAMPLE'){
   content+='<p class="nwv5-paragraph">'+nwV5Text(b.segments||nwV5BlockText(b))+'</p>';
  }
 }
 if(!mission)content+=nwV5Mission(m);
 if(!quick&&m.quick_check?.question){
  const q=m.quick_check,ans=q.answer||q.reference_answer||'';
  content+='<section class="nwv5-quick"><strong>Cek Pemahaman</strong><p>'+nwV5Text(q.question)+'</p>'
   +(ans?'<details><summary>Lihat jawaban dan penjelasan</summary><p>'+nwV5Text(ans)+'</p>'
    +(q.reason?'<p>'+nwV5Text(q.reason)+'</p>':'')+'</details>':'')+'</section>';
 }
 return '<article class="nwv5-reader">'+content+nwHarakatMethodMarkup(n,i)+nwHarakatConclusionMarkup(n,i,m.conclusion||'')+'</article>';
}

let nw25Mode='guide',nw25Query='',nw25LoadStatus='';
function nw25EnsureSpecial(){
 if(window.NAHWOO25||nw25LoadStatus==='loading')return;
 nw25LoadStatus='loading';
 nwAssetLoad('content/level_25_special.js',()=>{
  nw25LoadStatus='ready';if(view==='reader'&&level===25)render();
 },()=>{
  nw25LoadStatus='error';if(view==='reader'&&level===25)render();
 });
}
function nw25RefLink(id){
 return '<button type="button" class="nw25-ref" onclick="nw25OpenRef('+JSON.stringify(id)+')">'+nwEscape(id.replace(/L0?(\d+)-S0?(\d+)/,'L$1 · S$2'))+'</button>';
}
function nw25OpenRef(id){
 const x=window.NAHWOO25?.index_240.find(y=>y.id===id);
 if(!x)return;
 showModal('<h2>'+nwEscape(id)+' — '+nwEscape(x.title)+'</h2><p>'+nwV5Text(x.conclusion)+'</p><button class="btn full" onclick="nw25JumpRef('+JSON.stringify(id)+')">Buka materi asal</button>');
}
function nw25JumpRef(id){
 const m=String(id).match(/^L(\d+)-S(\d+)$/);if(!m)return;
 const lv=Number(m[1]),si=Number(m[2])-1;
 if(isLocked(lv)){closeModal();lockInfo(lv);return;}
 closeModal();level=lv;opened=lv;sub=si;view='reader';render();
 window.scrollTo(0,0);
}
function nw25Table(t){
 if(!t)return '';
 return '<div class="nw25-table-wrap"><h3>'+nwV5Text(t.title)+'</h3><div class="nw25-scroll"><table><thead><tr>'+t.columns.map(x=>'<th>'+nwEscape(x)+'</th>').join('')+'</tr></thead><tbody>'+t.rows.map(r=>'<tr>'+r.map(x=>'<td>'+nwEscape(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><p>'+nwV5Text(t.note||'')+'</p></div>';
}
function nw25Rule(r){
 return '<article class="nw25-rule"><h3>'+nwV5Text(r.term)+'</h3>'
 +'<div class="nw25-grid"><div><b>Ciri</b><p>'+nwV5Text(r.ciri)+'</p></div><div><b>Harakat / kedudukan</b><p>'+nwV5Text(r.harakat)+'</p></div><div><b>Cara mengartikan</b><p>'+nwV5Text(r.arti)+'</p></div></div>'
 +'<div class="nwv5-arab"><div class="nwv5-arab-text" lang="ar" dir="rtl">'+nwEscape(r.arab)+'</div><div class="nwv5-arab-meaning">'+nwV5Text(r.terjemah)+'</div></div>'
 +'<div class="nw25-refs"><small>Pelajari lagi:</small>'+(r.rujukan||[]).map(nw25RefLink).join('')+'</div></article>';
}
function nw25IndexMatches(q){
 const data=window.NAHWOO25;
 const res=data.index_240.filter(x=>(x.id+' '+x.title+' '+x.conclusion).toLowerCase().includes(q));
 return '<div class="nw25-resultcount">'+res.length+' / 240 materi</div>'
 +res.map(x=>'<details class="nw25-indexitem"><summary><b>'+nwEscape(x.id)+'</b> · '+nwEscape(x.title)+'</summary><p>'+nwV5Text(x.conclusion)+'</p><button class="nw25-ref" onclick="nw25JumpRef('+JSON.stringify(x.id)+')">Buka materi asal</button></details>').join('');
}
function nw25GuideMatches(q){
 const data=window.NAHWOO25;
 const u=data.sublevels[sub]||data.sublevels[0];
 const matches=u.cards.filter(x=>([x.term,x.ciri,x.harakat,x.arti,x.arab,x.terjemah,...x.rujukan].join(' ')).toLowerCase().includes(q));
 return (q?'':'<p class="nw25-intro">'+nwV5Text(u.intro)+'</p>'+nw25Table(u.quick_table))
  +'<div class="nw25-resultcount">'+matches.length+' / '+u.cards.length+' kaidah</div>'
  +(matches.map(nw25Rule).join('')||'<p>Belum ditemukan di sublevel ini. Coba gunakan indeks 240 materi.</p>')
  +(q?'':nwV5Conclusion(u.conclusion));
}
function nw25UpdateResults(){
 const out=document.getElementById('nw25-results');if(!out)return;
 const q=nw25Query.trim().toLowerCase();
 out.innerHTML=nw25Mode==='index'?nw25IndexMatches(q):nw25GuideMatches(q);
}
function nw25Search(s){nw25Query=String(s||'');nw25UpdateResults();}
function nw25SetMode(mode){
 nw25Mode=mode==='index'?'index':'guide';nw25Query='';
 if(view==='reader'&&level===25)render();
}
function nwLevel25LessonMarkup(n,i){
 if(!window.NAHWOO25)return '<div class="nw-card" id="nw-reader-load"><p>Menyiapkan Buku Saku Membaca Kitab… '+(nw25LoadStatus==='error'?'Gagal memuat. Tutup dan buka lagi.':'')+'</p></div>';
 const m=window.NAHWOO25.sublevels[i];if(!m)return '<p>Sublevel belum tersedia.</p>';
 const guide=nw25Mode!=='index';
 return '<div class="nwv5-reader nw25-reader"><p class="nwv5-opening nwv5-paragraph">'+nwV5Text(m.hook)+'</p>'
  +'<section class="nwv5-mission"><div class="nwv5-mission-icon">✓</div><div><h2>Misi Belajar</h2><p>'+nwV5Text(m.mission)+'</p></div></section>'
  +'<div class="nw25-toolbar"><button onclick="nw25SetMode(\'guide\')" class="'+(guide?'active':'')+'">Panduan praktis</button><button onclick="nw25SetMode(\'index\')" class="'+(!guide?'active':'')+'">Indeks 240 materi</button></div>'
  +'<label class="nw25-searchlabel" for="nw25-search">Cari kaidah, harakat, atau materi asal</label><input id="nw25-search" class="nw25-search" type="search" placeholder="Contoh: mutsanna, maf‘ul, kasrah, L08-S03…" oninput="nw25Search(this.value)" value="'+nwEscape(nw25Query)+'"/>'
  +'<div id="nw25-results">'+(guide?nw25GuideMatches(nw25Query.trim().toLowerCase()):nw25IndexMatches(nw25Query.trim().toLowerCase()))+'</div></div>';
}
