/**
 * @param cacheList 缓存对象
 * @param path 缓存路径
 * @param filesReg 缓存文件名，数组类型，内容可为字符串|正则表达式
 */
module.exports = {
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
  vision: 'healthy-wx-v1.0.0'
};
