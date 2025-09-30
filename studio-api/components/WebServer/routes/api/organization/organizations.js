const debug = require("debug")(
  "linto:conversation-manager:router:api:organizations:organizations",
)
const { createOrganization, listSelfOrganization, getOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/organizations.js`,
)

const { listConversationFromOrganization, leaveSelfFromOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/member.js`,
)

const PERMISSIONS = require(`${process.cwd()}/lib/dao/organization/permissions`)

const {
  addUserInOrganization,
  updateUserFromOrganization,
  deleteUserFromOrganization,
  deleteConversationFromOrganization,
  updateConversationOwner,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/maintainer.js`,
)

const { updateOrganization, deleteOrganization } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/admin.js`,
)

const {
  createM2MUser,
  listM2M,
  getM2MTokens,
  refreshM2MToken,
  revokeM2MToken,
  deleteM2Token,
} = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/m2m.js`,
)

const { transcribeReq } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/transcriptor.js`,
)

const { offlineReq } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
)

const { importConversation } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/import.js`,
)

module.exports = (webserver) => {
  return [
    /* No right*/
    {
      path: "/",
      method: "post",
      requireAuth: true,
      controller: createOrganization,
      requireOrganizationInitiatorAccess: true,
    },
    {
      path: "/",
      method: "get",
      requireAuth: true,
      controller: listSelfOrganization,
    },
    /*Member right */
    {
      path: "/:organizationId",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: getOrganization,
    },
    {
      path: "/:organizationId/self",
      method: "delete",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: leaveSelfFromOrganization,
    },
    {
      path: "/:organizationId/conversations",
      method: "get",
      requireAuth: true,
      requireOrganizationMemberAccess: true,
      controller: listConversationFromOrganization,
    },

    /*Uploader right */
    {
      path: "/:organizationId/conversations/create",
      method: "post",
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.UPLOAD,
      controller: transcribeReq.bind(webserver),
    },
    {
      path: "/:organizationId/conversations/import",
      method: "post",
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.UPLOAD,
      controller: importConversation,
    },
    {
      path: "/:organizationId/conversations/:conversationId/regenerate",
      method: "get",
      requireAuth: true,
      requireOrganizationUploaderAccess: true,
      orgaPermissionAccess: PERMISSIONS.UPLOAD,
      controller: offlineReq,
    },

    /* Maintainer right*/
    {
      path: "/:organizationId/users",
      method: "post",
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      controller: addUserInOrganization,
    },
    {
      path: "/:organizationId/users",
      method: "patch",
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      controller: updateUserFromOrganization,
    },
    {
      path: "/:organizationId/users",
      method: "delete",
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      controller: deleteUserFromOrganization,
    },
    {
      path: "/:organizationId/conversations",
      method: "delete",
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      controller: deleteConversationFromOrganization.bind(webserver),
    },
    {
      path: "/:organizationId/conversations/:conversationId/owner",
      method: "patch",
      requireAuth: true,
      requireOrganizationMaintainerAccess: true,
      controller: updateConversationOwner,
    },

    /* Admin right*/
    {
      path: "/:organizationId",
      method: "patch",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: updateOrganization,
    },
    {
      path: "/:organizationId",
      method: "delete",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: deleteOrganization,
    },

    /* Admin right M2M function*/

    {
      path: "/:organizationId/tokens",
      method: "post",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: createM2MUser,
    },
    {
      path: "/:organizationId/tokens/",
      method: "get",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: listM2M,
    },
    {
      path: "/:organizationId/tokens/:tokenId",
      method: "get",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: getM2MTokens,
    },
    {
      path: "/:organizationId/tokens/:tokenId/refresh",
      method: "get",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: refreshM2MToken,
    },
    {
      path: "/:organizationId/tokens/:tokenId/revoke",
      method: "delete",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: revokeM2MToken,
    },
    {
      path: "/:organizationId/tokens/:tokenId",
      method: "delete",
      requireAuth: true,
      requireOrganizationAdminAccess: true,
      controller: deleteM2Token,
    },
  ]
}
