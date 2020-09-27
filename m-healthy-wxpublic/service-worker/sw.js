// const config = require("./config");
const config = {
  cacheList: {
    // 渐进式
    progressive: [
      /^.*api\/order\/getPhoto.*$/
    ]
  },
  /** 普通预加载缓存列表，即使资源加载失败也不影响sw的安装 */
  preCacheList: [],
  /** 重要预加载缓存列表，资源加载成功才能顺利完成 */
  vipPreCacheList: [],
  rootPath: '/public',
  vision: 'healthy-wx-v1.0.1'
};;

const CACHE_STORAGE_KEY = config.vision;
const strategy = {
  StaleWhileRevalidate: () => { },
  progressive: e => {
    e.respondWith(
      // 首先判断缓存当中是否已有相同资源
      caches
        .open(CACHE_STORAGE_KEY)
        .then(cache => {
          return cache.match(e.request.url);
        })
        .then(resp => {
          if (!resp) {
            return fetchBackend(e.request);
          } else {
            return resp;
          }
        })
    );
  },
  onlyCache: e => {
    e.respondWith(
      caches.open(CACHE_STORAGE_KEY).then(cache => {
        return cache.match(e.request.url);
      })
    );
  },
  onlyNet: e => {
    e.respondWith(fetch(e.request));
  },
  firstCache: e => {
    e.respondWith(
      // 首先判断缓存当中是否已有相同资源
      caches.match(e.request).then(function (response) {
        if (response != null) {
          // 如果缓存中已有资源则直接使用
          // 否则使用fetch API请求新的资源并你缓存
          return response;
        }
        return fetchBackend(e.request);
      })
    );
  },
  firstNet: e => {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.open(CACHE_STORAGE_KEY).then(cache => {
          return cache.match(e.request.url);
        });
      })
    );
  }
};

/** 请求后台 */
const fetchBackend = req => {
  return fetch(req.clone()).then(resp => {
    const respClone = resp.clone();
    if (resp.status !== 200) {
      return resp;
    }
    caches.open(CACHE_STORAGE_KEY).then(cache => {
      cache.put(req.clone(), respClone);
    });
    return resp;
  });
};

// self.clients.matchAll().then(clients => {
//   clients.forEach(client => {
//     console.log("%c [sw message]", "color:#00aa00", client);
//     client.postMessage("This message is from serviceWorker");
//   });
// });

// 当浏览器解析完sw文件时，sw内部触发install事件
self.addEventListener("install", function (e) {
  // 打开一个缓存空间，将相关需要缓存的资源添加到缓存里面
  e.waitUntil(
    caches
      .open(CACHE_STORAGE_KEY)
      .then(function (cache) {
        cache.addAll(config.preCacheList);
        return cache.addAll(config.vipPreCacheList);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});
// 如果当前浏览器没有激活的service worker或者已经激活的worker被解雇，
// 新的service worker进入active事件
self.addEventListener("activate", function (e) {
  // active事件中通常做一些过期资源释放的工作
  const cacheDeletePromises = caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(name => {
        if (name !== CACHE_STORAGE_KEY) {
          // 如果资源的key与当前需要缓存的key不同则释放资源
          const deletePromise = caches.delete(name);
          return deletePromise;
        } else {
          return Promise.resolve();
        }
      })
    );
  });
  e.waitUntil(
    Promise.all([cacheDeletePromises]).then(() => {
      return self.clients.claim();
    })
  );
});
self.addEventListener("fetch", function (e) {

  Object.keys(config.cacheList).map(key => {
    if (strategy.hasOwnProperty(key)) {
      config.cacheList[key].map(item => {
        if(e.request.url === item || item.test(e.request.url)){
          console.log(
            `%c Service-worker`,
            "color:white;font-weight:bold;background:#02A9E0;padding: 2px 6px;border-radius:4px;",
            `拦截URL：${e.request.url}`
          );
          strategy[key](e);
        }
      })
    } else {
      console.error('Error: 不存在', key, '方法');
    }
  })
});
