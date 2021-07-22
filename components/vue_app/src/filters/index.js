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

let setCookie = function(cname, cvalue, exdays) {
    let d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    let expires = "expires=" + d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

// Convert time: seconds > hh:mm:ss
Vue.filter('timeToHMS', function(time) {
    const hour = Math.floor(time / (60 * 60))
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return `${hour < 10  ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec }`
})

// Convert: date > JJ/MM/YYYY
Vue.filter('dateToJMY', function(date) {
    let splitDate = date.split('T')
    return splitDate[0]
})

// Convert: date > JJ/MM/YYYY - hh:mm:ss
Vue.filter('dateToJMYHMS', function(date) {
    let splitDate = date.split('T')
    let fullTime = splitDate[1]
    let splitTime = fullTime.split('+')
    return `${splitDate[0]} - ${splitTime[0]}`
})

// Send request 
Vue.filter('sendRequest', async function(url, method, data) {
    // Get authorization token  
    const userToken = getCookie('authToken')
    try {
        let req = await axios(url, {
            method,
            data,
            headers: {
                'Authorization': `Bearer ${ userToken }`
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

// Send request multipart formData
Vue.filter('sendMultipartFormData', async function(url, method, data) {
    const userToken = getCookie('authToken')
    try {
        let req = await axios(url, {
            method,
            data,
            headers: {
                'charset': 'utf-8',
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${ userToken }`
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

// Test if required filed is empty
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

// Generate transcirption .txt format
Vue.filter('generateTranscriptionText', function(convo, filters) {
    let content = `=====================================================================\nConversation: ${ convo.name } - ${ convo.created }\n=====================================================================\n\n `

    let filtersLabel = ''
    if (filters.speaker !== '') {
        let spkId = filters.speaker
        let speaker = convo.speakers.filter(spk => spk.speaker_id === spkId)
        if (speaker.length > 0) {
            filtersLabel += `  - speaker: ${ speaker[0].speaker_name }\n `
        }
    }
    if (filters.highlights !== '') {
        let hlId = filters.highlights
        let highlights = convo.highlights.filter(hl => hl.hid === hlId)
        if (highlights.length > 0) {
            filtersLabel += `-  highlights: ${ highlights[0].label } \n `
        }
    }
    if (filters.keywords !== '') {
        let kwId = filters.keywords
        let keywords = convo.keywords.filter(kw => kw._id === kwId)
        if (keywords.length > 0) {
            filtersLabel += `  - keywords: ${ keywords[0].label }\n `
        }
    }

    if (filtersLabel.length > 0) {
        content += `Filtered by: \n${ filtersLabel }\n\n `
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
                    spkText += `${ word.word } `
                }
            }
            if (speaker.length > 0) {
                // Spk name
                spkName = `${ speaker[0].speaker_name }: `
            }
            content += `[${ startTime } - ${ endTime }] ${ spkName }: ${ spkText } \n\n `
        }
    }
    return content
})


// Test select field
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

// Test name field
Vue.filter('testName', function(obj) {
    const regex = /^[a-zA-ZÀ-ÿ]+(([' -][a-zA-ZÀ-ÿ ])?[a-zA-ZÀ-ÿ]*)*$/g
    obj.valid = false
    obj.error = null
    obj.value = obj.value.trim()
    if (obj.value.length === 0) {
        obj.error = 'This field is required'
    } else if (obj.value.match(regex)) {
        obj.valid = true
    } else {
        obj.error = 'Invalid name'
    }
})

// Test password field
Vue.filter('testPassword', function(obj) {
    obj.valid = false
    obj.error = null
    obj.value = obj.value.trim()
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

// Test confirmation password field
Vue.filter('testPasswordConfirm', function(obj, password) {
    obj.valid = false
    obj.error = null
    obj.value = obj.value.trim()
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

// Test email field
Vue.filter('testEmail', function(obj) {
    obj.valid = false
    obj.error = null
    obj.value = obj.value.toLowerCase().trim()
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (obj.value.match(regex)) {
        obj.valid = true
    } else {
        obj.error = 'Invalid email'
    }

})

// Set cookie
Vue.filter('setCookie', function(cname, value, days) {
    return setCookie(cname, value, days)
})

// Get cookie
Vue.filter('getCookie', function(cname) {
    return getCookie(cname)
})