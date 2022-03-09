const debug = require('debug')('app:router:api:organizations:organizations')
const {
    listUserOrganization,
    addUserInOrganization
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
            path: '/adduser',
            method: 'post',
            requireAuth: true,
            controller: addUserInOrganization
        }
    ]
}