export default function throttle<T extends Function>(
  fn: T,
  interval = 200,
  options = { leading: true, trailing: false, resultCallback: Function }
): T {
  // 1.计算剩余的时间
  const { leading, trailing, resultCallback } = options
  let lastTime = 0
  let timer: number | null = null

  // 2.事件触发时, 真正执行的函数
  function _throttle(this: any, ...args: any[]) {
    return new Promise((resolve) => {
      // 2.1.获取事件触发时的时间
      const nowTime = new Date().getTime()
      if (!leading && !lastTime) lastTime = nowTime
      // 2.2.使用事件触发时间和间隔时间以及上次触发事件时间, 计算出还剩多长时间去触发函数
      const remainTime = interval - (nowTime - lastTime)

      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        // 2.3.真正触发函数
        const result = fn.apply(this, args)
        if (resultCallback) resultCallback(result)
        resolve(result)
        // 2.4.保留触发事件时间
        lastTime = nowTime
      } else if (trailing && !timer) {
        timer = setTimeout(() => {
          const result = fn.apply(this, args)
          if (resultCallback) resultCallback(result)
          resolve(result)
          lastTime = leading ? 0 : new Date().getTime()
          timer = null
        }, remainTime)
      }
    })
  }

  _throttle.cancel = function () {
    if (timer) clearTimeout(timer)
    lastTime = 0
    timer = null
  }

  return (_throttle as Function) as T
}
