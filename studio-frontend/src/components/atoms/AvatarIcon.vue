<template>
  <PhIcon :name="name" size="auto" weight="bold" />
</template>

<script>
import PhIcon from "./PhIcon.vue"

export default {
  name: "AvatarIcon",
  components: { PhIcon },
  props: {
    name: { type: String, required: true },
  },
}
</script>
