const PERMISSIONS_ENUM = Object.freeze({
  UPLOAD: "upload",
  QUICK_MEETING: "quick_meeting",
  SUMMARY: "summary",
  SESSION: "session",
})

// Function to get default permissions based on ORGANIZATION_DEFAULT_PERMISSIONS
function getDefaultPermissions() {
  // Initialize permissions based on PERMISSIONS_ENUM with all values set to false
  const permissions = Object.values(PERMISSIONS_ENUM).reduce((acc, key) => {
    acc[key] = false
    return acc
  }, {})

  // Check environment variable and set corresponding permissions to true
  const envPermissions = process.env.ORGANIZATION_DEFAULT_PERMISSIONS
    ? process.env.ORGANIZATION_DEFAULT_PERMISSIONS.split(",")
    : []

  envPermissions.forEach((permission) => {
    if (permissions.hasOwnProperty(permission)) {
      permissions[permission] = true
    }
  })

  return permissions
}

// Function to validate and set default permissions in a given object
function validateAndSetDefaultPermissions(
  inputPermissions,
  defaultPermissions,
) {
  if (!defaultPermissions) defaultPermissions = getDefaultPermissions()

  // Ensure only valid permissions are included, using the default values if undefined
  const validatedPermissions = { ...defaultPermissions, ...inputPermissions }

  return validatedPermissions
}

module.exports = {
  getDefaultPermissions,
  validateAndSetDefaultPermissions,
}
