import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)


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

export default new Vuex.Store({
    strict: false,
    state: {
        conversations: '',
        users: '',
        userInfo: ''
    },
    mutations: {
        SET_CONVERSATIONS: (state, data) => {
            state.conversations = data
        },
        SET_USERS: (state, data) => {
            state.users = data
        },
        SET_USER_INFOS: (state, data) => {
            state.userInfo = data
        }
    },
    actions: {
        getConversations: async({ commit, state }) => {
            try {
                let token = ''
                if (!!state.userInfo.token) {
                    token = state.userInfo.token
                } else {
                    token = getCookie('authToken')
                }
                const getConvos = await axios.get(`${process.env.VUE_APP_CONVO_API}/conversations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('SET_CONVERSATIONS', getConvos.data)
                return state.conversations
            } catch (error) {
                console.error(error)
                return { error }
            }
        },
        getUsers: async({ commit, state }) => {
            try {
                let token = ''
                if (!!state.userInfo.token) {
                    token = state.userInfo.token
                } else {
                    token = getCookie('authToken')
                }
                const getUsers = await axios.get(`${process.env.VUE_APP_CONVO_API}/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('SET_USERS', getUsers.data)
                return state.users

            } catch (error) {
                return error.toString()
            }
        },
        getuserInfo: async({ commit, state }) =>  {
            try {
                const token = getCookie('authToken')
                const userId = getCookie('userId')

                const getInfo = await axios.get(`${process.env.VUE_APP_CONVO_API}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('SET_USER_INFOS', { token, ...getInfo.data })
                return state.userInfo
            } catch (error) {
                return error.toString()
            }
        }
    },
    getters: {
        conversationsByUserId: (state) => (userId) => {
            try {
                const conversations = state.conversations
                if (conversations.length > 0) {
                    let userConvos = []
                    for (let convo of conversations) {
                        // is owner
                        if (convo.owner === userId) {
                            userConvos.push(convo)
                        }
                        // is shared with 
                        if (convo.sharedWith.length > 0) {
                            for (let share of convo.sharedWith) {
                                if (share.user_id === userId) {
                                    userConvos.push(convo)
                                }
                            }
                        }
                    }
                    return userConvos
                }
                return []
            } catch (error) {
                return error.toString()
            }
        },
        conversationById: (state) => (convoId) => {
            try {
                const conversation = state.conversations.filter(f => f._id === convoId)
                if (conversation.length > 0) {
                    return conversation[0]
                } else {
                    throw 'Conversation not found'
                }
            } catch (error) {
                return error.toString()
            }
        },
        speakersByConversationId: (state) => (convoId) => {
            try {
                const conversation = state.conversations.filter(f => f._id === convoId)
                if (conversation.length > 0) {
                    return conversation[0].speakers
                } else {
                    throw 'Speakers not found'
                }
            } catch (error) {
                return error.toString()
            }
        },
        textBySpeakerId: (state) => (convoId, speakerId) => {
            try {
                const conversation = state.conversations.filter(c => c._id === convoId)
                return conversation[0].text.filter(txt => txt.speaker_id === speakerId)
            } catch (error) {
                return error.toString()

            }
        },
        turnIdsBetweenTwo: (state) => (convoId, payload) => {
            try {
                // One turn selected
                if (payload.startTurnPosition === payload.endTurnPosition) {
                    throw `Can't merge a turn with himself`
                }
                // Two turns selected
                else if (payload.startTurnPosition === payload.endTurnPosition + 1) {
                    return [payload.startTurnId, payload.endTurnId]
                }
                // More than two turns selected (Get turn_ids between first and last turn)
                else  {
                    const conversation = state.conversations.filter(c => c._id === convoId)
                    if (conversation.length > 0) {
                        const text = conversation[0].text
                        if (text.length > 0) {
                            let resp = []
                            text.map(turn => {
                                if (turn.pos >= payload.startTurnPosition && turn.pos <= payload.endTurnPosition) {
                                    resp.push(turn.turn_id)
                                }
                            })
                            return resp

                        } else {
                            throw 'conversation text not found'
                        }
                    } else {
                        throw 'conversation not found'
                    }
                }
            } catch (error) {
                return error.toString()
            }
        },
        wordsToTextBetweenWordIds: (state) => (convoId, payload) => {
            try {
                if (payload.startTurnPosition === payload.endTurnPosition) {
                    const conversation = state.conversations.filter(c => c._id === convoId)
                    if (conversation.length > 0) {
                        const text = conversation[0].text
                        const starWordPos = payload.startWordPosition
                        const endWordPos = payload.endWordPosition
                        const turn = text.find(t => t.turn_id === payload.startTurnId)
                        let wordids = []
                        let txt = ''
                        if (!!turn.words && turn.words.length > 0) {
                            for (let word of turn.words) {
                                if (word.pos >= starWordPos && word.pos <= endWordPos) {
                                    wordids.push(word.wid)
                                    txt += word.word + ' '
                                }
                            }
                            return { wordids, txt }
                        } else {
                            throw 'Turn not found'
                        }
                    } else {
                        throw 'conversation not found'
                    }
                } else {
                    throw 'Can\'t highlight on two turns'
                }
            } catch (error) {
                return error.toString()

            }
        },
        allUsersInfos: (state) => () => {
            try {
                const allUsers = state.users
                if (allUsers.length > 0) {
                    let usersArray = []
                    for (let user of allUsers) {
                        usersArray.push({
                            _id: user._id,
                            img: user.img,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email
                        })
                    }
                    return usersArray
                }
                return []
            } catch (error) {
                return error.toString()

            }
        },
        allUsersToShareWith: (state) => () => {
            try {
                let userId = getCookie('userId')
                if (userId.length > 0) {
                    let users = state.users.filter(user => user._id !== userId)
                    if (users.length > 0) {
                        return users
                    }
                    return []
                } else {
                    throw 'User Id not found'
                }
            } catch (error) {
                return error.toString()
            }
        }

    }
})