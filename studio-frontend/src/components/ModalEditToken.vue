<template>
  <Modal
    isForm
    :title="$t('api_tokens_settings.modal_edit.title')"
    v-model="isOpen"
    @submit="submit">
    <FormInput :field="name" v-model="name.value" />

    <FormInput :field="avatar">
      <template #custom-input="slotProps">
        <div class="avatar-upload">
          <input
            type="file"
            class="hidden"
            ref="avatarFile"
            :id="slotProps.id"
            :accept="acceptedAvatarTypes"
            @change="handleAvatarSelect" />
          <div class="avatar-upload__row">
            <Avatar
              size="lg"
              color="#dadada"
              :src="avatarPreview"
              :text="avatarPreview ? '' : '?'" />
            <div class="avatar-upload__actions">
              <label :for="slotProps.id" class="btn btn--secondary btn--sm">
                <span class="label">{{ avatarUploadLabel }}</span>
              </label>
              <Button
                v-if="avatarPreview"
                type="button"
                variant="secondary"
                intent="destructive"
                size="sm"
                icon="x"
                :label="$t('api_tokens_settings.modal_create.avatar_remove')"
                @click="removeAvatar" />
            </div>
          </div>
        </div>
      </template>
    </FormInput>
  </Modal>
</template>
<script>
import Modal from "@/components/molecules/Modal.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import {
  apiUpdateToken,
  apiUpdateTokenPicture,
  apiDeleteTokenPicture,
} from "@/api/token.js"
import Avatar from "@/components/atoms/Avatar.vue"
import Button from "@/components/atoms/Button.vue"
import userAvatar from "@/tools/userAvatar"

const ACCEPTED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
]
const MAX_AVATAR_SIZE = 5 * 1024 * 1024 // 5 MB

export default {
  props: {
    value: { type: Boolean, required: true },
    organizationId: {
      type: String,
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.token_name_label"),
        value: "",
      },
      avatar: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.modal_create.avatar_label"),
        value: null,
      },
      avatarPreview: null,
      avatarRemoved: false,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(open) {
        if (open) this.initFromToken()
      },
    },
  },
  methods: {
    initFromToken() {
      this.name.value = this.token?.firstname ?? ""
      this.name.error = null
      this.avatar.value = null
      this.avatar.error = null
      this.avatarRemoved = false
      this.clearPreviewObjectUrl()
      this.avatarPreview = this.originalAvatarSrc
    },
    clearPreviewObjectUrl() {
      if (this.avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(this.avatarPreview)
      }
    },
    setAvatarError(messageKey) {
      this.avatar.value = null
      this.avatar.error = this.$t(messageKey)
      this.clearPreviewObjectUrl()
      this.avatarPreview = this.originalAvatarSrc
      if (this.$refs.avatarFile) this.$refs.avatarFile.value = ""
    },
    handleAvatarSelect() {
      const file = this.$refs.avatarFile?.files?.[0] ?? null
      if (!file) return
      if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
        this.setAvatarError(
          "api_tokens_settings.modal_create.avatar_invalid_type",
        )
        return
      }
      if (file.size > MAX_AVATAR_SIZE) {
        this.setAvatarError("api_tokens_settings.modal_create.avatar_too_large")
        return
      }
      this.clearPreviewObjectUrl()
      this.avatar.value = file
      this.avatar.error = null
      this.avatarRemoved = false
      this.avatarPreview = URL.createObjectURL(file)
    },
    removeAvatar() {
      this.clearPreviewObjectUrl()
      this.avatar.value = null
      this.avatar.error = null
      this.avatarRemoved = true
      this.avatarPreview = null
      if (this.$refs.avatarFile) this.$refs.avatarFile.value = ""
    },
    async submit() {
      const name = (this.name.value ?? "").trim()
      if (!name) {
        this.name.error = this.$t(
          "api_tokens_settings.modal_edit.name_required",
        )
        return
      }

      const tokenId = this.token.userId
      try {
        if (name !== this.token.firstname) {
          const res = await apiUpdateToken(this.organizationId, tokenId, {
            name,
          })
          if (res.status !== "success") throw new Error(res.message)
        }

        if (this.avatar.value) {
          await apiUpdateTokenPicture(
            this.organizationId,
            tokenId,
            this.avatar.value,
          )
        } else if (this.avatarRemoved && this.token.img) {
          const res = await apiDeleteTokenPicture(this.organizationId, tokenId)
          if (res.status !== "success") throw new Error(res.message)
        }

        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.modal_edit.update_success"),
          type: "success",
          timeout: 5000,
        })
        this.$emit("handleTokenUpdated")
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.modal_edit.update_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
  },
  computed: {
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    originalAvatarSrc() {
      return this.token?.img ? userAvatar(this.token) : null
    },
    avatarUploadLabel() {
      return this.avatarPreview
        ? this.$t("api_tokens_settings.modal_create.avatar_change")
        : this.$t("api_tokens_settings.modal_create.avatar_choose")
    },
    acceptedAvatarTypes() {
      return ACCEPTED_AVATAR_TYPES.join(",")
    },
  },
  beforeDestroy() {
    this.clearPreviewObjectUrl()
  },
  components: {
    Modal,
    FormInput,
    Avatar,
    Button,
  },
}
</script>

<style scoped lang="scss">
.hidden {
  display: none;
}
.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  &__row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
}
</style>
