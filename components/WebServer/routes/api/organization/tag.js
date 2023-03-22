const debug = require('debug')('linto:conversation-manager:router:api:tag:tag')
const {
    getTag,
    getTagByCategory,
    getTagByOrganization,
    createTag,
    updateTag,
    deleteTag,
    searchTag,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/tag.js`)

const {
    searchConversation
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/search.js`)

//Cannot POST /api/organizations/63f4d9ed7d1b424dccabc375/tag/search
module.exports = (webserver) => {
    return [
        {
            path: '/conversation/search',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: searchConversation
        },
        {
            path: '/search',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: searchTag
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