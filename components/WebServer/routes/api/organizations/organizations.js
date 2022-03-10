const debug = require('debug')('app:router:api:organizations:organizations')
const {
    listUserOrganization,
    createOrganization,
    addUserInOrganization,
    updateUserRightInOrganization,
    deleteUserFromOrganization,
    deleteOrganization
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/organizations.js`)

module.exports = (webserver) => {
    return [
        {
            path: '/',
            method: 'get',
            requireAuth: true,
            controller: listUserOrganization
        },
        {
            path: '/',
            method: 'post',
            requireAuth: true,
            controller: createOrganization
        },
        {
            path: '/:organizationId/user/add',
            method: 'post',
            requireAuth: true,
            controller: addUserInOrganization
        },
        {
            path: '/:organizationId/user/update',
            method: 'post',
            requireAuth: true,
            controller: updateUserRightInOrganization
        },
        {
            path: '/:organizationId',
            method: 'delete',
            requireAuth: true,
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