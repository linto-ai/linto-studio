const debug = require('debug')('app:router:api:organizations:organizations')
const {
    listUserOrganization,
    listOrganization,
    createOrganization,
    addUserInOrganization,
    updateOrganization,
    updateUserInOrganization,
    deleteUserFromOrganization,
    deleteOrganization,
    getOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/organizations.js`)

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
            controller: listUserOrganization
        },
        {
            path: '/',
            method: 'get',
            requireAuth: true,
            controller: listOrganization
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
            controller: updateUserInOrganization
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
        },
        {
            path: '/:organizationId/user/',
            method: 'delete',
            requireAuth: true,
            controller: deleteUserFromOrganization
        }
    ]
}