<template>
  <div id="app" v-if="renderInterface">
    <AppVerticalNavigation></AppVerticalNavigation>
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
      return {}
    },
    computed: {
      renderInterface () {
        return (this.$route.fullPath.indexOf('interface') >= 0)
      },
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    async mounted () {
      if(this.renderInterface){
        await this.getuserInfo()
      }
    },
    methods: {
      async getuserInfo () {
        try {
          
          await this.$options.filters.dispatchStore('getuserInfo')
        } catch (error) {
          console.error('err: ', error)
        }
      } 
    },
    components: {
      AppHeader,
      AppNotif,
      AppVerticalNavigation
    }
  }
</script>
