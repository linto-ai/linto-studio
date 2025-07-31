<template>
  <div
    class="user-profile-picture-container"
    :data-info="hover ? userName : false">
    <img v-if="userAvatar" :src="userAvatar" class="user-profile-picture" />
    <ph-icon v-else name="user" class="user-profile-picture" size="xs" />
  </div>
</template>
<script>
import { userName } from "@/tools/userName.js"
import userAvatar from "@/tools/userAvatar"

export default {
  name: "UserProfilePicture",
  props: {
    user: {
      type: Object,
      required: true,
    },
    hover: {
      type: Boolean,
      default: true,
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

<style lang="scss">
.user-profile-picture-container {
  position: relative;
  padding: 0;
  margin: 0;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  overflow: hidden;
}

.user-profile-picture {
  display: inline-block;
  position: relative;
  background-color: #dadada;
  width: 100%;
  background-size: cover;
  background-position: center;
}
</style>