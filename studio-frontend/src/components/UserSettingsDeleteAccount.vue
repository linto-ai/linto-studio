<template>
  <section>
    <h2>{{ $t("user_settings.delete_account.title") }}</h2>
    <p class="delete-account__hint">
      {{ $t("user_settings.delete_account.description") }}
    </p>
    <Button
      :label="$t('user_settings.delete_account.button')"
      icon="trash"
      variant="secondary"
      intent="destructive"
      size="sm"
      @click="isModalOpen = true" />
    <Modal
      v-model="isModalOpen"
      :title="$t('user_settings.delete_account.modal_title')"
      :withActionApply="false"
      withActionDelete
      :textActionDelete="$t('user_settings.delete_account.modal_action')"
      size="sm"
      @on-delete="deleteAccount">
      <p>{{ $t("user_settings.delete_account.modal_content") }}</p>
    </Modal>
  </section>
</template>
<script>
import Modal from "@/components/molecules/Modal.vue"

export default {
  name: "UserSettingsDeleteAccount",
  components: { Modal },
  data() {
    return { isModalOpen: false }
  },
  methods: {
    async deleteAccount() {
      const req = await this.$store.dispatch("user/deleteAccount")
      if (req.status === "success") {
        document.location.reload()
        return
      }
      this.$store.dispatch("system/addNotification", {
        message: this.$t("user_settings.delete_account.notif_error"),
        type: "error",
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.delete-account__hint {
  margin: 0 0 0.5rem;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
