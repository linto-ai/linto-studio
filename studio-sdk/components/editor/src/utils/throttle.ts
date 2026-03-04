function throttle(fn: (...args: unknown[]) => void, delay = 250) {
  let isThrottled = false
  let timer: ReturnType<typeof setTimeout>

  return (...args: unknown[]) => {
    if (isThrottled) return
    isThrottled = true
    fn(...args)
    timer = setTimeout(() => {
      isThrottled = false
    }, delay)
  }
}

export default throttle
