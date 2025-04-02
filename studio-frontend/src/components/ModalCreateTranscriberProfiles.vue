<template>
  <ModalNew
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="createTranscriberProfile"
    :actionBtnLabel="$t('modal_create_transcriber_profile.action_btn')"
    :title="$t('modal_create_transcriber_profile.title')">
    <div style="height: 100vh" class="flex col">
      <TranscriberProfileEditor
        class="flex1"
        v-bind:transcriberProfile.sync="transcriberProfile" />
    </div>
  </ModalNew>
</template>
<script>
import ModalNew from "./ModalNew.vue"
import TranscriberProfileEditor from "@/components/TranscriberProfileEditor.vue"
import TRANSCRIBER_PROFILES_TEMPLATES from "@/const/transcriberProfilesTemplates"
import { apiCreateTranscriberProfile } from "@/api/session.js"
import { bus } from "@/main.js"

export default {
  props: {},
  data() {
    return {
      state: "idle",
      transcriberProfile: TRANSCRIBER_PROFILES_TEMPLATES.linto,
    }
  },
  mounted() {},
  methods: {
    async createTranscriberProfile(event) {
      this.state = "loading"
      const res = await apiCreateTranscriberProfile(this.transcriberProfile)
      if (res.status === "success") {
        this.$emit("on-confirm", res)
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("modal_create_transcriber_profile.notif_error"),
        })
      }
    },
  },
  components: { ModalNew, TranscriberProfileEditor },
}
</script>
