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
              <th>My role</th>
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
                  {{ orga.users.length }}
              </td>
              <td class="center">
                <a 
                  v-if="getUserRoleByOrganizationId(orga._id) === 'owner' || getUserRoleByOrganizationId(orga._id) > 1"
                  :href="`/interface/user/organizations/${orga._id}`"
                  class="btn btn-medium info-text green" data-content="Edit organization">
                  <span class="icon icon__edit"></span>
                </a>
              </td>
              <td class="center" v-if="orga.owner === userInfo._id">
                <button 
                  v-if="!orga.personal"
                  class="btn btn-medium red info-text" 
                  data-content="Remove organization"
                  @click="deleteOrganization(orga)"
                >
                  <span class="icon icon__remove"></span>
                </button>
              </td>
              <td class="center" v-else>
                <button 
                  v-if="!orga.personal"
                  class="btn btn-medium red info-text" 
                  data-content="Leave organization"
                  @click="leaveOrganization(orga)">
                  <span class="icon icon__cancel"></span>
                </button>
              </td>
              <td>
                {{ userRoles.find(role => role.value === getUserRoleByOrganizationId(orga._id)).name }}
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
      ]
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
    getUserRoleByOrganizationId(organizationId) {
      return this.$store.getters.getUserRoleByOrganizationId(organizationId, this.userInfo._id)
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