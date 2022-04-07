<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Create Organiaztion</h1>
    <div class="form-field flex col">
      <span class="label">Organization Name</span>
      <input 
        type="text"
        v-model="organizationName.value"
        :class="organizationName.error !== null ? 'error' : ''"
      >
    </div>
    <div class="form-field flex col">
      <span class="label">Description</span>
      <textarea
        v-model="organizationDescription.value"
      ></textarea>
    </div>

    <div class="form-field flex col">
      <span class="label">Visibility</span>
      <select 
        v-model="organizationVisibility.value"
      >
        <option value="private">private</option>
        <option value="public">public</option>
      </select>
    </div>
    <!-- Members -->
    <div class="form-field flex col">
      <span class="label">Members</span>
      
      <div class="flex col search-member-container" >
        <input type="text" v-model="searchMemberValue" @input="searchMember()">
        <div class="flex col search-member-list" v-if="searchMemberValue.length > 0">
          
          <div class="flex row search-member-item" v-for="user in usersList" :key="user._id">
              <button 
                class="search-member-link flex row"
                @click="addToMembers(user)">
                  <img class="picture" :src="'/'+user.img">
                  <span class="name">{{ getUserById(user._id).firstname }} {{getUserById(user._id).lastname }}</span>
                  <span class="email">({{ user.email }})</span>
              </button>
          </div>
        </div>
      </div>

      <div class="organization-members">
        <table class="table" v-if="organizationMembers.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in organizationMembers" :key="member._id">
              <td>{{ getUserById(member._id).firstname }} {{ getUserById(member._id).lastname }}</td>
              <td>{{ getUserById(member._id).email }}</td>
              <td>
                <select v-model="member.role">
                  <option v-for="role in userRoles" :key="role.value" :value="role.value">{{ role.name }}</option>
                </select>
              </td>
              <td><button @click="removeFromMembers(member)">Remove</button></td>
            </tr>
          </tbody>
        </table>
        <span v-else>No member selected</span>

      </div>
      <div class="flex col form-field">
        <button @click="handleOrganizationForm()">Envoyer</button>
      </div>
    </div>
  </div>
  <div v-else>
    loading
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['userInfo'],
  data() {
    return{
      orgaLoaded: false,
      usersLoaded: false,
      userOrgaLoaded: false,
      organizationName: {
        value: '',
        error: null,
        valid: false
      },
      organizationDescription: {
        value: '',
        error: null,
        valid: false
      },
      organizationVisibility: {
        value: 'private',
        error: null,
        valid: false
      },
      searchMemberValue: '',
      organizationMembers: [],
      selectedMembersId: [],
      usersList: [],
      userRoles: [
        {
          name: "Guest",
          value: 1
        },
        {
          name: "Maintainer", 
          value: 2
        }, {
          name:"Admin", 
          value: 3
        }
      ]
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
    searchMember() {
      if(this.searchMemberValue.length > 0) {
        this.usersList = this.filterUsersList(this.searchMemberValue)
      }
    },
    filterUsersList (searchValue) {
      let availableUsers = this.$store.state.users
      for(let user of availableUsers) {
          console.log( `${user.firstname} ${user.lastname}`, searchValue)
          console.log(`${user.firstname} ${user.lastname}`.indexOf(searchValue))
        }
    // Return all user filtered by: searchValue + Not current User + Not selected
    return availableUsers.filter(user => 
    (`${user.firstname} ${user.lastname}`.indexOf(searchValue) >= 0 || user.email.indexOf(searchValue) >= 0) && user._id !== this.userInfo._id && this.selectedMembersId.indexOf(user._id) < 0)
    },

    addToMembers(user) {
      let newUser = user
      newUser.role = 1
      this.organizationMembers.push(newUser)
      this.selectedMembersId.push(user._id)
      this.searchMemberValue = ''
    },
    removeFromMembers(user) {
        let organizationMembersIndex = this.organizationMembers.findIndex(member => member._id === user._id)
        this.organizationMembers.splice(organizationMembersIndex, 1)

        let selectedMemberIndex = this.selectedMembersId.findIndex(id => id === user._id )
        this.selectedMembersId.splice(selectedMemberIndex, 1)
      
    },
    async handleOrganizationForm() {
      this.$options.filters.testName(this.organizationName)
      
      if(this.organizationName.valid) {
        await this.sendForm()
      }
    },
    async sendForm() {
      try {
        let users = []
        for(let user of this.organizationMembers) {
          users.push({userId: user._id, role: user.role, visibility: 'public'})
        }
        let payload = {
          name: this.organizationName.value,
          description: this.organizationDescription.value,
          type: this.organizationVisibility.value,
          users
        }

        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations`, 'post', payload) 
          
          console.log('ALLO', !!req.data.msg, !!req.data.message, !!req.data.msg || !!req.data.message)
          console.log('donc ? ', req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message))

        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000,
            redirect: '/interface/user/organizations'
          })
        } else {
          throw req
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        bus.$emit('app_notif', {
          status: 'error',
          message:  error.msg || error.message || 'Error on creating organization',
          timeout: null
        })
      }
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
}
</script>