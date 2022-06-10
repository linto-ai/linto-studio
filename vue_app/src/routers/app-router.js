import Vue from 'vue'
import Router from 'vue-router'

// Views
import CreateAccount from '../views/CreateAccount.vue'
import Login from '../views/Login.vue'

import Conversations from '../views/Conversations.vue'
import ConversationsCreate from '../views/ConversationsCreate.vue'
import ConversationsOverview from '../views/ConversationsOverview.vue'
import ConversationsTranscription from '../views/ConversationsTranscription.vue'
import Organizations from '../views/Organizations.vue'
import OrganizationsCreate from '../views/OrganizationsCreate.vue'
import OrganizationsUpdate from '../views/OrganizationsUpdate.vue'

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
        },
        {
            path: '/interface/conversations/create',
            name: 'conversations create',
            component: ConversationsCreate
        },
        {
            path: '/interface/conversations/:conversationId',
            name: 'conversations Overview',
            component: ConversationsOverview
        },
        {
            path: '/interface/conversations/:conversationId/transcription',
            name: 'conversations Transcription',
            component: ConversationsTranscription
        },
        {
            path: '/interface/organizations',
            name: 'organizations list',
            component: Organizations
        },
        {
            path: '/interface/organizations/create',
            name: 'organizations create',
            component: OrganizationsCreate
        },
        {
            path: '/interface/organizations/:organizationId',
            name: 'organizations update',
            component: OrganizationsUpdate
        }
    ]
})

export default router