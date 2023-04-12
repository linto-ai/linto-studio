const debug = require('debug')('linto:conversation-manager:router:api:tag:tag')
const {
    getTag,
    getTagInfo,
    getTagByOrganization,
    createTag,
    updateTag,
    deleteTag,
    searchTag,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/tag.js`)

//Cannot POST /api/organizations/63f4d9ed7d1b424dccabc375/tag/search
module.exports = (webserver) => {
    return [
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
            path: '/search',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: searchTag
        },
        {
            path: '/info',
            method: 'post',
            requireAuth: true,
            requireOrganizationMemberAccess: true,
            controller: getTagInfo
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