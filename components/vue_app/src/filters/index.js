import Vue from 'vue'
import store from '../store.js'
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


Vue.filter('sendRequest', async function(url, method, data) {
    const userToken = getCookie('authToken')
    try {
        let req = await axios(url, {
            method,
            data,
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        })
        if (req.status === 200) {
            return req
        } else {
            throw req
        }
    } catch (error) {
        if (!!error.response && !!error.response.data) {
            return error.response.data
        }
        return error
    }
})


Vue.filter('sendMultipartFormData', async function(url, method, data) {
    const userToken = getCookie('authToken')
    try {
        let req = await axios(url, {
            method,
            data,
            headers: {
                'charset': 'utf-8',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userToken}`
            }
        })
        if (req.status === 200) {
            return req
        } else {
            throw req
        }
    } catch (error) {
        if (!!error.response && !!error.response.data) {
            return error.response.data
        }
        return error
    }
})

Vue.filter('CapitalizeFirstLetter', function(string) {
    if (string.length > 0) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return ''
})

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

Vue.filter('generateTranscriptionText', function(convo, filters) {
    let speakers = convo.speakers
    let content = `===================================================================== \nConversation: ${convo.name} - ${convo.created}\n=====================================================================\n\n`

    let filtersLabel = ''

    if (filters.speaker !== '') {
        let spkId = filters.speaker
        let speaker = convo.speakers.filter(spk => spk.speaker_id === spkId)
        if (speaker.length > 0) {
            filtersLabel += `- speaker : ${speaker[0].speaker_name}\n`
        }
    }
    if (filters.highlights !== '') {
        let hlId = filters.highlights
        let highlights = convo.highlights.filter(hl => hl._id === hlId)
        if (highlights.length > 0) {
            filtersLabel += `- highlights : ${highlights[0].label}\n`
        }
    }
    if (filters.keywords !== '') {
        let kwId = filters.keywords
        let keywords = convo.keywords.filter(kw => kw._id === kwId)
        if (keywords.length > 0) {
            filtersLabel += `- keywords : ${keywords[0].label}\n`
        }
    }

    if (filtersLabel.length > 0) {
        content += `Filtered by :\n${filtersLabel} \n\n`
    }

    if (convo.text.length > 0) {
        for (let turn of convo.text) {
            let speakerId = turn.speaker_id
            let speaker = convo.speakers.filter(spk => spk.speaker_id === speakerId)
            let spkText = ''
            let spkName = ''
            let startTime = 0
            let endTime = 0
            if (turn.words.length > 0) {
                for (let word of turn.words) {
                    // start time
                    if (word.pos === 0) {
                        startTime = word.stime
                    }
                    //end time
                    if (word.pos === turn.words.length - 1) {
                        endTime = word.etime
                    }
                    // words
                    spkText += `${word.word} `
                }
            }
            if (speaker.length > 0) {
                // Spk name
                spkName = `${speaker[0].speaker_name}: `
            }
            content += `[${startTime} - ${endTime}] ${spkName}: ${spkText} \n\n`
        }
    }
    return content
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