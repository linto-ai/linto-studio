<template>
  <div id="app-header" class="flex row">
    <div class="header-lang-btn-container flex row">
      <button 
        @click="setAppLanguage('fr')" 
        class="header-lang-btn fr"
        :class="$i18n.locale === 'fr' ? 'active' : ''"
      ></button>
      <span> | </span>
      <button 
        @click="setAppLanguage('en')" 
        class="header-lang-btn en"
        :class="$i18n.locale === 'en' ? 'active' : ''"
      ></button>
    </div>
    <div class="user-menu flex row">
      <button class="user-menu-btn flex row" @click="toggleUserMenu()" :class="userMenuOpened ? 'opened' : 'closed'" v-if="!!user">
        <img class="user-menu-btn--img" :src="imgUrl">
        <span class="user-menu--name flex1">{{`${CapitalizeFirstLetter(user.firstname)} ${CapitalizeFirstLetter(user.lastname)}`.substring(0,24) }}</span>
        <span class="user-menu-btn--arrow flex col" :class="userMenuOpened ? 'user-menu-btn--arrow__opened' : 'user-menu-btn--arrow__closed'"></span>
      </button>
      <div class="user-menu-links flex col" :class="userMenuOpened ? 'opened' : 'closed'">
          <a class="user-menu-links--item flex" :href="`/interface/user/profile/${user._id}`">
            <span class="icon logout"></span>
            <span class="label">{{ $t('nav.my_account') }}</span>
          </a>
        </div>
    </div>
    <div class="header-logout">
      <a href="/auth/logout" id="logout"><span class="icon"></span></a>
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
      appLanguages: ['fr', 'en'],
      userId: ''
    }
  },
  async mounted () {
    this.checkLangCookie()
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
    checkLangCookie () {
      let cookieLang = this.getCookie('cm_lang')
      if(cookieLang !== null) {
        this.$i18n.locale = cookieLang
      }
    },
    setAppLanguage (lang) {
      this.$i18n.locale = lang
      this.setCookie('cm_lang', lang, 30)
    },
    CapitalizeFirstLetter(string) {
      return this.$options.filters.CapitalizeFirstLetter(string)
    },
    toggleUserMenu() {
      this.userMenuOpened = !this.userMenuOpened
    },
    getCookie (name) {
      return this.$options.filters.getCookie(name)
    },
    setCookie(name, value, days) {
      return this.$options.filters.setCookie(name, value, days)
    },
    async getUserInfo () {
        await this.$options.filters.dispatchStore('getuserInfo')
    }
  }
}
</script>