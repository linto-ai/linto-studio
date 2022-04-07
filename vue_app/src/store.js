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

export default new Vuex.Store({
    strict: false,
    state: {
        userInfo: '',
        users: '',
        userOrganizations: '',
        organizations: ''
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
        getUserOrganisations: async({  commit, state }) => {
            try {
                const token = getCookie('authToken')
                const getUserOrganizations = await axios.get(`${process.env.VUE_APP_CONVO_API}/organizations/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                commit('SET_USER_ORGANIZATIONS', getUserOrganizations.data)
                return state.userOrganizations

            } catch (error) {
                return error.toString()
            }
        },
        getOrganisations: async({  commit, state }) => {
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
                return error.toString()
            }
        }
    },
    getters: {
        getUserById: (state) => (userId) => {
            return state.users.find(usr => usr._id === userId)
        }
    }
})