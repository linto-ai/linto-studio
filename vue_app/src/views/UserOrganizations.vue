<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Organizations</h1>
    <div class="flex col">
      <h2>My organizations</h2>
      <div class="flex">
        <table class="table" >
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Visibility</th>
              <th>Members</th>
              <th>Edit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="orga in userOrganizations.userOrganizations" :key="orga._id">
              <td>{{orga.name}}</td>
              <td>{{orga.description}}</td>
              <td>{{ getUserById(orga.owner).firstname }} {{ getUserById(orga.owner).lastname }}</td>
              <td>{{orga.type}}</td>
              <td>
                <div class="flex col">
                <span v-for="user in orga.users" :key="user.userId">{{ getUserById(user.userId).firstname }} {{getUserById(user.userId).lastname }}</span>
                </div>
              </td>
              <td>Edit</td>
              <td>Remove</td>
            </tr>
          </tbody>
        </table>
      </div> 
    </div>
    <a href="/interface/user/organizations/create">Create new Organization</a>
  </div>
  <div v-else>
    loading
  </div>
</template>
<script>
import { bus } from '../main.js'

export default({
  props: ['userInfo'],

  data() {
    return {
      orgaLoaded: false,
      usersLoaded: false,
      userOrgaLoaded: false
    }
  },
  async mounted () {
    await this.dispatchOrganizations()
    await this.dispatchUserOrganizations()
    await this.dispatchUsers()
  },
  computed: {
    dataLoaded () {
      return this.orgaLoaded && this.usersLoaded && this.userOrgaLoaded
    },
    userOrganizations () {
      return this.$store.state.userOrganizations

    },
    organizations () {
      return this.$store.state.organizations
    }
  },
  methods: {
    getUserById (id) {
      return this.$store.getters.getUserById(id)
    },
    async dispatchOrganizations () {
      this.orgaLoaded = await this.$options.filters.dispatchStore('getOrganisations')
    },
    async dispatchUserOrganizations () {
      this.userOrgaLoaded = await this.$options.filters.dispatchStore('getUserOrganisations')
    },
    async dispatchUsers () {
      this.usersLoaded = await this.$options.filters.dispatchStore('getAllUsers')
    }
    
  }
})
</script>
