<template>
  <ModalNew
    value
    size="xl"
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="createTranscriberProfile"
    :actionBtnLabel="$t('modal_create_transcriber_profile.action_btn')"
    :title="$t('modal_create_transcriber_profile.title')">
    <div class="transcriber-modal-content">
      <TranscriberProfileEditor
        ref="editor"
        @input="updateTranscriberProfile"
        @files-changed="onFilesChanged"
        :organizationId="organizationId"
        :transcriberProfile="transcriberProfile" />
    </div>
  </ModalNew>
</template>
<script>
import ModalNew from "@/components/molecules/Modal.vue"
import TranscriberProfileEditor from "@/components/TranscriberProfileEditor.vue"
import TRANSCRIBER_PROFILES_TEMPLATES from "@/const/transcriberProfilesTemplates"
import {
  apiAdminCreateTranscriberProfile,
  apiAdminCreateAmazonTranscriberProfile,
} from "@/api/admin.js"
import { bus } from "@/main.js"

export default {
  props: {
    organizationId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      state: "idle",
      transcriberProfile: TRANSCRIBER_PROFILES_TEMPLATES.linto,
      amazonFiles: {
        certificate: null,
        privateKey: null,
      },
    }
  },
  mounted() {},
  methods: {
    updateTranscriberProfile(value) {
      this.transcriberProfile = structuredClone(value)
    },
    onFilesChanged(files) {
      this.amazonFiles = files
    },
    async createTranscriberProfile(event) {
      this.state = "loading"
      let res

      if (this.transcriberProfile.config.type === "amazon") {
        res = await apiAdminCreateAmazonTranscriberProfile(
          {
            ...this.transcriberProfile,
            organizationId: this.organizationId,
          },
          this.amazonFiles,
        )
      } else {
        res = await apiAdminCreateTranscriberProfile({
          ...this.transcriberProfile,
          organizationId: this.organizationId,
        })
      }

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
<style scoped>
.transcriber-modal-content {
  min-height: 60vh;
}
</style>
