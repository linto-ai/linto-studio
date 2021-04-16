import Vue from 'vue'
import Router from 'vue-router'

// Views
import Index from '../views/HelloWorld.vue'
import Conversations from '../views/Conversations.vue'
import ConversationsCreate from '../views/ConversationCreate.vue'
import ConversationManage from '../views/ConversationManage.vue'
import ConversationTranscription from '../views/ConversationTranscription.vue'
Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [{
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