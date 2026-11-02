'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('assert').strict;
const root=path.resolve(__dirname,'..');
const src=path.join(root,'app/src/main/assets/content');
const proof=JSON.parse(fs.readFileSync(path.join(root,'docs/v4/V4_SOURCE_PROOF_09-16.json'),'utf8'));
const digest=t=>crypto.createHash('sha256').update(t,'utf8').digest('hex');
const context={window:{}};
let blocks=0,questions=0,options=0,hints=0;
const seenQuestions=new Set();
for(let level=9;level<=16;level++){
 const num=String(level).padStart(2,'0');
 const record=proof.levels[String(level)];
 for(const type of ['public','keys']){
  const file=path.join(src,`level_${num}_${type}.js`);
  const code=fs.readFileSync(file,'utf8');
  const serialized=code.slice(code.indexOf(']=')+2).trim().replace(/;$/,'');
  assert.equal(digest(serialized),record[type+'_payload_sha256'],`L${level} ${type}: source payload unexpectedly changed`);
  if(type==='public')assert.ok(!code.includes('correct_index')&&!code.includes('"explanation"'),`L${level} public leaks private answers`);
  vm.runInNewContext(code,context,{filename:file});
 }
 const pub=context.window.NW_LEVEL_DATA[level],prv=context.window.NW_PRIVATE_KEYS[level];
 assert.equal(pub.materials.length,10);assert.equal(pub.evaluations.length,10);assert.equal(prv.answer_keys.length,10);
 for(let i=0;i<10;i++){
  const expected=`L${num}-S${String(i+1).padStart(2,'0')}`;
  const m=pub.materials[i],e=pub.evaluations[i],keys=prv.answer_keys[i];
  assert.equal(m.sublevel_id,expected);assert.equal(e.sublevel_id,expected);assert.equal(keys.evaluation_id,e.evaluation_id);
  assert.equal(e.questions.length,20);assert.equal(keys.answers.length,20);
  assert.ok(m.source_competency&&m.blocks.some(b=>b.type==='SUBHEADING'));
  blocks+=m.blocks.length;
  const keyMap=new Map(keys.answers.map(k=>[k.question_id,k]));assert.equal(keyMap.size,20);
  for(const q of e.questions){
   assert.ok(!seenQuestions.has(q.id),`duplicate question ID ${q.id}`);seenQuestions.add(q.id);
   assert.equal(q.options.length,6);assert.deepEqual(Array.from(q.options,x=>x.label),['A','B','C','D','E','F']);
   for(const o of q.options)assert.ok(o.segments?.[0]?.text,`${q.id} missing text`);
   assert.ok(q.hint1&&q.hint2&&q.stem,`${q.id} stem/hints missing`);
   const key=keyMap.get(q.id);assert.ok(key,`missing key for ${q.id}`);
   assert.ok(Number.isInteger(key.correct_index)&&key.correct_index>=0&&key.correct_index<6);
   assert.ok(key.explanation,`missing explanation for ${q.id}`);
   questions++; options+=6; hints+=2;
  }
 }
}
assert.equal(blocks,proof.total_material_blocks);assert.equal(questions,1600);assert.equal(options,9600);assert.equal(hints,3200);
for(const n of [...Array(8)].map((_,i)=>i+1).concat([...Array(8)].map((_,i)=>i+17))) {
 for(const type of ['public','keys'])assert.ok(fs.existsSync(path.join(src,`level_${String(n).padStart(2,'0')}_${type}.js`)),`old L${n} preserved`);
}
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
assert.ok(html.includes('nahwoo_eval_v4_01814'),'V4 9-16 eval namespace missing');
assert.ok(html.includes('nwV4HeadingTypes0916'),'semantic mapping missing');
assert.ok(html.includes('nwV4QuickQuestionMarkup'),'quick-check material missing');
console.log(JSON.stringify({status:'PASS',levels:8,sublevels:80,blocks,questions,options,hints,answerKeys:1600}));