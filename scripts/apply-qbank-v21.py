#!/usr/bin/env python3
"""Install user-approved 4800-question bank; retain all lesson material and Level 25."""
import sys,json,zipfile,pathlib,hashlib,collections
root=pathlib.Path(__file__).resolve().parents[1]
asset=root/'app/src/main/assets'
zip_path=pathlib.Path(sys.argv[1])
SHA='8b83a066ccb6738c203a82e5100ba3abfbed45024b8aa109061f8df960c56b6c'
assert hashlib.sha256(zip_path.read_bytes()).hexdigest()==SHA,'Unapproved question archive'
gradle=root/'app/build.gradle';g=gradle.read_text()
assert 'versionCode 23' in g and "versionName '0.1.8.16'" in g
index=asset/'index.html';s=index.read_text()
def decode(bs):
 return json.loads(bs.decode('utf8').split(']=',1)[1].rstrip(' ;\r\n'))
tot=collections.Counter()
with zipfile.ZipFile(zip_path) as z:
 assert z.testzip() is None
 for level in range(1,25):
  n=str(level).zfill(2)
  pubs='level_'+n+'_public.js';keys='level_'+n+'_keys.js'
  bp=z.read('content/'+pubs);bk=z.read('content/'+keys)
  old=decode((asset/'content'/pubs).read_bytes())
  new=decode(bp);priv=decode(bk)
  assert new['materials']==old['materials'],'Lesson content drift Level '+n
  assert len(new['materials'])==len(new['evaluations'])==len(priv['answer_keys'])==10
  for material,ev,kr in zip(new['materials'],new['evaluations'],priv['answer_keys']):
   assert material['sublevel_id']==ev['sublevel_id']
   assert ev['evaluation_id']==kr['evaluation_id']
   assert len(ev['questions'])==len(kr['answers'])==20
   by_id={a['question_id']:a for a in kr['answers']}
   assert len(by_id)==20
   counts=collections.Counter()
   for q in ev['questions']:
    counts[q['category']]+=1
    ans=by_id[q['id']]
    assert len(q['options'])==6 and q['stem'].strip()
    assert q['hint1'].strip() and q['hint2'].strip() and ans['explanation'].strip()
    assert type(ans['correct_index']) is int and 0<=ans['correct_index']<6
    tot['questions']+=1
   assert counts=={'harakat':12,'makna':4,'pemahaman':4},counts
   tot['sublevels']+=1
  (asset/'content'/pubs).write_bytes(bp)
  (asset/'content'/keys).write_bytes(bk)
  tot['levels']+=1
assert dict(tot)=={'questions':4800,'sublevels':240,'levels':24}
def swap(old,new):
 global s
 assert s.count(old)==1,('Expected exactly once',old[:90],s.count(old))
 s=s.replace(old,new,1)
