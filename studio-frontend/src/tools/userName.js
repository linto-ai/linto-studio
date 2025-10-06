import { capitalizeFirstLetter } from "./capitalizeFirstLetter"

export function userName(user) {
  if (user.fullName) return user.fullName.substring(0, 24)
  if (user?.firstname == null || user?.lastname == null)
    return capitalizeFirstLetter(user?.email || "Unknown email")
  return `${capitalizeFirstLetter(user.firstname)} ${capitalizeFirstLetter(
    user.lastname,
  )}`.substring(0, 24)
}
