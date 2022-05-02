import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

let getCookie = function(cname) {
    let name = cname + "="
    let decodedCookie = decodeURIComponent(document.cookie)
    let ca = decodedCookie.split(';')
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return null
}
let setCookie = function(cname, cvalue, exdays) {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    let expires = "expires=" + d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

let getUserRightByConversation = function(conversation, state, userId) {

    const RIGHTS = state.userRights
    let fullRights = RIGHTS.SHARE + RIGHTS.DELETE + RIGHTS.WRITE + RIGHTS.COMMENT + RIGHTS.READ

    // is Owner
    if (conversation.owner === userId) {
        return fullRights
    }
    // is in sharedWithUsers
    else if (conversation.sharedWithUsers.findIndex(usr => usr.userId === userId) >= 0) {
        return conversation.sharedWithUsers.find(usr => usr.userId === userId).right
    }
    // is in organization
    else {
        if (convoOrganization.users.findIndex(usr => usr.userId === userId) < 0) {
            console.log('not in the organization > REDIRECT')
            return 0
        } else {
            let convoOrganization = state.userOrganizations.find(orga => orga._id === conversation.organization.organizationId)
            if (!convoOrganization) return 'organization not found'
            let userRole = convoOrganization.users.find(usr => usr.userId === userId).role
            if (userRole === 1) return RIGHTS.READ
            if (userRole > 1) return fullRights
        }
    }
    return 0
}
let getRightByRole = function(role) {
    let userRights = Object.freeze({
        "UNDEFINED": 0,
        "READ": 1,
        "COMMENT": 2,
        "WRITE": 4,
        "DELETE": 8,
        "SHARE": 16,
    })
    switch (role) {
        case 1:
            return userRights.READ
        case 2:
            return userRights.READ + userRights.COMMENT + userRights.WRITE + userRights.SHARE
        case 3:
            return userRights.READ + userRights.COMMENT + userRights.WRITE + userRights.DELETE + userRights.SHARE
        default:
            return userRights.UNDEFINED
    }
}

export default new Vuex.Store({
    strict: false,
    state: {
        userInfo: '',
        users: [],
        userOrganizations: [],
        organizations: [],
        conversations: [],
        userRights: Object.freeze({
            "UNDEFINED": 0,
            "READ": 1,
            "COMMENT": 2,
            "WRITE": 4,
            "DELETE": 8,
            "SHARE": 16,
            hasRightAccess: (userRight, desiredRight) => ((userRight & desiredRight) == desiredRight)
        })
    },
    mutations: {
        SET_USER_INFOS: (state, data) => {
            state.userInfo = data
        },
        SET_USERS: (state, data) => {
            state.users = data
        },
        SET_USER_ORGANIZATIONS: (state, data) => {
            state.userOrganizations = data
        },
        SET_ORGANIZATIONS: (state, data) => {
            state.organizations = data
        },
        SET_CONVERSATIONS: (state, data) => {
            state.conversations = data
        }
    },
    actions: {
        getUserRights: ({ commit, state }) => {
            return state.userRights
        },
        getuserInfo: async({ commit, state }) =>  {
            try {
                const token = getCookie('authToken')
                const userId = getCookie('userId')
                const getUserInfos = await axios.get(`${process.env.VUE_APP_CONVO_API}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('SET_USER_INFOS', { token, ...getUserInfos.data })
                return state.userInfo
            } catch (error) {
                return error.toString()
            }
        },
        getAllUsers: async({ commit, state }) =>  {
            try {
                const token = getCookie('authToken')
                const getAllUsers = await axios.get(`${process.env.VUE_APP_CONVO_API}/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('SET_USERS', getAllUsers.data)
                return state.users
            } catch (error) {
                return error.toString()
            }
        },
        getUserOrganizations: async({  commit, state }) => {
            try {
                const token = getCookie('authToken')
                const userId = getCookie('userId')
                const getUserOrganizations = await axios.get(`${process.env.VUE_APP_CONVO_API}/organizations/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                let userOrganizations = getUserOrganizations.data.userOrganizations

                commit('SET_USER_ORGANIZATIONS', userOrganizations)
                return state.userOrganizations

            } catch (error) {
                console.error(error)
                return error.toString()
            }
        },
        getOrganizations: async({  commit, state }) => {
            try {
                const token = getCookie('authToken')
                const getOrganizations = await axios.get(`${process.env.VUE_APP_CONVO_API}/organizations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('SET_ORGANIZATIONS', getOrganizations.data.organizations)
                return state.organizations

            } catch (error) {
                console.error(error)
                return error.toString()
            }
        },
        getConversations: async({  commit, state }) => {
            try {
                const token = getCookie('authToken')
                const userId = getCookie('userId')
                const getConversations = await axios.get(`${process.env.VUE_APP_CONVO_API}/conversations/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                let conversations = getConversations.data.conversations
                for (let conv of conversations) {
                    conv.userRight = getUserRightByConversation(conv, state, userId)
                }
                commit('SET_CONVERSATIONS', conversations)
                return state.conversations

            } catch (error) {
                return error.toString()
            }
        }
    },
    getters: {
        getUserById: (state) => (userId) => {
            return state.users.find(usr => usr._id === userId)
        },
        getOrganizationById: (state) => (organizationId) => {
            return state.userOrganizations.find(orga => orga._id === organizationId)
        },
        getConversationById: (state) => (conversationId) => {
            return state.conversations.find(conv => conv._id === conversationId)
        },
        getCurrentOrganizationScope: (state) => () => {
            let orgaCookie = getCookie('cm_orga_scope')
            if (orgaCookie !== null && orgaCookie !== '' && orgaCookie !== 'undefined' && state.userOrganizations.findIndex(org => org._id === orgaCookie) >= 0) {
                return orgaCookie
            } else {
                let target = state.userOrganizations.find(org => org.personal == true)
                setCookie('cm_orga_scope', target._id, 7)
                return target._id
            }
        },
        getConversationByOrganizationScope: (state) => (organizationScope) => {
            let userId = getCookie('userId')
            let conversations = state.conversations

            let userOrganizationsIds = []
            for (let userOrga of state.userOrganizations) {
                userOrganizationsIds.push(userOrga._id)
            }

            let targetOrga = state.userOrganizations.find(orga => orga._id === organizationScope)
            let userConvos = []

            // personal organization
            if (targetOrga.owner === userId && targetOrga.personal) {
                if (conversations.length > 0) {
                    conversations.map(conv => {
                        let convoOrganizationId = conv.organization.organizationId
                            // Conversations created by user
                        if (convoOrganizationId === organizationScope) {
                            userConvos.push(conv)
                        }
                        // Conversations shared with user
                        else {
                            if (convoOrganizationId.indexOf(userOrganizationsIds) < 0) {
                                let userIndex = conv.sharedWithUsers.findIndex(usr => usr.userId === userId)
                                if (userIndex >= 0) {
                                    userConvos.push(conv)
                                }
                            }
                        }
                    })
                }
                return userConvos
            } else {
                return conversations.filter(conv => conv.organization.organizationId === organizationScope)
            }
        },
        getUserRoleInOrganization: (state) => (organizationId) => {
            let organization = state.userOrganizations.find(orga => orga._id === organizationId)
            let userId = getCookie('userId')
            let orgaRoles = []
            orgaRoles[1] = 'member'
            orgaRoles[2] = 'maintainer'
            orgaRoles[3] = 'admin'

            let userRole = organization.users.find(user => user.userId === userId).role
            return {  name: orgaRoles[userRole], value: userRole }
        },
        getUserRightTxt: (state) => (right) => {
            if (state.userRights.hasRightAccess(right, state.userRights.SHARE)) return 'Full rights'
            else if (state.userRights.hasRightAccess(right, state.userRights.WRITE)) return 'Can write'
            else if (state.userRights.hasRightAccess(right, state.userRights.COMMENT)) return 'Can comment'
            else if (state.userRights.hasRightAccess(right, state.userRights.READ)) 'Can read'
            else return 'undefined'
        },
        getUsersByConversation: (state) => (conversationId) => {
            let conversation = state.conversations.find(conv => conv._id === conversationId)
            let roleAccess = conversation.organization.role
            let organization = state.organizations.find(orga => orga._id === conversation.organization.organizationId)

            let convUsers = []
            let organizationUsers = []
            let sharedWithUsers = []

            // Organization users
            for (let user of organization.users) {
                if (user.role >= roleAccess) {
                    let userInfos = state.users.find(usr => usr._id === user.userId)

                    userInfos.role = user.role
                    userInfos.visibility = user.visibility
                    userInfos.right = getRightByRole(user.role)
                    organizationUsers.push(userInfos)
                }
            }

            // Organization users with custom rights
            let customRights = conversation.organization.membersRights
            if (customRights.length > 0) {
                organizationUsers.map(ouser => {
                    if (customRights.findIndex(cr => cr.userId === ouser._id) >= 0) {
                        ouser.right = customRights.find(cr => cr.userId === ouser._id).right
                    }
                })
            }



            convUsers = {
                organization: organizationUsers
            }
            return convUsers

        }
    }
})