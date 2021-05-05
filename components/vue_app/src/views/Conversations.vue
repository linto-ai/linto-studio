<template>
  <div>
    <h1>My conversations</h1>
    
    <div class="flex row" v-if="dataLoaded">
      <div class="conversation-filter-container flex1">
        <button class="conversation-filter--btn conversation-filter--btn__active" >All</button> | <button class="conversation-filter--btn" >Owned by me</button> | <button class="conversation-filter--btn" >Shared with me</button> 
      </div>
      <div class="flex1 flex col flex-end">
        <a href="/interface/conversation/create" class="btn btn--txt-icon green">
          <span class="label">New conversation</span>
          <span class="icon icon__plus"></span>
        </a>
      </div>
    </div>
    <div class="flex">
      <table class="table">
        <thead>
          <tr>
            <th v-for="convoKey in conversationsKeys" :key="convoKey.key">
              <button
                class="table-th-filter"
                @click="sortByKey(convoKey.key)"
                :class="sortBy === convoKey.key ? `selected ${sortDirection}` : ''"
              >{{ convoKey.text }}</button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
          </tr>
          <tr v-for="convo in sortedConversations" :key="convo._id" @click="redirectConversationPage(convo._id)">
            <td class="title">{{ convo.name }}</td>
            <td>{{ convo.description }}</td>
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: ['userInfo'],
  data () {
    return {
      convosLoaded: false,
      usersLoaded: false,
      sortBy: 'date',
      sortDirection: 'down',
      conversationsKeys: [
        {
          key: 'title',
          text: 'Title'
        },
        {
          key: 'description',
          text: 'Description'
        },
        {
          key: 'date',
          text: 'Date'
        },
        {
          key: 'duration',
          text: 'Duration'
        },
        {
          key: 'owner',
          text: 'Owner'
        },
        {
          key: 'sharedWith',
          text: 'Shared With'
        },
        {
          key: 'status',
          text: 'Status'
        }
      ]
    }
  },
  async mounted () {
    await this.dispatchConversations()
    await this.dispatchUsersInfo()
  },
  computed: {
    dataLoaded () {
      return this.convosLoaded && this.usersLoaded && this.allUsersInfos
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
    sortedConversations () {
      if(!!this.conversations && this.conversations.length > 0) {
        let sortedArray = this.conversations
        const key = this.sortBy
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
  }
}
</script>