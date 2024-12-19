<template>
  <Loading></Loading>
</template>
<script>
import Loading from "@/components/Loading.vue"
import { getOidcToken } from "@/api/user.js"

export default {
  props: {},
  data() {
    return {}
  },
  mounted() {
    this.fetchToken()
  },
  methods: {
    async fetchToken() {
      let res = await getOidcToken()
      console.log(res)
      if (res.status == "error") {
        this.$router.replace({ name: "login", query: { error: "oidc" } })
      }

      if (res.status == "success") {
        this.setCookie("userId", res.data.user_id, 7)
        this.setCookie("authToken", res.data.auth_token, 7)
        this.setCookie("cm_orga_scope", "")

        if (this.$route?.query?.next) {
          window.location.href = this.$route?.query?.next
        } else {
          window.location.href = "/"
        }
      }
    },
  },
  components: {
    Loading,
  },
}
</script>
