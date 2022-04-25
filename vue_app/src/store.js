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

export default new Vuex.Store({
    strict: false,
    state: {
        userInfo: '',
        users: [],
        userOrganizations: [],
        organizations: [],
        conversations: []
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

                const getOrganizations = await axios.get(`${process.env.VUE_APP_CONVO_API}/conversations/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                let conversations = getOrganizations.data.conversations
                console.log('conversations', conversations)

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
            if (orgaCookie !== null && orgaCookie !== '' && orgaCookie !== 'undefined') {
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
                return conversations.filter(conv => conv.organization.orgnizationId === organizationScope)
            }
        },
        getUserRoleInOrganization: (state) => (organizationId) => {
            let organization = state.userOrganizations.find(orga => orga._id === organizationId)
            let userId = getCookie('userId')
            let orgaRoles = []
            orgaRoles[1] = 'member'
            orgaRoles[2] = 'maintainer'
            orgaRoles[1] = 'admin'

            if (organization.owner === userId) {
                return { name: 'owner', value: 4 }
            } else {
                let userRole = organization.users.find(user => user.userId === userId).role
                return {  name: orgaRoles[userRole], value: userRole }
            }
        }
    }
})