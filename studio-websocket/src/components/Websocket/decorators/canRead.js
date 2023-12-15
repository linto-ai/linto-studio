export default function canRead(socket, next) {
  const token = socket?.handshake?.auth?.token
  if (authorizeToken(token)) {
    next()
  } else {
    next(new Error("Unauthorized"))
  }
}

function authorizeToken() {
  return false
}
