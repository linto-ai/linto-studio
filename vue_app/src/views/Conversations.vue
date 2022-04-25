<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <table v-if="conversations.length > 0">
      <thead>
        <tr>
          <th>name</th>
          <th>owner</th>
          <th>shared</th>
          <th>Rights</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="convo in conversations" :key="convo._id">
          <td>{{ convo.name }}</td>
          <td>{{ convo.owner === userInfo._id }}</td>
          <td>{{ convo.sharedWithUsers.indexOf(usr => usr.userId === userInfo._id) >= 0}}</td>
          <td>todo</td>
        </tr>
      </tbody>
    </table>
    <div v-else>No conversation</div>
    </div>
</template>
<script>
export default {
  props:["userInfo","currentOrganizationScope"],
  data() {
    return {
      userOrgasLoaded: false,
      orgasLoaded: false,
      convosLoaded: false
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
      if(!!this.currentOrganization && this.convosLoaded) return this.$store.getters.getConversationByOrganizationScope(this.currentOrganizationScope)
      return []
    }
  },
  async mounted () {
    await this.dispatchOrganizations()
    await this.dispatchUserOrganizations()
    await this.dispatchConversations()
  },
  methods: {
    async dispatchConversations() {
      this.convosLoaded = await this.$options.filters.dispatchStore('getConversations')
    },
    async dispatchOrganizations() {
      this.orgasLoaded = await this.$options.filters.dispatchStore('getOrganizations')
    },
    async dispatchUserOrganizations() {
      this.userOrgasLoaded = await this.$options.filters.dispatchStore('getUserOrganizations')
    }
  }
}
</script>