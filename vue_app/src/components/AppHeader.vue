<template>
  <div id="app-header" class="flex row">
    <div class="user-menu flex row">
      <button class="user-menu-btn flex row" @click="toggleUserMenu()" :class="userMenuOpened ? 'opened' : 'closed'" v-if="!!user">
        <img class="user-menu-btn--img" :src="imgUrl">
        <span class="user-menu--name flex1">{{`${CapitalizeFirstLetter(user.firstname)} ${CapitalizeFirstLetter(user.lastname)}`.substring(0,24) }}</span>
        <span class="user-menu-btn--arrow flex col" :class="userMenuOpened ? 'user-menu-btn--arrow__opened' : 'user-menu-btn--arrow__closed'"></span>
      </button>
      <div class="user-menu-links flex col" :class="userMenuOpened ? 'opened' : 'closed'">
          <a class="user-menu-links--item flex row" :href="`/interface/user/profile/${user._id}`">
            <span class="icon account"></span>
            <span class="label">Mon compte</span>
          </a>

          <a class="user-menu-links--item red flex row" href="/auth/logout">
            <span class="icon logout"></span>
            <span class="label">Déconnexion</span>
          </a>
        </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['userInfo'],
  data () {
    return {
      userMenuOpened: false,
      userId: ''
    }
  },
  async mounted () {
    bus.$on('refresh_user', async () => {
      await this.getUserInfo()
    })
  },
  computed: {
    user () {
      return this.$store.state.userInfo
    },
    imgUrl () {
      if(!!this.user) {
        return `${process.env.VUE_APP_URL}/${this.user.img}`
      }
      return ''
    }
  },
  methods: {
    CapitalizeFirstLetter(string) {
      return this.$options.filters.CapitalizeFirstLetter(string)
    },
    toggleUserMenu() {
      this.userMenuOpened = !this.userMenuOpened
    },
    async getUserInfo () {
        await this.$options.filters.dispatchStore('getuserInfo')
    }
  }
}
</script>