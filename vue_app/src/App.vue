<template>
  <div id="app" v-if="renderInterface && dataLoaded">
    <AppVerticalNavigation :currentOrganizationScope="currentOrganizationScope"></AppVerticalNavigation>
    <div id="app-view" class="flex col flex1">
      <AppHeader :userInfo="userInfo"></AppHeader>
      <div class="app-view-content flex col flex1">
        <router-view class="flex1" :userInfo="userInfo"></router-view>
        <AppNotif></AppNotif>
      </div>
    </div>
  </div>
  <div id="app" v-else>
      <router-view class="login-form-wrapper flex col flex1"></router-view>
  </div>
</template>
<script>
  import AppHeader from '@/components/AppHeader.vue'
  import AppVerticalNavigation from '@/components/AppVerticalNavigation.vue'
  import AppNotif from '@/components/AppNotif.vue'
  export default {
    data () {
      return {
        orgasLoaded: false,
        userOrgasLoaded: false,
        currentOrganizationScope: null,
      }
    },
    computed: {
      renderInterface () {
        return (this.$route.fullPath.indexOf('interface') >= 0)
      },
      dataLoaded () {
        return this.orgasLoaded && this.userOrgasLoaded && !!this.userInfo
      },
      userInfo () {
        return this.$store.state.userInfo
      },
      userOrganizations() {
        return this.$store.state.userOrganizations
      }
    },
    async mounted () {
      if(this.renderInterface){
        await this.getuserInfo()
        await this.dispatchOrganizations()
        await this.dispatchUserOrganizations()
        this.getActiveOrganizationScope()
      }
    },
    methods: {
      async getuserInfo () {
        try {
          await this.$options.filters.dispatchStore('getuserInfo')
        } catch (error) {
          console.error('err: ', error)
          return
        }
      },
      getActiveOrganizationScope() {
        let orgaCookie = this.$options.filters.getCookie('cm_orga_scope')
        if(orgaCookie !== null) {
          this.currentOrganizationScope = this.userOrganizations.find(orga => orga._id === orgaCookie)._id
        } else {
          this.currentOrganizationScope = this.userOrganizations.find(orga => orga.personal === true)._id
          // set organization scope cookie
          this.$options.filters.setCookie('cm_orga_scope', this.currentOrganizationScope, 7)
        }
      },
      async dispatchOrganizations() {
        this.orgasLoaded = await this.$options.filters.dispatchStore('getOrganizations')
      },
      async dispatchUserOrganizations() {
        this.userOrgasLoaded = await this.$options.filters.dispatchStore('getUserOrganizations')
      }
    },
    components: {
      AppHeader,
      AppNotif,
      AppVerticalNavigation
    }
  }
</script>
