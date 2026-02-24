<template>
  <Modal
    value
    size="xl"
    :loading="loading"
    :overlayClose="false"
    @on-cancel="$emit('on-cancel')"
    @on-confirm="save"
    :actionBtnLabel="actionBtnLabel"
    :title="modalTitle">
    <template #header-actions>
      <div class="flex gap-medium">
        <Tooltip :text="$t('modal_transcriber_profile.type_tooltip')">
          <div class="header-selector">
            <!-- <ph-icon name="microphone" size="sm" /> -->
            <PopoverList
              :items="typeItems"
              v-model="currentType"
              :disabled="isEditMode"
              size="sm" />
          </div>
        </Tooltip>
        <Tooltip :text="$t('modal_transcriber_profile.organization_tooltip')">
          <div class="header-selector">
            <!-- <ph-icon name="buildings" size="sm" /> -->
            <PopoverList
              :items="organizationItems"
              v-model="selectedOrganizationId"
              :disabled="isEditMode"
              size="sm" />
          </div>
        </Tooltip>
        <Tooltip v-if="enableSecurityLevel" :text="$t('modal_transcriber_profile.security_level_tooltip')">
          <div class="header-selector">
            <!-- <ph-icon :name="securityLevelIcon" size="sm" /> -->
            <PopoverList
              :items="securityLevelItems"
              v-model="currentSecurityLevel"
              size="sm" />
          </div>
        </Tooltip>
      </div>
    </template>
    <template #footer-left v-if="isEditMode">
      <Button
        @click="deleteProfile"
        variant="secondary"
        intent="destructive"
        icon="trash"
        :label="$t('modal_transcriber_profile.delete_button')" />
    </template>
    <div class="transcriber-modal-content flex col">
      <TranscriberProfileEditor
        v-if="!loading"
        ref="editor"
        @input="updateTranscriberProfile"
        @files-changed="onFilesChanged"
        :organizationId="selectedOrganizationId"
        :transcriberProfile="transcriberProfile" />
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import TranscriberProfileEditor from "@/components/TranscriberProfileEditor.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import Tooltip from "@/components/atoms/Tooltip.vue"
import Button from "@/components/atoms/Button.vue"
import TRANSCRIBER_PROFILES_TEMPLATES from "@/const/transcriberProfilesTemplates"
import SECURITY_LEVELS_LIST from "@/const/securityLevelsList"
import {
  DEFAULT_SECURITY_LEVEL,
  SECURITY_LEVEL_ICONS,
} from "@/const/securityLevels"
import {
  apiAdminCreateTranscriberProfile,
  apiAdminCreateAmazonTranscriberProfile,
  apiAdminUpdateTranscriberProfile,
  apiAdminUpdateAmazonTranscriberProfile,
  apiAdminDeleteTranscriberProfile,
  apiAdminGetTranscriberProfilesById,
  apiGetAllOrganizations,
} from "@/api/admin.js"
import { bus } from "@/main.js"
import transriberImageFromtype from "@/tools/transriberImageFromtype"
import { getEnv } from "@/tools/getEnv"

