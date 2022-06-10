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


    let convoOrganization = state.userOrganizations.find(orga => orga._id === conversation.organization.organizationId)
        // is Owner
    if (conversation.owner === userId) {
        return fullRights
    }
    // is in sharedWithUsers
    else if (conversation.sharedWithUsers.findIndex(usr => usr.userId === userId) >= 0) {
        return conversation.sharedWithUsers.find(usr => usr.userId === userId).right
    }
    // is in Organization
    else if (convoOrganization.users.findIndex(usr => usr.userId === userId) >= 0) {
        let userRole = convoOrganization.users.find(usr => usr.userId === userId).role
        if (conversation.organization.customRights.findIndex(usr => usr.userId === userId) >= 0) {
            return conversation.organization.customRights.find(usr => usr.userId === userId).right
        } else if (userRole === 1) {
            return conversation.organization.membersRight
        } else {
            return getRightByRole(userRole)
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
        publicUsers: [],
        userRights: Object.freeze({
            "UNDEFINED": 0,
            "READ": 1,
            "COMMENT": 2,
            "WRITE": 4,
            "DELETE": 8,
            "SHARE": 16,
            hasRightAccess: (userRight, desiredRight) => ((userRight & desiredRight) == desiredRight)
        }),
        conversationsList: [],
        conversation: [], // current conversations
        conversationUsers: [],
        publicOrganizations: [],
        userOrganizations: [],
        organization: [] // current organization
    },
    mutations: {
        SET_USER_INFOS: (state, data) => {
            state.userInfo = data
        },
        SET_CONVERSATIONS_LIST: (state, data) => {
            state.conversationsList = data
        },
        SET_CURRENT_CONVERSATION: (state, data) => {
            state.conversation = data
        },
        SET_USER_ORGANIZATIONS: (state, data) => {
            state.userOrganizations = data
        },
        SET_CURRENT_ORGANIZATION: (state, data) => {
            state.organization = data
        },
        SET_PUBLIC_USERS: (state, data) => {
            state.publicUsers = data
        },
        SET_CONVERSATION_USERS: (state, data) => {
            state.conversationUsers = data
        }
    },
    actions: {
        getuserInfo: async({ commit, state }) => {
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
        getConversationsByOrganization: async({ commit, state }) => {
            try {
                const token = getCookie('authToken')
                const organizationScope = getCookie('cm_orga_scope')
                const getConversations = await axios.get(`${process.env.VUE_APP_CONVO_API}/organizations/${organizationScope}/conversation`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                let conversations = getConversations.data

                commit('SET_CONVERSATIONS_LIST', conversations)
                return state.conversationsList
            } catch (error) {
                console.error(error)
                return error.toString()
            }
        },
        getConversationById: async({ commit, state }, paylaod) => {
            try {
                let conversationId = paylaod.conversationId
                const token = getCookie('authToken')

                const getConversation = await axios.get(`${process.env.VUE_APP_CONVO_API}/conversations/${conversationId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                let conversation = getConversation.data
                commit('SET_CURRENT_CONVERSATION', conversation)
                return state.conversation
            } catch (error) {
                console.error(error)
                return error.toString()
            }
        },
        getUserOrganizations: async({ commit, state }) => {
            try {
                const token = getCookie('authToken')
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
        getOrganizationById: async({ commit, state }, payload) => {
            try {
                const token = getCookie('authToken')
                const getOrganization = await axios.get(`${process.env.VUE_APP_CONVO_API}/organizations/${payload.organizationId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                let organization = getOrganization.data
                commit('SET_CURRENT_ORGANIZATION', organization)
                return state.organization
            } catch (error) {
                console.error(error)
                return error.toString()
            }
        },
        getUsersByConversationId: async({ commit, state }, payload) => {
            try {
                const token = getCookie('authToken')
                const getUsers = await axios.get(`${process.env.VUE_APP_CONVO_API}/conversations/${payload.conversationId}/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                let users = getUsers.data
                commit('SET_CONVERSATION_USERS', users)
                return state.conversationUsers
            } catch (error) {
                console.error(error)
                return error.toString()
            }
        }
    },
    getters: {
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
        searchPublicUsers: (state) => async(payload) => {
            try {
                const token = getCookie('authToken')
                const getPublicUsers = await axios(`${process.env.VUE_APP_CONVO_API}/users/search`, {
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: { search: payload.search }
                })
                return getPublicUsers.data

            } catch (error) {
                console.error(error)
                return error.toString()
            }
        },
        getUserRoleInOrganization: (state) => () => {
            let organization = state.organization
            const userId = getCookie('userId')
            if (organization.owner === userId) return 3
            else {
                let findUser = organization.users.filter(usr => usr._id === userId)
                return findUser.length > 0 ? findUser[0].role : 0
            }
        },
        getUserRightTxt: (state) => (right) => {
            if (state.userRights.hasRightAccess(right, state.userRights.DELETE)) return 'Full rights'
            else if (state.userRights.hasRightAccess(right, state.userRights.SHARE)) return 'Can share'
            else if (state.userRights.hasRightAccess(right, state.userRights.WRITE)) return 'Can write'
            else if (state.userRights.hasRightAccess(right, state.userRights.COMMENT)) return 'Can comment'
            else if (state.userRights.hasRightAccess(right, state.userRights.READ)) return 'Can read'
            else return 'No access'
        },

    }
})