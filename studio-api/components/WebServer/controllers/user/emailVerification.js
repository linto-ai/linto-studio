const moment = require("moment")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const Mailing = require(`${process.cwd()}/lib/mailer/mailing`)
const VALIDITY_DATE = require(
  `${process.cwd()}/lib/dao/validityDate/validityDate.js`,
)
const { GenerateMagicLinkError } = require(
  `${process.cwd()}/components/WebServer/error/exception/users`,
)
const { NodemailerError } = require(
  `${process.cwd()}/components/WebServer/error/exception/nodemailer`,
)

// Address awaiting confirmation, ignored once its validity has passed
function activePendingEmail(user) {
  const pending = user?.pendingEmail
  if (!pending?.address) return null
  if (!moment().isBefore(pending.validityDate)) return null
  return pending.address
}

function pendingEmailFor(address) {
  return {
    address,
    validityDate: VALIDITY_DATE.generateValidityDate(VALIDITY_DATE.SHORT),
  }
}

// A magic link only proves the address it was sent to
function verifiedFieldsFromLink(user) {
  const target = user.authLink?.email
  const fields = { authLink: { magicId: null, validityDate: null } }
  const promotesPending = Boolean(target) && target === activePendingEmail(user)
  if (!promotesPending && target !== user.email) return fields

  const verifiedEmail = [...(user.verifiedEmail || [])]
  if (promotesPending) {
    if (user.emailIsVerified && !verifiedEmail.includes(user.email)) {
      verifiedEmail.push(user.email)
    }
    fields.email = target
    fields.pendingEmail = null
  }
  if (!verifiedEmail.includes(target)) verifiedEmail.push(target)
  return { ...fields, emailIsVerified: true, verifiedEmail }
}

async function sendVerificationLink(userId, address, req) {
  const link = await model.users.generateMagicLink({
    _id: userId,
    email: address,
  })
  if (link.modifiedCount === 0) throw new GenerateMagicLinkError()

  const sent = await Mailing.verifyEmailAddress(address, req, link.data.magicId)
  if (!sent) throw new NodemailerError()
}

// The new address stays pending until its own link is clicked
async function requestEmailChange(userId, address, req) {
  await model.users.update({
    _id: userId,
    pendingEmail: pendingEmailFor(address),
  })
  await sendVerificationLink(userId, address, req)
}

module.exports = {
  activePendingEmail,
  pendingEmailFor,
  verifiedFieldsFromLink,
  sendVerificationLink,
  requestEmailChange,
}
