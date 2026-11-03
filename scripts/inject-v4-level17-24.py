#!/usr/bin/env python3
"""One-time source-faithful NAHWOO V4 Levels 17-24 integration from original archive."""
import sys, os, re, json, zipfile, hashlib, pathlib, collections
root=pathlib.Path(__file__).resolve().parents[1]
archive=pathlib.Path(sys.argv[1])
expected="b99c9936fb9716d94860891ad0fb44757fdb6a63d94cf75b770737fdbd605858"
assert hashlib.sha256(archive.read_bytes()).hexdigest()==expected,"Original source ZIP SHA mismatch"
asset=root/"app/src/main/assets"
index=asset/"index.html"
gradle=root/"app/build.gradle"
assert "versionCode 21" in gradle.read_text() and "versionName '0.1.8.14'" in gradle.read_text(), "Wrong source baseline"
html=index.read_text(encoding="utf-8")
assert "function nwV4Kind(section,n)" in html and "const isV4=(n>=1&&n<=8)||(n>=9&&n<=16);" in html,"V4 renderer baseline mismatch"
dest=asset/"content"
proof={"levels":{}, "source_zip_sha256":expected, "total_material_blocks":0}
semantic={}
tot=collections.Counter()
def extract(z,n):
    names=[x for x in z.namelist() if x.endswith("L%d_INJEKSI_LENGKAP.json"%n)]
    assert len(names)==1,(n,names)
    return json.loads(z.read(names[0]))
def kind(h):
    t=h.strip().lower()
    if re.search(r"target|hasil belajar|yang kita kuasai|yang bisa kita buktikan",t): return "target"
    if re.search(r"jebakan|kesalahan|jangan sampai|waspada",t):return "warning"
    if re.search(r"bandingkan|perbandingan|beda(?:kan)? ",t):return "compare"
    if re.search(r"bedah|bongkar|jenis kata|fungsi|kaidah|analisis",t):return "breakdown"
    if re.search(r"mini buka kitab|buka kitab!|menguji|cek cepat|tantangan|coba tanpa|tanpa mengintip",t):return "practice"
    if re.search(r"pegangan|sampai sini|inti pembelajaran",t):return "takeaway"
    if re.search(r"model berharakat|model bacaan|contoh berharakat",t):return "example"
    return "flow"
with zipfile.ZipFile(archive) as z:
    for n in range(17,25):
        data=extract(z,n)
        assert len(data["sublevels"])==10
        materials=[];evaluations=[];answer_keys=[]
        for k,s in enumerate(data["sublevels"],1):
            sid="L%02d-S%02d"%(n,k)
            assert s["sublevel_id"]==sid,(sid,s["sublevel_id"])
            blocks=[]
            for b in s["material_blocks"]:
                typ=b["type"]
                if typ=="MAIN_HEADING":out={"type":typ,"text":b["text"]}
                elif typ=="ARABIC_TEXT":out={"type":typ,"arabic":b["text"]}
                else:out={"type":typ,"segments":[{"text":b["text"],"marks":[]}]}
                blocks.append(out)
                if typ=="SUBHEADING":
                    semantic[str(n)+"|"+b["text"].strip().lower()]=kind(b["text"])
            qc=s.get("quick_check") or {}
            materials.append({"sublevel_id":sid,"title":s["sublevel_title"],
                "blocks":blocks,"source_competency":s["competency"],
                "quick_check":{"question":qc.get("question",""),"answer":qc.get("reference_answer","")},
                "source_meta":{key:s.get(key) for key in ("prerequisite","scope_limit","unvowelled_example","vowelled_model","natural_translation")}})
            questions=[];answers=[]
            assert len(s["questions"])==20,(sid,len(s["questions"]))
            for q in s["questions"]:
                assert len(q["options"])==6 and q.get("hint1") and q.get("hint2"),q["id"]
                correct=q["correct_index"]
                assert isinstance(correct,int) and 0<=correct<6
                assert q["options"][correct]["text"]==q["correct_text"],q["id"]
                assert q["id"].startswith(sid+"-Q"),q["id"]
                public={key:value for key,value in q.items() if key not in (
                    "options","correct_index","correct_letter","correct_text","explanation")}
                public["options"]=[{"label":o["label"],"segments":[{"text":o["text"],"marks":[]}]} for o in q["options"]]
                questions.append(public)
                answers.append({"question_id":q["id"],"correct_index":correct,"explanation":q["explanation"]})
                tot["questions"]+=1;tot["options"]+=6;tot["hints"]+=2
            eid=sid+"-EV01"
            evaluations.append({"sublevel_id":sid,"evaluation_id":eid,"questions":questions})
            answer_keys.append({"evaluation_id":eid,"answers":answers})
            tot["sublevels"]+=1;tot["blocks"]+=len(blocks)
        pubs={"materials":materials,"evaluations":evaluations}
        keys={"answer_keys":answer_keys}
        proof["levels"][str(n)]={}
        for typ,obj in (("public",pubs),("keys",keys)):
            prefix=("window.NW_LEVEL_DATA=window.NW_LEVEL_DATA||{};window.NW_LEVEL_DATA" if typ=="public"
                    else "window.NW_PRIVATE_KEYS=window.NW_PRIVATE_KEYS||{};window.NW_PRIVATE_KEYS")
            payload=json.dumps(obj,ensure_ascii=False,separators=(",",":"))
            out=dest/("level_%02d_%s.js"%(n,typ))
            assert out.exists(),"Expected existing level content: "+str(out)
            out.write_text(prefix+"["+str(n)+"]="+payload+";\n",encoding="utf-8")
            proof["levels"][str(n)][typ+"_payload_sha256"]=hashlib.sha256(payload.encode("utf-8")).hexdigest()
        tot["levels"]+=1
