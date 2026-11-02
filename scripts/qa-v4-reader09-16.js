'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert').strict;
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
const maps=JSON.parse(fs.readFileSync(path.join(root,'docs/v4/V4_SEMANTIC_MAPPINGS_09-16.json'),'utf8'));
assert.equal(Object.keys(maps.targets).length,80);assert.ok(Object.keys(maps.types).length>=400);
for(const [key,expected] of Object.entries({
'13|kemampuan yang akan kita buktikan':'target',
'14|kemampuan yang akan kita kuasai':'target',
'14|waspada kesalahan yang sering lolos':'warning',
'15|kita bongkar, bukan sekadar menamai':'breakdown',
'15|cek cepat sebelum menutup halaman':'practice',
'16|kesalahan yang diam-diam menjebak':'warning',
'12|model berharakat dan terjemahan':'example'
}))assert.equal(maps.types[key],expected,`semantic mapping ${key}`);
const m=html.match(/<script>([\s\S]*?)<\/script>/);assert.ok(m);new vm.Script(m[1]);
for(const rule of ['n<=16','nwV4HeadingTypes0916','nwV4LearningTargets0916','nwV4QuickQuestionMarkup','prefers-reduced-motion'])assert.ok(html.includes(rule),`missing ${rule}`);
for(const css of ['#FFF5D9','#EDCF7D','#EDF3FF','#CBDCF9','#EDF8F1','#B9DFC9','#F1EDFF','#D3C5EC','#FFF0EE','#ECC4BE','#E7EEFF'])assert.ok(html.includes(css));
assert.ok(html.includes('font-size:1.14em!important'),'inline Arabic proportional');
assert.ok(html.includes('var(--arabic-size'),'standalone Arabic font setting');
console.log(JSON.stringify({status:'PASS',semanticHeadings:Object.keys(maps.types).length,sourcedTargets:80}));