swap("let nwEvalIndex=0, nwEvalAnswers={}, nwEvalSubmitted=false, nwEvalConfirm=false, nwEvalHintLevels={},nwEvalActiveKey='';","let nwEvalIndex=0, nwEvalAnswers={}, nwEvalSubmitted=false, nwEvalConfirm=false, nwEvalHintLevels={},nwEvalActiveKey='',nwEvalOrder=[];")
shuffle="""function nwEvalRand(max){
 if(window.crypto&&typeof window.crypto.getRandomValues==='function'){
 const x=new Uint32Array(1);window.crypto.getRandomValues(x);return x[0]%max;
 }
 return Math.floor(Math.random()*max);
}
function nwEvalPermute(a){
 for(let i=a.length-1;i>0;i--){const j=nwEvalRand(i+1);[a[i],a[j]]=[a[j],a[i]];}
 return a;
}
function nwEvalOrderOK(a,n){
 return Array.isArray(a)&&a.length===n&&new Set(a).size===n&&a.every(i=>Number.isInteger(i)&&i>=0&&i<n);
}
function nwEvalNewOrder(bank){
 const nums=bank.map((_,i)=>i);
 const typ=bank.map(q=>q.category);
 if(bank.length!==20||typ.filter(x=>x==='harakat').length!==12||typ.filter(x=>x==='makna').length!==4||typ.filter(x=>x==='pemahaman').length!==4)return nwEvalPermute(nums);
 for(let attempt=0;attempt<240;attempt++){
  const a=nwEvalPermute(nums.slice());let run=1,longest=1;
  for(let i=1;i<a.length;i++){run=typ[a[i]]===typ[a[i-1]]?run+1:1;longest=Math.max(longest,run);}
  if(longest<=3&&new Set(a.slice(0,6).map(i=>typ[i])).size>=2)return a;
 }
 const pools={harakat:nwEvalPermute(nums.filter(i=>typ[i]==='harakat')),
 makna:nwEvalPermute(nums.filter(i=>typ[i]==='makna')),
 pemahaman:nwEvalPermute(nums.filter(i=>typ[i]==='pemahaman'))};
 const pattern=['harakat','makna','harakat','pemahaman','harakat',
 'harakat','pemahaman','harakat','makna','harakat',
 'harakat','makna','pemahaman','harakat','harakat',
 'pemahaman','harakat','makna','harakat','harakat'];
 return pattern.map(k=>pools[k].pop());
}
function nwEvalOrdered(bank){
 if(!nwEvalOrderOK(nwEvalOrder,bank.length))nwEvalOrder=nwEvalNewOrder(bank);
 return nwEvalOrder.map(i=>bank[i]);
}
"""
anchor='function nwEvalKey(){const ns='
assert s.count(anchor)==1
s=s.replace(anchor,shuffle+anchor,1)
swap("const ns=level<=8?'nahwoo_eval_v4_01812':level<=16?'nahwoo_eval_v4_01814':'nahwoo_eval_v4_01815';","const ns='nahwoo_eval_v21_01817';")
a=s.index('function nwEvalLoad(){');b=s.index('function nwEvalSave(){',a)
s=s[:a]+"""function nwEvalLoad(){
 const k=nwEvalKey();if(nwEvalActiveKey===k)return;
 nwEvalActiveKey=k;nwEvalIndex=0;nwEvalConfirm=false;
 let prev={};
 try{prev=JSON.parse(localStorage.getItem(k)||'{}')||{}}catch(e){}
 nwEvalAnswers=(prev.answers&&typeof prev.answers==='object')?prev.answers:{};
 nwEvalSubmitted=!!prev.submitted;
 nwEvalHintLevels=(prev.hints&&typeof prev.hints==='object')?prev.hints:{};
 const bank=nwGetEvaluation(level,sub)?.questions||[];
 nwEvalOrder=nwEvalOrderOK(prev.order,bank.length)?prev.order:nwEvalNewOrder(bank);
 nwEvalSave();
}
"""+s[b:]
swap('answers:nwEvalAnswers,submitted:nwEvalSubmitted,hints:nwEvalHintLevels','answers:nwEvalAnswers,submitted:nwEvalSubmitted,hints:nwEvalHintLevels,order:nwEvalOrder')
swap('nwEvalIndex=0;nwEvalHintLevels={};nwEvalSave();nwEvalDraw();','nwEvalIndex=0;nwEvalHintLevels={};nwEvalOrder=nwEvalNewOrder(nwGetEvaluation(level,sub)?.questions||[]);nwEvalSave();nwEvalDraw();')
swap('const bank=ev.questions,answered=','const bank=nwEvalOrdered(ev.questions),answered=')
swap('Enam opsi A–F, dua petunjuk opsional. <b>Nilai, kunci, dan pembahasan baru ditampilkan setelah semua jawaban dikirim.</b>','Urutan soal acak pada setiap percobaan. <b>Nilai, kunci, dan pembahasan baru dibuka setelah semua 20 jawaban dikumpulkan.</b>')
index.write_text(s)
gradle.write_text(g.replace('versionCode 23','versionCode 24',1).replace("versionName '0.1.8.16'","versionName '0.1.8.17'",1))
proof=root/'docs/v5/QUESTION_BANK_V21_RELEASE.json';proof.parent.mkdir(parents=True,exist_ok=True)
proof.write_text(json.dumps({'archive_sha256':SHA,'version':'0.1.8.17','levels':24,'sublevels':240,'questions':4800,'harakat':2880,'makna':960,'pemahaman':960,'level25_unchanged':True},indent=2))
print('INJECTED',dict(tot),'v0.1.8.17')
