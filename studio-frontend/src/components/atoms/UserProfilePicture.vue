<template>
  <div class="list-profil-picture-container" :data-info="userName">
    <img :src="userAvatar" class="list-profil-picture" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { userName } from "@/tools/userName.js"
import userAvatar from "@/tools/userAvatar"

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    userName() {
      return userName(this.user)
    },
    userAvatar() {
      return userAvatar(this.user)
    },
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
