import getFirstWeekMondayOfTheYear from "./getFirstWeekMondayOfTheYear.js"

export default function getWeekNumberFromDate(date) {
  const year = date.getFullYear()

  const firstMonday = getFirstWeekMondayOfTheYear(year)
  firstMonday.setHours(0, 0, 0, 0)

  if (date < firstMonday) {
    return getWeekNumberFromDate(new Date(`${year - 1}-12-31`))
  }

  const dateAtMidnight = new Date(date)
  dateAtMidnight.setHours(0, 0, 0, 0)

  const mondayOfWeek = new Date(dateAtMidnight)
  mondayOfWeek.setDate(
    dateAtMidnight.getDate() - (dateAtMidnight.getDay() || 7) + 1,
  )

  const diffInDays = (dateAtMidnight - firstMonday) / 86400000
  const weekNo = Math.ceil((diffInDays + 1) / 7)
  return weekNo
}
