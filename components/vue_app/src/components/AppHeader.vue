<template>
  <div id="app-header" class="flex row">
    <div class="user-menu flex row">
      <button class="user-menu-btn" @click="toggleUserMenu()" :class="userMenuOpened ? 'opened' : 'closed'" v-if="!!user">
        <img class="user-menu-btn--img" :src="imgUrl">
        <span class="user-menu--name">{{CapitalizeFirstLetter(user.firstname)}} {{CapitalizeFirstLetter(user.lastname)}}</span>
        <span class="user-menu-btn--arrow flex col" :class="userMenuOpened ? 'user-menu-btn--arrow__opened' : 'user-menu-btn--arrow__closed'"></span>
      </button>
      <div class="user-menu-links flex col" :class="userMenuOpened ? 'opened' : 'closed'">
          <a class="user-menu-links--item flex" href="/auth/logout">
            <span class="icon logout"></span>
            <span class="label">Logout</span>
          </a>
        </div>
    </div>
    
  </div>
</template>
<script>
export default {
  props: ['userInfo'],
  data () {
    return {
      userMenuOpened: false
    }
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
    },

  }
}
</script>