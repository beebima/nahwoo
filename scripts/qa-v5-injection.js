'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../app/src/main/assets');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8'),inline=html.match(/<script>([\s\S]*?)<\/script>/);
assert(inline,'Inline application script missing');new vm.Script(inline[1],{filename:'index.html'});
assert(!html.includes('nwEvalMarkup()}'),'Internal quiz still displayed');
assert(!html.includes("else if(view==='levelResume')"),'Separate level recap still displayed');
assert(!html.includes('Rangkuman Level '+String.fromCharCode(36)+'{n}'),'Recap still linked in menu');
assert(html.includes('function nahwooLessonMarkup(n,i){if(n<=24&&window.NW_V5_LEVELS[n])return nwV5LessonMarkup(n,i);'));
const ctx={window:{}};for(const f of ['01_04','05_08','09_12','13_16','17_20','21_24'])vm.runInNewContext(fs.readFileSync(path.join(base,'content/v5/level_'+f+'.js'),'utf8'),ctx,{timeout:12000});
assert.equal(Object.keys(ctx.window.NW_V5_LEVELS).length,24);
let subs=0,questions=0,packs=0;const seen=new Set();
for(let n=1;n<=24;n++){
 const lessons=ctx.window.NW_V5_LEVELS[n];assert.equal(lessons.length,10,'V5 sublevels Level '+n);
 for(let i=0;i<10;i++){const m=lessons[i];assert.equal(m.level,n);assert.equal(m.sublevel,i+1);assert(m.title&&m.blocks.length>5);assert.equal(m.blocks.at(-1).kind,'summary');assert(!Object.hasOwn(m,'question_count'));assert(!m.blocks.some(x=>x.kind==='question'||x.kind==='quiz'));subs++;}
 const ctx2={window:{}};vm.runInNewContext(fs.readFileSync(path.join(base,'content/qbank24','level_'+String(n).padStart(2,'0')+'.js'),'utf8'),ctx2,{timeout:15000});
 const bank=ctx2.window.NW_QBANK24[n];assert.equal(bank.questions.length,1000);assert.equal(bank.packs.length,50);
 for(const q of bank.questions){assert(!seen.has(q.id));seen.add(q.id);assert.equal(q.options.length,6);assert(q.hint1&&q.hint2);}
 for(const p of bank.packs)assert.equal(p.ids.length,20);
 questions+=bank.questions.length;packs+=bank.packs.length;
}
new vm.Script(fs.readFileSync(path.join(base,'nw-v5-reader.js'),'utf8'));
assert.equal(subs,240);assert.equal(questions,24000);assert.equal(packs,1200);
const gradle=fs.readFileSync(path.resolve(__dirname,'../app/build.gradle'),'utf8');
assert(gradle.includes("versionName '0.1.8.29'")&&gradle.includes('versionCode 36'));
console.log('PASS NAHWOO V5: 24 level, 240 sublevel; no internal questions or level recap; 24,000 end-level bank questions; 1,200 packs.');