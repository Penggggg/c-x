export function watch(ctx: any, obj: any) {
    Object.keys(obj).forEach(key => {
      defineReactive(ctx.data, key, ctx.data[key], function(value: any) {
        obj[key].call(ctx, value)
      })
    })
  }
  
export function computed(ctx: any, obj: any) {
    let keys = Object.keys(obj)
    let dataKeys = Object.keys(ctx.data)
    dataKeys.forEach(dataKey => {
      defineReactive(ctx.data, dataKey, ctx.data[dataKey])
    })
    let firstComputedObj = keys.reduce((prev: any, next) => {
      ctx.data.$target = function() {
        ctx.setData({ [next]: obj[next].call(ctx) })
      }
      prev[next] = obj[next].call(ctx)
      ctx.data.$target = null
      return prev
    }, {})
    ctx.setData(firstComputedObj)
  }
  
  function defineReactive(data: any, key: any, val: any, fn?: any) {
    let subs = data['$' + key] || []
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function() {
        if (data.$target) {
          subs.push(data.$target)
          data['$' + key] = subs
        }
        return val
      },
      set: function(newVal) {
        if (newVal === val) return
        fn && fn(newVal)
        if (subs.length) {
          // 用 setTimeout 因为此时 this.data 还没更新
          setTimeout(() => {
            subs.forEach((sub: any) => sub())
          }, 0)
        }
        val = newVal
      },
    })
  }
  
