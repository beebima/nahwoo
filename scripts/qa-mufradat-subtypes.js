'use strict';
/* V0.1.8.20: full 10,000 subtype presentation / random Home regression. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),asset=path.join(root,'app/src/main/assets');
const ctx={window:{}};vm.createContext(ctx);
new vm.Script(fs.readFileSync(path.join(asset,'nw-mufradat-subtypes.js'),'utf8')).runInContext(ctx);
for(let i=1;i<=10;i++){
 const f=path.join(asset,'content/mufradat_10000','part_'+String(i).padStart(2,'0')+'.js');
 new vm.Script(fs.readFileSync(f,'utf8')).runInContext(ctx,{timeout:10000});
}
const data=ctx.window.NW_MINI_DICTIONARY_IMPORTED;
assert.equal(data.length,10000);
const before=data.map(e=>[e.id,e.ar,e.meaning,e.word_type,e.word_subtype,e.example,e.translation].join('|'));
const summary=ctx.nwMufradatApplySubtypes(data);
assert.equal(summary.count,10000);
assert(summary.labels>=15&&summary.labels<=120,'Unexpected normalized label count: '+summary.labels);
const after=data.map(e=>[e.id,e.ar,e.meaning,e.word_type,e.word_subtype_source,e.example,e.translation].join('|'));
assert.deepEqual(after,before,'Original data or original subtype changed');
for(const e of data){
 assert(e.word_subtype&&e.word_subtype_source,'Missing subtype '+e.id);
 assert(!/belum ditentukan|perlu audit|perlu verifikasi/i.test(e.word_subtype),'Raw uncertainty displayed '+e.id);
 assert(e.word_subtype.length<90,'Subtype too long: '+e.id);
 assert(ctx.nwMufradatHomeTypeLabel(e).includes(' · '),'Home subtitle missing '+e.id);
}
const shuffled=ctx.nwMufradatShuffleHome(data,()=>0.735719);
assert.equal(shuffled.length,10000);
assert.equal(new Set(shuffled.map(e=>e.id)).size,10000);
assert.notEqual(shuffled[0].id,data[0].id,'Home not shuffled');
for(let i=1;i<shuffled.length;i++)assert.notEqual(shuffled[i].ar,shuffled[i-1].ar,'Adjacent same form');
const html=fs.readFileSync(path.join(asset,'index.html'),'utf8');
for(const part of ['src="nw-mufradat-subtypes.js"','nwMufradatApplySubtypes(imported)','nwMufradatShuffleHome(nwMiniIndex.map(','paint(\'.mini-kind\',nwMufradatHomeTypeLabel(item))','safe(nwMufradatHomeTypeLabel(w))','subkind=item.word_subtype'])assert(html.includes(part),'UI contract missing '+part);
const totals={};for(const e of data)totals[e.word_type]=(totals[e.word_type]||0)+1;
assert.deepEqual(totals,{isim:8305,fiil:1680,huruf:15});
console.log('PASS 10,000 subtypes and randomized Home',JSON.stringify({...summary,totals,first:shuffled.slice(0,5).map(x=>x.id)}));
