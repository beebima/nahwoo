'use strict';
// Regression protection N-016. Run: node scripts/qa-richtext.js
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
const begin=html.indexOf('function nwRenderArabicEscaped(v)');
const end=html.indexOf('function nwPara(segs)',begin);
assert(begin>=0 && end>begin,'N-016 rich text renderer missing: do not remove its regression protection');
const ctx={nwEscape:text=>String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')};
vm.createContext(ctx);
vm.runInContext(html.slice(begin,end),ctx,{timeout:5000});
const fixture=[
  {text:'Sebelum sibuk dengan harakat akhir, **kenali dulu keluarga katanya: ',marks:[]},
  {text:'isim',marks:['italic']},{text:', ',marks:[]},
  {text:'fi‘il',marks:['italic']},{text:', atau ',marks:[]},
  {text:'harf',marks:['italic']},{text:'.**',marks:[]}
];
const rendered=ctx.nwSegments(fixture);
assert(!rendered.includes('**'),'Asterisks leaked from cross-run quote');
assert(rendered.includes('<strong>'),'Expected bold quote');
assert(rendered.includes('<strong><em>isim</em></strong>'),'Italic inside bold lost');
const mixed=ctx.nwSegments([{text:'Perhatikan **',marks:[]},{text:'قَالَ',marks:['bold']},{text:'** sebagai contoh.',marks:[]}]);
assert(mixed.includes('nw-arab-inline') && mixed.includes('<strong>') && !mixed.includes('**'));
assert(ctx.nwTextMixed('Teks <script>evil</script> **penting**').includes('&lt;script&gt;'),'Unsafe HTML inserted');
assert(ctx.nwTextMixed('**tebal** dan *miring*').includes('<em>miring</em>'));
assert.equal(ctx.nwSegments([{text:'tebal',marks:['bold']}]),'<strong>tebal</strong>');
let auditedBlocks=0, auditedQuestions=0, markdownSpans=0, errors=[];
for(let lv=1;lv<=24;lv++){
 const filename=path.join(root,'app/src/main/assets/content',`level_${String(lv).padStart(2,'0')}_public.js`);
 const code=fs.readFileSync(filename,'utf8');
 const sandbox={window:{NW_LEVEL_DATA:{}}};
 vm.runInNewContext(code,sandbox,{timeout:5000,filename});
 const data=sandbox.window.NW_LEVEL_DATA[lv];
 assert(data && data.materials.length===10 && data.evaluations.length===10,`Missing Level ${lv}`);
 for(const mat of data.materials){
   for(const block of mat.blocks){
     if(block.segments){
       const original=block.segments.map(x=>x.text||'').join('');
       const out=ctx.nwSegments(block.segments);
       auditedBlocks++;
       if(original.includes('**'))markdownSpans++;
       if(out.includes('**'))errors.push(`${mat.sublevel_id}: leaked ** in ${block.type}`);
       if(/\*\*[^*]+\*\*/.test(original) && !out.includes('<strong>'))errors.push(`${mat.sublevel_id}: missing bold in ${block.type}`);
     }
   }
 }
 for(const ev of data.evaluations){
  for(const q of ev.questions){
    auditedQuestions++;
    for(const field of [q.stem,...(q.options||[]).map(x=>x.segments),q.hint1,q.hint2]){
      const output=ctx.nwSegments(field);
      if(output.includes('**'))errors.push(`${q.id}: leaked ** in question field`);
    }
  }
 }
}
assert.equal(auditedQuestions,4800,'Unexpected number of questions');
assert(errors.length===0,errors.slice(0,25).join('\n'));
console.log(`PASS N-016: ${auditedBlocks} material blocks; ${auditedQuestions} questions; ${markdownSpans} material blocks had cross-run Markdown; no raw ** in rendered text.`);