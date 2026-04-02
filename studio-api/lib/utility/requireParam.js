function requireParam(value, ExceptionClass, message) {
  if (!value) throw new ExceptionClass(message)
}

module.exports = { requireParam }
