const crypto = require("crypto")

console.log(process.env.SSO_ENCRYPTION_KEY)

const rawKey =
  process.env.SSO_ENCRYPTION_KEY ||
  "default_platform_encryption_key_please_change"
const ENCRYPTION_KEY = crypto.createHash("sha256").update(rawKey).digest()
const IV_LENGTH = 16

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv)

  let encrypted = cipher.update(text, "utf8", "base64")
  encrypted += cipher.final("base64")

  return iv.toString("base64") + ":" + encrypted
}

function decrypt(encoded) {
  const [ivPart, encryptedPart] = encoded.split(":")

  const iv = Buffer.from(ivPart, "base64")
  const encryptedText = encryptedPart

  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv)

  let decrypted = decipher.update(encryptedText, "base64", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

module.exports = { encrypt, decrypt }
