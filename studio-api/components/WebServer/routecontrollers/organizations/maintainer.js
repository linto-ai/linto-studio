const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:maintainer",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const Mailing = require(`${process.cwd()}/lib/mailer/mailing`)

const orgaUtility = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

const { updateChildConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/child`,
)

const {
  OrganizationError,
  OrganizationUnsupportedMediaType,
  OrganizationForbidden,
  OrganizationNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/organization`,
)

const { ConversationError, ConversationNotFound } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)
const saas = require(`${process.cwd()}/lib/saas`)

const { requireParam } = require(`${process.cwd()}/lib/utility/requireParam`)

async function addUserInOrganization(req, res, next) {
  try {
    requireParam(req.body.email, OrganizationUnsupportedMediaType)
    requireParam(req.body.role, OrganizationUnsupportedMediaType)

    if (isNaN(req.body.role) && ROLES.checkValue(req.body.role))
      throw new OrganizationUnsupportedMediaType("Role value is not valid")
    if (ROLES.canGiveAccess(req.body.role, req.userRole))
      throw new OrganizationForbidden()

    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0) throw new OrganizationNotFound()
    else organization = organization[0]

    const sharedUser = await model.users.getById(req.payload.data.userId)
    const userId = await orgaUtility.inviteMemberByEmail({
      organization,
      email: req.body.email,
      role: req.body.role,
      inviterEmail: sharedUser[0].email,
      origin: req,
    })

    saas.syncOrgSeats(req.params.organizationId, organization)

    const conversations = await model.conversations.getSharedConvFromOrga(
      req.params.organizationId,
      userId,
    )
    conversations.map(async (conv) => {
      conv.sharedWithUsers = conv.sharedWithUsers.filter(
        (u) => u.userId !== userId,
      )
      await model.conversations.update(conv)
    })

    res.status(201).send({
      message: req.body.email + " has been added to the organization",
    })
  } catch (err) {
    next(err)
  }
}

async function updateUserFromOrganization(req, res, next) {
  try {
    requireParam(req.body.userId, OrganizationUnsupportedMediaType)
    requireParam(req.body.role, OrganizationUnsupportedMediaType)

    if (isNaN(req.body.role) && ROLES.checkValue(req.body.role))
      throw new OrganizationUnsupportedMediaType("Role value is not valid")
    if (ROLES.canGiveAccess(req.body.role, req.userRole))
      throw new OrganizationForbidden()

    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0) throw new OrganizationNotFound()
    else organization = organization[0]

    const userRole = parseInt(req.body.role)

    if (
      organization.users.filter((oUser) => oUser.userId === req.body.userId)
        .length === 0
    )
      throw new OrganizationError(
        "User is not part of the " + organization.name,
      )

    organization.users.map((oUser) => {
      if (oUser.userId === req.body.userId) {
        if (ROLES.hasRoleAccess(req.userRole, oUser.role))
          // Update role need to be lower or equal than my current role
          oUser.role = userRole
        else throw new OrganizationForbidden()
        return
      }
    })

    const data = orgaUtility.countAdmin(organization, req.body.userId)
    if (data.adminCount === 0)
      throw new OrganizationForbidden("You cannot change the last admin role")

    const result = await model.organizations.update(organization)
    if (result.matchedCount === 0)
      throw new OrganizationError("Error while updating user in organization")

    saas.syncOrgSeats(req.params.organizationId, organization)

    user = await model.users.getById(req.body.userId, true)
    await Mailing.organizationRightUpdate(user[0], req, organization.name)

    res.status(200).send({
      message: "Updated user from the organization",
    })
  } catch (err) {
    next(err)
  }
}

async function deleteUserFromOrganization(req, res, next) {
  try {
    requireParam(req.body.userId, OrganizationUnsupportedMediaType)

    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0) throw new OrganizationNotFound()
    else organization = organization[0]

    let user = organization.users.filter(
      (oUser) => oUser.userId === req.body.userId,
    )

    if (user.length === 0)
      throw new OrganizationNotFound("User is not in " + organization.name)
    if (!ROLES.hasRevokeRoleAccess(user[0].role, req.userRole))
      throw new OrganizationForbidden() // Update role need to be lower or equal than my current role

    organization.users = organization.users.filter(
      (oUser) => oUser.userId !== req.body.userId,
    )

    const data = orgaUtility.countAdmin(organization, req.body.userId)
    if (data.adminCount === 0)
      throw new OrganizationForbidden("You cannot delete the last admin")

    const result = await model.organizations.update(organization)
    if (result.matchedCount === 0) throw new OrganizationError()

    saas.syncOrgSeats(req.params.organizationId, organization)

    user = await model.users.getById(req.body.userId, true)
    await Mailing.organizationDelete(user[0], req, organization.name)

    res.status(200).send({
      message: "User has been deleted from the organization",
    })
  } catch (err) {
    next(err)
  }
}

async function deleteConversationFromOrganization(req, res, next) {
  try {
    let organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length === 0) throw new OrganizationNotFound()
    else organization = organization[0]

    requireParam(req.body.conversationsId, OrganizationUnsupportedMediaType)
    const convIds = req.body.conversationsId.split(",")
    const userId = req.payload.data.userId

    let conversations = await model.conversations.listConvFromConvIds(
      convIds,
      userId,
      ROLES.MAINTAINER,
      RIGHTS.DELETE,
      req.query,
    )

    for (let conv of conversations.list) {
      await updateChildConversation(conv, "DELETE")

      await orgaUtility.deleteConversationCascade(conv)

      if (this?.app?.components?.IoHandler) {
        this.app.components.IoHandler.emit(
          "conversation_deleted",
          conv.organization.organizationId,
          conv._id,
          conv?.jobs?.transcription?.state,
        )
      }
    }

    if (conversations.count === convIds.length) {
      res.status(200).send({
        message: "Conversation has been deleted from the organization",
      })
    } else if (conversations.count === 0) {
      throw new ConversationError(
        `Error when deleting conversation : ${convIds}`,
      )
    } else {
      let message = "Conversation has been deleted from the organization :"
      conversations.list.map((c) => {
        message += " " + c._id
      })

      res.status(200).send({
        message,
      })
    }
  } catch (err) {
    next(err)
  }
}

async function updateConversationOwner(req, res, next) {
  try {
    const conversation = await model.conversations.getById(
      req.params.conversationId,
    )
    if (conversation.length !== 1) throw new ConversationNotFound()
    requireParam(req.body.userId, ConversationError, "User ID is required")
    const user = await model.users.getById(req.body.userId)
    if (user.length !== 1) throw new ConversationError("User not found")

    const organization = await model.organizations.getById(
      req.params.organizationId,
    )
    if (organization.length !== 1)
      throw new ConversationError("Organization not found")
    if (!organization[0].users.some((u) => u.userId === req.body.userId)) {
      throw new ConversationError("User is not part of the organization")
    }

    const result = await model.conversations.update({
      _id: req.params.conversationId,
      owner: req.body.userId,
    })

    res.status(200).send({
      message: "Conversation owner updated",
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  addUserInOrganization,
  updateUserFromOrganization,
  deleteUserFromOrganization,
  deleteConversationFromOrganization,
  updateConversationOwner,
}
