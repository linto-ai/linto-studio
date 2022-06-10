<template>
  <div id="vertical-navigation" class="flex col" v-if="dataLoaded">

    <div class="app-nav-organizations flex col">
      
      <button 
        :class="[navOrganizationVisible ? 'active': '', 'nav-current-orga']" 
        @click="navOrganizationVisible = !navOrganizationVisible"
      >{{ currentOrganization.name }}</button>
      <div class="nav-orga-list" :class="[navOrganizationVisible ? 'visible' : 'hidden','flex','col']">
        <button 
          class="nav-orga-item" 
          v-for="orga in navOrganizationList" 
          :key="orga._id"
          @click="setOrganizationScope(orga._id)"
        >{{ orga.name }}</button>
      </div>
      <a v-if="!currentOrganization.personal" :href="`/interface/organizations/${currentOrganizationScope}`" class="nav-orga-link" style="margin-top: 10px;">Organization settings</a>
    <a href="/interface/organizations/create"  class="nav-orga-link">Create organization</a>
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
  props:['currentOrganizationScope', 'userOrganizations'],
  data () {
    return {
      orgasLoaded: false,
      userOrgasLoaded: false,
      reduced: false,
      navOrganizationVisible: false
    }
  },
    mounted () {
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
    currentOrganization () {
      return this.userOrganizations.find(orga => orga._id === this.currentOrganizationScope) || null
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
    }
  }
}
</script>