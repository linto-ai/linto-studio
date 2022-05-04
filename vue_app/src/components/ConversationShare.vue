<template>
  <div class="flex col" v-if="conversationUsers !== null && this.userRightsLoaded" id="conversation-share-container">
      <button id="conversation-share" @click="showShareList = !showShareList">Share</button>
      <div :class="[showShareList ? 'visible' : 'hidden', 'flex','col', 'conversation-share-list']">
        <div class="flex row conversation-share-item" v-for="user of conversationUsers.organization" :key="user._id">
          <div class="flex1 flex row align-center">
              <img :src="`/${user.img}`" class="search-member-img">
              <span class="search-member-identity">{{ user.firstname }} {{ user.lastname }} <i>{{ user.email }}</i></span>
          </div>
          <div class=" flex row">
            <select v-model="user.right">
              <option v-for="uright in rigthsList" :key="uright" :value="uright.value">{{ uright.txt }}</option>
            </select>
          </div>
        </div>
        <div class="flex row conversation-share-item" v-for="user of conversationUsers.sharedWithUsers" :key="user._id">
          <div class="flex1 flex row align-center">
            <img :src="`/${user.img}`" class="search-member-img">
            <span class="search-member-identity">{{ user.firstname }} {{ user.lastname }} <i>(guest) {{ user.email }}</i></span>
          </div>
          <div class="flex row">
            <select v-model="user.right">
              <option v-for="uright in rigthsList" :key="uright" :value="uright.value">{{ uright.txt }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'

export default {
  props: ["userInfo", "currentOrganizationScope", "conversation"],
  data() {
    return {
      userOrgasLoaded: false,
      orgasLoaded: false,
      convosLoaded: false,
      userRightsLoaded: false,
      usersLoaded: false,
      showShareList: false,
      rigthsList: [
        {
          value: 1,
          txt: 'Can read'
        },
        {
          value: 3,
          txt: 'Can comment'
        },
        {
          value: 7,
          txt: 'Can write'
        },
        {
          value: 23,
          txt: 'Can share'
        },
        {
          value: 31,
          txt: 'Full rights'
        }
      ]
    }
  },
  async mounted () {
    await this.dispatchOrganizations() 
    await this.dispatchUserOrganizations()
    await this.dispatchConversations()
    await this.dispatchUsers()
    await this.dispatchUserRights()
    
  },
  computed: {
    conversationUsers () {
      if(this.usersLoaded && this.conversation !== null) {
        return this.$store.getters.getUsersByConversation(this.conversation._id)
      } return null
    },
    userRights() {
      return this.$store.state.userRights
    }
  },
  methods: {
    getUserRightTxt(right) {
      return this.$store.getters.getUserRightTxt(right)
    },
    async dispatchUsers() {
      this.usersLoaded = await this.$options.filters.dispatchStore('getAllUsers')
    },
    async dispatchConversations() {
      this.convosLoaded = await this.$options.filters.dispatchStore('getConversations')
    },
    async dispatchOrganizations() {
      this.orgasLoaded = await this.$options.filters.dispatchStore('getOrganizations')
    },
    async dispatchUserOrganizations() {
      this.userOrgasLoaded = await this.$options.filters.dispatchStore('getUserOrganizations')
    },
    async dispatchUserRights() {
      this.userRightsLoaded = await this.$options.filters.dispatchStore('getUserRights')
    }
  }
}
</script>
