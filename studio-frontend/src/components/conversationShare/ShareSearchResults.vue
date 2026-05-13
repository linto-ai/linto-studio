<template>
  <section class="share-search">
    <div
      v-if="showInviteRow"
      class="share-search__invite">
      <div class="share-search__invite-info">
        <ph-icon name="envelope-simple" size="md" />
        <span class="share-search__invite-email">{{ trimmedSearch }}</span>
      </div>
      <Button
        :label="$t('share_menu.invite_email_action', { email: trimmedSearch })"
        :title="
          inviteEnabled
            ? $t('share_menu.invite_email_action', { email: trimmedSearch })
            : $t('share_menu.inscription_disabled')
        "
        :disabled="!inviteEnabled"
        variant="primary"
        size="sm"
        icon="paper-plane-tilt"
        @click="$emit('invite', trimmedSearch)" />
    </div>

    <div v-if="loading" class="share-search__loading">
      <Loading />
    </div>

    <GenericTable
      v-else-if="enrichedResults.length > 0"
      :columns="columns"
      :content="enrichedResults"
      sortListDirection=""
      sortListKey="">
      <template #cell-status="{ element }">
        <div class="share-search__badges">
          <Chip v-if="element.inOrg" :value="$t('share_menu.badge_org')" />
          <Chip
            v-if="element.atDefault"
            :value="$t('share_menu.badge_default')" />
        </div>
      </template>
      <template #cell-user="{ element }">
        <UserInfoInline :user="element" :user-id="element._id" />
      </template>
      <template #cell-right="{ element }">
        <Loading v-if="usersLoading[element._id]" />
        <RightSelect
          v-else
          :value="element.effectiveRight"
          @input="$emit('update:userRight', { user: element, right: $event })" />
      </template>
    </GenericTable>

    <p
      v-else-if="!showInviteRow && trimmedSearch.length > 0"
      class="share-search__empty">
      {{ $t("share_menu.no_search_results") }}
    </p>
  </section>
</template>

<script>
import { mapGetters } from "vuex"

import { apiSearchUser } from "@/api/user.js"
import { debounceMixin } from "@/mixins/debounce.js"

import GenericTable from "@/components/molecules/GenericTable.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import Loading from "@/components/atoms/Loading.vue"
import Button from "@/components/atoms/Button.vue"
import Chip from "@/components/atoms/Chip.vue"
import RightSelect from "./RightSelect.vue"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default {
  name: "ShareSearchResults",
  mixins: [debounceMixin],
  components: {
    GenericTable,
    UserInfoInline,
    Loading,
    Button,
    Chip,
    RightSelect,
  },
  props: {
    searchValue: { type: String, required: true },
    sharedUsers: { type: Array, default: () => [] },
    defaultRight: { type: Number, required: true },
    usersLoading: { type: Object, default: () => ({}) },
    inviteEnabled: { type: Boolean, default: true },
  },
  data() {
    return {
      results: [],
      loading: false,
    }
  },
  computed: {
    ...mapGetters("organizations", {
      orgUsers: "getCurrentOrganizationUsers",
    }),
    trimmedSearch() {
      return this.searchValue.trim()
    },
    isEmail() {
      return EMAIL_RE.test(this.trimmedSearch)
    },
    orgUserIds() {
      return new Set(this.orgUsers.map((u) => u._id))
    },
    sharedById() {
      return new Map(this.sharedUsers.map((u) => [u._id, u]))
    },
    sharedByEmail() {
      return new Map(
        this.sharedUsers
          .filter((u) => u.email)
          .map((u) => [u.email.toLowerCase(), u]),
      )
    },
    enrichedResults() {
      return this.results.map((user) => {
        const shared = this.sharedById.get(user._id)
        const inOrg = this.orgUserIds.has(user._id)
        const isException = shared && shared.right !== this.defaultRight
        const atDefault = inOrg && !isException
        let effectiveRight
        if (shared) effectiveRight = shared.right
        else if (inOrg) effectiveRight = this.defaultRight
        else effectiveRight = 0
        return { ...user, effectiveRight, inOrg, atDefault }
      })
    },
    showInviteRow() {
      if (!this.isEmail) return false
      const found = this.sharedByEmail.has(this.trimmedSearch.toLowerCase())
      if (found) return false
      const matchedInResults = this.results.some(
        (u) => u.email?.toLowerCase() === this.trimmedSearch.toLowerCase(),
      )
      return !matchedInResults
    },
    columns() {
      return [
        {
          key: "status",
          label: this.$t("share_menu.column_status"),
          width: "auto",
        },
        { key: "user", label: this.$t("share_menu.column_user"), width: "1fr" },
        {
          key: "right",
          label: this.$t("share_menu.column_right"),
          width: "auto",
        },
      ]
    },
  },
  watch: {
    searchValue: {
      immediate: true,
      async handler(value) {
        const trimmed = value?.trim() ?? ""
        if (trimmed.length === 0) {
          this.results = []
          return
        }
        const res = await this.debouncedSearch(apiSearchUser, trimmed)
        this.results = res?.data || []
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.share-search {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__invite {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: var(--primary-soft);
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius-sm);
  }

  &__invite-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
  }

  &__invite-email {
    font-weight: 600;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: 1.5rem;
  }

  &__empty {
    margin: 0;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  &__badges {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
}
</style>
