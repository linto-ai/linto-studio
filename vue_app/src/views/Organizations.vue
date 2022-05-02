<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Organizations</h1>

    <a href="/interface/organizations/create">Create organization</a>
    <table v-if="userOrganizations.length > 0">
      <thead>
        <tr>
          <th>name</th>
          <th>role</th>
          <th>visibility</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="orga in userOrganizations" :key="orga._id">
          <td><a :href="`/interface/organizations/${orga._id}`">{{ orga.name }}</a></td>
          <td>{{ getRoleByOrganization(orga._id) }}</td>
          <td>todo</td>
        </tr>
      </tbody>
    </table>
    <div v-else>No organization</div>
    </div>
</template>
<script>
export default {
  props:["userInfo"],
  data() {
    return {
      userOrgasLoaded: false,
      orgasLoaded: false,
    }
  },
  computed: {
    dataLoaded () {
      return this.userOrgasLoaded
    },
    userOrganizations () {
      return this.$store.state.userOrganizations
    }
  },
  async mounted () {
    await this.dispatchUserOrganizations()
  },
  methods: {
    async dispatchUserOrganizations() {
      this.userOrgasLoaded = await this.$options.filters.dispatchStore('getUserOrganizations')
    },
     getRoleByOrganization(organizationId) {
      return this.$store.getters.getUserRoleInOrganization(organizationId)
    }
    
  }
}
</script>