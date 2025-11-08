<template>
  <div class="flex col user-list">
    <h3 class="user-list__title">{{ title }}</h3>
    <div class="flex col gap-small">
      <UserInfoInline
        v-for="user in usersList"
        :key="user._id"
        :user="user"
        :user-id="user._id">
        <slot v-bind:user="user"></slot>
      </UserInfoInline>
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
export default {
  props: {
    usersList: { type: Array, required: true },
    title: { type: String, required: true },
    expanded: { type: Boolean, required: false, default: false },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { UserInfoInline },
}
</script>
