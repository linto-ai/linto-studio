<template>
  <div id="app" v-if="renderInterface && dataLoaded">
    <AppVerticalNavigation :currentOrganizationScope="currentOrganizationScope"></AppVerticalNavigation>
    <div id="app-view" class="flex col flex1">
      <AppHeader :userInfo="userInfo"></AppHeader>
      <div class="app-view-content flex col flex1">
        <router-view 
          class="flex1" 
          :userInfo="userInfo"
          :currentOrganizationScope="currentOrganizationScope"
        ></router-view>
        <AppNotif ></AppNotif>
      </div>
    </div>
  </div>
  <div id="app" v-else>
      <router-view class="login-form-wrapper flex col flex1"></router-view>
  </div>
</template>
<script>
  import { bus } from './main.js'
  import AppHeader from '@/components/AppHeader.vue'
  import AppVerticalNavigation from '@/components/AppVerticalNavigation.vue'
  import AppNotif from '@/components/AppNotif.vue'
  export default {
    data () {
      return {
        orgasLoaded: false,
        userOrgasLoaded: false,
      }
    },
    computed: {
      renderInterface () {
        return (this.$route.fullPath.indexOf('interface') >= 0)
      },
      dataLoaded () {
        return !!this.userInfo && !!this.currentOrganizationScope
      },
      userInfo () {
        return this.$store.state.userInfo
      },
      userOrganizations() {
        return this.$store.state.userOrganizations
      },
      currentOrganizationScope() {
        if(this.orgasLoaded && this.userOrgasLoaded) return this.$store.getters.getCurrentOrganizationScope()
        return null
      }
    },
    async mounted () {
      if(this.renderInterface){
        await this.getuserInfo()
        await this.dispatchOrganizations()
        await this.dispatchUserOrganizations()

        bus.$on('set_organization_scope', (data) =>{
          this.setOrganizationScope(data.organizationId)
        })
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
      async setOrganizationScope(organizationId){
        this.$options.filters.setCookie('cm_orga_scope', organizationId, 7)
          if(this.$route.path === '/interface/conversations/') {
            await this.getuserInfo()
            await this.dispatchOrganizations()
            await this.dispatchUserOrganizations()

          } else {
            window.location.href = '/interface/conversations/'
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
