const debug = require('debug')('app:router:api:organizations:organizations')
const {
    createOrganization,
    listOrganization,
    getOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/organizations.js`)

const {
    listSelfOrganization,
    updateSelfFromOrganization,
    leaveSelfFromOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/member.js`)

const {
    addUserInOrganization,
    updateUserFromOrganization,
    deleteUserFromOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/maintainer.js`)

const {
    adminAddUserInOrganization,
    adminUpdateUserFromOrganization,
    adminDeleteUserFromOrganization,
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
            path: '/',
            method: 'get',
            requireAuth: true,
            controller: listOrganization
        },

        /*Member right */

        {
            path: '/user',
            method: 'get',
            requireAuth: true,
            controller: listSelfOrganization
        },
        {
            path: '/user/:organizationId',
            method: 'patch',
            requireAuth: true,
            controller: updateSelfFromOrganization
        },
        {
            path: '/user/:organizationId',
            method: 'delete',
            requireAuth: true,
            controller: leaveSelfFromOrganization
        },


        // TODO: WIP HERE


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