const debug = require('debug')('linto:conversation-manager:router:api:tag:tag')
const {
    getTag,
    getTagByCategory,
    getTagByOrganization,
    createTag,
    updateTag,
    deleteTag,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/tag.js`)

const {
    searchConversation,
    searchTaxonomy
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/taxonomy.js`)


module.exports = (webserver) => {
    return [
        {
            path: '/search',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: searchTaxonomy
        },
        {
            path: '/conversation/search',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: searchConversation
        },
        {
            path: '/',
            method: 'post',
            controller: createTag,
            requireAuth: true,
            requireOrganizationMemberAccess: true
        },
        {
            path: '/',
            method: 'get',
            controller: getTagByOrganization,
            requireAuth: true,
            requireOrganizationMemberAccess: true
        },
        {
            path: '/category/:categoryId',
            method: 'get',
            controller: getTagByCategory,
            requireAuth: true,
            requireOrganizationMemberAccess: true
        },
        {
            path: '/:tagId',
            method: 'get',
            controller: getTag,
            requireAuth: true,
            requireOrganizationMemberAccess: true
        },
        {
            path: '/:tagId',
            method: 'patch',
            controller: updateTag,
            requireAuth: true,
            requireOrganizationMemberAccess: true
        },
        {
            path: '/:tagId',
            method: 'delete',
            controller: deleteTag,
            requireAuth: true,
            requireOrganizationMemberAccess: true
        }
    ]
}