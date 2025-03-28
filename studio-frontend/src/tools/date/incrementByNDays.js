export default function incrementByNDays(date, n) {
  let newDate = new Date(date)
  newDate.setDate(date.getDate() + n)
  return newDate
}
