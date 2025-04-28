<template>
  <div>toto</div>
</template>
<script>
import { bus } from "@/main.js"
import { mapActions } from "vuex"
export default {
  props: {},
  data() {
    return {}
  },
  mounted() {
    this.fetchUser()
  },
  methods: {
    ...mapActions("user", ["fetchUser"]),
  },
  components: {},
}
</script>
