'use strict';
/* NAHWOO v0.1.8.25 — test packet 1–20 navigation anchor + smooth scroll. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('app/src/main/assets/nw-qbank24-review.js','utf8');
const css=fs.readFileSync('app/src/main/assets/nw-qbank24-review.css','utf8');
new vm.Script(src,{filename:'nw-qbank24-review.js'});
assert(src.includes('id="nw24-scroll-anchor"'),'Packet counter anchor missing');
assert(css.includes('.nw24-top#nw24-scroll-anchor{scroll-margin-top:calc(var(--demo-ad-height,50px) + 12px)!important}'),'Fixed top ad offset missing');
assert(css.includes('body.demo-no-ads .nw24-top#nw24-scroll-anchor{scroll-margin-top:12px!important}'),'Ad-free offset missing');
assert(src.includes('onclick="nw24SetPos(nw24State.pos-1)"'),'Previous button not connected');
assert(src.includes('onclick="nw24SetPos(nw24State.pos+1)"'),'Next button not connected');
const a=src.indexOf('function nw24ScrollToNavigation(){');
const b=src.indexOf('function nw24Ref(){',a);
assert(a>=0&&b>a,'Scroll navigation functions not found');
const frag=src.slice(a,b);
const calls=[],queries=[],state={pos:0},ctx={
 nw24State:state,
 nw24Save:()=>calls.push('save'),
 nw24Draw:()=>calls.push('draw'),
 requestAnimationFrame:fn=>fn(),
 document:{getElementById:id=>{queries.push(id);return {scrollIntoView:args=>calls.push(args)}}},
 window:{matchMedia:()=>({matches:false})}
};
vm.createContext(ctx);vm.runInContext(frag,ctx,{timeout:2000});
ctx.nw24SetPos(1);
assert.equal(state.pos,1);
assert.deepEqual(calls.slice(0,2),['save','draw']);
assert.equal(queries.at(-1),'nw24-scroll-anchor');
assert.equal(calls.at(-1).behavior,'smooth');
assert.equal(calls.at(-1).block,'start');
assert.equal(calls.at(-1).inline,'nearest');
ctx.nw24SetPos(0);
assert.equal(state.pos,0);
assert.equal(calls.filter(x=>typeof x==='object').length,2);
const count=calls.length;ctx.nw24SetPos(-1);ctx.nw24SetPos(20);
assert.equal(calls.length,count,'Out of bounds must not scroll');
ctx.window.matchMedia=()=>({matches:true});
ctx.nw24SetPos(2);
assert.equal(calls.at(-1).behavior,'auto','Honor reduced motion');
assert(!/function nw24Pick\(i\)\{[^}]*nw24ScrollToNavigation/.test(src),'Selecting answer must not jump');
assert(!/function nw24Note\(s\)\{[^}]*nw24ScrollToNavigation/.test(src),'Writing notes must not jump');
console.log('PASS NAHWOO v0.1.8.25: Prev/Next and question-grid tap scroll to packet counter and grid below ad; answers and notes stay put');
