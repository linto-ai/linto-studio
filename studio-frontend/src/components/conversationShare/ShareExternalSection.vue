<template>
  <section class="share-external">
    <ShareSectionHeader
      icon="user-plus"
      :title="$t('share_menu.external_members')"
      :count="members.length" />

    <GenericTable
      v-if="members.length > 0"
      :columns="columns"
      :content="members"
      sortListDirection=""
      sortListKey="">
      <template #cell-user="{ element }">
        <UserInfoInline :user="element" :user-id="element._id" />
      </template>
      <template #cell-right="{ element }">
        <Loading v-if="usersLoading[element._id]" />
        <RightSelect
          v-else
          :value="element.right"
          :withMultiple="element.right === -1"
          @input="
            $emit('update:userRight', { user: element, right: $event })
          " />
      </template>
      <template #cell-actions="{ element }">
        <Button
          icon="x"
          size="sm"
          variant="tertiary"
          :title="$t('share_menu.reset_to_default')"
          @click="$emit('remove', element)" />
      </template>
    </GenericTable>

    <NotificationBanner
      v-else
      variant="neutral"
      align="start"
      icon="paper-plane-tilt">
      {{ $t("share_menu.external_empty") }}
    </NotificationBanner>
  </section>
</template>

<script>
import GenericTable from "@/components/molecules/GenericTable.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import Loading from "@/components/atoms/Loading.vue"
import Button from "@/components/atoms/Button.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import ShareSectionHeader from "./ShareSectionHeader.vue"
import RightSelect from "./RightSelect.vue"

export default {
  name: "ShareExternalSection",
  components: {
    GenericTable,
    UserInfoInline,
    Loading,
    Button,
    NotificationBanner,
    ShareSectionHeader,
    RightSelect,
  },
  props: {
    members: { type: Array, required: true },
    usersLoading: { type: Object, default: () => ({}) },
  },
  computed: {
    columns() {
      return [
        { key: "user", label: this.$t("share_menu.column_user"), width: "1fr" },
        {
          key: "right",
          label: this.$t("share_menu.column_right"),
          width: "auto",
        },
        { key: "actions", label: "", width: "auto" },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.share-external {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  border-radius: 4px;
  padding: 0.75rem;
  border: 1px solid var(--neutral-20);
  box-shadow: var(--shadow-1);
  background-color: var(--background-primary);
}
</style>
