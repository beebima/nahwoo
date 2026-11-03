'use strict';
/* NAHWOO V0.1.8.20: source-preserving 10,000-word subtype layer.
   Specific labels are derived from the supplied grammatical metadata.
   Uncertain source labels remain traceable and explicitly marked for review. */
function nwMufradatSubtypeClassify(row){
 const source=String(row.word_subtype||'').trim(),ar=String(row.ar||'').trim();
 const t=source.toLowerCase().replace(/[’‘ʿʻ´]/g,"'")
   .replace(/fi'il/g,'fiil').replace(/fa'il/g,'fail').replace(/maf'ul/g,'maful')
   .replace(/mashdar/g,'masdar').replace(/tafdhil/g,'tafdil').replace(/\s+/g,' ');
 const type=String(row.word_type||'').toLowerCase();
 let review=/perlu (?:audit|verifikasi|telaah)|sesuai konteks|\batau\b|\/(?:idhafi|washfi|isim|sifat|masdar|mufrad|jamak)/i.test(t),label='';
 const pattern=()=>{
  if(/istaf'ala|istif'al/.test(t))return 'istif‘āl';
  if(/ifti'al|ifta'ala/.test(t))return 'ifti‘āl';
  if(/infi'al|infa'ala/.test(t))return 'infi‘āl';
  if(/mufa'alah/.test(t))return 'mufā‘alah';
  if(/tafa''ul|tafa''ala/.test(t))return 'tafa‘‘ul';
  if(/tafa'ul|tafa'ala/.test(t))return 'tafā‘ul';
  if(/taf'il|fa''ala/.test(t))return 'taf‘īl';
  if(/if'al|af'ala/.test(t))return 'if‘āl';
  return '';
 };
 if(type==='huruf'){
  if(/jar/.test(t))label='Huruf jar';
  else if(/athaf/.test(t))label='Huruf ‘athaf';
  else if(/taukid/.test(t))label='Huruf taukid dan nasb';
  else if(/nasikh|inna/.test(t))label='Huruf nasikh';
  else if(/tamanni/.test(t))label='Huruf tamanni';
  else if(/tarajji/.test(t))label='Huruf tarajji';
  else{label='Huruf (partikel)';review=true;}
 }else if(type==='fiil'){
  const tense=/mudhari/.test(t)?'mudhari‘':/amr/.test(t)?'amr':/madhi/.test(t)?'madhi':'';
  if(!tense){label='Fi‘il (bentuk khusus)';review=true;}
  else{
   label='Fi‘il '+tense;
   let detail=/ruba'i|rubai/.test(t)?'ruba‘i':/tsulatsi|tsulasi/.test(t)?'tsulatsi':'';
   if(detail&&/mujarrad/.test(t))detail+=' mujarrad';
   else if(detail&&/mazid/.test(t))detail+=' mazid';
   const weak=['ajwaf','naqis','mahmuz','mitsal'].find(x=>t.includes(x));
   if(weak)detail+=(detail?' · ':'')+weak;
   const bab=pattern();
   if(bab&&!review)detail+=(detail?' · ':'')+'bab '+bab;
   if(detail)label+=' ('+detail+')';
  }
 }else if(type==='isim'){
  if(/zharaf/.test(t)){
   if(/zaman atau makan/.test(t)){label='Zharaf (waktu/tempat)';review=true;}
   else label=/zaman/.test(t)?'Zharaf zaman':'Zharaf makan';
  }else if(/asmaul khamsah/.test(t))label='Asmā’ul khamsah';
  else if(/murakkab|frasa nominal|frasa nomina/.test(t)){
   if(/idhafi/.test(t)&&/washfi/.test(t)){label='Isim murakkab (frasa)';review=true;}
   else if(/idhafi/.test(t))label='Murakkab idhafi';
   else if(/washfi/.test(t))label='Murakkab washfi';
   else{label='Isim murakkab (frasa)';review=true;}
  }else if(/jamak/.test(t)){
   if(/mufrad atau|jamak \/ isim jenis|jamak atau/.test(t)){label='Isim (mufrad/jamak)';review=true;}
   else if(/muannats salim/.test(t))label='Isim jamak muannats salim';
   else if(/mudzakkar salim/.test(t))label='Isim jamak mudzakkar salim';
   else if(/taksir/.test(t))label='Isim jamak taksir';
   else label='Isim jamak';
  }else if(/shighat mubalaghah|isim mubalaghah/.test(t))label='Shighat mubalaghah';
  else if(/sifah musyabbahah|sifat musyabbahah/.test(t))label='Sifah musyabbahah';
  else if(/tafdil/.test(t))label='Isim tafdhil';
  else if(/nisbah/.test(t))label='Isim nisbah'+(/muannats/.test(t)?' muannats':'');
  else if(/jamid/.test(t)&&/musytaq/.test(t)){label='Isim (jamid/musytaq)';review=true;}
  else if(/jamid/.test(t))label='Isim jamid';
  else if(/masdar|مصدر/.test(t)){
   if(/mufrad atau|atau masdar|\/ masdar/.test(t)){label='Isim (nomina/masdar)';review=true;}
   else{label='Isim masdar';if(pattern()&&!review)label+=' (bab '+pattern()+')';if(/sina'i/.test(t))label='Isim masdar shina‘i';}
  }else if(/maful/.test(t)&&/fail/.test(t)){label='Isim sifat musytaq';review=true;}
  else if(/maful/.test(t))label='Isim maf‘ul'+(/muannats/.test(t)?' muannats':'');
  else if(/fail/.test(t)){
   if(/atau sifat|\/ sifat/.test(t)){label='Isim fa‘il / sifat musytaq';review=true;}
   else label='Isim fa‘il'+(/muannats/.test(t)?' muannats':'')+(/manqush/.test(t)?' manqush':'');
  }else if(/alat/.test(t)){
   if(/atau/.test(t)){label='Isim alat / benda';review=true;}
   else label='Isim alat';
  }else if(/makan/.test(t))label='Isim makan';
  else if(/zaman/.test(t))label='Isim zaman';
  else if(/tasghir/.test(t))label='Isim tashghir';
  else if(/mamnu/.test(t))label='Isim mamnu‘ minash-sharf';
  else if(/maqsur/.test(t))label='Isim maqshur';
  else if(/manqus|manqush/.test(t))label='Isim manqush';
  else if(/jins|jenis/.test(t))label='Isim jins';
  else if(/sifat|musytaq/.test(t)){label='Isim sifat'+(/muannats/.test(t)?' muannats':'');if(/musytaq/.test(t))review=true;}
  else if(/nama profesi|peran/.test(t)){label='Isim profesi/peran';review=true;}
  else if(/mufrad|kata benda|nomina|istilah|اِسْمٌ|isim/.test(t)){
   if(ar.split(/\s+/).length>1&&/mufrad atau istilah|perlu audit/.test(t)){label='Isim murakkab (frasa)';review=true;}
   else if(/mufrad atau/.test(t)){label='Isim (nomina)';review=true;}
   else label='Isim mufrad'+(/muannats/.test(t)?' muannats':'');
   if(!/mufrad|kata benda|nomina/.test(t))review=true;
  }else{label='Isim (nomina)';review=true;}
 }else{label=source||'Bentuk khusus';review=true;}
 return {label,review,source};
}
function nwMufradatApplySubtypes(entries){
 if(!Array.isArray(entries))return {count:0,review:0,labels:0};
 const kinds=new Set();let review=0;
 for(const e of entries){
  const x=nwMufradatSubtypeClassify(e);
  if(!e.word_subtype_source)e.word_subtype_source=x.source;
  e.word_subtype=x.label;e.word_subtype_review=!!x.review;
  if(x.review)review++;kinds.add(x.label);
 }
 return {count:entries.length,review,labels:kinds.size};
}
function nwMufradatHomeTypeLabel(entry){
 if(!entry)return '';
 const kind=String(entry.kind||'').trim(),sub=String(entry.word_subtype||'').trim();
 return sub?kind+' · '+sub.replace(/^Fi‘il\s+/,'').replace(/^Isim\s+/,'').replace(/^Huruf\s+/,''):kind;
}
function nwMufradatShuffleHome(entries,rng){
 const out=entries.slice();
 const random=typeof rng==='function'?rng:()=>{
  if(typeof crypto!=='undefined'&&crypto.getRandomValues){
   const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]/4294967296;
  }
  return Math.random();
 };
 for(let i=out.length-1;i>0;i--){
  const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));
  [out[i],out[j]]=[out[j],out[i]];
 }
 for(let i=1;i<out.length;i++)if(out[i].ar===out[i-1].ar){
  let j=i+1;while(j<out.length&&(out[j].ar===out[i].ar||out[j].ar===out[i-1].ar))j++;
  if(j<out.length)[out[i],out[j]]=[out[j],out[i]];
 }
 return out;
}
