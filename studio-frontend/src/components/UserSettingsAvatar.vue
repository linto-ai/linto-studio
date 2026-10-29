<template>
  <section class="user-settings-avatar">
    <div class="flex gap-medium">
      <UserAvatar :user="displayedUser" :size="100" />
      <!-- <button class="btn primary">
        <span class="label">{{ pictureUploadLabel }}</span>
      </button> -->
      <input
        type="file"
        class="hidden"
        id="file"
        ref="file"
        accept="image/png, image/jpeg, image/webp"
        v-on:change="handleFileUpload()" />
      <label for="file" class="btn btn--secondary btn--sm">
        <span class="label">{{
          $t("user_settings.profile_avatar.profile_image_button")
        }}</span>
      </label>
      <Button
        variant="primary"
        size="sm"
        :label="$t('user_settings.profile_avatar.update_picture_button')"
        @click="updateProfilPicture"
        :disabled="!picture.valid">
      </Button>
      <!-- <button
        class="btn primary"
        :disabled="!picture.valid"
        @click="updateProfilPicture">
        <span class="label">{{
          $t("user_settings.profile_avatar.update_picture_button")
        }}</span>
      </button> -->
    </div>
  </section>
</template>
<script>
import { bus } from "@/main.js"
import UserAvatar from "@/components/atoms/UserAvatar.vue"
import { mapActions } from "vuex"

export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      picture: {
        value: "",
        error: null,
        valid: false,
        preview: null,
      },
    }
  },
  mounted() {},
  methods: {
    ...mapActions("user", ["updateUserImage"]),
    handleFileUpload() {
      this.picture.value = this.$refs.file.files[0]
      const acceptedTypes = ["image/png", "image/jpeg", "image/webp"]
      if (
        typeof this.picture.value !== "undefined" &&
        this.picture.value !== null &&
        !!this.picture.value.type
      ) {
        const type = this.picture.value.type
        if (acceptedTypes.indexOf(type) >= 0) {
          this.picture.valid = true
          this.picture.error = null
          // add a preview of the image
          this.picture.preview = URL.createObjectURL(this.picture.value)
        } else {
          this.picture.valid = false
          this.picture.error = this.$t(
            "user_settings.profile_avatar.notif_unsupported_type",
          )
          bus.$emit("app_notif", {
            status: "error",
            message: this.picture.error,
          })
        }
      } else {
        this.picture.valid = false
        this.picture.error = "This field is required"
        this.picture.value = ""
      }
    },
    async updateProfilPicture() {
      try {
        if (this.picture.valid) {
          let file = this.picture.value
          let req = await this.updateUserImage(file)
          if (req.status === "success") {
            this.picture = {
              value: "",
              error: null,
              valid: false,
            }
            bus.$emit("app_notif", {
              status: "success",
              message: this.$t("user_settings.notif_success"),
            })
          } else {
            let message = this.$t("user_settings.notif_error")
            if (req.error?.response?.status === 415) {
              message = this.$t(
                "user_settings.profile_avatar.notif_unsupported_type",
              )
            }
            bus.$emit("app_notif", {
              status: "error",
              message,
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
  computed: {
    // The picked file (a blob: URL) shows in place of the saved picture
    // until it is uploaded.
    displayedUser() {
      if (!this.picture.preview) return this.userInfo
      return { ...this.userInfo, img: this.picture.preview }
    },
  },
  components: {
    UserAvatar,
  },
}
</script>
