export default function withSocket(socket, next) {
  return (...args) => next(socket, ...args)
}
