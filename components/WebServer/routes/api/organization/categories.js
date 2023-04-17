const debug = require('debug')('linto:conversation-manager:router:api:tag:categories')
const {
    getCategory,
    listCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/category.js`)

const {
    searchCategory
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/search.js`)


//path allways preceded by /api/organizations/:organizationId/category
module.exports = (webserver) => {
    return [
        {
            path: '/search',
            method: 'get',
            controller: searchCategory,
            requireAuth: true,
            requireOrganizationMaintainerAccess: true
        },
        {
            path: '/',
            method: 'post',
            controller: createCategory,
            requireAuth: true,
            requireOrganizationMaintainerAccess: true
        },
        {
            path: '/',
            method: 'get',
            controller: listCategory,
            requireAuth: true,
            requireOrganizationMaintainerAccess: true
        },
        {
            path: '/:categoryId',
            method: 'get',
            controller: getCategory,
            requireAuth: true,
            requireOrganizationMaintainerAccess: true
        },
        {
            path: '/:categoryId',
            method: 'patch',
            controller: updateCategory,
            requireAuth: true,
            requireOrganizationMaintainerAccess: true
        },
        {
            path: '/:categoryId',
            method: 'delete',
            controller: deleteCategory,
            requireAuth: true,
            requireOrganizationMaintainerAccess: true
        }
    ]
}