<template>
  <Modal
    isForm
    :title="$t('api_tokens_settings.modal_create.title')"
    v-model="isOpen"
    @submit="createToken">
    <FormInput :field="name" v-model="name.value" />
    <FormInput :field="role">
      <template #custom-input="slotProps">
        <OrgaRoleSelector v-model="role.value" :id="slotProps.id" />
      </template>
    </FormInput>
    <DurationInput :field="expiration" v-model="expiration.value" />

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
              <label
                :for="slotProps.id"
                class="btn btn--secondary btn--sm">
                <span class="label">{{ avatarUploadLabel }}</span>
              </label>
              <Button
                v-if="avatar.value"
                type="button"
                variant="tertiary"
                size="sm"
                icon="x"
                :label="$t('api_tokens_settings.modal_create.avatar_remove')"
                @click="resetAvatar" />
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
import OrgaRoleSelector from "./molecules/OrgaRoleSelector.vue"
import { apiCreateToken, apiUpdateTokenPicture } from "@/api/token.js"
import DurationInput from "@/components/molecules/DurationInput.vue"
import Avatar from "@/components/atoms/Avatar.vue"
import Button from "@/components/atoms/Button.vue"

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
  },
  data() {
    return {
      name: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.token_name_label"),
      },
      role: {
        ...EMPTY_FIELD,
        value: 1,
        label: this.$t("api_tokens_settings.token_role_label"),
      },
      expiration: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.modal_create.expiration_label"),
        value: "30d",
        customParams: {
          min: 1,
        },
      },
      avatar: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.modal_create.avatar_label"),
        value: null,
      },
      avatarPreview: null,
    }
  },
  methods: {
    clearAvatarPreview() {
      if (this.avatarPreview) URL.revokeObjectURL(this.avatarPreview)
      this.avatarPreview = null
    },
    setAvatarError(messageKey) {
      this.avatar.value = null
      this.avatar.error = this.$t(messageKey)
      this.clearAvatarPreview()
    },
    resetAvatar() {
      this.avatar.value = null
      this.avatar.error = null
      this.clearAvatarPreview()
      if (this.$refs.avatarFile) this.$refs.avatarFile.value = ""
    },
    handleAvatarSelect() {
      const file = this.$refs.avatarFile?.files?.[0] ?? null
      if (!file) {
        this.resetAvatar()
        return
      }
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
      this.clearAvatarPreview()
      this.avatar.value = file
      this.avatar.error = null
      this.avatarPreview = URL.createObjectURL(file)
    },
    async createToken() {
      const expiration = this.expiration.value
      const req = await apiCreateToken(this.organizationId, {
        name: this.name.value,
        role: this.role.value,
        expiration,
      })

      if (req.status == "success") {
        // Upload the avatar (best effort): the token has been created
        // successfully even if this step fails, so we don't surface the
        // error as a token-creation failure.
        if (this.avatar.value && req.data?.user_id) {
          try {
            await apiUpdateTokenPicture(
              this.organizationId,
              req.data.user_id,
              this.avatar.value,
            )
          } catch (err) {
            this.$store.dispatch("system/addNotification", {
              message: this.$t(
                "api_tokens_settings.modal_create.avatar_upload_failed",
              ),
              type: "error",
              timeout: 5000,
            })
          }
        }

        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.token_created"),
          type: "success",
          timeout: 5000,
        })
        this.resetAvatar()
        this.$emit("handleTokenCreated", req.data)
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.token_created_error"),
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
    avatarUploadLabel() {
      return this.avatar.value
        ? this.$t("api_tokens_settings.modal_create.avatar_change")
        : this.$t("api_tokens_settings.modal_create.avatar_choose")
    },
    acceptedAvatarTypes() {
      return ACCEPTED_AVATAR_TYPES.join(",")
    },
  },
  components: {
    Modal,
    FormInput,
    OrgaRoleSelector,
    DurationInput,
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
