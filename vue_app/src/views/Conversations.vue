<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Conversations</h1>
    <div class="flex row">
      <a href="/interface/conversations/create">Create conversation</a>
    </div>
    <div class="conversations-list flex col" v-if="conversations.length > 0">
        <div v-for="conv of conversations" :key="conv._id" class="flex row conversation-list-item">
          <div class="flex col flex2">
            <a :href="`/interface/conversations/${conv._id}`" class="conv-title">{{ conv.name }}</a>
            <p class="conv-desc">{{ conv.description }}</p>
            <span>Right : {{ getUserRightTxt(conv.userRight) }}</span>
          </div>
          <div class="flex col flex1">
            <div class="flex col">
              <span class="conv-data">Duration: {{ timeToHMS(conv.audio.duration) }}</span>
              <span class="conv-data">Last update: {{ dateToJMYHMS(conv.last_update) }}</span>
            </div>
          </div>
        </div>
    </div>
    <span v-else class="no-result">No conversation found</span>
  </div>
</template>
<script>
export default {
  props:["userInfo","currentOrganizationScope"],
  data() {
    return {
      userOrgasLoaded: false,
      orgasLoaded: false,
      convosLoaded: false,
      userRightsLoaded: false
    }
  },
  computed: {
    dataLoaded () {
      return !!this.currentOrganization && !!this.conversations 
    },
    userOrganizations () {
      return this.$store.state.userOrganizations
    },
    currentOrganization () {
      if(this.orgasLoaded && this.userOrgasLoaded) return this.$store.getters.getOrganizationById(this.currentOrganizationScope)
      return null
    },
    conversations() {
      if(!!this.currentOrganization && this.convosLoaded && this.userRightsLoaded ) return this.$store.getters.getConversationByOrganizationScope(this.currentOrganizationScope)
      return []
    },
    userRights (){
      return this.$store.state.userRights
    }
  },
  async mounted () {
    await this.dispatchUserRights()
    await this.dispatchOrganizations()
    await this.dispatchUserOrganizations()
    await this.dispatchConversations()
  },
  methods: {
    getUserRightTxt(right) {
      return this.$store.getters.getUserRightTxt(right)
    },
    dateToJMYHMS(date) {
      return this.$options.filters.dateToJMYHMS(date)
    },
    timeToHMS(time){
      return this.$options.filters.timeToHMS(time)
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
    async dispatchUserRights() {
      this.userRightsLoaded = await this.$options.filters.dispatchStore('getUserRights')
    }
  }
}
</script>

<style scoped>
.conversation-list-item{
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
}
.conversation-list-item>div{
  padding: 0 10px;
}
.conv-data{
  display: inline-block;
  font-size: 12px;
  margin: 5px 0;
}
</style>