<template>
  <MainContentBackoffice :loading="loading">
    <div class="flex col gap-medium" style="width: 100%; height: 100%">
      <TranscriberProfileEditor
        ref="editor"
        :transcriberProfile="transcriberProfile"
        @input="updateProfile"
        @files-changed="onFilesChanged"
        class="flex1" />
      <div class="flex gap-medium transcriber-profile-detail__footer">
        <Button
          @click="deleteProfile"
          variant="secondary"
          intent="destructive"
          icon="trash"
          :label="$t('backoffice.transcriber_profile_detail.delete_button')" />

        <div class="flex1 small-padding-left"></div>

        <Button
          variant="secondary"
          @click="reset"
          :label="$t('backoffice.transcriber_profile_detail.reset_button')" />

        <Button
          variant="primary"
          icon="check"
          @click="save"
          :disabled="!hasChanged"
          :label="$t('backoffice.transcriber_profile_detail.save_button')" />
      </div>
    </div>
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import TranscriberProfileEditor from "@/components/TranscriberProfileEditor.vue"
import {
  apiAdminGetTranscriberProfilesById,
  apiAdminUpdateTranscriberProfile,
  apiAdminUpdateAmazonTranscriberProfile,
  apiAdminDeleteTranscriberProfile,
} from "@/api/admin.js"

export default {
  props: {},
  data() {
    return {
      loading: true,
      transcriberProfileOriginal: null,
      transcriberProfile: null,
      transcriberProfileId: this.$route.params.transcriberProfileId,
      amazonFiles: {
        certificate: null,
        privateKey: null,
      },
    }
  },
  mounted() {
    this.fetchTranscriberProfile()
  },
  methods: {
    updateProfile(value) {
      this.transcriberProfile = value
    },
    onFilesChanged(files) {
      this.amazonFiles = files
    },
    async fetchTranscriberProfile() {
      this.loading = true
      const req = await apiAdminGetTranscriberProfilesById(
        this.transcriberProfileId,
      )
      if (req.status === "success") {
        delete req.data.id
        this.transcriberProfile = req.data
        this.transcriberProfileOriginal = structuredClone(req.data)
      } else {
        this.$router.push({ name: "not_found" })
      }
      // fetch transcriber profile
      this.loading = false
    },
    async reset() {
      this.transcriberProfile = structuredClone(this.transcriberProfileOriginal)
      this.amazonFiles = { certificate: null, privateKey: null }
      await this.$nextTick()
      this.$refs.editor.reset()
    },
    async save() {
      this.loading = true
      let req

      if (this.transcriberProfile.config.type === "amazon") {
        req = await apiAdminUpdateAmazonTranscriberProfile(
          this.transcriberProfileId,
          this.transcriberProfile,
          this.amazonFiles,
        )
      } else {
        req = await apiAdminUpdateTranscriberProfile(
          this.transcriberProfileId,
          this.transcriberProfile,
        )
      }

      if (req.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$t(
            "backoffice.transcriber_profile_detail.notif_success",
          ),
        })
        this.transcriberProfile = req.data
        this.transcriberProfileOriginal = structuredClone(req.data)
        this.amazonFiles = { certificate: null, privateKey: null }
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("backoffice.transcriber_profile_detail.notif_error"),
        })
      }
      this.loading = false
    },
    async deleteProfile() {
      this.loading = true
      const req = await apiAdminDeleteTranscriberProfile(
        this.transcriberProfileId,
      )
      if (req.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$t(
            "backoffice.transcriber_profile_detail.notif_delete_success",
          ),
        })
        this.$router.push({ name: "backoffice-transcriberProfilesList" })
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t(
            "backoffice.transcriber_profile_detail.notif_delete_error",
          ),
        })
      }
      this.loading = false
    },
  },
  computed: {
    hasChanged() {
      return (
        JSON.stringify(this.transcriberProfile) !==
        JSON.stringify(this.transcriberProfileOriginal)
      )
    },
  },
  components: {
    MainContentBackoffice,
    TranscriberProfileEditor,
  },
}
</script>
