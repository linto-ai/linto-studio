const dns = require("dns").promises
const ipaddr = require("ipaddr.js")

// "unicast" is the only publicly routable range, everything else stays inside
function isPublicAddress(address) {
  let parsed = ipaddr.parse(address)
  if (parsed.kind() === "ipv6" && parsed.isIPv4MappedAddress()) {
    parsed = parsed.toIPv4Address()
  }
  return parsed.range() === "unicast"
}

// Only http(s) toward a publicly routable host may be fetched on behalf of a user
async function assertPublicHttpUrl(raw) {
  let url
  try {
    url = new URL(raw)
  } catch {
    throw new Error("Invalid URL")
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed")
  }

  // URL keeps the brackets of an IPv6 literal, dns.lookup does not want them
  const hostname = url.hostname.replace(/^\[|\]$/g, "")
  const addresses = await dns.lookup(hostname, { all: true }).catch(() => [])
  if (addresses.length === 0) throw new Error("URL host cannot be resolved")
  if (!addresses.every(({ address }) => isPublicAddress(address))) {
    throw new Error("URL must target a public host")
  }
  return url.href
}

module.exports = { assertPublicHttpUrl }
