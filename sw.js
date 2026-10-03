const APP_VERSION="0.25";
const CACHE=`1912cities-v${APP_VERSION.replace('.','')}`;
const ASSETS=["./","./manifest.webmanifest"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 if(u.origin===location.origin&&(u.pathname.endsWith("/1912CITIES/")||u.pathname.endsWith("/1912CITIES/index.html"))){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(async resp=>{
   let text=await resp.text();
   text=text.replace(/Prototype v0\.2/g,`Prototype v${APP_VERSION}`);
   text=text.replace('m.type==="行政区"?"区":"市"','({"市":"市","町":"町","村":"村","特別区":"区","行政区":"区"}[m.type]||m.type)');
   text=text.replace('const recent=visits.slice().reverse().slice(0,4);','const recent=visits.slice().reverse().slice(0,4); const adminDoneHome=MUNICIPALITIES.filter(x=>x.type==="行政区"&&done.has(x.code)).length; const muniDoneHome=done.size-adminDoneHome; const muniPctHome=((muniDoneHome/1741)*100).toFixed(2); const adminPctHome=((adminDoneHome/171)*100).toFixed(2); const totalPctHome=((done.size/1912)*100).toFixed(2);');
   text=text.replace('全国1,912対象をめぐる。','全国1,912市区町村をめぐる。');
   text=text.replace('<div class="sub">1,741市区町村＋171行政区。通過ではなく、その土地に降り立って何かをしたら制覇。</div>','');
   text=text.replace('制覇率 ${pct()}%','制覇率 ${totalPctHome}%');
   text=text.replace('<div class="cardtitle">マスターデータ</div><div class="stats"><div class="stat"><div class="sl">市区町村</div><div class="sn">1,741</div></div><div class="stat"><div class="sl">行政区</div><div class="sn">171</div></div><div class="stat"><div class="sl">合計</div><div class="sn">1,912</div></div></div><div class="note">アップロードされた自治体マスターを組み込み済み。北方領土6件は標準1,912対象から除外しています。</div>','<div class="cardtitle">制覇数</div><div class="stats"><div class="stat"><div class="sl">市区町村</div><div class="sn">${muniDoneHome}<span style="font-size:12px"> / 1,741</span></div><div class="mm">${muniPctHome}%</div></div><div class="stat"><div class="sl">行政区</div><div class="sn">${adminDoneHome}<span style="font-size:12px"> / 171</span></div><div class="mm">${adminPctHome}%</div></div><div class="stat"><div class="sl">合計</div><div class="sn">${done.size}<span style="font-size:12px"> / 1,912</span></div><div class="mm">${totalPctHome}%</div></div></div><div class="note">北方領土の6村（色丹村、泊村、留夜別村、留別村、紗那村、蘂取村）は対象外としています。</div>');
   text=text.replace('font-size:12px}.input:focus','font-size:16px}.input:focus');
   text=text.replace('$("search").oninput=e=>{q=e.target.value;pageNo=1;render()};',`(()=>{const s=$("search");let composing=false;const apply=value=>{q=value;pageNo=1;render();requestAnimationFrame(()=>{const n=$("search");if(n){n.focus({preventScroll:true});try{const p=n.value.length;n.setSelectionRange(p,p)}catch(_){}}})};s.addEventListener("compositionstart",()=>{composing=true});s.addEventListener("compositionend",e=>{composing=false;apply(e.target.value)});s.addEventListener("input",e=>{if(composing||e.isComposing)return;apply(e.target.value)})})();`);
   return new Response(text,{status:resp.status,statusText:resp.statusText,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}});
  }).catch(()=>caches.match("./")));
  return;
 }
 e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp}).catch(()=>caches.match(e.request)));
});