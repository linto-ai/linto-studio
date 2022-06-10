<template>
  <div class="flex col" id="conversation-share-container" v-if="dataLoaded">
      <button id="conversation-share" @click="showShareList = !showShareList">Share</button>
      <div :class="[showShareList ? 'visible' : 'hidden', 'flex','col', 'conversation-share-list']">

        <!-- Seach user field --> 
        <div v-if="userRights.hasRightAccess(conversation.userAccess.right, userRights.SHARE)" class="flex col conversation-share-search-container">
          <input type="text" v-model="searchMemberValue" placeholder="Find an user...">
          <!-- Seach user list -->
          <div class="conversation-share-search-list flex col">
            <div v-if="searchMemberValue.length > 0 && availableUsers.length > 0" class="search-member-list flex1 flex col">
              <button class="search-member-btn share flex1 flex row align-center" v-for="user of availableUsers" :key="user._id" @click="shareWithUSer(user)">
              <img :src="`/${user.img}`" class="search-member-img">
                <span class="search-member-identity">{{ user.firstname }} {{ user.lastname }} <i>({{ user.email }})</i></span>
              </button>
            </div>
            <div v-if="searchMemberValue.length > 0 && availableUsers.length === 0" class="search-member-list flex1 flex col">User not found</div>
          </div>
        </div>

        <!-- Organization members with access -->
        <div class="flex row conversation-share-item" v-for="user of conversationUsers.organization_member" :key="user._id">
          <div class="flex1 flex row align-center">
              <img :src="`/${user.img}`" class="search-member-img">
              <span class="search-member-identity">{{ user.firstname }} {{ user.lastname }} <i>{{ user.email }}</i></span>
          </div>
          <div class="flex row">
            <select 
              v-if="userRights.hasRightAccess(conversation.userAccess.right, userRights.SHARE) && user.role === 1"
              v-model="user.right" @change="updateUserRights(user)"
            >
              <option v-for="uright in rigthsList" :key="uright.value" :value="uright.value">{{ uright.txt }}</option>
            </select>
            <span v-if="!userRights.hasRightAccess(conversation.userAccess.right, userRights.SHARE) && user.role === 1">{{getUserRightTxt(user.right)}}</span>
            <span v-if="user.role === 2">Maintainer</span>
            <span v-if="user.role === 3">Admin</span>
          </div>
        </div>

        <!-- Users with access -->
        <div class="flex row conversation-share-item" v-for="user of conversationUsers.external_member" :key="user._id">
          <div class="flex1 flex row align-center">
            <img :src="`/${user.img}`" class="search-member-img">
            <span class="search-member-identity">{{ user.firstname }} {{ user.lastname }} <i>(guest) {{ user.email }}</i></span>
          </div>
          <div class="flex row">
            <select 
              v-if="userRights.hasRightAccess(conversation.userAccess.right, userRights.SHARE)"
              v-model="user.right" 
              @change="user.right === 0 ? validateUnsahring(user) : updateUserRights(user)"
            >
              <option v-for="uright in rigthsList" :key="uright.value*2" :value="uright.value">{{ uright.txt }}</option>
            </select>
            <span v-else>{{ getUserRightTxt(user.right) }}</span>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ["userInfo", "currentOrganizationScope", "conversation"],
  data() {
    return {
      convoUsersLoaded: false,
      showShareList: false,
      rigthsList: [
        {
          value: 0,
          txt: 'No access'
        },
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
      ],
      searchMemberValue: '',
      searchDebounce: null,
      searchUsersList: []
    }
  },
  async mounted () {
    await this.dispatchConversationUsers()
    bus.$on('confirm_unshare_user_conversation', (data) => {
      this.unshareWithUser(data.user)
    })
  },
  watch:{
    async searchMemberValue(data) {
      if(data.length > 0) {
        if(this.searchDebounce === null) {
          this.searchDebounce = setTimeout(async ()=> {
            this.searchUsersList = await this.searchUsers(data)
          },300)
        } else {
          clearTimeout(this.searchDebounce)
          this.searchDebounce = setTimeout(async ()=> {
              this.searchUsersList = await this.searchUsers(data)
          },300) 
        }
      } else {
        this.searchUsersList = []
      }
    }
  },
  computed: {
    dataLoaded () {
      return this.convoUsersLoaded 
    },
    conversationUsers () {
      return this.$store.state.conversationUsers
    },
    userRights() {
      return this.$store.state.userRights
    },
     availableUsers () {
      if(this.searchMemberValue.length > 0) {
        return this.searchUsersList.filter(user =>
          this.conversationUsers.organization_member.findIndex(usr => usr._id === user._id) < 0 && this.conversationUsers.external_member.findIndex(usr => usr._id === user._id) < 0)
      }
      return []
    }
  },
  methods: {
    validateUnsahring(user) {
      bus.$emit('show_modal', { 
          title: 'Unshare conversation',
          content: `Are you sure you want to remove "${user.email} from the conversation ?"`,
          actionBtnLabel: 'Unshare',
          actionName: 'unshare_user_conversation',
          conversation: this.conversation,
          user
        })
    },
    async unshareWithUser(user){
      let userInfo = user
      userInfo.right = 0
      await this.updateUserRights(user)
    },
    async shareWithUSer(user){
      let userInfo = user
      userInfo.right = 1
      userInfo.visibility = 'public'
      await this.updateUserRights(user)

    },
    async updateUserRights(user) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/conversations/${this.conversation._id}/user/${user._id}`, 'patch', {right: user.right})
        
        if(req.status >= 200 && req.status < 300) {
          await this.dispatchConversationUsers()
          this.searchMemberValue = ''
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.message || req.data.msg || `User right udpated`,
            timeout: 3000
          })
        } else {
          throw req
        }
      } catch (error) {
        console.error(error)
        bus.$emit('app_notif', {
            status: 'error',
            message: error.message || error.msg || 'Error on updating user rights',
            timeout: null
        })
      }
    },
    async dispatchConversationUsers() {
      this.convoUsersLoaded = await this.$options.filters.dispatchStore('getUsersByConversationId', {conversationId: this.conversation._id})
    },
    getUserRightTxt(right) {
      return this.$store.getters.getUserRightTxt(right)
    },
    async searchUsers(search) {
      return await this.$store.getters.searchPublicUsers({search})
    }
  },
}
</script>
