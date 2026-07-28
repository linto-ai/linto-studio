// Models return their errors as values; normalize to a throw at the call site
function throwIfError(result) {
  if (result instanceof Error) throw result
  return result
}

module.exports = { throwIfError }
