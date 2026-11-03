'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert').strict;
const root=path.resolve(__dirname,'..'),src=path.join(root,'app/src/main/assets');
const html=fs.readFileSync(path.join(src,'index.html'),'utf8');
const renderer=fs.readFileSync(path.join(src,'nw-editorial25.js'),'utf8');
new vm.Script(renderer,{filename:'nw-editorial25.js'});
const inline=html.match(/<script>([\s\S]*?)<\/script>/);assert(inline);new vm.Script(inline[1],{filename:'index.html'});
assert(html.includes('nwEditorialReaderMarkup(n,i)'));
assert(html.includes('nwLevel25LessonMarkup(n,i)'));
assert(html.includes('Array.from({length:subs.length}'));
assert(html.includes('level_25_special.js')||renderer.includes('level_25_special.js'));
assert(!html.includes('24 level · 240 sublevel sudah berisi materi'));
let counts={levels:0,sublevels:0,questions:0,options:0,hints:0,keys:0,referenceCards:0};
const context={window:{}};
for(let n=1;n<=25;n++){
 const x=String(n).padStart(2,'0');
 for(const kind of ['public','keys']){
  const file=path.join(src,'content','level_'+x+'_'+kind+'.js');
  vm.runInNewContext(fs.readFileSync(file,'utf8'),context,{filename:file});
 }
 const pub=context.window.NW_LEVEL_DATA[n],keys=context.window.NW_PRIVATE_KEYS[n];
 assert(pub&&keys);counts.levels++;counts.sublevels+=pub.materials.length;
 if(n===25){
  assert.equal(pub.materials.length,11);assert.equal(pub.evaluations.length,0);assert.equal(keys.answer_keys.length,0);continue;
 }
 assert.equal(pub.materials.length,10);assert.equal(pub.evaluations.length,10);assert.equal(keys.answer_keys.length,10);
 for(let i=0;i<10;i++){
  const m=pub.materials[i],ev=pub.evaluations[i],key=keys.answer_keys[i];
  assert(m.conclusion&&m.blocks.length>1);
  assert.equal(m.sublevel_id,ev.sublevel_id);
  assert.equal(ev.questions.length,20);assert.equal(key.answers.length,20);
  const map=new Map(key.answers.map(a=>[a.question_id,a]));
  assert.equal(map.size,20);
  for(const q of ev.questions){
   assert.equal(q.options.length,6);assert(q.hint1&&q.hint2&&q.stem);
   const a=map.get(q.id);assert(a&&Number.isInteger(a.correct_index)&&a.correct_index>=0&&a.correct_index<6);
   counts.questions++;counts.keys++;counts.options+=6;counts.hints+=2;
  }
 }
}
vm.runInNewContext(fs.readFileSync(path.join(src,'content/level_25_special.js'),'utf8'),context);
const spec=context.window.NAHWOO25;
assert.equal(spec.sublevels.length,11);assert.equal(spec.index_240.length,240);
const ids=new Set(spec.index_240.map(x=>x.id));
for(const u of spec.sublevels){
 assert(u.mission&&u.conclusion);
 for(const card of u.cards){
  assert(card.arab&&card.terjemah&&card.harakat&&card.ciri);
  assert(card.rujukan.every(id=>ids.has(id)));
  counts.referenceCards++;
 }
}
assert.deepEqual(counts,{levels:25,sublevels:251,questions:4800,options:28800,hints:9600,keys:4800,referenceCards:139});
const gradle=fs.readFileSync(path.join(root,'app/build.gradle'),'utf8');
assert(gradle.includes("versionName '0.1.8.16'")&&gradle.includes('versionCode 23'));
console.log('PASS',JSON.stringify(counts));
