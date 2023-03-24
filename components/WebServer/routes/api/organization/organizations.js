const debug = require('debug')('linto:conversation-manager:router:api:organizations:organizations')
const {
    createOrganization,
    listSelfOrganization,
    getOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/organizations.js`)

const {
    // listSelfOrganization,
    listConversationFromOrganization,
    leaveSelfFromOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/member.js`)

const {
    addUserInOrganization,
    updateUserFromOrganization,
    deleteUserFromOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/maintainer.js`)

const {
    updateOrganization,
    deleteOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/admin.js`)

const {
    searchConversationByTag
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/search.js`)

module.exports = (webserver) => {
    return [

        /* No right*/
        {
            path: '/',
            method: 'post',
            requireAuth: true,
            controller: createOrganization
        },
        {
            path: '/user',
            method: 'get',
            requireAuth: true,
            controller: listSelfOrganization
        }

        /*Member right */
        , {
            path: '/:organizationId',
            method: 'get',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: getOrganization
        },
        {
            path: '/:organizationId/self',
            method: 'delete',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: leaveSelfFromOrganization
        },
        {
            path: '/:organizationId/conversation',
            method: 'get',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: listConversationFromOrganization
        },
        {
            path: '/:organizationId/conversation/searchByTag',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: searchConversationByTag
        },

        /* Maintainer right*/
        {
            path: '/:organizationId/user',
            method: 'post',
            requireAuth: true,
            requireOrganizationMaintainerAccess: true,
            controller: addUserInOrganization
        },
        {
            path: '/:organizationId/user',
            method: 'patch',
            requireAuth: true,
            requireOrganizationMaintainerAccess: true,
            controller: updateUserFromOrganization
        },
        {
            path: '/:organizationId/user',
            method: 'delete',
            requireAuth: true,
            requireOrganizationMaintainerAccess: true,
            controller: deleteUserFromOrganization
        },

        /* Admin right*/
        {
            path: '/:organizationId',
            method: 'patch',
            requireAuth: true,
            requireOrganizationAdminAccess: true,
            controller: updateOrganization
        },
        {
            path: '/:organizationId',
            method: 'delete',
            requireAuth: true,
            requireOrganizationAdminAccess: true,
            controller: deleteOrganization
        }
    ]
}