proof["total_material_blocks"]=tot["blocks"]
assert tot==dict(levels=8,sublevels=80,blocks=2566,questions=1600,options=9600,hints=3200),tot
docs=root/"docs/v4";docs.mkdir(parents=True,exist_ok=True)
(docs/"V4_SEMANTIC_MAPPINGS_17-24.json").write_text(json.dumps(semantic,ensure_ascii=False,indent=2),encoding="utf-8")
(docs/"V4_SOURCE_PROOF_17-24.json").write_text(json.dumps(proof,ensure_ascii=False,indent=2),encoding="utf-8")
mapping="const nwV4HeadingTypes1724="+json.dumps(semantic,ensure_ascii=False,separators=(",",":"))+";\n"
html=html.replace("function nwV4Kind(section,n){",mapping+"function nwV4Kind(section,n){",1)
needle="const raw=nwV4PlainHeading(section).trim().toLocaleLowerCase('id-ID');"
assert html.count(needle)==1
html=html.replace(needle,needle+"\n if(n>=17&&n<=24){const key=n+'|'+raw;return Object.prototype.hasOwnProperty.call(nwV4HeadingTypes1724,key)?nwV4HeadingTypes1724[key]:'flow';}",1)
html=html.replace("const isV4=(n>=1&&n<=8)||(n>=9&&n<=16);","const isV4=(n>=1&&n<=24);",1)
html=html.replace("if(n>=9&&n<=16){\n const mat=nwGetLesson(n,i);","if(n>=9&&n<=24){\n const mat=nwGetLesson(n,i);",1)
html=html.replace("(n>=9&&n<=16?nwV4QuickQuestionMarkup(lesson):'')","(n>=9&&n<=24?nwV4QuickQuestionMarkup(lesson):'')",1)
html=html.replace("level<=16?'nahwoo_eval_v4_01814':'nahwoo_eval_v0185'","level<=16?'nahwoo_eval_v4_01814':'nahwoo_eval_v4_01815'",1)
assert "const isV4=(n>=1&&n<=24);" in html
assert "level<=16?'nahwoo_eval_v4_01814':'nahwoo_eval_v4_01815'" in html
index.write_text(html,encoding="utf-8")
g=gradle.read_text().replace("versionCode 21","versionCode 22",1).replace("versionName '0.1.8.14'","versionName '0.1.8.15'",1)
gradle.write_text(g)
# The V0.1.8.13 reader QA asserted that later levels were untouched. Update that
# historical assertion to verify the intentionally expanded V4 reader range.
readerqa=root/"scripts/qa-v4-reader-semantics.js"
qatext=readerqa.read_text(encoding="utf-8")
old="assert.ok(html.includes('n>=1&&n<=8'),'Other levels untouched');"
new="assert.ok(html.includes('const isV4=(n>=1&&n<=24);'),'All 24 V4 reading levels enabled');"
assert qatext.count(old)==1,"Legacy QA assertion changed unexpectedly"
readerqa.write_text(qatext.replace(old,new),encoding="utf-8")
print("V4 LEVEL 17-24 INJECTED",dict(tot),"semantic_heading_keys",len(semantic))
