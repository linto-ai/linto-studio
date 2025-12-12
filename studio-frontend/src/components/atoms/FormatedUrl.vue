<template>
  <div>{{ simplifiedUrl }}</div>
</template>
<script>
import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"

export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    simplifiedUrl() {
      const BASE_API = new URL(getEnv("VUE_APP_CONVO_API"))

      const urlWithoutBase = this.url.replace(BASE_API.pathname, "") // Supprimer le domaine de l'URL
      const urlWithoutOrganizationId = urlWithoutBase.replace(
        /\/organizations\/[a-f0-9]{24}/,
        "",
      )
      return urlWithoutOrganizationId
    },
  },
  methods: {},
  components: {},
}
</script>
