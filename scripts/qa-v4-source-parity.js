'use strict';
/* V0.1.8.13 — source parity for the uploaded V4 Level 01–08 kit.
   Verifies text/harakat/questions/keys byte-for-byte at the semantic JSON value level.
   It does not certify the academic accuracy of the author's content. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const crypto=require('node:crypto');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const proof=JSON.parse(fs.readFileSync(path.join(root,'docs/v4/V4_SOURCE_PROOF.json'),'utf8'));
const h=(data)=>crypto.createHash('sha256').update(JSON.stringify(data),'utf8').digest('hex');
const environment={window:{}};
let blocks=0,questions=0;
for(let level=1;level<=8;level++){
 const part=String(level).padStart(2,'0');
 for(const suffix of ['public','keys']){
   const file=path.join(root,`app/src/main/assets/content/level_${part}_${suffix}.js`);
   vm.runInNewContext(fs.readFileSync(file,'utf8'),environment,{filename:file});
 }
 const pub=environment.window.NW_LEVEL_DATA[level];
 const priv=environment.window.NW_PRIVATE_KEYS[level];
 assert.ok(pub&&priv,`V4 L${level} missing`);
 assert.equal(pub.materials.length,10);assert.equal(pub.evaluations.length,10);
 for(let i=0;i<10;i++){
  const s=String(i+1).padStart(2,'0');const id=`L${part}-S${s}`;
  const m=pub.materials[i],e=pub.evaluations[i];
  const record=proof.levels[String(level)][id];
  assert.ok(record,`Missing source fingerprint for ${id}`);
  assert.equal(m.sublevel_id,`L${level}-S${s}`);assert.equal(e.sublevel_id,m.sublevel_id);
  const pubBlocks=m.blocks.filter(b=>['MAIN_HEADING','SUBHEADING','BODY','ARABIC_TEXT','QUOTE'].includes(b.type));
  const normBlocks=pubBlocks.map(b=>[b.type,b.type==='ARABIC_TEXT'?(b.arabic||b.text||''):b.text??(Array.isArray(b.segments)?b.segments.map(x=>x.text||'').join(''):'')]);
  assert.equal(h(normBlocks),record.blocks,`${id} material source parity (including Arabic diacritics)`);
  assert.equal(pubBlocks.length,record.block_count);
  const normQuestions=e.questions.map(q=>[q.id,typeof q.stem==='string'?q.stem:q.stem.map(x=>x.text||'').join(''),q.arabic_lines,q.options.map(o=>[o.label,Array.isArray(o.segments)?o.segments.map(x=>x.text||'').join(''):o.text]),q.hint1,q.hint2]);
  assert.equal(h(normQuestions),record.questions,`${id} 20 questions exact source parity`);
  const group=priv.answer_keys.find(k=>k.evaluation_id===e.evaluation_id);
  assert.ok(group,`${id} answer group not found`);
  const normalizedAnswers=group.answers.map(a=>[a.question_id,a.correct_index,a.explanation]);
  assert.equal(h(normalizedAnswers),record.answers,`${id} keys/explanations source parity`);
  assert.equal(e.questions.length,20);
  blocks+=pubBlocks.length;questions+=e.questions.length;
 }
}
assert.equal(questions,1600);
console.log(JSON.stringify({status:'PASS',levels:8,sublevels:80,sourceMaterialBlocks:blocks,questions,answers:questions,manifest:'docs/v4/V4_SOURCE_PROOF.json'}));