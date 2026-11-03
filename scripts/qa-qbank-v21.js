'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),asset=path.join(root,'app/src/main/assets');
const html=fs.readFileSync(path.join(asset,'index.html'),'utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/);
assert(src,'Missing main application script');
new vm.Script(src[1],{filename:'NAHWOO-index.js'});
assert(html.includes("const ns='nahwoo_eval_v21_01817'"),'V2.1 must isolate old evaluation progress');
assert(html.includes('const bank=nwEvalOrdered(ev.questions),answered='));
assert(html.includes('order:nwEvalOrder'));
assert(html.includes('nwEvalOrder=nwEvalNewOrder(nwGetEvaluation(level,sub)?.questions||[])'));
const start=src[1].indexOf('function nwEvalRand(max){'),end=src[1].indexOf('function nwEvalKey(){',start);
assert(start>=0&&end>start);
const sh=vm.runInNewContext(src[1].slice(start,end)+';({make:nwEvalNewOrder,valid:nwEvalOrderOK})',{window:{},Math,Uint32Array,Set,Number});
const ctx={window:{}};let levels=0,sublevels=0,questions=0,options=0,hints=0;
const totals={harakat:0,makna:0,pemahaman:0};
for(let n=1;n<=24;n++){
 const id=String(n).padStart(2,'0');
 for(const part of ['public','keys']){
  const file=path.join(asset,'content','level_'+id+'_'+part+'.js');
  vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
 }
 const pub=ctx.window.NW_LEVEL_DATA[n],keys=ctx.window.NW_PRIVATE_KEYS[n];
 assert.equal(pub.materials.length,10);assert.equal(pub.evaluations.length,10);assert.equal(keys.answer_keys.length,10);
 for(let s=0;s<10;s++){
  const m=pub.materials[s],ev=pub.evaluations[s],key=keys.answer_keys[s];
  assert(m.conclusion&&m.blocks.length>0);
  assert.equal(m.sublevel_id,ev.sublevel_id);
  assert.equal(ev.evaluation_id,key.evaluation_id);
  assert.equal(ev.questions.length,20);assert.equal(key.answers.length,20);
  const answerMap=new Map(key.answers.map(a=>[a.question_id,a]));assert.equal(answerMap.size,20);
  const cats={harakat:0,makna:0,pemahaman:0};
  for(const q of ev.questions){
   const a=answerMap.get(q.id);
   assert(a&&a.explanation&&Number.isInteger(a.correct_index)&&a.correct_index>=0&&a.correct_index<6,q.id);
   assert.equal(q.options.length,6);assert(q.hint1&&q.hint2);
   cats[q.category]++;totals[q.category]++;questions++;options+=6;hints+=2;
  }
  assert.deepEqual(cats,{harakat:12,makna:4,pemahaman:4});
  for(let attempt=0;attempt<8;attempt++){
   const order=sh.make(ev.questions);
   assert(sh.valid(order,20));
   assert(new Set(order.slice(0,6).map(i=>ev.questions[i].category)).size>=2);
   let run=1;
   for(let i=1;i<20;i++){run=ev.questions[order[i]].category===ev.questions[order[i-1]].category?run+1:1;assert(run<=3);}
  }
  sublevels++;
 }
 levels++;
}
assert.deepEqual({levels,sublevels,questions,options,hints,totals},{levels:24,sublevels:240,questions:4800,options:28800,hints:9600,totals:{harakat:2880,makna:960,pemahaman:960}});
const special=fs.readFileSync(path.join(asset,'content/level_25_special.js'),'utf8');
vm.runInNewContext(special,ctx);
assert.equal(ctx.window.NAHWOO25.sublevels.length,11);
const gradle=fs.readFileSync(path.join(root,'app/build.gradle'),'utf8');
assert((gradle.includes("versionName '0.1.8.17'")&&gradle.includes('versionCode 24'))||(gradle.includes("versionName '0.1.8.18'")&&gradle.includes('versionCode 25'))||(gradle.includes("versionName '0.1.8.19'")&&gradle.includes('versionCode 26')),'Unexpected bank version; V2.1 data must remain unchanged');
console.log('PASS 4,800 QBANK V2.1:',JSON.stringify({levels,sublevels,questions,options,hints,totals,referenceLevel25:'retained'}));
