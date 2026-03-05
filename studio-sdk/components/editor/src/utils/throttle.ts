function throttle(fn: (...args: unknown[]) => void, delay = 250) {
  let isThrottled = false
  return (...args: unknown[]) => {
    if (isThrottled) return
    isThrottled = true
    fn(...args)
    setTimeout(() => {
      isThrottled = false
    }, delay)
  }
}

export default throttle
