// 1912CITIES v0.34: navigation network-first, never rewrite HTML in the service worker.
const CACHE="1912cities-static-v0.34";
self.addEventListener("install",event=>{self.skipWaiting()});
self.addEventListener("activate",event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith("1912cities-")&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener("fetch",event=>{
 const request=event.request;
 if(request.method!=="GET"||request.mode!=="navigate")return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(request,{cache:"no-store"});
   if(response.ok)await cache.put("./index.html",response.clone());
   return response;
  }catch(error){
   return await cache.match("./index.html")||Response.error();
  }
 })());
});
