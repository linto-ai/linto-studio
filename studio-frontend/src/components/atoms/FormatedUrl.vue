<template>
  <div>{{ simplifiedUrl }}</div>
</template>
<script>
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
      let urlWithoutBase = ""
      try {
        const BASE_API = new URL(getEnv("VUE_APP_CONVO_API"))

        urlWithoutBase = this.url.replace(BASE_API.pathname, "") // Supprimer le domaine de l'URL
      } catch (error) {
        urlWithoutBase = this.url
      }

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
