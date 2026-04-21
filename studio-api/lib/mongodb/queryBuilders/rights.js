function customRightsAllowed(userId, desiredAccess) {
  return {
    "organization.customRights": {
      $elemMatch: {
        userId: userId,
        right: { $bitsAnySet: desiredAccess },
      },
    },
  }
}

function customRightsNotMember(userId) {
  return {
    "organization.customRights": {
      $not: {
        $elemMatch: {
          userId: userId,
        },
      },
    },
  }
}

function sharedWithUsersAllowed(userId, desiredAccess) {
  return {
    sharedWithUsers: {
      $elemMatch: {
        userId: userId,
        right: { $bitsAnySet: desiredAccess },
      },
    },
  }
}

module.exports = {
  customRightsAllowed,
  customRightsNotMember,
  sharedWithUsersAllowed,
}
