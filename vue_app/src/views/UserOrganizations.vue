<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Organizations</h1>
    <div class="flex col">
      <div class="flex row">
        <a href="/interface/user/organizations/create" class="btn btn-big green">
          <span class="icon icon__plus"></span>
          <span class="label">Create organization</span>
        </a>
      </div>
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
              <td class="title">{{orga.name}}</td>
              <td>{{orga.description}}</td>
              <td>
                <div class="table-user-img flex row">
                  <span class="table-user-img__span" :data-name="`${getUserById(orga.owner).firstname} ${getUserById(orga.owner).lastname}`">
                    <img :src="'/'+getUserById(orga.owner).img" class="table-user-img__img">
                  </span>
                </div>
              </td>
              <td>{{orga.type}}</td>
              <td class="center">
                  {{ orga.users.length}}
              </td>
              <td class="center">
                <button class="btn btn-medium info-text green" data-content="Edit organization">
                  <span class="icon icon__edit"></span>
                </button>
              </td>
              <td class="center" v-if="orga.owner === userInfo._id">
                <button class="btn btn-medium red info-text" data-content="Remove organization">
                  <span class="icon icon__remove"></span>
                </button>
              </td>
              <td class="center" v-else>
                <button class="btn btn-medium red info-text" data-content="Leave organization">
                  <span class="icon icon__cancel"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div> 
    </div>
    <a href="/interface/user/organizations/create">Create new Organization</a>

    <div class="test flex row">
      <button class="btn btn-small">
        <span class="icon icon__plus"></span>
        <span class="label">Button small</span>
      </button>

      <button class="btn btn-medium">
        <span class="icon icon__plus"></span>
        <span class="label">Button medium</span>
      </button>

      <button class="btn btn-medium">
        <span class="icon icon__plus"></span>
      </button>

      <button class="btn btn-big green">
        <span class="icon icon__plus"></span>
        <span class="label">Button Big</span>
      </button>
    </div>
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

<style scoped>
.test {
  margin-top: 20px;
}
.test .btn{
  margin: 0 20px;
}
</style>