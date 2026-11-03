'use strict';
/* NAHWOO V0.1.8.19: full-source structural regression for user-supplied 10,000 entries. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'app/src/main/assets/content/mufradat_10000');
const ctx={window:{}};vm.createContext(ctx);
for(let i=1;i<=10;i++){
  const file=path.join(dir,'part_'+String(i).padStart(2,'0')+'.js');
  assert.ok(fs.existsSync(file),'missing '+file);
  new vm.Script(fs.readFileSync(file,'utf8'),{filename:file}).runInContext(ctx,{timeout:10000});
  assert.equal(ctx.window.NW_MINI_DICTIONARY_IMPORTED.length,i*1000,'chunk '+i+' must add 1000 records');
}
const data=ctx.window.NW_MINI_DICTIONARY_IMPORTED;
assert.equal(data.length,10000,'must retain exactly 10000 source entries');
const ids=data.map(r=>r.id);
assert.equal(new Set(ids).size,10000,'source IDs must remain unique');
assert.ok(ids.every((id,i)=>id==='VOC-'+String(i+1).padStart(5,'0')),'missing, reordered, or overwritten VOC IDs');
const fields=['ar','meaning','kind','word_type','word_subtype','example','translation','id'];
for(const [i,r] of data.entries())assert.ok(fields.every(k=>typeof r[k]==='string'&&r[k].trim()),'missing field '+i);
const counts={isim:0,fiil:0,huruf:0};
for(const r of data){assert.ok(r.word_type in counts);counts[r.word_type]++;}
assert.deepEqual(counts,{isim:8305,fiil:1680,huruf:15},'source part-of-speech totals changed');
assert.equal(new Set(data.map(r=>r.ar)).size,9976,'user-provided repeated Arabic spellings must remain intact');
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
assert.ok(html.includes("imported.length!==10000"),'loader count guard missing');
assert.ok(html.includes("nwMiniIndex.length!==10000"),'search index count guard missing');
assert.ok(html.includes("const key=typeof row.id"),'dictionary must preserve source IDs instead of dropping duplicate lemmas');
assert.ok(html.includes("subkind=item.word_subtype"),'subtype must be shown on dictionary cards');
assert.ok(html.includes("nwHomeSyncBank()"),'home word card must share the complete dictionary');
assert.ok(html.includes('nwHomeNoFinalDot(item.example)'),'source display formatting has regressed');
assert.ok(html.includes("const candidates=isArabic?[entry.ar,...entry.formsAr]:[entry.meaning,...entry.aliases]"),'search must exclude example sentences');
console.log('PASS V0.1.8.19: 10,000 records, 10 parts, all IDs and fields, source duplicates preserved, UI integration ready');
