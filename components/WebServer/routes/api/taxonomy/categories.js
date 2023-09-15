const debug = require('debug')('linto:conversation-manager:router:api:taxonomy:categories')

const {
  getOrganizationCategory,
  createCategory,
  getCategory
} = require(`${process.cwd()}/components/WebServer/routecontrollers/taxonomy/categories.js`)

const {
  searchCategory
} = require(`${process.cwd()}/components/WebServer/routecontrollers/taxonomy/search.js`)


const {
  listConvCategoryByHighlight
} = require(`${process.cwd()}/components/WebServer/routecontrollers/conversation/categories.js`)



module.exports = (webserver) => {
  return [
    {
      path: '/organizations/:organizationId/categories/search,/conversations/:conversationId/categories/search',
      method: 'get',
      controller: searchCategory,
      requireAuth: true,
      requireReadTaxonomyAccess: true
    },
    {
      path: '/organizations/:organizationId/categories,/conversations/:conversationId/categories',
      method: 'get',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: getOrganizationCategory
    },
    {
      path: '/organizations/:organizationId/categories,/conversations/:conversationId/categories',
      method: 'post',
      requireAuth: true,
      requireReadTaxonomyAccess: true,
      controller: createCategory
    },
    {
      path: '/organizations/:organizationId/categories/:categoryId,/conversations/:conversationId/categories/:categoryId',
      method: 'get',
      controller: getCategory,
      requireAuth: true,
      requireReadTaxonomyAccess: true
    },
    {
      path: '/:conversationId/categories/highlights',
      method: 'get',
      requireAuth: true,
      requireConversationWriteAccess: true,
      controller: listConvCategoryByHighlight
    }
  ]
}