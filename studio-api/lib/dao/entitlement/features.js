function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function parseFeatures(raw, path = "features") {
  if (!isObject(raw)) throw new Error(`${path} must be an object`)
  const clean = {}
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "boolean") clean[key] = value
    else if (isObject(value))
      clean[key] = parseFeatures(value, `${path}.${key}`)
    else throw new Error(`${path}.${key} must be a boolean or an object`)
  }
  return clean
}

function hasFeature(features, path) {
  let node = features
  for (const part of path.split(".")) {
    if (!node || typeof node !== "object") return false
    node = node[part]
  }
  return node === true
}

module.exports = {
  parseFeatures,
  hasFeature,
}
