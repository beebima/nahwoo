'use strict';
/* NAHWOO v0.1.8.26: check curriculum augmentation and both exercise banks.
 * Automated topic matching flags for editorial review; not a human answer audit. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../app/src/main/assets');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8'),ed=fs.readFileSync(path.join(base,'nw-editorial25.js'),'utf8');
const main=html.match(/<script>([\s\S]*?)<\/script>/);assert(main);new vm.Script(main[1],{filename:'NAHWOO-index.js'});
for(const s of ['nw-harakat-method.css','nw-harakat-method.js','nwHarakatResumeMarkup(n)'])assert(html.includes(s),s);
assert(html.includes("level<=24&&sub===9?nwHarakatResumeMarkup(level):''"));
assert(ed.includes("nwHarakatMethodMarkup(n,i)+nwHarakatConclusionMarkup(n,i,m.conclusion||'')"));
const css=fs.readFileSync(path.join(base,'nw-harakat-method.css'),'utf8');assert(css.includes('nwv5-quote.nw-harakat-quote'));
const c={window:{}};vm.createContext(c);
const group=['level_01_06.js','level_07_12.js','level_13_18.js','level_19_24.js'];
for(const f of group){assert(html.includes('content/harakat/'+f));vm.runInContext(fs.readFileSync(path.join(base,'content/harakat',f),'utf8'),c);}
const rules=c.window.NW_HARAKAT_DATA;assert.equal(Object.keys(rules).length,24);
for(let n=1;n<=24;n++){assert.equal(rules[n]?.length,10);for(const x of rules[n])assert(x.length===3&&x.every(y=>typeof y==='string'&&y.length>=40));}
const escape=s=>String(s||'').replace(/[&<>]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[x]));
c.nwV5Text=escape;c.nwEscape=escape;c.nwV5Conclusion=s=>'<aside class="nwv5-conclusion">'+escape(s)+'</aside>';
vm.runInContext(fs.readFileSync(path.join(base,'nw-harakat-method.js'),'utf8'),c);
const norm=s=>String(s||'').normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f\u064b-\u065f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
const stop=new Set('dan yang dari dengan dalam untuk pada atau cara menjadi itu apa sebuah satu dua tiga bagaimana ketika di ke ini kitab baca membaca soal buka praktek praktikum mengenali kenapa baru bahwa bertanda tentang kata akhir bentuk jenis level menemukan mengubah tanda menentukan melihat mengetahui bisa ada sebagai lebih dasar harakat ciri'.split(' '));
const toks=s=>new Set(norm(s).split(' ').filter(x=>x.length>2&&!stop.has(x)));
const report={version:'0.1.8.26',scope:'24 levels, 240 lessons, 4800 keyed evaluation questions, 24000 unkeyed review questions',method:'Muhammad Abdul Fatah, Panduan Praktis Membaca dan Menerjemah Kitab Arab — adapted teaching method',curriculum:{supplements:0,resumes:0,quotes:0,conclusions:0},evaluation:{questions:0,key_count:0,duplicate_option_items:0},bank24:{questions:0,packs:0,valid_sublevel_links:0,missing_topic:0,topic_groups_needing_review:0,duplicate_option_items:0,answer_keys_bundled:false},flags:[],per_level:[]};
const seenBank=new Set(),seenEval=new Set();
for(let n=1;n<=24;n++){
 const ns=String(n).padStart(2,'0'),env={window:{}};
 for(const suffix of ['public','keys']){
   const file=path.join(base,'content','level_'+ns+'_'+suffix+'.js');
   vm.runInNewContext(fs.readFileSync(file,'utf8'),env,{filename:file,timeout:10000});
 }
 const bankFile=path.join(base,'content/qbank24','level_'+ns+'.js');
 vm.runInNewContext(fs.readFileSync(bankFile,'utf8'),env,{filename:bankFile,timeout:20000});
 const pub=env.window.NW_LEVEL_DATA[n],priv=env.window.NW_PRIVATE_KEYS[n],bank=env.window.NW_QBANK24[n];
 assert(pub&&priv&&bank);assert.equal(pub.materials.length,10);assert.equal(pub.evaluations.length,10);assert.equal(bank.questions.length,1000);assert.equal(bank.packs.length,50);
 c.window.NW_LEVEL_DATA=c.window.NW_LEVEL_DATA||{};c.window.NW_LEVEL_DATA[n]=pub;
 c.sublevels=c.sublevels||[];c.sublevels[n-1]=pub.materials.map(x=>x.title);
 const lv={level:n,topic_review:[],no_topic:[]};
 for(let si=0;si<10;si++){
  const m=pub.materials[si],e=pub.evaluations[si],ans=priv.answer_keys.find(z=>z.evaluation_id===e.evaluation_id);
  assert(m.conclusion&&ans&&e.questions.length===20&&ans.answers.length===20);
  const markup=c.nwHarakatMethodMarkup(n,si),conclusion=c.nwHarakatConclusionMarkup(n,si,m.conclusion);
  assert(markup.includes('KAIDAH HARAKAT')&&markup.includes('nw-harakat-quote')&&markup.includes('② Yang memengaruhi harakat'));
  assert(conclusion.includes('Pegangan harakat:')&&conclusion.includes('Alasannya:'));
  report.curriculum.supplements++;report.curriculum.quotes++;report.curriculum.conclusions++;
  const byId=new Map(ans.answers.map(z=>[z.question_id,z]));
  for(const q of e.questions){
   assert(!seenEval.has(q.id),q.id);seenEval.add(q.id);
   const a=byId.get(q.id);assert(a&&a.explanation&&Number.isInteger(a.correct_index)&&a.correct_index>=0&&a.correct_index<6,q.id);
   assert.equal(q.options.length,6);assert(q.hint1&&q.hint2);
   const ops=q.options.map(x=>norm((x.segments||[]).map(z=>z.text||'').join('')));
   if(new Set(ops).size<6){report.evaluation.duplicate_option_items++;report.flags.push({kind:'eval_duplicate_option',id:q.id});}
   report.evaluation.questions++;report.evaluation.key_count++;
  }
 }
 let res=c.nwHarakatResumeMarkup(n);
 assert(res.includes('Resume Level')&&(res.match(/class="nw-harakat-resume-item-title"/g)||[]).length===10);
 report.curriculum.resumes++;
 const grouped=Array.from({length:10},()=>[]);
 for(const q of bank.questions){
  assert(!seenBank.has(q.id),q.id);seenBank.add(q.id);
  const match=String(q.sublevel||'').match(/^L(\d\d)-S(\d\d)$/);
  assert(match&&Number(match[1])===n&&Number(match[2])>=1&&Number(match[2])<=10,q.id);
  grouped[Number(match[2])-1].push(q);
  assert(Array.isArray(q.options)&&q.options.length===6&&q.options.every(x=>typeof x==='string'&&x.trim()),q.id);
  if(new Set(q.options.map(norm)).size<6){report.bank24.duplicate_option_items++;report.flags.push({kind:'bank_duplicate_option',id:q.id});}
  if(!String(q.topic||'').trim())report.bank24.missing_topic++;
  report.bank24.questions++;report.bank24.valid_sublevel_links++;
 }
 for(let si=0;si<10;si++){
  let qs=grouped[si];assert.equal(qs.length,100,'L'+n+' S'+(si+1));
  let title=pub.materials[si].title,top=Array.from(new Set(qs.map(x=>String(x.topic||'').trim()))).filter(Boolean);
  if(!top.length){lv.no_topic.push(si+1);continue;}
  const own=toks(title);
  if(!top.some(t=>[...toks(t)].some(token=>own.has(token)))){
   lv.topic_review.push({sublevel:si+1,title,bank_topics:top.slice(0,3),examples:qs.slice(0,2).map(q=>q.id)});
   report.bank24.topic_groups_needing_review++;
  }
 }
 const ids=new Set(bank.questions.map(x=>x.id)),used=new Set();
 for(const pack of bank.packs){assert.equal(pack.ids.length,20);for(const id of pack.ids){assert(ids.has(id)&&!used.has(id),id);used.add(id);}report.bank24.packs++;}
 assert.equal(used.size,1000);
 report.per_level.push(lv);
}
assert.equal(report.curriculum.supplements,240);assert.equal(report.curriculum.quotes,240);assert.equal(report.curriculum.conclusions,240);assert.equal(report.curriculum.resumes,24);
assert.equal(report.evaluation.questions,4800);assert.equal(report.evaluation.key_count,4800);
assert.equal(report.bank24.questions,24000);assert.equal(report.bank24.packs,1200);
const file=path.resolve(__dirname,'../reports/harakat-v026-bank-audit.json');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
console.log('PASS 240 LESSONS, 240 KAIDAH QUOTES, 240 CONCLUSIONS, 24 LEVEL RESUMES');
console.log('PASS QUESTION STRUCTURE 4800 EVALUATION + 24000 BANK + 1200 PACKS');
console.log('EDITORIAL FLAGS '+JSON.stringify({missingTopic:report.bank24.missing_topic,topicGroups:report.bank24.topic_groups_needing_review,evalDuplicates:report.evaluation.duplicate_option_items,bankDuplicates:report.bank24.duplicate_option_items,report:file}));
