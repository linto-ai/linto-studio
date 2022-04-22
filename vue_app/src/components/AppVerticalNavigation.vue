<template>
  <div id="vertical-navigation" class="flex col" v-if="dataLoaded">

    <div class="app-nav-organizations flex col">
      
      <button :class="[navOrganizationVisible ? 'active': '', 'nav-current-orga']" @click="navOrganizationVisible = !navOrganizationVisible">{{ currentOrganization.name }}</button>

      <div class="nav-orga-list" :class="[navOrganizationVisible ? 'visible' : 'hidden','flex','col']">
        <button class="nav-orga-item" v-for="orga in navOrganizationList" :key="orga._id">{{ orga.name }}</button>
      </div>
    </div>
    
    
    <div class="app-nav flex col">
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
      currentOrganization: null,
      navOrganizationVisible: false
    }
  },
  async mounted () {
    await this.dispatchOrganizations()
    await this.dispatchUserOrganizations()

    this.getActiveOrganizationScope()

    bus.$on('vertical_nav_close', (data) => {
      this.verticalNavOpen = false
    })
  },
  computed: {
    dataLoaded () {
      return this.orgasLoaded && this.userOrgasLoaded && this.currentOrganization !== null
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
    navOrganizationList() {
      return this.userOrganizations.filter(orga => orga._id !== this.currentOrganization._id)
    }
  },
  methods: {
    toggleNav () {
      this.verticalNavOpen = !this.verticalNavOpen
    },
    getActiveOrganizationScope() {
        this.currentOrganization = this.userOrganizations.find(orga => orga._id === this.currentOrganizationScope)
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