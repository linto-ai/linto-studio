<template>
  <div>{{ simplifiedUrl }}</div>
</template>
<script>
import { API_ENDPOINTS } from "@/const/apiEndpoints.js"

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
        const BASE_API = new URL(API_ENDPOINTS.api)

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
