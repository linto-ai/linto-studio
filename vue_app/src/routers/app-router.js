import Vue from 'vue'
import Router from 'vue-router'

// Views
import CreateAccount from '../views/CreateAccount.vue'
import Login from '../views/Login.vue'

import Conversations from '../views/Conversations.vue'
Vue.use(Router)

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

const router = new Router({
    mode: 'history',
    routes: [{
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/create-account',
            name: 'create-account',
            component: CreateAccount
        },
        {
            path: '/interface/conversations',
            name: 'conversations',
            component: Conversations
        }
    ]
})

export default router