import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import cookieParser from 'cookie-parser'

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
        auth_token: ''
    },
    mutations: {
        SET_CONVERSATIONS: (state, data) => {
            state.conversations = data
        },
        SET_AUTH_TOKEN: (state, data) => {
            state.auth_token = data
        }
    },
    actions: {
        getConversations: async({ commit, state }) => {
            try {
                const token = getCookie('authToken')
                const getConvos = await axios(`${process.env.VUE_APP_CONVO_API}/conversations`, {
                    method: 'get',
                    headers: {
                        'Authorization': `${token} Bearer`
                    }
                })
                commit('SET_CONVERSATIONS', getConvos.data)
                return state.conversations
            } catch (error) {
                return ({
                    error: 'Error on getting conversations'
                })
            }
        },
        getAuthToken: ({ commit, state }) =>  {
            try {
                const token = getCookie('authToken')
                commit('SET_AUTH_TOKEN', token)
                return state.auth_token
            } catch (error) {
                console.error('store', error)
            }
        }
    },
    getters: {
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
        highlightsByConversationId: (state) => (convoId) => {
            try {
                const conversation = state.conversations.filter(c => c._id === convoId)
                return conversation[0].highlights
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
        }
    }
})