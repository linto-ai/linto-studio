import Vue from 'vue'
import Router from 'vue-router'

// Views

import Conversations from '../views/Conversations.vue'
import Login from '../views/Login.vue'
import CreateAccount from '../views/CreateAccount.vue'
import UserProfile from '../views/UserProfile.vue'
import UserOrganizations from '../views/UserOrganizations.vue'
import UserOrganizationCreate from '../views/UserOrganizationCreate.vue'
/*
import ConversationsCreate from '../views/ConversationCreate.vue'
import ConversationManage from '../views/ConversationManage.vue'
import ConversationTranscription from '../views/ConversationTranscription.vue'
*/
Vue.use(Router)

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
            path: '/interface/user/profile/:userId',
            name: 'User profile settings',
            component: UserProfile
        },
        {
            path: '/interface/user/organizations',
            name: 'User organization',
            component: UserOrganizations
        },
        {
            path: '/interface/user/organizations/create',
            name: 'Create organization',
            component: UserOrganizationCreate
        }
    ]
})

/*{
            path: '/interface/conversation/create',
            name: 'Create a new conversation',
            component: ConversationsCreate
        }, {
            path: '/interface/conversation/:convoId',
            name: 'conversations manager',
            component: ConversationManage
        },
        {
            path: '/interface/conversation/:convoId/transcription',
            name: 'conversations transcription',
            component: ConversationTranscription
        },
        /

    ]
})

/* The following function parse the route.meta attribtue to set page "title" and "meta" before entering a route" */
/*router.beforeEach((to, from, next) => {
    if (to.meta.length > 0) {
        to.meta.map(m => {
            if (m.name === 'title') {
                document.title = m.content
            } else {
                let meta = document.createElement('meta')
                meta.setAttribute('name', m.name)
                meta.setAttribute('content', m.content)
                document.getElementsByTagName('head')[0].appendChild(meta)
            }
        })
    }
    next()
})*/

export default router