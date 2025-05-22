import { capitalizeFirstLetter } from "./capitalizeFirstLetter"

export function userName(user) {
  if (user.fullName) return user.fullName.substring(0, 24)
  // if (!user) retur
  if (!user.firstname || !user.lastname)
    return capitalizeFirstLetter(user.email)
  return `${capitalizeFirstLetter(user.firstname)} ${capitalizeFirstLetter(
    user.lastname,
  )}`.substring(0, 24)
}
