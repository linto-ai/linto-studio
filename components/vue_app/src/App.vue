<template>
  <div id="app">
    <AppVerticalNavigation></AppVerticalNavigation>
    <div id="app-view" class="flex col flex1">
      <AppHeader></AppHeader>
      <div class="app-view-content flex col flex1">
        <router-view class="flex1"></router-view>
        <AppNotif></AppNotif>
      </div>
      
    </div>
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
    components: {
      AppHeader,
      AppNotif,
      AppVerticalNavigation
    }
  }
</script>
