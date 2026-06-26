export function pickKwarg(args, ...keys) {
  for (const key of keys) {
    if (args?.[key] !== undefined) return args[key]
  }
  return undefined
}
