<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Create Organiaztion</h1>

    <!-- Organization name -->
      <div class="form-field flex col">
        <span class="form-label">Organization Name</span>
        <input 
          type="text"
          v-model="organizationName.value"
          :class="organizationName.error !== null ? 'error' : ''"
        >
        <span class="error-field" v-if="organizationName.error !== null">{{ organizationName.error }}</span>
      </div>

      <!-- Description -->
      <div class="form-field flex col">
        <span class="form-label">Description</span>
        <textarea
          v-model="organizationDescription.value"
        ></textarea>
        <span class="error-field" v-if="organizationDescription.error !== null">{{ organizationDescription.error }}</span>
      </div>


      <!-- Visibility -->
      <div class="form-field flex col">
        <span class="form-label">Visibility</span>
        <select 
          v-model="organizationVisibility.value"
        >
          <option value="private">private</option>
          <option value="public">public</option>
        </select>
      </div>

      <!-- Members -->
      <div class="form-field flex col">
        <span class="form-label">Members</span>
        <div class="flex col search-member-container" >
          <input type="text" v-model="searchMemberValue" @input="searchMember()">
          <div class="flex col search-member-list" v-if="searchMemberValue.length > 0">
            <div class="flex col" v-if="usersList.length > 0">
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
            <div v-else>
              <span class="no-result">No resulte found</span>
          </div>
          </div>
        </div>

        <div class="organization-members">
          <table class="table members" v-if="organizationMembers.length > 0">
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
                <td class="title">{{ getUserById(member._id).firstname }} {{ getUserById(member._id).lastname }}</td>
                <td>{{ getUserById(member._id).email }}</td>
                <td>
                  <select v-model="member.role">
                    <option v-for="role in userRoles" :key="role.value" :value="role.value">{{ role.name }}</option>
                  </select>
                </td>
                <td class="center">
                  <button class="btn btn-small red" @click="removeFromMembers(member)">
                    <span class="icon icon__remove"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <span v-else class="no-member">No member selected</span>

        </div>
        <div class="flex row form-field">
          <button class="btn btn-big green" @click="handleOrganizationForm()">
            <span class="icon icon__apply"></span>
            <span class="label">Envoyer</span>
          </button>
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
          name: "Member",
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
    debugger
    await this.dispatchUserOrganizations()
    debugger
    await this.dispatchUsers()
    debugger

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