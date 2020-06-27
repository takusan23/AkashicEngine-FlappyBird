// キャッシュしないといけないファイルを列挙する。間違えないように
const CACHE_LIST = [
    "/icons/icon_192.png",
    "/icons/icon_512.png",
    "/image/play.png",
    "/image/result.png",
    "/image/title.png",
    "/image/tori.png",
    "index.html",
    "manifest.json",
    "/"
]

// バージョンの名前。識別に使う
const VERSION_NAME = 'bird_20200627' // ここの値が変わるとキャッシュを再登録するっぽい？

// インストール時に
self.addEventListener('install', event => {
    console.log('インストールするぞ')
    event.waitUntil(
        caches.open(VERSION_NAME).then(cache => {
            return cache.addAll(CACHE_LIST) // キャッシュ登録
        }).catch(err => { console.log(err) }) // えらー
    )
})

// リクエストを横取りする
self.addEventListener('fetch', event => {
    // キャッシュの内容に置き換える
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
})

// 古いキャッシュを消す。
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName !== VERSION_NAME;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
