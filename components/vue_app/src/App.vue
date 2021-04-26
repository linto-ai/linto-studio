<template>
  <div id="app" v-if="renderInterface">
    <AppVerticalNavigation></AppVerticalNavigation>
    <div id="app-view" class="flex col flex1">
      <AppHeader></AppHeader>
      <div class="app-view-content flex col flex1">
        <router-view class="flex1" :authToken="authToken"></router-view>
        <AppNotif></AppNotif>
      </div>
    </div>
  </div>
  <div id="app" v-else>
      <router-view class="flex1"></router-view>
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
      authToken () {
        return this.$options.filters.getCookie('authToken')
      },
      renderInterface () {
        return (this.$route.fullPath.indexOf('interface') >= 0)
      }
    },
    components: {
      AppHeader,
      AppNotif,
      AppVerticalNavigation
    }
  }
</script>
