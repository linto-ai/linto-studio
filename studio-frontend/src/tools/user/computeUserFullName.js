/**
 * Joins the first and last name that are filled in, empty string when none is
 * (an invited account that has not completed its profile yet).
 * @param {{ firstname?: string, lastname?: string }} user
 * @returns {string}
 */
export function computeUserFullName(user) {
  return [user?.firstname, user?.lastname]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ")
}
