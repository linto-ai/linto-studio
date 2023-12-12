export default function canEdit(socket, next) {
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
