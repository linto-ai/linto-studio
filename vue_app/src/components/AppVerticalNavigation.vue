<template>
  <div id="vertical-navigation" class="flex col" v-if="dataLoaded">

    <div class="app-nav-organizations flex col">
      
      <button 
        :class="[navOrganizationVisible ? 'active': '', 'nav-current-orga']" 
        @click="navOrganizationVisible = !navOrganizationVisible"
      >{{ currentOrganization.personal ? 'My organization': currentOrganization.name }}</button>

      <div class="nav-orga-list" :class="[navOrganizationVisible ? 'visible' : 'hidden','flex','col']">
        
        <button 
          class="nav-orga-item" 
          v-for="orga in navOrganizationList" 
          :key="orga._id"
          @click="setOrganizationScope(orga._id)"
        >{{ orga.personal ? 'My Organization' : orga.name }}</button>

        <a :href="`/interface/organizations/${currentOrganizationScope}`" class="nav-orga-item">Organization settings</a>
        <a href="/interface/organizations/create"  class="nav-orga-item">Create organization</a>
      </div>
    </div>
    
    
    <div class="app-nav flex col" style="margin-top: 20px;">
      <div class="flex row">
        <a href="/interface/conversations" class="app-nav-link">Conversations</a>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props:['currentOrganizationScope'],
  data () {
    return {
      orgasLoaded: false,
      userOrgasLoaded: false,
      reduced: false,
      navOrganizationVisible: false
    }
  },
  async mounted () {
    await this.dispatchOrganizations()
    await this.dispatchUserOrganizations()

    bus.$on('vertical_nav_close', (data) => {
      this.verticalNavOpen = false
    })
  },
  computed: {
    dataLoaded () {
      return  this.currentOrganization !== null
    },
    logoPath () {
      if (this.verticalNavOpen) {
        return '/assets/img/conversation-manager-logo-white.svg'
      } else {
        return '/assets/img/conversation-manager-logo-small.svg'
      }
    },
    userOrganizations () {
      return this.$store.state.userOrganizations
    },
    currentOrganization () {
      if(this.orgasLoaded && this.userOrgasLoaded ) return this.$store.getters.getOrganizationById(this.currentOrganizationScope)
      return null

    },
    navOrganizationList() {
      return this.userOrganizations.filter(orga => orga._id !== this.currentOrganization._id)
    }
  },
  methods: {
    toggleNav () {
      this.verticalNavOpen = !this.verticalNavOpen
    },
    setOrganizationScope(organizationId){
      bus.$emit('set_organization_scope', {organizationId})
      this.navOrganizationVisible = false

    },
    async dispatchOrganizations() {
      this.orgasLoaded = await this.$options.filters.dispatchStore('getOrganizations')
    },
    async dispatchUserOrganizations() {
      this.userOrgasLoaded = await this.$options.filters.dispatchStore('getUserOrganizations')
    }
  }
}
</script>