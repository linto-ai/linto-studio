const debug = require('debug')('linto:conversation-manager:router:api:tag:categories')
const {
    getCategory,
    getType,
    listCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/category.js`)

const {
    searchConversation,
    searchCategory,
    searchCommonTagFromCategory,
    searchTaxonomy
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/search.js`)


//path allways preceded by /api/organizations/:organizationId/category
module.exports = (webserver) => {
    return [
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
            path: '/search',
            method: 'post',
            controller: searchCategory,
            requireAuth: true,
            requireOrganizationMaintainerAccess: true
        },
        {
            path: '/explore',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: searchTaxonomy
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
        },
        {
            path: '/:categoryId/search',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: searchCommonTagFromCategory
        },
    ]
}