<template>
  <section class="share-org">
    <header class="share-org__header">
      <ShareSectionHeader
        icon="users-three"
        :title="$t('share_menu.organization_members')"
        :count="members.length" />

      <div class="share-org__default">
        <div class="share-org__default-text">
          <span class="share-org__subtitle">
            {{ $t("share_menu.default_right_label") }}
          </span>
          <span class="share-org__hint">
            {{ $t("share_menu.applied_to_every_member") }}
          </span>
        </div>
        <RightSelect
          :value="defaultRight"
          :withMultiple="defaultRight === MULTIPLE_VALUE"
          @input="$emit('update:defaultRight', $event)" />
      </div>
    </header>

    <div class="share-org__exceptions">
      <h5 class="share-org__subtitle">
        {{ $t("share_menu.exceptions_label") }}
        <CountBadge>{{ exceptions.length }}</CountBadge>
      </h5>

      <GenericTable
        v-if="exceptions.length > 0"
        :columns="columns"
        :content="exceptions"
        sortListDirection=""
        sortListKey="">
        <template #cell-user="{ element }">
          <UserInfoInline
            :user="element"
            :user-id="element._id"
            :role="element.role" />
        </template>
        <template #cell-right="{ element }">
          <Loading v-if="usersLoading[element._id]" />
          <RightSelect
            v-else
            :value="element.right"
            :withMultiple="element.right === MULTIPLE_VALUE"
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
            @click="$emit('reset', element)" />
        </template>
      </GenericTable>

      <NotificationBanner v-else variant="neutral" align="start" icon="info">
        {{ $t("share_menu.no_exceptions") }}
      </NotificationBanner>
    </div>

    <details class="share-org__disclosure" v-if="membersAtDefault.length > 0">
      <summary class="share-org__disclosure-summary">
        <PhIcon name="caret-right" size="xs" class="share-org__chevron" />
        <span>{{ $t("share_menu.other_members_label") }}</span>
        <CountBadge>{{ membersAtDefault.length }}</CountBadge>
      </summary>
      <GenericTable
        :columns="allMembersColumns"
        :content="membersAtDefault"
        sortListDirection=""
        sortListKey="">
        <template #cell-user="{ element }">
          <UserInfoInline
            :user="element"
            :user-id="element._id"
            :role="element.role" />
        </template>
        <template #cell-right="{ element }">
          <Loading v-if="usersLoading[element._id]" />
          <RightSelect
            v-else
            :value="element.right"
            :withMultiple="element.right === MULTIPLE_VALUE"
            @input="
              $emit('update:userRight', { user: element, right: $event })
            " />
        </template>
      </GenericTable>
    </details>

    <details class="share-org__disclosure" v-if="admins.length > 0">
      <summary class="share-org__disclosure-summary">
        <PhIcon name="caret-right" size="xs" class="share-org__chevron" />
        <span>{{ $t("share_menu.admins_label") }}</span>
        <CountBadge>{{ admins.length }}</CountBadge>
      </summary>
      <GenericTable
        :columns="allMembersColumns"
        :content="adminsWithForcedRight"
        sortListDirection=""
        sortListKey="">
        <template #cell-user="{ element }">
          <UserInfoInline
            :user="element"
            :user-id="element._id"
            :role="element.role" />
        </template>
        <template #cell-right="{ element }">
          <RightSelect :value="element.right" readonly />
        </template>
      </GenericTable>
    </details>
  </section>
</template>

<script>
import GenericTable from "@/components/molecules/GenericTable.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import Loading from "@/components/atoms/Loading.vue"
import Button from "@/components/atoms/Button.vue"
import PhIcon from "@/components/atoms/PhIcon.vue"
import CountBadge from "@/components/atoms/CountBadge.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import ShareSectionHeader from "./ShareSectionHeader.vue"
import RightSelect from "./RightSelect.vue"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles.js"

const MULTIPLE_VALUE = -1

const ADMIN_RIGHT = 31
const MAINTAINER_RIGHT = 23

export default {
  name: "ShareOrgSection",
  components: {
    GenericTable,
    UserInfoInline,
    Loading,
    Button,
    PhIcon,
    CountBadge,
    NotificationBanner,
    ShareSectionHeader,
    RightSelect,
  },
  props: {
    defaultRight: { type: Number, required: true },
    members: { type: Array, required: true },
    exceptions: { type: Array, required: true },
    admins: { type: Array, default: () => [] },
    usersLoading: { type: Object, default: () => ({}) },
  },
  data() {
    return { MULTIPLE_VALUE }
  },
  computed: {
    membersAtDefault() {
      const exceptionIds = new Set(this.exceptions.map((u) => u._id))
      return this.members.filter((u) => !exceptionIds.has(u._id))
    },
    adminsWithForcedRight() {
      return this.admins.map((u) => ({
        ...u,
        right:
          u.role === ORGANIZATION_ROLES.ADMINISTRATOR
            ? ADMIN_RIGHT
            : MAINTAINER_RIGHT,
      }))
    },
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
    allMembersColumns() {
      return [
        { key: "user", label: this.$t("share_menu.column_user"), width: "1fr" },
        {
          key: "right",
          label: this.$t("share_menu.column_right"),
          width: "auto",
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.share-org {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  border-radius: 4px;
  padding: 0.75rem;
  border: 1px solid var(--neutral-20);
  box-shadow: var(--shadow-1);
  background-color: var(--background-primary);

  &__header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__subtitle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__default {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__default-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  &__hint {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--text-secondary);
  }

  &__exceptions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--neutral-20);
  }

  &__disclosure-summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary-color);
    padding: 0.25rem 0;
    user-select: none;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  &__chevron {
    transition: transform 0.15s ease;
  }

  &__disclosure[open] &__chevron {
    transform: rotate(90deg);
  }
}
</style>
