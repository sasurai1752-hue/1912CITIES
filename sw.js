const CACHE="1912cities-v04";
const ASSETS=["./","./manifest.webmanifest"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin&&(u.pathname.endsWith("/1912CITIES/")||u.pathname.endsWith("/1912CITIES/index.html"))){
    e.respondWith(fetch(e.request,{cache:"no-store"}).then(async resp=>{
      let text=await resp.text();
      text=text.replace('m.type==="行政区"?"区":"市"','({"市":"市","町":"町","村":"村","特別区":"区","行政区":"区"}[m.type]||m.type)');
      return new Response(text,{status:resp.status,statusText:resp.statusText,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}});
    }).catch(()=>caches.match("./")));
    return;
  }
  e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp}).catch(()=>caches.match(e.request)));
});