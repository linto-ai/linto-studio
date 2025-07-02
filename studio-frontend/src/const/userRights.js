export default Object.freeze({
  UNDEFINED: 0,
  READ: 1,
  COMMENT: 2,
  WRITE: 4,
  DELETE: 8,
  SHARE: 16,
  hasRightAccess: (userRight, desiredRight) =>
    (userRight & desiredRight) == desiredRight,
})
