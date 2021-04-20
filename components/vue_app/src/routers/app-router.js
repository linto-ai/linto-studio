import Vue from 'vue'
import Router from 'vue-router'

// Views
import Index from '../views/HelloWorld.vue'
import Conversations from '../views/Conversations.vue'
import ConversationsCreate from '../views/ConversationCreate.vue'
import ConversationManage from '../views/ConversationManage.vue'
import ConversationTranscription from '../views/ConversationTranscription.vue'
import Login from '../views/Login.vue'
import CreateAccount from '../views/CreateAccount.vue'
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
            path: '/interface',
            name: 'index',
            component: Index,
            /* ADD META DATA : EXAMPLE
                meta: [
                  {
                    name: 'title',
                    content: 'Linto Admin - Tock interface'
                  },
                  {
                    name: 'robots',
                    content: 'noindex, nofollow'
                  }
                ]
              */
        }, {
            path: '/interface/conversations',
            name: 'conversations',
            component: Conversations
        },
        {
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
        }

        /*      {
                  path: '/interface/conversations/transcript',
                  name: 'conversation transcription',
                  component: ConversationTranscription
              } */
    ]
})

/* The following function parse the route.meta attribtue to set page "title" and "meta" before entering a route" */
router.beforeEach((to, from, next) => {
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
})

export default router