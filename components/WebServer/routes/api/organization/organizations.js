const debug = require('debug')('linto:conversation-manager:router:api:organizations:organizations')
const {
    createOrganization,
    // listOrganization,
    listSelfOrganization,
    searchOrganizationByName,
    getOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/organizations.js`)

const {
    // listSelfOrganization,
    listConversationFromOrganization,
    updateSelfFromOrganization,
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
            path: '/search',
            method: 'post',
            requireAuth: true,
            controller: searchOrganizationByName
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
            method: 'patch',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: updateSelfFromOrganization
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