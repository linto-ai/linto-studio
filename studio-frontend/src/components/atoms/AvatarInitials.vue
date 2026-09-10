<template>
  <span class="avatar-text">{{ text }}</span>
</template>

<script>
export default {
  name: "AvatarInitials",
  props: {
    text: { type: String, required: true },
  },
}
</script>

<style scoped>
.avatar-text {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
