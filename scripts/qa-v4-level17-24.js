'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),assert=require('assert').strict;
const root=path.resolve(__dirname,'..'),src=path.join(root,'app/src/main/assets/content');
const proof=JSON.parse(fs.readFileSync(path.join(root,'docs/v4/V4_SOURCE_PROOF_17-24.json'),'utf8'));
const mapping=JSON.parse(fs.readFileSync(path.join(root,'docs/v4/V4_SEMANTIC_MAPPINGS_17-24.json'),'utf8'));
const hash=t=>crypto.createHash('sha256').update(t,'utf8').digest('hex');
let s={levels:0,sublevels:0,questions:0,options:0,hints:0,blocks:0};const seen=new Set();
for(let n=17;n<=24;n++){
const context={window:{}};const no=String(n).padStart(2,'0');
for(const type of ['public','keys']){
const file=path.join(src,'level_'+no+'_'+type+'.js'),code=fs.readFileSync(file,'utf8');
const serialized=code.slice(code.indexOf(']=')+2).trim().replace(/;$/,'');
assert.equal(hash(serialized),proof.levels[String(n)][type+'_payload_sha256'],'payload SHA '+file);
if(type==='public'){assert(!code.includes('"correct_index"')&&!code.includes('"explanation"'),'answers leaked in '+file);}
vm.runInNewContext(code,context,{filename:file});
}
const pub=context.window.NW_LEVEL_DATA[n],priv=context.window.NW_PRIVATE_KEYS[n];
assert.equal(pub.materials.length,10);assert.equal(pub.evaluations.length,10);assert.equal(priv.answer_keys.length,10);
for(let j=0;j<10;j++){
const mat=pub.materials[j],ev=pub.evaluations[j],key=priv.answer_keys[j];
assert.equal(mat.sublevel_id,ev.sublevel_id);assert.equal(key.evaluation_id,ev.evaluation_id);
assert.equal(ev.questions.length,20);assert.equal(key.answers.length,20);
assert(mat.source_competency&&mat.blocks.some(b=>b.type==='MAIN_HEADING'));
assert(mat.quick_check&&mat.quick_check.question&&mat.quick_check.answer);
for(const block of mat.blocks){
s.blocks++;
if(block.type==='SUBHEADING'){const h=block.segments.map(x=>x.text).join('').toLocaleLowerCase('id-ID').trim();assert(Object.hasOwn(mapping,n+'|'+h),'unmapped '+n+' '+h);}
}
const keyMap=new Map(key.answers.map(q=>[q.question_id,q]));assert.equal(keyMap.size,20);
for(const q of ev.questions){
assert(!seen.has(q.id),'duplicate '+q.id);seen.add(q.id);
assert.equal(q.options.length,6);assert.deepEqual(Array.from(q.options,x=>x.label),['A','B','C','D','E','F']);
const answer=keyMap.get(q.id);assert(answer&&answer.correct_index>=0&&answer.correct_index<6&&answer.explanation);
assert(q.hint1&&q.hint2&&q.stem);
s.questions++;s.options+=6;s.hints+=2;
}
s.sublevels++;
}
s.levels++;
}
assert.deepEqual(s,{levels:8,sublevels:80,questions:1600,options:9600,hints:3200,blocks:2566});
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
assert(html.includes('const isV4=(n>=1&&n<=24);'));
assert(html.includes('nwV4HeadingTypes1724'));
assert(html.includes('nahwoo_eval_v4_01815'));
assert(html.includes("(n>=9&&n<=24?nwV4QuickQuestionMarkup(lesson):'')"));
const gradle=fs.readFileSync(path.join(root,'app/build.gradle'),'utf8');
assert(gradle.includes("versionName '0.1.8.15'")&&gradle.includes('versionCode 22'));
console.log('PASS V4 Level 17–24',JSON.stringify(s));
