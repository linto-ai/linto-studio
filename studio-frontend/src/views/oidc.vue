<template>
  <Loading></Loading>
</template>
<script>
import Loading from "@/components/atoms/Loading.vue"
import { apiGetPersonalUserInfo } from "@/api/user.js"

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
      const token = this.$route?.query?.token
      if (token) {
        // The user info request needs the token: saved first, the user id after
        const auth = { userId: null, authToken: token, refreshToken: null }
        await this.$store.dispatch("auth/save", auth)
        const userReq = await apiGetPersonalUserInfo()
        if (userReq.status == "success") {
          await this.$store.dispatch("auth/save", {
            ...auth,
            userId: userReq.data._id,
          })
          this.redirect()
          return
        }
      } else {
        const res = await this.$store.dispatch("auth/loginWithOidc")
        if (res.status == "success") {
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
