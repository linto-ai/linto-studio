<template>
  <MainContentBackoffice :loading="loading">
    <div class="flex col gap-medium" style="width: 100%; height: 100%">
      <TranscriberProfileEditor
        ref="editor"
        v-bind:transcriberProfile.sync="transcriberProfile"
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
  apiGetTranscriberProfilesById,
  apiUpdateTranscriberProfile,
  apiDeleteTranscriberProfile,
} from "@/api/session.js"

export default {
  props: {},
  data() {
    return {
      loading: true,
      transcriberProfileOriginal: null,
      transcriberProfile: null,
      transcriberProfileId: this.$route.params.transcriberProfileId,
    }
  },
  mounted() {
    this.fetchTranscriberProfile()
  },
  methods: {
    async fetchTranscriberProfile() {
      this.loading = true
      const req = await apiGetTranscriberProfilesById(this.transcriberProfileId)
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
    reset() {
      this.transcriberProfile = structuredClone(this.transcriberProfileOriginal)
      this.$refs.editor.reset()
    },
    async save() {
      this.loading = true
      const req = await apiUpdateTranscriberProfile(
        this.transcriberProfileId,
        this.transcriberProfile,
      )
      if (req.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$t(
            "backoffice.transcriber_profile_detail.notif_success",
          ),
        })
        this.transcriberProfile = req.data
        this.transcriberProfileOriginal = structuredClone(req.data)
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
      const req = await apiDeleteTranscriberProfile(this.transcriberProfileId)
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
