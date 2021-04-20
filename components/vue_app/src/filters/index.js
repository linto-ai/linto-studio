import Vue from 'vue'
import store from '../store.js'

Vue.filter('testFieldEmpty', function(obj) {
    obj.error = null
    obj.valid = false
    if (obj.value.length === 0) {
        obj.error = 'This field is required'
        obj.valid = false
    } else  {
        obj.valid = true
    }
    return obj
})


// DISPATCH STORE
Vue.filter('dispatchStore', async function(label) {
    try {
        const req = await store.dispatch(label)
        if (!!req.error) {
            throw req.error
        }
        if (typeof req !== 'undefined') {
            return {
                status: 'success',
                msg: ''
            }
        } else {
            throw 'an error has occured'
        }
    } catch (error) {
        return ({
            status: 'error',
            msg: error
        })
    }
})

// TEST SELECT FIELD
Vue.filter('testSelectField', function(obj) {
    obj.error = null
    obj.valid = false
    if (typeof(obj.value) === 'undefined') {
        obj.value = ''
    }
    if (obj.value === '' || obj.value.length === 0) {
        obj.error = 'This field is required'
    } else {
        obj.valid = true
    }
})

// TEST NAME
Vue.filter('testName', function(obj) {
    const regex = /^[a-zA-ZÀ-ÿ]+(([' -][a-zA-ZÀ-ÿ ])?[a-zA-ZÀ-ÿ]*)*$/g
    obj.valid = false
    obj.error = null
    if (obj.value.length === 0) {
        obj.error = 'This field is required'
    } else if (obj.value.match(regex)) {
        obj.valid = true
    } else {
        obj.error = 'Invalid name'
    }
})

Vue.filter('testPassword', function(obj) {
    obj.valid = false
    obj.error = null
    const regex = /^[0-9A-Za-z\!\@\#\$\%\-\_\s]{4,}$/ // alphanumeric + special chars "!","@","#","$","%","-","_"
    if (obj.value.length === 0) {
        obj.error = 'This field is required'
    } else if (obj.value.length < 6) {
        obj.error = 'This field must contain at least 6 characters'
    } else if (obj.value.match(regex)) {
        obj.valid = true
    } else {
        obj.error = 'Invalid password'
    }
})

Vue.filter('testPasswordConfirm', function(obj, password) {
    obj.valid = false
    obj.error = null
    if (obj.value.length === 0) {
        obj.error = 'This field is required'
    } else {
        if (obj.value !== password.value) {
            obj.error = 'Passwords must be the same'
        } else  {
            obj.valid = true
        }
    }
})

Vue.filter('testEmail', function(obj) {
    obj.valid = false
    obj.error = null
    obj.value = obj.value.toLowerCase()
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (obj.value.match(regex)) {
        obj.valid = true
    } else {
        obj.error = 'Invalid email'
    }

})

Vue.filter('getCookie', function(cname) {
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
    return ""
})