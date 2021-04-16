import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'Login'
    }, ]
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