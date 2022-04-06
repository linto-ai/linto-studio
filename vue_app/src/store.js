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
        userInfo: ''
    },
    mutations: {
        SET_CONVERSATIONS: (state, data) => {
            state.conversations = data
        },
        SET_USERS: (state, data) => {
            state.users = data
        },
        SET_USER_INFOS: (state, data) => {
            state.userInfo = data
        }
    },
    actions: {
        getuserInfo: async({ commit, state }) =>  {
            try {
                const token = getCookie('authToken')
                const userId = getCookie('userId')
                const getInfo = await axios.get(`${process.env.VUE_APP_CONVO_API}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('SET_USER_INFOS', { token, ...getInfo.data })
                return state.userInfo
            } catch (error) {
                return error.toString()
            }
        }
    },
    getters: {

    }
})