<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Organization: {{ currentOrganization.name }}</h1>
    <!--Organization Name -->
    <div class="form-field flex col" v-if="userRole.value === 3">
      <span class="form-label">Name</span>
      <input 
        type="text" 
        v-model="orgaName.value"
        :class="orgaName.error !== null ? 'error' : ''"
        @change="updateOrganization()"
      >
      <span class="error-field" v-if="orgaName.error !== null">{{ orgaName.error }}</span>
    </div>
    <h3 v-else class="orga-info title">{{ orgaName.value }}</h3>

    <!--Organization Descirption -->
    <div class="form-field flex col" v-if="userRole.value === 3">
      <span class="form-label">Description</span>
      <input 
        type="text" 
        v-model="orgaDescription.value" 
        @change="updateOrganization()"
      >
    </div>
    <span v-else class="orga-info description">{{ orgaDescription.value }}</span>

    <!--Organization Visibility -->
    <div class="form-field flex col" v-if="userRole.value === 3">
      <span class="form-label">Visibility</span>
      <select 
        v-model="orgaVisibility.value" 
        @change="updateOrganization()"
      >
        <option value="public">public</option>
        <option value="private">private</option>
      </select>
    </div>
    <span class="orga-info visibility" v-else>{{ orgaVisibility.value }}</span>
    <!--Organization Members -->
    <div class="form-field flex col" v-if="userRole.value > 1 && !currentOrganization.personal">
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
            <th>Visibility</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member of orgaMembers" :key="member._id" :class="userInfo._id === member._id ? 'currentuser' : ''">
            <td>
              <div class="flex row align-center">
                <img :src="`/${member.img}`" class="search-member-img">
                <span class="search-member-identity">{{ member.firstname }} {{ member.lastname }} <i>({{ member.email }})</i></span>
              </div>
            </td>
            <td>
              <select 
                v-model="member.role" 
                v-if="userRole.value > 1 && userRole.value >= member.role && userInfo._id!== member._id"
                @change="updateUserRole(member)"
              >
                <option 
                  v-for="role in userRoles" 
                  :key="role.value" 
                  :value="role.value" 
                  :disabled="userRole.value < role.value"
                >{{ role.name }}</option>
              </select>
              <span v-else>{{ userRoles.find(ur => ur.value === member.role).name }}</span>
            </td>
            <td>
              <select 
                v-if="userInfo._id === member._id"
                v-model="userVisibility.value"
                @change="updateSelfVisibility()"
              >
                <option value="public">public</option>
                <option value="private">private</option>
              </select>
              <span v-else>{{ member.visibility }}</span></td>
            <td>
              <button 
              v-if="!currentOrganization.personal && userRole.value >= member.role && userInfo._id !== member._id"
              @click="removeFromMembersValidation(member)">Remove</button>
              <button 
              v-if="!currentOrganization.personal  && userInfo._id === member._id"
              @click="leaveOrganization()">Leave organization</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Modal></Modal>
  </div>
