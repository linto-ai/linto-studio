// This function is used to extract the value of a cookie from the request headers
// Example of key : authToken, userId, ...
const getUserValueFromCookies = (cookies, key) => {
  if (!cookies) return null

  const authCookie = cookies
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(key + "="))

  if (!authCookie) return null

  const value = authCookie.split("=")[1]
  return value || null
}

module.exports = { getUserValueFromCookies }