export default {
  props: {
    organizationId: {
      type: String,
      required: false,
      default: null,
    },
    transcriberProfileId: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      organizations: [],
      selectedOrganizationId: this.organizationId,
      typeItems: [
        {
          value: "linto",
          text: "LinTO",
          avatar: transriberImageFromtype("linto"),
        },
        {
          value: "microsoft",
          text: "Microsoft",
          avatar: transriberImageFromtype("microsoft"),
        },
        {
          value: "amazon",
          text: "Amazon",
          avatar: transriberImageFromtype("amazon"),
        },
        {
          value: "voxstral",
          text: "Voxstral",
          avatar: transriberImageFromtype("voxstral"),
        },
      ],
      transcriberProfile: structuredClone(TRANSCRIBER_PROFILES_TEMPLATES.linto),
      transcriberProfileOriginal: null,
      amazonFiles: {
        certificate: null,
        privateKey: null,
      },
    }
  },
  computed: {
    enableSecurityLevel() {
      return getEnv("VUE_APP_ENABLE_SECURITY_LEVEL") === "true"
    },
    isEditMode() {
      return !!this.transcriberProfileId
    },
    modalTitle() {
      return this.isEditMode
        ? this.$t("modal_transcriber_profile.title_edit")
        : this.$t("modal_transcriber_profile.title_create")
    },
    actionBtnLabel() {
      return this.isEditMode
        ? this.$t("modal_transcriber_profile.action_btn_edit")
        : this.$t("modal_transcriber_profile.action_btn_create")
    },
    organizationItems() {
      const items = [
        {
          value: null,
          text: this.$t("modal_transcriber_profile.platform_global"),
          icon: "globe-hemisphere-west",
          //iconWeight: "regular",
        },
      ]
      this.organizations.forEach((org) => {
        items.push({
          value: org._id,
          text: org.name,
          icon: "buildings",
          iconWeight: "regular",
        })
      })
      return items
    },
    currentType: {
      get() {
        return this.transcriberProfile.config.type
      },
      set(value) {
        if (this.isEditMode) return
        this.transcriberProfile = structuredClone(
          TRANSCRIBER_PROFILES_TEMPLATES[value],
        )
        this.amazonFiles = { certificate: null, privateKey: null }
        this.$nextTick(() => {
          this.$refs.editor?.reset()
        })
      },
    },
    securityLevelItems() {
      return SECURITY_LEVELS_LIST((key) => this.$t(key)).map((level) => ({
        value: level.value,
        text: level.txt,
        icon: SECURITY_LEVEL_ICONS[level.value],
        iconWeight: "regular",
      }))
    },
    currentSecurityLevel: {
      get() {
        return (
          this.transcriberProfile.meta?.securityLevel ?? DEFAULT_SECURITY_LEVEL
        )
      },
      set(value) {
        if (!this.transcriberProfile.meta) {
          this.transcriberProfile.meta = {}
        }
        this.transcriberProfile.meta.securityLevel = value
      },
    },
    securityLevelIcon() {
      return (
        SECURITY_LEVEL_ICONS[this.currentSecurityLevel] ??
        SECURITY_LEVEL_ICONS[DEFAULT_SECURITY_LEVEL]
      )
    },
  },
  async mounted() {
    this.loading = true
    await this.fetchOrganizations()
    if (this.isEditMode) {
      await this.fetchTranscriberProfile()
    }
    this.loading = false
  },
  methods: {
    async fetchOrganizations() {
      const res = await apiGetAllOrganizations(0, {
        pageSize: 1000,
        hidePersonal: true,
      })
      this.organizations = res.list || []
    },
    async fetchTranscriberProfile() {
      const req = await apiAdminGetTranscriberProfilesById(
        this.transcriberProfileId,
      )
      if (req.status === "success") {
        delete req.data.id
        this.transcriberProfile = req.data
        this.transcriberProfileOriginal = structuredClone(req.data)
        this.selectedOrganizationId = req.data.organizationId || null
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("modal_transcriber_profile.notif_fetch_error"),
        })
        this.$emit("on-cancel")
      }
    },
    updateTranscriberProfile(value) {
      this.transcriberProfile = structuredClone(value)
    },
    onFilesChanged(files) {
      this.amazonFiles = files
    },
    async save() {
      this.loading = true
      let res

      const payload = {
        ...this.transcriberProfile,
        organizationId: this.selectedOrganizationId,
      }

      if (this.isEditMode) {
        res = await this.updateProfile(payload)
      } else {
        res = await this.createProfile(payload)
      }

      if (res.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.isEditMode
            ? this.$t("modal_transcriber_profile.notif_update_success")
            : this.$t("modal_transcriber_profile.notif_create_success"),
        })
        this.$emit("on-confirm", res)
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("modal_transcriber_profile.notif_error"),
        })
      }
      this.loading = false
    },
    async createProfile(payload) {
      if (payload.config.type === "amazon") {
        return await apiAdminCreateAmazonTranscriberProfile(
          payload,
          this.amazonFiles,
        )
      }
      return await apiAdminCreateTranscriberProfile(payload)
    },
    async updateProfile(payload) {
      if (payload.config.type === "amazon") {
        return await apiAdminUpdateAmazonTranscriberProfile(
          this.transcriberProfileId,
          payload,
          this.amazonFiles,
        )
      }
      return await apiAdminUpdateTranscriberProfile(
        this.transcriberProfileId,
        payload,
      )
    },
    async deleteProfile() {
      if (!confirm(this.$t("modal_transcriber_profile.confirm_delete"))) {
        return
      }
      this.loading = true
      const req = await apiAdminDeleteTranscriberProfile(
        this.transcriberProfileId,
      )
      if (req.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$t("modal_transcriber_profile.notif_delete_success"),
        })
        this.$emit("on-delete")
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("modal_transcriber_profile.notif_delete_error"),
        })
      }
      this.loading = false
    },
  },
  components: {
    Modal,
    TranscriberProfileEditor,
    PopoverList,
    Tooltip,
    Button,
  },
}
</script>

<style scoped>
.transcriber-modal-content {
  min-height: 60vh;
}

.header-selector {
  display: flex;
  align-items: center;
  gap: var(--tiny-gap);
}
</style>
