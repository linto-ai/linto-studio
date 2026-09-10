const dns = require("dns").promises
const net = require("net")

const { ConversationURLExtractorError } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

// Loopback, private, link-local (cloud metadata included), CGNAT, multicast
const blocked = new net.BlockList()
for (const [address, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.168.0.0", 16],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
]) {
  blocked.addSubnet(address, prefix, "ipv4")
}
blocked.addAddress("::", "ipv6")
blocked.addAddress("::1", "ipv6")
for (const [address, prefix] of [
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
]) {
  blocked.addSubnet(address, prefix, "ipv6")
}

// Only http(s) toward a publicly routable host may be fetched on behalf of a user
async function assertPublicHttpUrl(raw) {
  let url
  try {
    url = new URL(raw)
  } catch {
    throw new ConversationURLExtractorError("Invalid URL")
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ConversationURLExtractorError(
      "Only http and https URLs are allowed",
    )
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "")
  const addresses = await dns.lookup(hostname, { all: true }).catch(() => [])
  if (addresses.length === 0) {
    throw new ConversationURLExtractorError("URL host cannot be resolved")
  }
  for (const { address, family } of addresses) {
    if (blocked.check(address, family === 6 ? "ipv6" : "ipv4")) {
      throw new ConversationURLExtractorError("URL must target a public host")
    }
  }
  return url.href
}

module.exports = { assertPublicHttpUrl }
