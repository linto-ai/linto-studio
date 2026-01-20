<template>
  <ModalNew
    value
    size="xl"
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="createTranscriberProfile"
    :actionBtnLabel="$t('modal_create_transcriber_profile.action_btn')"
    :title="$t('modal_create_transcriber_profile.title')">
    <template #header-actions>
      <Tooltip
        :text="$t('modal_create_transcriber_profile.organization_tooltip')">
        <div class="header-selector">
          <ph-icon name="buildings" size="sm" />
          <PopoverList
            :items="organizationItems"
            v-model="selectedOrganizationId"
            size="sm" />
        </div>
      </Tooltip>
      <Tooltip :text="$t('modal_create_transcriber_profile.type_tooltip')">
        <div class="header-selector">
          <ph-icon name="microphone" size="sm" />
          <PopoverList :items="typeItems" v-model="currentType" size="sm" />
        </div>
      </Tooltip>
    </template>
    <div class="transcriber-modal-content flex col">
      <TranscriberProfileEditor
        ref="editor"
        @input="updateTranscriberProfile"
        @files-changed="onFilesChanged"
        :organizationId="selectedOrganizationId"
        :transcriberProfile="transcriberProfile" />
    </div>
  </ModalNew>
</template>
<script>
import ModalNew from "@/components/molecules/Modal.vue"
import TranscriberProfileEditor from "@/components/TranscriberProfileEditor.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import Tooltip from "@/components/atoms/Tooltip.vue"
import TRANSCRIBER_PROFILES_TEMPLATES from "@/const/transcriberProfilesTemplates"
import {
  apiAdminCreateTranscriberProfile,
  apiAdminCreateAmazonTranscriberProfile,
  apiGetAllOrganizations,
} from "@/api/admin.js"
import { bus } from "@/main.js"

export default {
  props: {
    organizationId: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      state: "idle",
      organizations: [],
      selectedOrganizationId: this.organizationId,
      typeItems: [
        { value: "linto", text: "LinTO" },
        { value: "microsoft", text: "Microsoft" },
        { value: "amazon", text: "Amazon" },
      ],
      transcriberProfile: structuredClone(TRANSCRIBER_PROFILES_TEMPLATES.linto),
      amazonFiles: {
        certificate: null,
        privateKey: null,
      },
    }
  },
  computed: {
    organizationItems() {
      const items = [
        {
          value: null,
          text: this.$t("modal_create_transcriber_profile.platform_global"),
        },
      ]
      this.organizations.forEach((org) => {
        items.push({ value: org._id, text: org.name })
      })
      return items
    },
    currentType: {
      get() {
        return this.transcriberProfile.config.type
      },
      set(value) {
        this.transcriberProfile = structuredClone(
          TRANSCRIBER_PROFILES_TEMPLATES[value],
        )
        this.amazonFiles = { certificate: null, privateKey: null }
        this.$nextTick(() => {
          this.$refs.editor.reset()
        })
      },
    },
  },
  async mounted() {
    await this.fetchOrganizations()
  },
  methods: {
    async fetchOrganizations() {
      const res = await apiGetAllOrganizations(0, {
        pageSize: 1000,
        hidePersonal: true,
      })
      this.organizations = res.list || []
    },
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
            organizationId: this.selectedOrganizationId,
          },
          this.amazonFiles,
        )
      } else {
        res = await apiAdminCreateTranscriberProfile({
          ...this.transcriberProfile,
          organizationId: this.selectedOrganizationId,
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
  components: { ModalNew, TranscriberProfileEditor, PopoverList, Tooltip },
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
