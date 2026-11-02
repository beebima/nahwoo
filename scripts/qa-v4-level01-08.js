'use strict';
// Regression gate: V4 Reading-First dataset Level 01–08. No claims of linguistic expertise.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets/content');
const index=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
const sandbox={window:{}};
const questionIds=new Set();
let materialTotal=0,questions=0,hints=0,answers=0;
for(let n=1;n<=8;n++){
 const part=String(n).padStart(2,'0');
 const pubFile=path.join(assets,`level_${part}_public.js`);
 const keysFile=path.join(assets,`level_${part}_keys.js`);
 const pubCode=fs.readFileSync(pubFile,'utf8');
 const keysCode=fs.readFileSync(keysFile,'utf8');
 assert.ok(!pubCode.includes('correct_index')&&!pubCode.includes('"explanation"'),`L${n} public answer leak`);
 vm.runInNewContext(pubCode,sandbox,{filename:pubFile});
 vm.runInNewContext(keysCode,sandbox,{filename:keysFile});
 const obj=sandbox.window.NW_LEVEL_DATA[n],privateKeys=sandbox.window.NW_PRIVATE_KEYS[n];
 assert.equal(obj.materials.length,10,`L${n} materials`);
 assert.equal(obj.evaluations.length,10,`L${n} evaluations`);
 assert.equal(privateKeys.answer_keys.length,10,`L${n} keys groups`);
 for(let k=0;k<10;k++){
  const subId=`L${n}-S${String(k+1).padStart(2,'0')}`;
  const mat=obj.materials[k],evaluation=obj.evaluations[k],privateGroup=privateKeys.answer_keys[k];
  assert.equal(mat.sublevel_id,subId);assert.equal(evaluation.sublevel_id,subId);
  assert.equal(evaluation.evaluation_id,privateGroup.evaluation_id);
  assert.ok(mat.blocks.length>12,`L${n}S${k+1} material absent`);
  const blockTypes=new Set(mat.blocks.map(x=>x.type));
  for(const type of ['MAIN_HEADING','SUBHEADING','BODY','ARABIC_TEXT','QUICK_CHECK'])assert.ok(blockTypes.has(type),`L${n}S${k+1} missing ${type}`);
  assert.equal(evaluation.questions.length,20,`L${n}S${k+1} 20 questions`);
  assert.equal(privateGroup.answers.length,20,`L${n}S${k+1} 20 answer keys`);
  const keyById=new Map(privateGroup.answers.map(x=>[x.question_id,x]));
  assert.equal(keyById.size,20);
  for(const block of mat.blocks){
   materialTotal++;
   if(['BODY','QUOTE','SUBHEADING','QUICK_CHECK'].includes(block.type)){
    assert.ok(Array.isArray(block.segments)&&block.segments.some(x=>x.text),'V4 text would render blank');
   }
   if(block.type==='ARABIC_TEXT')assert.ok(block.arabic,'Arabic text would render blank');
  }
  for(const q of evaluation.questions){
   assert.ok(!questionIds.has(q.id),`Duplicate q ${q.id}`);questionIds.add(q.id);
   assert.equal(q.options.length,6);
   assert.deepEqual(Array.from(q.options,x=>x.label),['A','B','C','D','E','F']);
   for(const opt of q.options)assert.ok(opt.segments?.[0]?.text,'Missing option text');
   assert.ok(q.hint1&&q.hint2,'Two hints missing');
   assert.ok(q.stem,'Stem missing');
   const key=keyById.get(q.id);
   assert.ok(key,`Key missing ${q.id}`);
   assert.ok(Number.isInteger(key.correct_index)&&key.correct_index>=0&&key.correct_index<6);
   assert.ok(key.explanation,'Explanation missing');
   questions++;answers++;hints+=2;
  }
 }
}
assert.equal(questions,1600);assert.equal(answers,1600);assert.equal(hints,3200);
assert.match(index,/nahwoo_eval_v4_01812/, 'Old answer state must not be reused after V4 question replacement');
assert.ok(index.includes('function nwEvalKey()'),'Evaluation state handling missing');
assert.ok(index.includes('function nwRenderRichText'),'Styled lesson parser missing');
assert.ok(index.includes('function nwHomeNoFinalDot'),'Mufradat no-dot rule must remain');
assert.ok(index.includes('function nwMiniEnsureLoaded'),'Kamus Mini must remain');
for(let n=9;n<=24;n++){
 assert.ok(fs.existsSync(path.join(assets,`level_${String(n).padStart(2,'0')}_public.js`)),`Level ${n} should be preserved`);
 assert.ok(fs.existsSync(path.join(assets,`level_${String(n).padStart(2,'0')}_keys.js`)),`Level ${n} keys should be preserved`);
}
console.log(JSON.stringify({status:'PASS',levels:8,sublevels:80,materialBlocks:materialTotal,questions,answers,hints,uncorrectedHigherLevels:16}));