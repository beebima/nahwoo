'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'app/src/main/assets/content/qbank24');
const unique=new Set(),stats=[];
for(let n=1;n<=24;n++){
 const name='level_'+String(n).padStart(2,'0')+'.js',file=path.join(dir,name);
 const source=fs.readFileSync(file,'utf8'),ctx={window:{}};
 new vm.Script(source,{filename:file}).runInNewContext(ctx);
 const bank=ctx.window.NW_QBANK24[n];assert(bank,'bank missing: '+n);
 assert.equal(bank.level,n);assert.equal(bank.status,'DRAFT_REVIEW');
 assert.equal(bank.questions.length,1000);assert.equal(bank.packs.length,50);
 const local=new Map(),counts={};
 for(const q of bank.questions){
   assert(!unique.has(q.id),'duplicate global ID '+q.id);unique.add(q.id);local.set(q.id,q);
   assert(Array.isArray(q.options)&&q.options.length===6&&q.options.every(x=>typeof x==='string'&&x.trim()),'options '+q.id);
   assert(q.prompt&&q.hint1&&q.hint2,'missing content '+q.id);
   assert(Object.keys(q).every(k=>['id','sublevel','topic','difficulty','arabic','focus','vowel','prompt','options','hint1','hint2'].includes(k)),'unexpected field '+q.id);
   counts[q.sublevel]=(counts[q.sublevel]||0)+1;
 }
 const members=new Set();
 for(let i=0;i<50;i++){
   const p=bank.packs[i];assert.equal(p.number,i+1);assert.equal(p.ids.length,20);
   for(const id of p.ids){assert(local.has(id),'unmatched '+id);assert(!members.has(id),'duplicate member '+id);members.add(id);}
 }
 assert.equal(members.size,1000);
 if(n===1){assert.equal(Object.keys(counts).length,10);assert(Object.values(counts).every(x=>x===100));}
 assert(!/"(?:correct_index|correct_option|answer_text|explanation|misconception_tags|answer_keys|editorial_master)"\s*:/.test(source),'private key data '+name);
 stats.push({level:n,bytes:Buffer.byteLength(source)});
}
assert.equal(unique.size,24000);
const index=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
assert(index.includes('nw-qbank24-review.js')&&index.includes('nw-qbank24-review.css'));
assert(index.includes("view==='qbank24'")&&index.includes("nw24OpenLevel(n)"));
assert(index.includes('nw24CountLevel(n)/1000*100')&&index.includes('nw24TotalProgress()'),'No actual 24K progress metrics');
assert(!index.includes('Demo hanya 3 soal')&&!index.includes('1001 soal')&&!index.includes('24.024 soal'),'Legacy demo remains');
assert(!index.includes("view==='quiz'"),'Old demo view must be removed');
assert(fs.readFileSync(path.join(root,'app/src/main/assets/nw-qbank24-review.js'),'utf8').includes('function nw24OpenLevel(n)'),'Main route target missing');
new vm.Script(fs.readFileSync(path.join(root,'app/src/main/assets/nw-qbank24-review.js'),'utf8'));
const gradle=fs.readFileSync(path.join(root,'app/build.gradle'),'utf8');
assert(gradle.includes("versionName '0.1.8.25'")&&gradle.includes('versionCode 32'));
console.log('PASS — 24,000 unique draft review questions, 1,200 packs, no private answer keys; Bank bytes='+stats.reduce((s,x)=>s+x.bytes,0));
