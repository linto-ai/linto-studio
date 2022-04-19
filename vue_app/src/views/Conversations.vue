<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Mes conversations</h1>
    <div class="flex col">
      <div class="flex row">
        <a href="/interface/conversation/create" class="btn btn-medium green">
          <span class="icon icon__plus"></span>
          <span class="label">Create conversation</span>
        </a>
      </div>

      <div class="flex col">
        <table class="table auto">
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration</th>
              <th>Role</th>
              <th>Last update</th>
              <th>Organization</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="conv in conversations" 
              :key="conv._id"
              :class="'conversation-item ' + conv.job.state">
              <td class="title">
                <a :href="`interface/conversations/${conv._id}`">{{ conv.name }}</a>
              </td>
              <td>{{ conv.audio.duration !== null ? timeToHMS(conv.audio.duration) : 'undefined?' }}</td>
              <td>    
                <span :class="`user-role ${conv.userRole.name.toLowerCase()}`">{{conv.userRole.name }}</span>
              </td>
              <td>{{ getFormattedDate(conv.last_update) }}</td>
              <td class="title"><a :href="`/interface/user/organizations/${conv.organization.organizationId}`">{{ userOrganizations.find(orga => orga._id === conv.organization.organizationId).name }}</a></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      
      </div>
    </div>
    
    <!-- 
    <div class="flex row" v-if="dataLoaded">
      <div class="conversation-filter-container flex1">
        <button class="conversation-filter--btn" :class="filterActive === 'all' ? 'active' : ''"  @click="filterActive = 'all'">{{ $t('filters.all') }}</button> | 
        <button class="conversation-filter--btn" :class="filterActive === 'ownedByMe' ? 'active' : ''" @click="filterActive = 'ownedByMe'">{{ $t('filters.owned_by_me') }}</button> | 
        <button class="conversation-filter--btn" :class="filterActive === 'sharedWithMe' ? 'active' : ''" @click="filterActive = 'sharedWithMe'">{{ $t('filters.shared_with_me') }}</button> 
      </div>
      <div class="flex col flex-end">
        <a href="/interface/conversation/create" class="btn btn--txt-icon green">
          <span class="label">{{ $t('buttons.new_conversation') }}</span>
          <span class="icon icon__plus"></span>
        </a>
      </div>
    </div>
    <div class="flex">
      <table class="table">
        <thead>
          <tr>
            <th v-for="(convoKey, i) in conversationsKeys" :key="i">
              <button
                class="table-th-filter"
                @click="sortByKey(convoKey)"
                :class="sortBy === convoKey ? `selected ${sortDirection}` : ''"
              >{{ $t(`array_labels.${convoKey}`) }}</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
          </tr>
          <tr v-for="convo in filteredConversations" :key="convo._id"  class="clickable"> 
            <td class="title" @click="redirectConversationPage(convo._id)">{{ convo.name.length > 40 ? convo.name.substring(0, 40) + '...' : convo.name }}</td>
            <td>{{ convo.description.length > 60 ? convo.description.substring(0, 60) + '...' : convo.description }}</td>
            <td>{{ dateToJMY(convo.created) }}</td>
            <td>{{ secToHMS(convo.audio.duration) }}</td>
            <td>
              <div class="table-user-img flex row" v-if="!!allUsersInfos && allUsersInfos.length > 0">
                <span class="table-user-img__span" :data-name="`${CapitalizeFirstLetter(allUsersInfos[allUsersInfos.findIndex(usr => usr._id === convo.owner)].firstname)} ${CapitalizeFirstLetter(allUsersInfos[allUsersInfos.findIndex(usr => usr._id === convo.owner)].lastname)}`">
                  <img :src="imgPath(allUsersInfos[allUsersInfos.findIndex(usr => usr._id === convo.owner)].img)" class="table-user-img__img" >
                </span>
              </div>
            </td>
            <td>
              <div class="table-user-img flex row" v-if="!!allUsersInfos && allUsersInfos.length > 0">
                <span class="table-user-img__span" v-for="user in convo.sharedWith" :key="user.user_id" :data-name="`${CapitalizeFirstLetter(allUsersInfos[allUsersInfos.findIndex(usr => usr._id === user.user_id)].firstname)} ${CapitalizeFirstLetter(allUsersInfos[allUsersInfos.findIndex(usr => usr._id === user.user_id)].lastname)}`">
                  <img :src="imgPath(allUsersInfos[allUsersInfos.findIndex(usr => usr._id === user.user_id)].img)" class="table-user-img__img" >
                </span>
              </div>
            </td>
            <td class="status" :class="convo.locked === 0 ? 'open' : 'locked'"><span class="label">{{ convo.locked === 0 ? 'open' : 'locked' }}</span></td>
            <td class="remove">
              <button class="btn--icon red" @click="removeConversationModal(convo)">
                <span class="icon icon--remove"></span>
                </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalRemoveConversation></ModalRemoveConversation>-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      convosLoaded: false,
      orgaLoaded: false,
      userOrgaLoaded: false
    }
  },
  computed: {
    dataLoaded () {
      return this.convosLoaded && this.userOrgaLoaded
    },
    conversations () {
      return this.$store.state.conversations
    },
    userOrganizations () {
      return this.$store.state.userOrganizations
    }
  },
  async mounted () {
    await this.dispatchUserOrganizations()
    await this.dispatchConversations()
  },
     methods: {
      timeToHMS(time){
        return this.$options.filters.timeToHMS(time) 
      },
       
      getFormattedDate(dateTime) {
        let date = dateTime.split('T')[0]
        let timeSplit = dateTime.split('T')[1]
        let time = timeSplit.split('+')[0]

        return date + ' - ' + time
      },
      async dispatchOrganizations () {
        this.orgaLoaded = await this.$options.filters.dispatchStore('getOrganisations')
      },
      async dispatchUserOrganizations () {
        this.userOrgaLoaded = await this.$options.filters.dispatchStore('getUserOrganisations')
      },
     async dispatchConversations () {
      this.convosLoaded = await this.$options.filters.dispatchStore('getConversations')
    },
    
   }
}
/*
import { bus } from '../main.js'

export default {
  props: ['userInfo'],
  data () {
    return {
      convosLoaded: false,
      usersLoaded: false,
      filterActive: 'all',
      sortBy: 'date',
      sortDirection: 'down',
      conversationsKeys: ['name','description','created','audio','owner','sharedWith','locked','delete']
    }
  },
  async mounted () {
    await this.dispatchConversations()
    await this.dispatchUsersInfo()

    bus.$on('refresh_conversations', async (data) => {
      await this.dispatchConversations()
      await this.dispatchUsersInfo()
    })
  },
  computed: {
    dataLoaded () {
      return this.convosLoaded && this.usersLoaded
    },
    conversations () {
      if(!!this.userInfo) {
        return this.$store.getters.conversationsByUserId(this.userInfo._id)
      }
      return []
    },
    allUsersInfos () {
      return this.$store.getters.allUsersInfos()
    },
    filteredConversations () {
      if(!!this.sortedConversations){
        let sorted = this.sortedConversations
        if(this.filterActive === 'all') {
          return sorted
        } else if (this.filterActive === 'ownedByMe') {
          return sorted.filter(convo => convo.owner === this.userInfo._id)
        } else if (this.filterActive === 'sharedWithMe') {
          return sorted.filter(convo => convo.owner !== this.userInfo._id)
        }
      }
      return []
    },
    sortedConversations () {
      if(!!this.conversations && this.conversations.length > 0) {
        let sortedArray = this.conversations
        let key = this.sortBy
        if (this.sortDirection === 'down') {
          return sortedArray.sort(function (a, b) {
            if (a[key] > b[key]) {
              return 1
            }
            if (a[key] < b[key]) {
              return -1
            }
            return 0
          })
        } else {
          return sortedArray.sort(function (a, b) {
            if (a[key] < b[key]) {
              return 1
            }
            if (a[key] > b[key]) {
              return -1
            }
            return 0
          })
        }
        
      } 
      return []
    }
  },
  methods: {
    removeConversationModal (convo) {
      bus.$emit('modal_remove_conversation', {convo})
    },
    imgPath(url) {
      return `${process.env.VUE_APP_URL}/${url}`
    },
    sortByKey (key) {
      if (this.sortBy === key) {
        this.sortDirection === 'down' ? this.sortDirection = 'up' : this.sortDirection = 'down'
      } else {
        this.sortBy = key
        this.sortDirection = 'down'
      }
    },
     secToHMS (time) {
      const totalSeconds = parseInt(time)
      const hour = Math.floor(totalSeconds / (60 * 60))
      const min = Math.floor(totalSeconds / 60)
      const sec =  Math.floor(totalSeconds % 60)
      return `${hour < 10  ? '0' + hour : hour}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec }`
    },
    redirectConversationPage (convoId) {
      document.location.href = `/interface/conversation/${convoId}`
    },
    dateToJMY (date) {
      return this.$options.filters.dateToJMY(date) 
    },
    dateToJMYHMS (date) {
      return this.$options.filters.dateToJMYHMS(date) 
    },
    CapitalizeFirstLetter (string) {
      return this.$options.filters.CapitalizeFirstLetter(string)
    },
    async dispatchConversations () {
      this.convosLoaded = await this.$options.filters.dispatchStore('getConversations')
    },
    async dispatchUsersInfo () {
      this.usersLoaded = await this.$options.filters.dispatchStore('getUsers')
    }
  },
  components: {
    ModalRemoveConversation
  }
}*/

</script>