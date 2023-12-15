var timerId, args, context
export class Throttle {
  constructor() {
    this.timerId = null
    this.args = null
    this.context = null

    this.functionThrottled = null
  }

  createThrottle(func, delay) {
    this.functionThrottled = func
    const throttleInstance = this

    function throttleFunction() {
      throttleInstance.context = this // this is the context of the function that is being throttled (ex: the vuejs component)
      throttleInstance.args = arguments

      if (throttleInstance.timerId) {
        return
      }

      // Schedule a setTimeout after delay seconds
      throttleInstance.timerId = setTimeout(function () {
        throttleInstance.executeNow()
      }, delay)
    }

    return throttleFunction
  }

  executeNow() {
    if (this.timerId) {
      this.clearThrottle()
      this.functionThrottled.apply(this.context, this.args)
    }
  }

  clearThrottle() {
    clearTimeout(this.timerId)
    this.timerId = undefined
  }
}
