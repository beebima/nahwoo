'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),base=path.join(root,'app/src/main/assets');
const html=fs.readFileSync(path.join(base,'index.html'),'utf8'),css=fs.readFileSync(path.join(base,'nwv5-styles.css'),'utf8'),js=fs.readFileSync(path.join(base,'nw-editorial25.js'),'utf8');
assert(html.includes('href="nwv5-styles.css"'),'Editorial stylesheet is not loaded');
for(const cl of ['.nwv5-paragraph','.nwv5-mission','.nwv5-arab','.nwv5-panel-breakdown','.nwv5-panel-warning','.nwv5-panel-compare','.nwv5-quick','.nwv5-quote','.nwv5-conclusion','.dark .nwv5-reader','.nw25-reader .nw25-rule'])assert(css.includes(cl),'Missing visual '+cl);
for(const c of ['#fff4d5','#ecf3ff','#eaf8f0','#f1edff','#fff0ee'])assert(css.includes(c),'Missing color '+c);
new vm.Script(js,{filename:'nw-editorial25.js'});
const escape=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=s=>escape(Array.isArray(s)?s.map(x=>x.text||'').join(''):s);
const ctx={window:{NW_LEVEL_DATA:{}},nwSegments:text,nwEscape:escape};
ctx.nwGetLesson=(n,i)=>ctx.window.NW_LEVEL_DATA[n].materials[i];
vm.createContext(ctx);vm.runInContext(js,ctx,{timeout:8000});
for(const f of ['level_01_06.js','level_07_12.js','level_13_18.js','level_19_24.js']){
  vm.runInContext(fs.readFileSync(path.join(base,'content/harakat',f),'utf8'),ctx,{timeout:8000});
}
vm.runInContext(fs.readFileSync(path.join(base,'nw-harakat-method.js'),'utf8'),ctx,{timeout:8000});

let lessons=0,quotes=0,panels=0,examples=0;
for(let level=1;level<=24;level++){
 const file=path.join(base,'content','level_'+String(level).padStart(2,'0')+'_public.js');
 vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{timeout:8000});
 const data=ctx.window.NW_LEVEL_DATA[level];
 for(let sub=0;sub<10;sub++){
  const mat=data.materials[sub],out=ctx.nwEditorialReaderMarkup(level,sub);
  assert(out.startsWith('<article class="nwv5-reader">')&&out.includes('nwv5-mission')&&out.includes('nwv5-conclusion'),mat.sublevel_id+' layout missing');
  assert((out.match(/nwv5-paragraph/g)||[]).length>=4,mat.sublevel_id+' paragraphs collapsed');
  const n=(out.match(/<figure class="nwv5-arab/g)||[]).length;
  assert.equal(n,mat.blocks.filter(b=>b.type==='ARABIC_TEXT').length,mat.sublevel_id+' Arabic card lost');
  if(mat.blocks.some(b=>b.type==='QUOTE')){assert(out.includes('nwv5-quote'),mat.sublevel_id+' quote lost');quotes++;}
  panels+=(out.match(/class="nwv5-panel /g)||[]).length;examples+=n;lessons++;
  if(level===1&&sub===0)assert(out.indexOf('Coba lihat baris ini')>out.indexOf('</figure>'),'Long commentary swallowed in Arabic figure');
 }
}
assert.equal(lessons,240);assert(panels>=30,'Too few semantically highlighted passages: '+panels);
console.log('PASS V0.1.8.18 semantic layout:',{lessons,quotes,panels,examples});
