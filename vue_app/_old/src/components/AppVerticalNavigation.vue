<template>
  <div id="vertical-navigation" class="flex col" :class="[verticalNavOpen ? 'vertical-navigation__opened' : 'vertical-navigation__closed', verticalNavOpen ? '' : 'small']">
    <div class="app-logo flex col">
      <a href="/interface/conversations"><img :src="logoPath" alt="Conversation Manager" class="app-logo--img" /></a>
    </div>
    <div class="toggle-nav">
      <button 
        class="toggle-nav--btn" 
        @click="toggleNav()"
        :class="verticalNavOpen ? 'open' : 'closed'"
      ></button>
    </div>
    
    <div class="app-nav">
      <div>
        <a href="/interface/conversations" class="app-nav-link">{{ $t('nav.conversations_overview')}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  data () {
    return {
      verticalNavOpen: true,
      reduced: false
    }
  },
  mounted () {
    bus.$on('vertical_nav_close', (data) => {
      this.verticalNavOpen = false
    })
  },
  computed: {
    logoPath () {
      if (this.verticalNavOpen) {
        return '/assets/img/conversation-manager-logo-white.svg'
      } else {
        return '/assets/img/conversation-manager-logo-small.svg'
      }
    }
  },
  methods: {
    toggleNav () {
      this.verticalNavOpen = !this.verticalNavOpen
    },
  }
}
</script>