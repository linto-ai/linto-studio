// Value of a date input ("2027-05-24") -> ISO instant of the beginning of this
// day for the user. null for an empty input.
export default function dateInputToIso(value) {
  if (!value) return null
  return new Date(`${value}T00:00`).toISOString()
}
