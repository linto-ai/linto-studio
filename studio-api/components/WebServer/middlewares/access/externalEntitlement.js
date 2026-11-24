const { callerOf } = require(`./platform`)
const { isExternalKey } = require(
  `${process.cwd()}/lib/utility/externalIdentity`,
)
const { resolveFeatures } = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/resolve`,
)
const { hasFeature, canQuickMeeting, PERMISSION_FEATURES } = require(
  `${process.cwd()}/lib/dao/entitlement/features`,
)
const { EntitlementFeatureForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/entitlement`,
)
const { SessionForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/session`,
)

// Never kept beyond the request, so that a lost right bites at once
async function externalFeaturesOf(req) {
  if (req.externalFeatures === undefined) {
    const user = await callerOf(req)
    const identity = isExternalKey(user) ? user.metadata.externalIdentity : null
    const root = user?.metadata?.organizationId
    req.externalFeatures = identity
      ? (root && (await resolveFeatures(identity, root))) || {}
      : null
  }
  return req.externalFeatures
}

async function isExternalCaller(req) {
  return !!req.payload?.data?.userId && isExternalKey(await callerOf(req))
}

async function assertPermissionFeature(req, permission) {
  const feature = PERMISSION_FEATURES[permission]
  if (!feature || !req.payload?.data?.userId) return
  const features = await externalFeaturesOf(req)
  if (features && !hasFeature(features, feature)) {
    throw new EntitlementFeatureForbidden(
      `This API key is not entitled to ${feature}`,
      { capability: feature },
    )
  }
}

async function denyExternalCaller(req, res, next) {
  try {
    if (!(await isExternalCaller(req))) return next()
    next(new SessionForbidden("Not available to an external API key"))
  } catch (err) {
    next(err)
  }
}

async function quickMeetingAccess(req, res, next) {
  try {
    const features = await externalFeaturesOf(req)
    if (canQuickMeeting(await callerOf(req), features)) return next()
    next(
      new SessionForbidden(
        "This API key is not allowed to start a quick meeting",
        { code: "quick_meeting_disabled" },
      ),
    )
  } catch (err) {
    next(err)
  }
}

module.exports = {
  assertPermissionFeature,
  quickMeetingAccess,
  isExternalCaller,
  denyExternalCaller,
}
