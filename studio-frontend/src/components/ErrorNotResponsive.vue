<template>
  <div class="error-not-responsive">
    <h1>{{ $t("error.not_responsive.title", { app_name: title }) }}</h1>
    <p>
      {{ $t("error.not_responsive.description", { app_name: title }) }}
    </p>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"

export default {
  props: {},
  data() {
    return {}
  },
  computed: {
    title() {
      return getEnv("VUE_APP_NAME")
    },
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>

<style scoped>
.error-not-responsive {
  text-align: center;
  padding: 1rem;
}
</style>
