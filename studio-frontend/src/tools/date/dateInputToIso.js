// Value of a date input ("2027-05-24") -> ISO instant of the beginning of this
// day for the user. null for an empty input.
export default function dateInputToIso(value) {
  if (!value) return null
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day).toISOString()
}
