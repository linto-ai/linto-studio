const debug = require('debug')('conversation-manager:interface:*')
const middlewares = require(`${process.cwd()}/components/WebServer/middlewares/index.js`)
const orgaUtility = require(`${process.cwd()}/components/WebServer/controllers/organization/utility`)

const axios = require('axios')
const { UserForbidden } = require('../../error/exception/users')
const organizations = require('../api/organizations/organizations')

module.exports = (webServer) => {
    return [{
            path: '/',
            method: 'get',
            requireSession: true,
            controller: [
                (req, res, next) => {
                    res.redirect('/interface/conversations')
                }
            ]
        },
        {
            path: '/user/organizations/create',
            method: 'get',
            requireSession: true,

            controller: [
                (req, res, next) => {
                    res.setHeader("Content-Type", "text/html")
                    res.sendFile(process.cwd() + '/dist/index.html')
                }
            ]
        },
        {
            path: '/user/organizations/:organizationId',
            method: 'get',
            requireSession: true,

            controller: [
                async(req, res, next) => {
                    try {
                        const userId = req.cookies['userId']
                        const organization = await orgaUtility.getOrganization(req.params.organizationId)

                        let userRole = 0
                        organization.owner === userId ? userRole = 'owner' : userRole = organization.users.find(usr => usr.userId === userId).role


                        if (userRole === 'owner' || userRole > 1) {
                            res.setHeader("Content-Type", "text/html")
                            res.sendFile(process.cwd() + '/dist/index.html')
                        } else {
                            throw 'unauthorized user'
                        }

                    } catch (error) {
                        console.error(error)
                        res.redirect('/interface/conversations')
                    }
                }
            ]
        },
        {
            path: '/*',
            method: 'get',
            requireSession: true,
            controller: [
                (req, res, next) => {
                    res.setHeader("Content-Type", "text/html")
                    res.sendFile(process.cwd() + '/dist/index.html')
                }
            ]
        }
    ]
}