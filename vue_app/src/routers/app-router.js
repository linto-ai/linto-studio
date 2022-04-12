import Vue from 'vue'
import Router from 'vue-router'

// Views

import Conversations from '../views/Conversations.vue'
import Login from '../views/Login.vue'
import CreateAccount from '../views/CreateAccount.vue'
import UserProfile from '../views/UserProfile.vue'
import UserOrganizations from '../views/UserOrganizations.vue'
import UserOrganizationCreate from '../views/UserOrganizationCreate.vue'
import UserOrganizationUpdate from '../views/UserOrganizationUpdate.vue'
/*
import ConversationsCreate from '../views/ConversationCreate.vue'
import ConversationManage from '../views/ConversationManage.vue'
import ConversationTranscription from '../views/ConversationTranscription.vue'
*/
Vue.use(Router)

import axios from 'axios'

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

let checkRole = async function(to, from, next) {
    let orgaId = to.params.organizationId
    let userId = getCookie('userId')
    const token = getCookie('authToken')
    const getOrganizations = await axios.get(`${process.env.VUE_APP_CONVO_API}/organizations`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    let orgas = getOrganizations.data.organizations
    let orga = orgas.find(org => org._id === orgaId)
    let role = ''
    orga.owner === userId ? role = 'owner' : role = orga.users.find(user => user.userId === userId).role

    if (role === 'owner' ||  role > 1) {
        next()
    } else {
        // If role < 'maintainer', redirect to homepage
        next('/interface/conversations')
    }
}


const hydrateProps = (route, props) => {
    Object.assign(route.meta, { props });
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
        },
        {
            path: '/interface/user/organizations/:organizationId',
            name: 'Update organization',
            component: UserOrganizationUpdate
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