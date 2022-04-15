<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <div class="flex row" style="margin-bottom:20px;">
      <a class="btn btn-medium secondary" href="/interface/user/organizations">
        <span class="icon icon__arrow-left"></span>
        <span class="label">Back to organizations</span>
      </a>
    </div>
    <h1>Update Organiaztion - {{organizationName.value}}</h1>
    <div class="flex row">
      <div class="flex flex1 col oganization-infos">
        <!-- Organization name -->
          <div class="form-field flex col">
            <span class="form-label">Organization Name</span>
            <input 
              v-if="userRole.value > 2"
              type="text"
              v-model="organizationName.value"
              :class="organizationName.error !== null ? 'error' : ''"
            >
            <span v-else class="organization-info-title">{{ organizationName.value }}</span>
            <span class="error-field" v-if="organizationName.error !== null">{{ organizationName.error }}</span>
          </div>

          <!-- Description -->
          <div class="form-field flex col">
            <span class="form-label">Description</span>
            <textarea
              v-if="userRole.value > 2"
              v-model="organizationDescription.value"
            ></textarea>
            <span v-else class="organization-info-desc" :class="organizationDescription.value.length > 0 ? '' : 'no-desc'">{{ organizationDescription.value.length > 0 ? organizationDescription.value : 'No description' }}</span> 
            <span class="error-field" v-if="organizationDescription.error !== null">{{ organizationDescription.error }}</span>
          </div>


          <!-- Visibility -->
          <div class="form-field flex col">
            <span class="form-label">Visibility</span>
            <select 
              v-if="userRole.value > 2"
              v-model="organizationVisibility.value"
            >
              <option value="private">private</option>
              <option value="public">public</option>
            </select>
            <span class="organization-info-visibility" v-else>{{organizationVisibility.value}}</span>
          </div>
          <div class="flex row form-field" v-if="userRole.value > 2">
              <button class="btn btn-big green" @click="handleOrganizationForm()">
                <span class="icon icon__apply"></span>
                <span class="label">Update</span>
              </button>
            </div>
        </div>

        <div class="flex2 flex col">
          <!-- Members -->

          <div class="form-field flex col" v-if="userRole.value >= 2">
            <span class="form-label">Add a member</span>
            <div class="flex col search-member-container" >
              <input type="text" v-model="searchMemberValue" @input="searchMember()" placeholder="User name or email...">
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
          </div>

            <div class="organization-members">
              <table class="table auto" v-if="organizationMembers.length > 0">
                <thead>
                  <tr>
                    <th>
                      <button 
                        class="table-th-filter" 
                        @click="orderOrgaBy('username')"
                        :class="[this.orderByKey === 'username' ? 'selected' : '', this.orderByKey === 'username' && !this.orderByDirectionAsc ? 'desc' : '']"
                      >User
                      </button>
                    </th>
                    <th>
                    <button 
                      class="table-th-filter" 
                      @click="orderOrgaBy('visibility')"
                      :class="[this.orderByKey === 'visibility' ? 'selected' : '', this.orderByKey === 'visibility' && !this.orderByDirectionAsc ? 'desc' : '']"
                    >Visibility
                    </button>
                    </th>
                    <th>
                      <button 
                        class="table-th-filter" 
                        @click="orderOrgaBy('role')"
                        :class="[this.orderByKey === 'role' ? 'selected' : '', this.orderByKey === 'role' && !this.orderByDirectionAsc ? 'desc' : '']"
                      >Role
                      </button>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in organizationMembers" :key="member._id" :class="member._id === userInfo._id ? 'current-user' : ''">
                    <td>
                      <div class="user-td flex row">
                        <img class="user-img" :src="'/' + member.img">
                        <div class="flex col">
                          <span class="user-name">{{ getUserById(member._id).firstname }} {{ getUserById(member._id).lastname }}</span>
                          <span class="user-email">{{ member.email }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <select v-model="userVisibility.value" v-if="member._id === userInfo._id" @change="updateSelfVisibility()">
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                      </select>

                      <span v-else><i>{{ member.visibility }}</i></span>
                    </td>
                    <td>
                      <select 
                        v-model="member.role" 
                        @change="updateUserRole(member)" 
                        v-if="member.role <= userRole.value && member._id !== userInfo._id && userRole.value >= 2">
                          <option v-for="role in userRoles.filter(ur => ur.value < 4)" :key="role.value" :value="role.value" :disabled="userRole.value < role.value">{{ role.name }}</option>
                      </select>
                      <span v-else :class="`user-role ${member._id === currentOrganization.owner ? 'owner' :
                        userRoles.find(role => role.value === member.role).name.toLowerCase()}`">
                          {{ member._id === currentOrganization.owner ? 'Owner' : userRoles.find(role => role.value === member.role).name }}
                        </span>
                    </td>
                    <td class="center">
                      <button 
                        v-if="member.role <= userRole.value && member._id !== userInfo._id && member._id !== currentOrganization.owner && userRole.value >= 2"
                        class="btn btn-small red info-text" 
                        data-content="Remove from organization" 
                        @click="removeMemberValidation(member)">
                        <span class="icon icon__trash"></span>
                      </button>
                      <button 
                        v-if="member._id === userInfo._id && userRole.value < 4" data-content="Leave organization" 
                        class="btn btn-small red info-text" 
                        @click="leaveOrganization()" >
                        <span class="icon icon__leave"></span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <span v-else class="no-member">No member selected</span>
            </div>
        </div>
      </div>
      <Modal></Modal>
    </div>
  <div v-else>
    loading
  </div>
</template>
<script>
import { bus } from '../main.js'
import Modal from '@/components/Modal.vue'

export default {
  props: ['userInfo'],
  data() {
    return{
      organizationId: '',
      orgaLoaded: false,
      usersLoaded: false,
      userOrgaLoaded: false,
      organizationName: {},
      organizationDescription: {},
      organizationVisibility: {},
      searchMemberValue: '',
      organizationMembers: [],
      selectedMembersId: [],
      usersList: [],
      userVisibility: {
        value: '',
        error: null,
        valid: false
      },
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
        }, {
          name:"Owner", 
          value: 4
        }
      ],
      orderByKey: '',
      orderByDirectionAsc: true
    } 
  },
  async mounted () {
    await this.dispatchOrganizations()
    await this.dispatchUserOrganizations()
    await this.dispatchUsers()

    this.organizationId = this.$route.params.organizationId

   
   
    bus.$on('refresh_user_organizations', async (data) => {
      await this.dispatchOrganizations()
      this.removeFromMembers(data.user)
    })

  },
  computed: {
    dataLoaded () {
      return this.orgaLoaded && this.usersLoaded && this.userOrgaLoaded && !!this.currentOrganization && !!this.userRole
    },
    userOrganizations () {
      return this.$store.state.userOrganizations
    },
    organizations () {
      return this.$store.state.organizations
    },
    currentOrganization () {
      if(this.orgaLoaded && this.organizationId !== '') {
        return this.$store.getters.getOrganizationById(this.organizationId)

        
      }
    },
    userRole () {
      return this.$store.getters.getUserRoleByOrganizationId(this.organizationId, this.userInfo._id)
    }
  },
  watch: {
    dataLoaded(data) {
      if(data) {
        this.organizationName = {
          value: this.currentOrganization.name,
          error: null,
          valid: true
        }
        this.organizationDescription = {
          value: this.currentOrganization.description,
          error: null,
          valid: true
        }
        this.organizationVisibility = {
          value: this.currentOrganization.type,
          error: null,
          valid: true
        }
      }

      let members = []
      for(let user of this.currentOrganization.users) {
        let memberItem = {
          role: user.role,
          visibility: user.visibility,
          ...this.getUserById(user.userId)
        }
        members.push(memberItem)
        this.selectedMembersId.push(user.userId)
      }
      this.organizationMembers = members


       this.userVisibility = {
        value: this.organizationMembers.find(member => member._id === this.userInfo._id).visibility,
        valid: true,
        error: null
      }
    },
    orderByKey(data) {
      
    }
  },
  methods: {
    orderOrgaBy(name) {
      if(this.orderByKey === name) {
        this.orderByDirectionAsc = !this.orderByDirectionAsc
      } else {
        this.orderByKey = name
        this.orderByDirectionAsc = true
      }
      if(this.orderByKey !== '') {
        this.organizationMembers.sort((a,b) => {
          let fa = ''
          let fb = ''

          if(this.orderByKey === 'visibility') {
            fa = a[this.orderByKey].toLowerCase()
            fb = b[this.orderByKey].toLowerCase()
          }
          if(this.orderByKey === 'role') {
            fa = a[this.orderByKey]
            fb = b[this.orderByKey]
          }

          if(this.orderByKey === 'username') {
            fa = a.firstname.toLowerCase() + a.lastname.toLowerCase() 
            fb = b.firstname.toLowerCase() + b.lastname.toLowerCase() 
          }

          if(fa === fb) return 0
          if(this.orderByDirectionAsc) {
            return fa > fb ? 1 : -1
          } else {
            return fa < fb ? 1 : -1
          }
        })
      }
    },
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
    async addToMembers(user) {
      try {
        let newUser = user
        newUser.role = 1
        newUser.visibility = 'public'
        
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/${this.currentOrganization._id}/user`, 'post', newUser) 

        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000
          })
          await this.dispatchOrganizations() 
          this.organizationMembers.push(newUser)
          this.selectedMembersId.push(user._id)
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
    removeFromMembers(user) {
        let organizationMembersIndex = this.organizationMembers.findIndex(member => member._id === user._id)
        this.organizationMembers.splice(organizationMembersIndex, 1)

        let selectedMemberIndex = this.selectedMembersId.findIndex(id => id === user._id )
        this.selectedMembersId.splice(selectedMemberIndex, 1)
    },
    removeMemberValidation(user) {
      bus.$emit('show_modal', { 
          title: 'Remove user from organization',
          content: `Are you sure you want to remove the user "${user.firstname} ${user.lastname}" from the organization ?`,
          actionBtnLabel: 'Remove',
          actionName: 'remove_user_from_organization',
          organizationId: this.organizationId,
          user
        })
    },
    async handleOrganizationForm() {
      this.$options.filters.testName(this.organizationName)
      
      if(this.organizationName.valid) {
        await this.updateOrganization()
      }
    },
    async updateOrganization() {
      try {
        let payload = {
          name: this.organizationName.value,
          description: this.organizationDescription.value,
          type: this.organizationVisibility.value
        }

        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/${this.organizationId}`, 'patch', payload) 

        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000
          })
          await this.dispatchOrganizations() 
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
    async updateUserRole(member) {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/${this.organizationId}/user`, 'patch', {
          role: member.role,
          userId: member._id
        })

        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000
          })
          await this.dispatchOrganizations() 
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
    async updateSelfVisibility() {
      try {
        let req = await this.$options.filters.sendRequest(`${process.env.VUE_APP_CONVO_API}/organizations/user/${this.organizationId}`, 'patch', {
          visibility: this.userVisibility.value
        })

        if(req.status >= 200 && req.status < 300 && (!!req.data.msg || !!req.data.message)) {
          bus.$emit('app_notif', {
            status: 'success',
            message: req.data.msg || req.data.message,
            timeout: 3000
          })
          await this.dispatchOrganizations() 
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
     leaveOrganization (orga) {
      bus.$emit('show_modal', { 
        title: 'Leave Organisation',
        content: 'Are you sure you want to leave this organization ?',
        actionBtnLabel: 'Leave organization',
        actionName: 'leave_organization',
        organization: this.currentOrganization
      })
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
  },
  components: {
    Modal
  }
}
</script>