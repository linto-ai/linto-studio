const RIGHTS = Object.freeze({
  "UNDEFINED": 0,
  "READ": 1,
  "WRITE": 2,
  "DOWNLOAD": 4,
  "SHARE": 8,
  "ADMIN": 16,
  "OWNER": 32,
  asRightAccess: (userRight, desiredRight) => ((userRight & desiredRight) == desiredRight)
})

const TYPES = {
  public : 'public',
  private: 'private',
  personal: 'personal',  // Only one user when he is created
  asType: type => (type in TYPES)
}

module.exports = {
  RIGHTS : RIGHTS,
  TYPES : TYPES
}