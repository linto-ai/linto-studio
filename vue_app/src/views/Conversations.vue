<template>
  <div class="flex col scrollable" >
    <h1>Conversations</h1>
    <div class="flex row">
      <a href="/interface/conversations/create" class="btn" style="margin-bottom: 10px;">Create conversation</a>
    </div>
    <table v-if="conversations.length > 0">
      <thead>
        <tr>
          <th>Tilte</th>
          <th>Description</th>
          <th>Duration</th>
          <th>Update</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="conv of conversations" :key="conv._id">
          <td><a :href="`/interface/conversations/${conv._id}`">{{ conv.name }}</a></td>
          <td>{{ conv.description }}</td>
          <td>{{ timeToHMS(conv.audio.duration)}}</td>
          <td>{{ dateToJMYHMS(conv.last_update)}}</td>
        </tr>
      </tbody>
    </table>
    <span v-else class="no-result">No conversation found</span> 
  </div>
</template>
<script>
export default {
  props:["userInfo","currentOrganizationScope"],
  data() {
    return {
      userOrgasLoaded: false,
      convosLoaded: false,
      userRightsLoaded: false
    }
  },
  computed: {
    conversations() {
        return this.$store.state.conversationsList || []
    }
  },
  watch: {
    async currentOrganizationScope(data) {
      await this.dispatchConversations()
    }
  },
  async mounted () {
    await this.dispatchConversations()
  },
  methods: {
    dateToJMYHMS(date) {
      return this.$options.filters.dateToJMYHMS(date)
    },
    timeToHMS(time){
      return this.$options.filters.timeToHMS(time)
    },
    async dispatchConversations() {
      if(!!this.currentOrganizationScope && this.currentOrganizationScope.length > 0) {
        this.convosLoaded = await this.$options.filters.dispatchStore('getConversationsByOrganization')
      }
      else this.convosLoaded = false
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