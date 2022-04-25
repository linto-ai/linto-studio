<template>
  <div class="flex col scrollable" v-if="usersLoaded">
    <h1>Create organization</h1>
    <!--Organization Name -->
    <div class="form-field flex col">
      <span class="form-label">Name</span>
      <input 
        type="text" 
        v-model="orgaName.value"
        :class="orgaName.error !== null ? 'error' : ''"
      >
      <span class="error-field" v-if="orgaName.error !== null">{{ orgaName.error }}</span>
    </div>
    <!--Organization Descirption -->
    <div class="form-field flex col">
      <span class="form-label">Description</span>
      <input type="text" v-model="orgaDescription.value">
    </div>
    <!--Organization Visibility -->
    <div class="form-field flex col">
      <span class="form-label">Visibility</span>
      <select v-model="orgaVisibility.value">
        <option value="public">public</option>
        <option value="private">private</option>
      </select>
    </div>
    <!--Organization Members -->
    <div class="form-field flex col">
      <span class="form-label">Add a member</span>
      <input type="text" v-model="searchMemberValue">
      <div v-if="searchMemberValue.length > 0 && availableUsers.length > 0" class="search-member-list flex col">
        <button class="search-member-btn flex row align-center" v-for="user of availableUsers" :key="user._id" @click="addToMembers(user)">
          <img :src="`/${user.img}`" class="search-member-img">
          <span class="search-member-identity">{{ user.firstname }} {{ user.lastname }} <i>({{ user.email }})</i></span>
        </button>
      </div>
      <div v-if="searchMemberValue.length > 0 && availableUsers.length === 0" class="search-member-list flex col">
        <span>User not found</span>
      </div>
    </div>
    <div v-if="orgaMembers.length > 0" class="flex col">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member of orgaMembers" :key="member._id">
            <td>
              <div class="flex row align-center">
                <img :src="`/${member.img}`" class="search-member-img">
                <span class="search-member-identity">{{ member.firstname }} {{ member.lastname }} <i>({{ member.email }})</i></span>
              </div>
            </td>
            <td>
              <select v-model="member.role">
                <option v-for="role in userRoles" :key="role.value" :value="role.value">{{ role.name }}</option>
              </select>
            </td>
            <td>
              <button @click="removeFromMembers(member)">remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex row">
      <button @click="createOrganization()">{{ formSubmitLabel }}</button>
    </div>

  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props:["userInfo"],
  data() {
    return {
      usersLoaded: false,
      orgaName: {
        value:'',
        error: null,
        valid: false
      },
      orgaDescription: {
        value:'',
        error: null,
        valid: false
      },
      orgaVisibility: {
        value:'public',
        error: null,
        valid: true
      },
      orgaMembers: [],
      orgaMembersIds: [],
      searchMemberValue: '',
      userRoles: [
        {
          name: 'Member',
          value: 1
        },
        {
          name: 'Maintainer',
          value: 2
        },
        {
          name: 'Admin',
          value: 3
        }
      ],
      formSubmitLabel: 'Create organization',
      formState: 'available'

    }
  },
  computed: {
    allUsers () {
      return this.$store.state.users
    },
    availableUsers () {
      if(this.searchMemberValue.length > 0) {
        return this.allUsers.filter(user => 
          user._id !== this.userInfo._id && this.orgaMembersIds.indexOf(user._id) < 0 && ((user.firstname + ' ' + user.lastname).indexOf(this.searchMemberValue) >= 0 || user.email.indexOf(this.searchMemberValue) >= 0))
      } 
      return []
    }
  },
  async mounted () {
    await this.dispatchUsers()
  },
  methods: {
    async createOrganization() {
      if(this.formState === 'available') {
        
        // test name field
        this.$options.filters.testName(this.orgaName)

        // form valid
        if(this.orgaName.valid) {
          try {
            this.formSubmitLabel = 'Processing...'
            this.formState = 'sending'
            let users = []
            for(let user of this.orgaMembers) {
              users.push({userId: user._id, role: user.role, visibility: 'public'})
            }
            let payload = {
              name: this.orgaName.value,
              description: this.orgaDescription.value,
              type: this.orgaVisibility.value,
              users
            }
            let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations`, 'post', payload) 
            if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
              this.formState = 'success'
              bus.$emit('app_notif', {
                status: 'success',
                message: req.data.msg || req.data.message,
                timeout: 3000,
                redirect: '/interface/organizations'
              })
            } else {
              throw req
            }
          } catch (error) {
            if(process.env.VUE_APP_DEBUG === 'true') {
              this.formState = 'available'
              bus.$emit('app_notif', {
                status: 'error',
                message:  error.msg || error.message || 'Error on creating organization',
                timeout: null
              })
            }
          }
        }
      }
    },
    addToMembers (user) {
      this.orgaMembersIds.push(user._id)
      let userOrga = user
      userOrga.visibility = 'public'
      userOrga.role = 1
      this.orgaMembers.push(user)
      this.searchMemberValue = ''
    },
    removeFromMembers (user) {
      let memberIdIndex = this.orgaMembersIds.findIndex(id => id === user._id)
      this.orgaMembersIds.splice(memberIdIndex, 1)

      let memberIndex = this.orgaMembers.findIndex(usr => usr._id === user._id)
      this.orgaMembers.splice(memberIndex, 1)
    },
    async dispatchUsers() {
      this.usersLoaded = await this.$options.filters.dispatchStore('getAllUsers')
    }
  }
}
</script>