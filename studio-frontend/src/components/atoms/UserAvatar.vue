<template>
  <Avatar
    :src="source"
    :text="initials"
    :size="size"
    :tag="tag"
    tone="neutral"
    circle
    class="user-avatar" />
</template>
<script>
import userAvatar from "@/tools/user/userAvatar"
import { userName } from "@/tools/user/userName"
import { computeUserInitials } from "@/tools/user/computeUserInitials"
import Avatar from "@/components/atoms/Avatar.vue"

// A user's picture: the neutral tone keeps transparent images on a gray
// background instead of the primary color.
export default {
  name: "UserAvatar",
  components: { Avatar },
  props: {
    user: { type: Object, required: true },
    // Same scale as Avatar: xs/sm/md/lg/xl, or a raw number (px).
    size: { type: [Number, String], default: "sm" },
    tag: { type: String, default: "div" },
  },
  computed: {
    source() {
      return userAvatar(this.user)
    },
    initials() {
      return computeUserInitials(userName(this.user))
    },
  },
}
</script>

<style lang="scss" scoped>
.user-avatar {
  // border-box keeps the border inside the frame size set by Avatar
  box-sizing: border-box;
  border: 1px solid var(--neutral-50);
}
</style>
