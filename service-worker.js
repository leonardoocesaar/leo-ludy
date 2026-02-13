self.addEventListener("install",e=>{
    e.waitUntil(
        caches.open("leo-ludy").then(cache=>{
            return cache.addAll(["index.html"]);
        })
    );
});
