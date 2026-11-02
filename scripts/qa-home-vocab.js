// N-018: fast regression gate for the fixed-size Mufradat home card.
// This checks source contracts and output text; actual Android geometry is separately tested.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const bank=fs.readFileSync('app/src/main/assets/content/mufradat_bank.js','utf8');
function includes(fragment,label){assert.ok(html.includes(fragment),label+' missing');}
includes('class="nw-home-word-body" aria-live="polite"','home card content wrapper');
includes('.home-duo .home-vocab','fixed card CSS');
includes('height:100%!important;max-height:100%!important','stable card height');
includes('overflow:hidden!important;box-sizing:border-box','stable card clipping');
includes('nwHomeLockFrame();','fixed geometry before screen fit');
includes("duo.style.height=fixed+'px'","frame height from left stack");
includes('nwHomeFitWord(card)','fit word to frame');
includes("content.classList.add('nw-word-exit')",'fade out');
includes("content.classList.add('nw-word-enter')",'fade in');
includes('prefers-reduced-motion: reduce','accessibility reduced motion');
includes('safe(nwHomeNoFinalDot(w.example))','no final dot in Arabic display');
includes('safe(nwHomeNoFinalDot(w.translation))','no final dot in translation display');
const match=html.match(/function nwHomeNoFinalDot\(value\)\{[\s\S]*?\n\}/);
assert.ok(match,'no-final-dot helper is present');
const clean=vm.runInNewContext('('+match[0]+')',{});
for(const [input,expected] of [
['Zaid telah menulis surat.','Zaid telah menulis surat'],
['كَتَبَ زَيْدٌ.','كَتَبَ زَيْدٌ'],
['Buku itu bagus...   ','Buku itu bagus'],
['Poin 1. Kata ini?','Poin 1. Kata ini?'],
['3.14 tetap ada.','3.14 tetap ada'],
['كَتَبَ زَيْدٌ','كَتَبَ زَيْدٌ']
]) assert.equal(clean(input),expected);
const registry={};
vm.runInNewContext(bank,{window:registry});
assert.ok(Array.isArray(registry.NW_MINI_DICTIONARY_ENTRIES));
assert.ok(registry.NW_MINI_DICTIONARY_ENTRIES.length>=50,'existing 50-word bank retained');
console.log('N-018 home card geometry/transition/period regression: PASS');
