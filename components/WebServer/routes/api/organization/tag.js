const debug = require('debug')('linto:conversation-manager:router:api:tag:tag')
const {
    getTag,
    getTagByOrganization,
    createTag,
    updateTag,
    deleteTag,
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/tag.js`)

const {
    searchTag
} = require(`${process.cwd()}/components/WebServer/routecontrollers/organizations/taxonomy/search.js`)


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
            method: 'get',
            controller: searchTag,
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
            requireOrganizationMaintainerAccess: true
        }
    ]
}