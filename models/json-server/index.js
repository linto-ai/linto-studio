const debug = require('debug')('app:model:jsonserver')
const axios = require('axios')


class modelJsonServer {
    constructor() {}

    async getUsers() {
        try {
            const users = await axios(`${this.host}/users`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            return users.data
        } catch (error) {
            console.error(error)
        }
    }

    async getUserByName(userName) {
        try {
            const users = await axios(`${this.host}/users`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            return users.data.filter(user => user.username === userName)[0] // returns 1st user found
        } catch (error) {
            console.error(error)
        }
    }


    async getConversations() {
        try {
            const conversations = await axios(`${this.host}/conversations`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            return conversations.data;
        } catch (error) {
            console.error(error)
        }
    }

    async getConversation(id) {

    }
}

module.exports = modelJsonServer