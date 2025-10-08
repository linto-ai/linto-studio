<template>
  <!-- <ActionBar> -->
  <div class="flex flex1">
   
      
      <SessionStatus
        v-if="sessionLoaded"
        :session="session"
        :small="isMobile"
        showName
        withText
        class="flex1" />
      <slot></slot>

     
   
    </div>
  </div>
  <!-- </ActionBar> -->
</template>
<script>
import { bus } from "@/main.js"
import isAuthenticated from "@/tools/isAuthenticated.js"

import SessionStatus from "@/components/SessionStatus.vue"
import ActionBar from "@/layouts/ActionBar.vue"
import { mapActions, mapGetters } from "vuex"

export default {
  props: {
    sessionListRoute: {
      type: [String, Object],
      required: true,
    },
    sessionLoaded: {
      type: Boolean,
      required: true,
    },
    session: {
      type: Object,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    isAuthenticated() {
      return isAuthenticated()
    },
    ...mapGetters("system", ["isMobile"]),
  },
  components: {
    SessionStatus,
    ActionBar,
  },
}
</script>
