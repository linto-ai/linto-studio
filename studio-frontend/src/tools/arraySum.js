export function arraySum(arrayOfNumber) {
  return arrayOfNumber.reduce(function (a, b) {
    return a + b
  }, 0)
}
