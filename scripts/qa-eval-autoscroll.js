'use strict';
/* V0.1.8.22: active question navigation anchors at the entire 1–20 grid.
   The source of truth is the rendered grid and CSS sticky-ad clearance.
   Selection/hints preserve the current viewport. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const s=html.match(/<script>([\s\S]*?)<\/script>/);
assert(s,'Main inline JS missing');new vm.Script(s[1],{filename:'NAHWOO-index.js'});
const dollar=String.fromCharCode(36);
assert(html.includes('.nw-eval-numbers#nw-eval-number-grid{scroll-margin-top:calc(var(--demo-ad-height,50px) + 12px)!important}'),'Fixed top-banner offset missing');
assert(html.includes('body.demo-no-ads .nw-eval-numbers#nw-eval-number-grid{scroll-margin-top:12px!important}'),'Ad-free offset missing');
assert(html.includes('class="nw-eval-numbers" id="nw-eval-number-grid"'),'Number grid not scroll anchor');
assert(html.includes('id="nw-eval-active-number">SOAL '+dollar+'{nwEvalIndex+1} DARI 20'),'Question label must remain visible immediately below grid');
const start=s[1].indexOf('function nwEvalScrollToGrid(){');
const end=s[1].indexOf('function nwEvalHint(',start);
assert(start>0&&end>start,'Grid scroll handler missing');
const js=s[1].slice(start,end),calls=[];let draws=0;
const marker={scrollIntoView:args=>calls.push(args)};
const query=[];
const ctx={nwEvalIndex:0,nwEvalConfirm:false,nwEvalDraw:()=>draws++,
 document:{getElementById:id=>(query.push(id),id==='nw-eval-number-grid'?marker:null)},
 requestAnimationFrame:f=>f(),window:{matchMedia:()=>({matches:false})}};
vm.createContext(ctx);vm.runInContext(js,ctx,{timeout:2000});
ctx.nwEvalGo(1);assert.equal(ctx.nwEvalIndex,1);assert.equal(draws,1);
assert.equal(calls.length,1);assert.equal(calls[0].block,'start');
assert.equal(calls[0].behavior,'smooth');assert.equal(query.at(-1),'nw-eval-number-grid');
ctx.nwEvalGo(0);assert.equal(ctx.nwEvalIndex,0);assert.equal(calls.length,2);
ctx.nwEvalGo(19);assert.equal(ctx.nwEvalIndex,19);assert.equal(calls.length,3);
ctx.nwEvalGo(-1);ctx.nwEvalGo(20);assert.equal(calls.length,3);
assert(s[1].includes('onclick="nwEvalGo('+dollar+'{nwEvalIndex-1})"'),'Prev navigation missing');
assert(s[1].includes('onclick="nwEvalGo('+dollar+'{nwEvalIndex+1})"'),'Next navigation missing');
assert(s[1].includes('onclick="nwEvalGo('+dollar+'{i})"'),'Number-grid navigation missing');
assert(/function nwEvalSelect\(i\)\{[^\n]*nwEvalDraw\(\);\}/.test(s[1]),'Answer selection behavior changed');
assert(/function nwEvalHint\(n\)\{[^\n]*nwEvalDraw\(\);\}/.test(s[1]),'Hints behavior changed');
ctx.window.matchMedia=()=>({matches:true});ctx.nwEvalGo(2);
assert.equal(calls.at(-1).behavior,'auto');
console.log('PASS V0.1.8.22: Prev/Next/grid scroll to entire 20-number grid below ad; answer/hint stay put');
