export const debounce = (func, duration) => {
  let timeout
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, duration)
  }
}
