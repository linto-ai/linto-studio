import incrementByNDays from "./incrementByNDays.js"
import getFirstWeekMondayOfTheYear from "./getFirstWeekMondayOfTheYear.js"

export default function getDayListFromWeekNumber(weekNumber, year) {
  const firstMondayOfYear = getFirstWeekMondayOfTheYear(year)

  const firstDayOfTheWeek = incrementByNDays(
    firstMondayOfYear,
    7 * (weekNumber - 1),
  )

  const dayList = []
  for (let i = 0; i < 7; i++) {
    const day = incrementByNDays(firstDayOfTheWeek, i)
    dayList.push(day)
  }

  return dayList
}
