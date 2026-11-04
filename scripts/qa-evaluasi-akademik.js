'use strict';
/**
 * NAHWOO 0.1.8.26 — audit pendamping 4.800 soal evaluasi sublevel.
 * Pemeriksaan berbasis bukti bentuk, kunci, cuplikan Arab, dan mutu redaksi.
 * BUKAN validasi pakar nahwu/sharaf atau bukti bahwa semua jawaban benar.
 * Menjaga sumber, ID, indeks jawaban, serta data progres tetap utuh.
 */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../app/src/main/assets/content');
const report={version:'0.1.8.26',kind:'EVALUASI_SUBLEVEL_4800',scope:'Level 01–24, 10 sublevel × 20 soal',review_status:'STRUCTURAL_AND_TEXTUAL_AUDIT_ONLY',summary:{lessons:0,questions:0,harakat:0,translations:0,reasoning:0,quote_keys_verified:0,translation_keys_verified:0,rule_specific_harakat_explanations:0,generic_harakat_explanations:0,issues_by_type:{}},critical:[],editorial:[],levels:[]};
const norm=s=>String(s||'').normalize('NFC');
const arabic=s=>norm(s).replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s\u200E\u200F،؛.:!?«»【】]/g,'');
const chosen=(q,ix)=>q.options[ix].segments.map(x=>x.text||'').join('');
const parse=file=>{
 const context={window:{}}; vm.runInNewContext(fs.readFileSync(file,'utf8'),context,{filename:file,timeout:15000});return context.window;
};
const flag=(kind,q,lv,si,extra={},critical=false)=>{
 report.summary.issues_by_type[kind]=(report.summary.issues_by_type[kind]||0)+1;
 (critical?report.critical:report.editorial).push({id:q.id,level:lv,sublevel:si+1,issue:kind,...extra});
};
for(let lv=1;lv<=24;lv++){
 const ns=String(lv).padStart(2,'0');
 const pub=parse(path.join(root,'level_'+ns+'_public.js')).NW_LEVEL_DATA[lv];
 const key=parse(path.join(root,'level_'+ns+'_keys.js')).NW_PRIVATE_KEYS[lv];
 if(!pub||!key||pub.evaluations.length!==10||key.answer_keys.length!==10)throw Error('Missing level '+lv);
 const row={level:lv,questions:0,harakat:0,translation:0,reasoning:0,critical:0,editorial:0};
 for(let si=0;si<10;si++){
  const ev=pub.evaluations[si]; const ans=key.answer_keys.find(z=>z.evaluation_id===ev.evaluation_id);
  if(!ans||ev.questions.length!==20||ans.answers.length!==20)throw Error('Bad sublevel '+lv+'/'+si);
  report.summary.lessons++;
  const byId=new Map(ans.answers.map(x=>[x.question_id,x]));
  for(const q of ev.questions){
   report.summary.questions++;row.questions++;
   const a=byId.get(q.id);
   if(!a||!Number.isInteger(a.correct_index)||a.correct_index<0||a.correct_index>=6){flag('missing_or_invalid_answer',q,lv,si,{},true);continue;}
   if(!Array.isArray(q.options)||q.options.length!==6){flag('missing_options',q,lv,si,{},true);continue;}
   const opts=q.options.map((x,i)=>chosen(q,i));
   if(new Set(opts.map(norm)).size!==6)flag('duplicate_choices',q,lv,si,{},true);
   if(q.focus_words&&q.focus_words.some(w=>!(q.arabic_lines||[]).some(line=>arabic(line).includes(arabic(w))))){
    flag('focus_not_contiguous_in_context',q,lv,si,{focus:q.focus_words,context:q.arabic_lines},true);
   }
   const selected=opts[a.correct_index];const explanation=String(a.explanation||'');
   if(q.operation==='choose_vowelled'){
    report.summary.harakat++;row.harakat++;
    const ref=explanation.match(/Bacaan rujukan[^«]*«([^»]+)»/);
    if(!ref||norm(ref[1])!==norm(selected))flag('harakat_key_differs_from_explanation',q,lv,si,{selected,reference:ref?.[1]},true);
    else report.summary.quote_keys_verified++;
    if(q.focus_words?.length===1&&arabic(selected)!==arabic(q.focus_words[0]))flag('harakat_base_letters_differ_from_focus',q,lv,si,{selected,focus:q.focus_words[0]},true);
    if(/karena|sebab|‘amil|\\bamil\\b|marfu|manshub|majrur|mabni|wazan|fa.il|maf.ul|khabar|mubtada|mudhaf|jazm|tanwin/i.test(explanation)){
     report.summary.rule_specific_harakat_explanations++;
    }else{
     report.summary.generic_harakat_explanations++;
     flag('explanation_needs_specific_grammar_reason',q,lv,si,{},false);
    }
   }else if(q.operation==='choose_translation'){
    report.summary.translations++;row.translation++;
    const ref=explanation.match(/Makna yang menjadi rujukan materi adalah:\s*[“"]([^”"]+)[”"]/);
    if(!ref||norm(ref[1]).trim()!==norm(selected).trim())flag('translation_key_differs_from_explanation',q,lv,si,{selected,reference:ref?.[1]},true);
    else report.summary.translation_keys_verified++;
   }else if(q.operation==='reasoning'){
    report.summary.reasoning++;row.reasoning++;
    if(explanation.trim().length<40)flag('reasoning_explanation_too_brief',q,lv,si,{length:explanation.length},false);
   }else flag('unknown_operation',q,lv,si,{operation:q.operation},true);
  }
 }
 row.critical=report.critical.filter(x=>x.level===lv).length;
 row.editorial=report.editorial.filter(x=>x.level===lv).length;
 report.levels.push(row);
}
if(report.summary.questions!==4800||report.summary.harakat!==2880||report.summary.translations!==960||report.summary.reasoning!==960)throw Error('Unexpected coverage');
const target=path.resolve(__dirname,'../reports/qa-evaluasi-sublevel-4800.json');
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({summary:report.summary,critical:report.critical.slice(0,20),report:target},null,2));
if(report.critical.length)process.exitCode=1;
