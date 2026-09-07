function throttle(fn: (...args: unknown[]) => void, delay = 250) {
  let isThrottled = false
  let pendingArgs: unknown[] | null = null

  return (...args: unknown[]) => {
    if (isThrottled) {
      pendingArgs = args
      return
    }
    isThrottled = true
    fn(...args)
    setTimeout(() => {
      isThrottled = false
      if (pendingArgs !== null) {
        const saved = pendingArgs
        pendingArgs = null
        fn(...saved)
      }
    }, delay)
  }
}

export { throttle }
