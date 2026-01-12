<template>
  <div
    class="user-profile-picture-container"
    :data-info="hover ? userName : false">
    <img v-if="userAvatar" :src="userAvatar" class="user-profile-picture" />
    <span v-else-if="userInitials" class="user-profile-picture user-profile-picture--initials">{{ userInitials }}</span>
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
    userInitials() {
      const name = this.userName
      if (!name) return ""
      const parts = name.trim().split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
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

  &--initials {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 10px;
    font-weight: 600;
    color: var(--text-secondary, #666);
    background-color: var(--primary-soft, #e3f2fd);
    text-transform: uppercase;
  }
}
</style>