<template>
  <div class="flex col scrollable" v-if="dataLoaded">
    <h1>Organizations</h1>
    <div class="flex col">
      <div class="flex row">
        <a href="/interface/user/organizations/create" class="btn btn-medium green">
          <span class="icon icon__plus"></span>
          <span class="label">Create organization</span>
        </a>
      </div>
      <div class="flex">
        <table class="table auto" >
          <thead>
            <tr>
              <th>
                <button 
                  class="table-th-filter" 
                  :class="[this.orderByKey === 'name' ? 'selected' : '', this.orderByKey === 'name' && !this.orderByDirectionAsc ? 'desc' : '']"
                  @click="orderOrgaBy('name')"
                >Organization</button>
              </th>
              <th>
                  <button 
                    class="table-th-filter" 
                    @click="orderOrgaBy('owner')"
                    :class="[this.orderByKey === 'owner' ? 'selected' : '', this.orderByKey === 'owner' && !this.orderByDirectionAsc ? 'desc' : '']"
                  >Owner</button>
                </th>
              <th>
                <button 
                  class="table-th-filter" 
                  @click="orderOrgaBy('userRole')"
                  :class="[this.orderByKey === 'userRole' ? 'selected' : '', this.orderByKey === 'userRole' && !this.orderByDirectionAsc ? 'desc' : '']"
                >Role</button>
              </th>
              <th>
                <button 
                  class="table-th-filter" 
                  @click="orderOrgaBy('type')"
                  :class="[this.orderByKey === 'type' ? 'selected' : '', this.orderByKey === 'type' && !this.orderByDirectionAsc ? 'desc' : '']"
                >Visibility
                </button>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="orga in userOrganizations" :key="orga._id">
              <td class="title"><a :href="`/interface/user/organizations/${orga._id}`">{{orga.name}}</a></td>
              <td>
                <div class="user-td flex row">
                  <img class="user-img" :src="'/' + getUserById(orga.owner).img">
                  <div class="flex col">
                    <span class="user-name">{{ getUserById(orga.owner).firstname }} {{ getUserById(orga.owner).lastname }}</span>
                    <span class="user-email">{{getUserById(orga.owner).email }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span :class="`user-role ${orga.userRole.name.toLowerCase()}`">{{orga.userRole.name }}</span>
              </td>
              <td><i>{{orga.type}}</i></td>
              <td>
                  {{ orga.users.length }} member{{ orga.users.length > 1 ? 's' : ''}}
              </td>
              <td class="center" v-if="orga.owner === userInfo._id">
                <button 
                  v-if="!orga.personal"
                  class="btn btn-medium red info-text" 
                  data-content="Remove organization"
                  @click="deleteOrganization(orga)"
                >
                  <span class="icon icon__trash"></span>
                </button>
              </td>
              <td class="center" v-else>
                <button 
                  v-if="!orga.personal"
                  class="btn btn-medium red info-text" 
                  data-content="Leave organization"
                  @click="leaveOrganization(orga)">
                  <span class="icon icon__leave"></span>
                </button>
              </td>
              
            </tr>
          </tbody>
        </table>
      </div> 
    </div>
    <Modal></Modal>
  </div>
  <div v-else>
    loading
  </div>
</template>
<script>
import { bus } from '../main.js'
import Modal from '@/components/Modal.vue'
export default({
  props: ['userInfo'],

  data() {
    return {
      orgaLoaded: false,
      usersLoaded: false,
      userOrgaLoaded: false,
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

    bus.$on('refresh_user_organizations', async () => {
      await this.dispatchUserOrganizations()
    })
  },
  computed: {
    dataLoaded () {
      return this.orgaLoaded && this.usersLoaded && this.userOrgaLoaded
    },
    userOrganizations () {
      let organizations = this.$store.state.userOrganizations
      if(this.orderByKey === '') {
        return organizations
      } else {
        let sortedOrgas = organizations.sort((a,b) => {
          let fa = ''
          let fb = ''

          if(this.orderByKey === 'userRole') {
            fa = a[this.orderByKey].name.toLowerCase()
            fb = b[this.orderByKey].name.toLowerCase()
          }
          else{
            fa = a[this.orderByKey].toLowerCase()
            fb = b[this.orderByKey].toLowerCase()
          }

          if(fa === fb) return 0
          if(this.orderByDirectionAsc) {
            return fa > fb ? 1 : -1
          } else {
            return fa < fb ? 1 : -1
          }
        })
        return sortedOrgas
      }
    },
    organizations () {
      return this.$store.state.organizations
    }
  },
  methods: {
    getUserById (id) {
      return this.$store.getters.getUserById(id)
    },

    orderOrgaBy(name) {
      if(this.orderByKey === name) {
        this.orderByDirectionAsc = !this.orderByDirectionAsc
      } else {
        this.orderByKey = name
        this.orderByDirectionAsc = true
      }
    },
    leaveOrganization (orga) {
      bus.$emit('show_modal', { 
        title: 'Leave Organisation',
        content: 'Are you sure you want to leave this organization ?',
        actionBtnLabel: 'Leave organization',
        actionName: 'leave_organization',
        organization: orga
      })
    },
    deleteOrganization (orga) {
      bus.$emit('show_modal', { 
        title: 'Delete Organisation',
        content: 'Are you sure you want to delete this organization ?',
        actionBtnLabel: 'Delete organization',
        actionName: 'delete_organization',
        organization: orga
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
})
</script>