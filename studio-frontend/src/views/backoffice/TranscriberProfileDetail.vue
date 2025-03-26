<template>
  <MainContentBackoffice :loading="loading">
    <div class="flex col gap-medium" style="width: 100%; height: 100%">
      <TranscriberProfileEditor
        v-bind:transcriberProfile.sync="transcriberProfile"
        class="flex1" />
      <div class="flex gap-medium transcriber-profile-detail__footer">
        <div class="flex1 small-padding-left"></div>
        <button class="btn secondary" :disabled="!hasChanged" @click="reset">
          <span class="label">{{ $t("backoffice.transcriber_profile_detail.reset_button")}}</span>
        </button>

        <button class="btn green" :disabled="!hasChanged" @click="save">
          <span class="icon apply"></span>
          <span class="label">{{ $t("backoffice.transcriber_profile_detail.save_button")}}</span>
        </button>
      </div>
    </div>
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import TranscriberProfileEditor from "@/components/TranscriberProfileEditor.vue"
import { apiGetTranscriberProfilesById, apiUpdateTranscriberProfile } from "@/api/session.js"

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
    },
    async save() {
      this.loading = true
      const req = await apiUpdateTranscriberProfile(this.transcriberProfileId, this.transcriberProfile)
      if(req.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$t("backoffice.transcriber_profile_detail.notif_success"),
        })
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("backoffice.transcriber_profile_detail.notif_error"),
        })
      }
      this.loading = false
    }
  },
  computed: {
    hasChanged() {
      return JSON.stringify(this.transcriberProfile, null, 2) !== JSON.stringify(this.transcriberProfileOriginal, null, 2)
    },
  },
  components: {
    MainContentBackoffice,
    TranscriberProfileEditor,
  },
}
</script>
