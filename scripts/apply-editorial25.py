#!/usr/bin/env python3
import pathlib,sys,zipfile,hashlib,json,re
root=pathlib.Path(__file__).resolve().parents[1]
asset=root/'app/src/main/assets'
content=asset/'content'
sha24='ab14692a03511346545ebfe250581c7e26acfe220ae6ba431013b6396077f1a7'
sha25='a1943af30b563c1808c577520a28538aa1703d0120cbf6535281155b0d56d87e'
p24,p25=map(pathlib.Path,sys.argv[1:3])
assert hashlib.sha256(p24.read_bytes()).hexdigest()==sha24
assert hashlib.sha256(p25.read_bytes()).hexdigest()==sha25
gfile=root/'app/build.gradle';g=gfile.read_text()
assert "versionCode 22" in g and "versionName '0.1.8.15'" in g
f=asset/'index.html';s=f.read_text()
assert (asset/'nw-editorial25.js').exists()
count=0
with zipfile.ZipFile(p24) as z:
 assert z.testzip() is None
 for n in range(1,25):
  for typ in ('public','keys'):
   name=f'level_{n:02d}_{typ}.js'
   src=z.read('content/'+name)
   obj=json.loads(src.decode().split(']=',1)[1].rstrip(' ;\n'))
   if typ=='public':
    assert len(obj['materials'])==len(obj['evaluations'])==10
    for m,e in zip(obj['materials'],obj['evaluations']):
     assert m['conclusion'] and len(e['questions'])==20
     count+=1
   else:assert sum(len(x['answers']) for x in obj['answer_keys'])==200
   (content/name).write_bytes(src)
assert count==240
with zipfile.ZipFile(p25) as z:
 assert z.testzip() is None
 spec=json.loads(z.read('level_25_special.json'))
 assert len(spec['sublevels'])==11 and len(spec['index_240'])==240
 assert sum(len(x['cards']) for x in spec['sublevels'])==139
 refs={x['id']:x for x in spec['index_240']}
 for n in range(1,25):
  src=(content/f'level_{n:02d}_public.js').read_text()
  obj=json.loads(src.split(']=',1)[1].rstrip(' ;\n'))
  for i,m in enumerate(obj['materials']):
   id=f'L{n:02d}-S{i+1:02d}'
   assert refs[id]['conclusion']==m['conclusion'],id
 for x in spec['sublevels']:
  for c in x['cards']:
   assert c['arab'] and c['terjemah'] and all(id in refs for id in c['rujukan'])
 for typ in ('public','keys'):(content/f'level_25_{typ}.js').write_bytes(z.read(f'level_25_{typ}.js'))
 (content/'level_25_special.js').write_text('window.NAHWOO25='+json.dumps(spec,ensure_ascii=False,separators=(',',':'))+';\n')
for name,value in [('levels','Buku Saku Membaca Kitab Gundul'),('sublevels',[u['title'] for u in spec['sublevels']])]:
 m=re.search(r'const '+name+r'=(\[[^\n]+\]);',s)
 assert m,name
 arr=json.loads(m.group(1));assert len(arr)==24
 if name=='levels':arr[20:24]=['Jebakan yang Sering Bikin Salah Baca','Dari Harakat ke Makna','Membaca Halaman Kitab','Kita Buka Kitab Sendiri']
 arr.append(value)
 s=s[:m.start(1)]+json.dumps(arr,ensure_ascii=False,separators=(',',':'))+s[m.end(1):]
def change(old,new):
 global s
 assert old in s,old[:120]
 s=s.replace(old,new,1)
change('<script>','<script src="nw-editorial25.js"></script>\n<script>')
needle='const lesson=nwGetLesson(n,i);if(!lesson)return \'<div class="nw-card"><p>Sublevel tidak ditemukan di paket materi.</p></div>\';'
change(needle,needle+'\n if(n===25)return nwLevel25LessonMarkup(n,i);\n if(n<=24)return nwEditorialReaderMarkup(n,i);')
change('${nahwooLessonMarkup(level,sub)}${nwEvalMarkup()}','${nahwooLessonMarkup(level,sub)}${level===25?"":nwEvalMarkup()}')
change("if(view==='reader'&&level<=24){if(nwLevelAvailable(level)){nwEvalLoad();nwEvalDraw();}else nwEnsureLevelLoaded(level);}","if(view==='reader'){if(!nwLevelAvailable(level))nwEnsureLevelLoaded(level);else if(level===25){if(!window.NAHWOO25)nw25EnsureSpecial();}else{nwEvalLoad();nwEvalDraw();}}")
a=s.index('function readerNeighbor(delta){');b=s.index('function goReaderNeighbor(delta){',a)
s=s[:a]+"""function readerNeighbor(delta){
 if(level===25){
  const next=sub+delta;
  if(next>=0&&next<11)return {level:25,sub:next,title:sublevels[24][next]};
  if(next<0)return {level:24,sub:9,title:sublevels[23][9]};
  return null;
 }
 const idx=(level-1)*10+sub+delta;
 if(idx<0)return null;
 if(idx>=240)return {level:25,sub:0,title:sublevels[24][0]};
 const n=Math.floor(idx/10)+1,j=idx%10;
 return {level:n,sub:j,title:sublevels[n-1][j]};
}
"""+s[b:]
change('function progress(n){return Array.from({length:10},','function progress(n){return Array.from({length:(sublevels[n-1]||[]).length},')
change('progress(n)+"/10 SELESAI"','progress(n)+"/"+subs.length+" SELESAI"')
a=s.index('function learnResults(){');b=s.index('function quizResults(){',a)
part=s[a:b];assert 'Array.from({length:10}' in part
s=s[:a]+part.replace('Array.from({length:10}','Array.from({length:subs.length}',1)+s[b:]
change('function quizResults(){let out=levels.map(','function quizResults(){let out=levels.slice(0,24).map(')
change('function startQuiz(n){if(isLocked(n)){lockInfo(n);return}level=n;','function startQuiz(n){if(isLocked(n)){lockInfo(n);return}if(n===25){level=25;sub=0;view="reader";render();return}level=n;')
change('24 level · 240 sublevel sudah berisi materi · Seluruh level tersedia','25 level · 251 sublevel sudah berisi materi · Buku Saku tersedia')
s=s.replace('Freemium membuka semua 24 level','Freemium membuka semua 25 level')
s=s.replace('Level 13–24 beserta latihannya tersedia','Level 13–24 beserta latihan, dan Buku Saku Level 25, tersedia')
f.write_text(s)
gfile.write_text(g.replace('versionCode 22','versionCode 23',1).replace("versionName '0.1.8.15'","versionName '0.1.8.16'",1))
proof={'sha24':sha24,'sha25':sha25,'levels':25,'sublevels':251,'graded_questions':4800,'reference_cards':139,'version':'0.1.8.16'}
d=root/'docs/v5/APPROVED_EDITORIAL25_PROOF.json';d.parent.mkdir(parents=True,exist_ok=True);d.write_text(json.dumps(proof,indent=2))
print('INJECT PASS',proof)
