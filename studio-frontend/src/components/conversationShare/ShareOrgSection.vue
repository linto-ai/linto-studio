<template>
  <section class="share-org">
    <header class="share-org__header">
      <h4 class="share-org__title">
        {{ $t("share_menu.organization_members") }}
        <span class="share-org__count">({{ members.length }})</span>
      </h4>

      <FormInput :field="defaultField">
        <template #custom-input>
          <RightSelect
            :value="defaultRight"
            :withMultiple="defaultRight === MULTIPLE_VALUE"
            @input="$emit('update:defaultRight', $event)" />
        </template>
      </FormInput>
    </header>

    <div class="share-org__exceptions">
      <h5 class="share-org__subtitle">
        {{ $t("share_menu.exceptions_label") }}
        <span class="share-org__count">({{ exceptions.length }})</span>
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

      <p v-else class="share-org__empty">
        {{ $t("share_menu.no_exceptions") }}
      </p>
    </div>

    <details class="share-org__all" v-if="membersAtDefault.length > 0">
      <summary class="share-org__all-summary">
        {{
          $t("share_menu.show_other_members", {
            count: membersAtDefault.length,
          })
        }}
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

    <details class="share-org__all" v-if="admins.length > 0">
      <summary class="share-org__all-summary">
        {{ $t("share_menu.show_admins", { count: admins.length }) }}
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
import FormInput from "@/components/molecules/FormInput.vue"
import Loading from "@/components/atoms/Loading.vue"
import Button from "@/components/atoms/Button.vue"
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
    FormInput,
    Loading,
    Button,
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
    defaultField() {
      return { label: this.$t("share_menu.default_right_label") }
    },
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
  padding: 0.5rem;
  border: 1px solid var(--neutral-20);
  box-shadow: var(--shadow-1);
  background-color: var(--background-primary);

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__title,
  &__subtitle {
    margin: 0;
    color: var(--text-primary);
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
  }

  &__subtitle {
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__count {
    color: var(--text-secondary);
    font-weight: 400;
  }

  &__exceptions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__empty {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-style: italic;
  }

  &__all {
    //border-top: 1px solid var(--neutral-20);
    //padding-top: 0.75rem;
  }

  &__all-summary {
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    padding: 0.25rem 0;
    user-select: none;

    &:hover {
      color: var(--primary-color);
    }
  }
}
</style>