</template>
<script>
import { bus } from '../main.js'
import Modal from '@/components/Modal.vue'
export default {
  props:["userInfo"],
  data() {
    return {
      usersLoaded: false,
      userOrgasLoaded: true,
      organizationId: '',
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
        value:'',
        error: null,
        valid: false
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
      userVisibility: {
        value:'',
        error: null,
        valid: false
      }
    }
  },
  computed: {
    dataLoaded () {
      return this.usersLoaded && this.currentOrganization !== null && this.userRole !== null && !!this.userInfo
    },
    allUsers () {
      return this.$store.state.users
    },
    availableUsers () {
      if(this.searchMemberValue.length > 0) {
        return this.allUsers.filter(user => 
          user._id !== this.userInfo._id && this.orgaMembersIds.indexOf(user._id) < 0 && ((user.firstname + ' ' + user.lastname).indexOf(this.searchMemberValue) >= 0 || user.email.indexOf(this.searchMemberValue) >= 0))
      } 
      return []
    },
    currentOrganization() {
      if(this.organizationId !== '' && this.userOrgasLoaded) {
        return this.$store.getters.getOrganizationById(this.organizationId)
      }return null
    },
    userRole () {
      if(!!this.currentOrganization) {
        return this.$store.getters.getUserRoleInOrganization(this.organizationId)
      }
      return null
    }

  },
  async mounted () {
    await this.dispatchUsers()
    await this.dispatchUserOrganizations() 

    this.organizationId = this.$route.params.organizationId

    bus.$on('remove_organization_user', async(data) => {
      await this.dispatchUserOrganizations() 
      this.removeFromMembers(data.user)
    })
  },
  watch: {
    dataLoaded (data) {
      if(data) {
        this.orgaName = {
          value: this.currentOrganization.name,
          valid: true,
          error: null
        }
        this.orgaDescription = {
          value: this.currentOrganization.description,
          valid: true,
          error: null
        }
        this.orgaVisibility = {
          value: this.currentOrganization.type,
          valid: true,
          error: null
        }
        this.userVisibility = {
          value: this.currentOrganization.users.find(usr => usr.userId === this.userInfo._id).visibility,
          valid: true,
          error: null
        }
        for(let user of this.currentOrganization.users) {
          let userObj = this.getUserById(user.userId)
          userObj.role = user.role
          userObj.visibility = user.visibility
          
          this.orgaMembersIds.push(userObj._id)
          this.orgaMembers.push(userObj)
        }
      }
    }
  },
  methods: {
    async addToMembers(user) {
      try {
        let newUser = user
        newUser.role = 1
        newUser.visibility = 'public'
        
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/${this.currentOrganization._id}/user`, 'post', newUser) 
        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000
          })
          await this.dispatchUserOrganizations() 
          this.orgaMembers.push(newUser)
          this.orgaMembersIds.push(user._id)
          this.searchMemberValue = ''
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
    removeFromMembersValidation(user) {
      bus.$emit('show_modal', { 
          title: 'Remove user from organization',
          content: `Are you sure you want to remove "${user.email}" from the organization "${this.currentOrganization.name}"`,
          actionBtnLabel: 'Remove user',
          actionName: 'remove_user_from_organization',
          organizationId: this.currentOrganization._id,
          user
        })
    },
    removeFromMembers (user) {
      let memberIdIndex = this.orgaMembersIds.findIndex(id => id === user._id)
      this.orgaMembersIds.splice(memberIdIndex, 1)

      let memberIndex = this.orgaMembers.findIndex(usr => usr._id === user._id)
      this.orgaMembers.splice(memberIndex, 1)
    },
    leaveOrganization () {
        bus.$emit('show_modal', { 
          title: 'Leave organization',
          content: `Are you sure you want to leave the organization "${this.currentOrganization.name}"`,
          actionBtnLabel: 'Leave organization',
          actionName: 'leave_organization',
          organization: this.currentOrganization
        })
    },
    async updateUserRole(user) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/${this.organizationId}/user`, 'patch', {
          role: user.role,
          userId: user._id
        })
        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000
          })
          await this.dispatchUserOrganizations() 
        } else {
          throw req
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        bus.$emit('app_notif', {
          status: 'error',
          message:  error.msg || error.message || 'Error on updating user role',
          timeout: null
        })
      }
    },
    async updateOrganization() {
      this.$options.filters.testName(this.orgaName)
      
      if(this.orgaName.valid) {
        try {
          let payload = {
            name: this.orgaName.value,
            description: this.orgaDescription.value,
            type: this.orgaVisibility.value
          }
          let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/${this.organizationId}`, 'patch', payload) 
          if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
            bus.$emit('app_notif', {
              status: 'success',
              message: req.data.msg || req.data.message,
              timeout: 3000
            })
            await this.dispatchUserOrganizations() 
          } else {
            throw req
          }
        } catch (error) {
          if(process.env.VUE_APP_DEBUG === 'true') {
            console.error(error)
          }
          bus.$emit('app_notif', {
            status: 'error',
            message:  error.msg || error.message || 'Error on updating organization',
            timeout: null
          })
        }
      }
    },
    async updateSelfVisibility() {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/user/${this.organizationId}`, 'patch', {
          visibility: this.userVisibility.value
        })
        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000
          })
          await this.dispatchUserOrganizations() 
        } else {
          throw req
        }
      } catch (error) {
        if(process.env.VUE_APP_DEBUG === 'true') {
          console.error(error)
        }
        bus.$emit('app_notif', {
          status: 'error',
          message:  error.msg || error.message || 'Error updating user visibility',
          timeout: null
        })
      }
    },
    getUserById(userId) {
      return this.$store.getters.getUserById(userId)
    },
    async dispatchUsers() {
      this.usersLoaded = await this.$options.filters.dispatchStore('getAllUsers')
    },
    async dispatchUserOrganizations() {
      this.userOrgasLoaded = await this.$options.filters.dispatchStore('getUserOrganizations')
    }
  },
  components:{
    Modal
  }
}
</script>
