'use strict';
/* NAHWOO v0.1.8.30 — no old question datasets active or packaged. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=path.join(root,'app/src/main/assets');
const index=fs.readFileSync(path.join(base,'index.html'),'utf8');
const js=index.match(/<script>([\s\S]*?)<\/script>/);assert(js,'main application script missing');new vm.Script(js[1]);
assert(!index.includes('nwEvalLoad();nwEvalDraw();'),'Internal evaluator still executes');
assert(!index.includes('function nwEvalMarkup()'),'Internal evaluation renderer retained');
assert(!index.includes("const questions=[{q:'Kata"),'3 legacy demo questions retained');
assert(!index.includes("else if(view==='levelResume')"),'Old level recap still visible');
assert(index.includes('function nahwooLessonMarkup(n,i){if(n<=24&&window.NW_V5_LEVELS[n])return nwV5LessonMarkup(n,i);'));
const bankSrc=fs.readFileSync(path.join(base,'nw-qbank24-review.js'),'utf8');new vm.Script(bankSrc);
assert(bankSrc.includes('function nw24CountLevel(n){return 0;}'));
assert(bankSrc.includes('function nw24TotalProgress(){return 0;}'));
assert(!bankSrc.includes('nwAssetLoad('),'Old question files still dynamically requested');
const d={window:{}};vm.runInNewContext(bankSrc,d);assert.equal(d.nw24TotalProgress(),0);assert.equal(d.nw24CountLevel(1),0);
for(let level=1;level<=24;level++){
 const n=String(level).padStart(2,'0');
 for(const p of ['content/qbank24/level_'+n+'.js','content/level_'+n+'_public.js','content/level_'+n+'_keys.js'])assert(!fs.existsSync(path.join(base,p)),'Old question data still bundled: '+p);
}
const c={window:{}};for(const x of ['01_04','05_08','09_12','13_16','17_20','21_24'])vm.runInNewContext(fs.readFileSync(path.join(base,'content/v5/level_'+x+'.js'),'utf8'),c,{timeout:12000});
assert.equal(Object.keys(c.window.NW_V5_LEVELS).length,24);
let total=0;
for(let n=1;n<=24;n++){const rows=c.window.NW_V5_LEVELS[n];assert.equal(rows.length,10);
 for(let i=0;i<rows.length;i++){const row=rows[i];assert.equal(row.level,n);assert.equal(row.sublevel,i+1);assert.equal(row.blocks.at(-1).kind,'summary');assert(!Object.hasOwn(row,'question_count'));assert(!row.blocks.some(x=>x.kind==='question'||x.kind==='quiz'));total++;}
}
assert.equal(total,240);
const r=fs.readFileSync(path.join(base,'nw-v5-reader.js'),'utf8');new vm.Script(r);assert(r.includes('Bank V5 masih kosong.'));
const gradle=fs.readFileSync(path.join(root,'app/build.gradle'),'utf8');assert(gradle.includes("versionName '0.1.8.30'")&&gradle.includes('versionCode 37'));
console.log('PASS NAHWOO V5: 240 lessons retained; 0 old question files; 0 active question bank; no internal quiz; 1,000 new questions per level planned.');
