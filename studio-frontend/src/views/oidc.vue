<template>
  <Loading></Loading>
</template>
<script>
import Loading from "@/components/atoms/Loading.vue"
import { getOidcToken, apiGetPersonalUserInfo } from "@/api/user.js"
import { setCookie } from "@/tools/setCookie.js"

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
      if (this.$route?.query?.token) {
        setCookie("authToken", this.$route?.query?.token, 7)
        setCookie("cm_orga_scope", "")

        const userReq = await apiGetPersonalUserInfo()
        if (userReq.status == "success") {
          setCookie("userId", userReq.data._id, 7)
          this.redirect()
          return
        }
      } else {
        let res = await getOidcToken()

        if (res.status == "success") {
          setCookie("userId", res.data.user_id, 7)
          setCookie("authToken", res.data.auth_token, 7)
          setCookie("cm_orga_scope", "")
          this.redirect()
          return
        }
      }
      this.$router.replace({ name: "login", query: { error: "oidc" } })
    },
    async redirect() {
      if (this.$route?.query?.next) {
        window.location.href = this.$route?.query?.next
      } else {
        window.location.href = "/"
      }
    },
  },
  components: {
    Loading,
  },
}
</script>
