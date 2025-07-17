<template>
  <section>
    <h2>{{ $t("organisation.danger_zone") }}</h2>
    <Alert
      variant="error"
      icon="trash"
      size="xs"
      :title="$t('organisation.delete_modal.title')"
      :message="
        $t('organisation.delete_modal.content', {
          name: currentOrganization.name,
        })
      "
      @confirm="deleteOrganization">
      <Button
        variant="outline"
        color="tertiary"
        icon="trash"
        size="sm"
        :label="$t('organisation.delete_organization')" />
    </Alert>
  </section>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    async deleteOrganization() {
      let res = await this.$store.dispatch(
        "organizations/deleteOrganization",
        this.currentOrganization._id,
      )
      if (res.status === "success") {
        this.$store.dispatch("system/addNotification", {
          message: this.$i18n.t("organisation.delete_success_message"),
          type: "success",
        })
        document.location.href = "/interface/explore"
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$i18n.t("organisation.delete_error_message"),
          type: "error",
        })
      }
    },
  },
  components: {},
}
</script>
