import { capitalizeFirstLetter } from "./capitalizeFirstLetter"

export function userName(user) {
  if (!user.firstname || !user.lastname)
    return capitalizeFirstLetter(user.email)
  return `${capitalizeFirstLetter(user.firstname)} ${capitalizeFirstLetter(
    user.lastname
  )}`.substring(0, 24)
}
