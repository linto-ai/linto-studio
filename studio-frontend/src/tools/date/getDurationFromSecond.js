export default function getDurationFromSecond(seconds) {
  const numberOfHours = Math.ceil(seconds / 3600)

  const numberOfDays = numberOfHours / 24

  if (numberOfDays != Math.trunc(numberOfDays)) {
    return numberOfHours + "h"
  }

  const numberOfYears = numberOfDays / 365

  if (numberOfYears != Math.trunc(numberOfYears)) {
    return numberOfDays + "d"
  }

  return numberOfYears + "y"
}
