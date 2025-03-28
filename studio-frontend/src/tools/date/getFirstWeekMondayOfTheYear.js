import incrementByNDays from "./incrementByNDays.js"

export default function getFirstWeekMondayOfTheYear(year) {
  const firstDayOfYear = new Date(`${year}-01-01`)
  const dayInWeekOfFirstDay = firstDayOfYear.getDay() // 1 is monday, 0 is sunday, 6 is saturday
  let numberOfDayToIncrementUntilMonday = 0
  switch (dayInWeekOfFirstDay) {
    case 0: // sunday
      numberOfDayToIncrementUntilMonday = 1
      break
    case 1: // monday
      numberOfDayToIncrementUntilMonday = 0
      break
    case 2: // tuesday
      numberOfDayToIncrementUntilMonday = -1
      break
    case 3: // wednesday
      numberOfDayToIncrementUntilMonday = -2
      break
    case 4: // thursday
      numberOfDayToIncrementUntilMonday = -3
      break
    case 5: // friday
      numberOfDayToIncrementUntilMonday = 3
      break
    case 6: // saturday
      numberOfDayToIncrementUntilMonday = 2
      break
  }
  // increment the first day of the year with the number of days to reach the first monday
  const firstMondayOfYear = incrementByNDays(
    firstDayOfYear,
    numberOfDayToIncrementUntilMonday,
  )
  return firstMondayOfYear
}
