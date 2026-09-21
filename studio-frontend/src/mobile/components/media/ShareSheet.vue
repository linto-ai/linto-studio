<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.media.share_studio')"
    @input="$emit('input', $event)">
    <p v-if="media" class="m-muted">{{ media.name }}</p>
    <form class="m-share__search" @submit.prevent="submitSearch">
      <input
        type="search"
        :value="searchText"
        :placeholder="$t('mobile.share.search_placeholder')"
        :aria-label="$t('share_menu.search_label')"
        autocomplete="off"
        @input="onSearch($event.target.value)" />
    </form>

    <p v-if="loading" class="m-muted">{{ $t("share_menu.loading_users") }}</p>

    <template v-else-if="isSearching">
      <ul class="m-share__list">
        <ShareUserRow
          v-for="user in searchResults"
          :key="user._id"
          :user="user"
          :right="user.right"
          :hint="hintFor(user)"
          :locked="user.privileged"
          :busy="!!busyIds[user._id]"
          @change="changeUserRight(user, $event)" />
      </ul>
      <ListRow
        v-if="inviteOffered"
        icon="envelope-simple"
        :label="
          $t('share_menu.invite_email_action', { email: searchText.trim() })
        "
        :chevron="false"
        @click="invite(searchText.trim())" />
      <p v-else-if="searching" class="m-muted">
        {{ $t("mobile.common.loading") }}
      </p>
      <p v-else-if="searchResults.length === 0" class="m-muted">
        {{ $t("share_menu.no_search_results") }}
      </p>
    </template>

    <template v-else>
      <section class="m-share__section">
        <h3 class="m-section-title">
          {{ $t("share_menu.organization_members") }}
        </h3>
        <label class="m-share__default">
          <span>{{ $t("share_menu.default_right_label") }}</span>
          <ShareRightSelect
            :value="defaultRight"
            :label="$t('share_menu.default_right_label')"
            @input="changeDefaultRight" />
        </label>
        <ul v-if="sections.exceptions.length > 0" class="m-share__list">
          <ShareUserRow
            v-for="user in sections.exceptions"
            :key="user._id"
            :user="user"
            :right="user.right"
            :hint="hintFor(user)"
            :busy="!!busyIds[user._id]"
            @change="changeUserRight(user, $event)" />
        </ul>
        <p v-else class="m-muted">{{ $t("share_menu.no_exceptions") }}</p>
      </section>
      <section class="m-share__section">
        <h3 class="m-section-title">{{ $t("share_menu.external_members") }}</h3>
        <ul v-if="externalMembers.length > 0" class="m-share__list">
          <ShareUserRow
            v-for="user in externalMembers"
            :key="user._id"
            :user="user"
            :right="user.right"
            :hint="user.email"
            :busy="!!busyIds[user._id]"
            @change="changeUserRight(user, $event)" />
        </ul>
        <p v-else class="m-muted">{{ $t("mobile.share.external_hint") }}</p>
      </section>
    </template>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import ShareUserRow from "@/mobile/components/media/ShareUserRow.vue"
import ShareRightSelect from "@/mobile/components/media/ShareRightSelect.vue"
import { conversationShareMixin } from "@/mobile/mixins/conversationShare.js"
import { userSearchMixin } from "@/mobile/mixins/userSearch.js"
import { getOrganizationRoleKey } from "@/mobile/tools/getOrganizationRoleKey.js"

// Sharing inside Studio: the organization default right and its
// exceptions, people from outside, and a search that also invites an
// unknown email address. Same endpoints as the classic share panel.
export default {
  name: "ShareSheet",
  components: { BottomSheet, ListRow, ShareUserRow, ShareRightSelect },
  mixins: [conversationShareMixin, userSearchMixin],
  props: { value: { type: Boolean, default: false } },
  watch: {
    value(open) {
      this.resetSearch()
      if (open) this.load()
    },
  },
  methods: {
    hintFor(user) {
      if (user.role == null) return user.email ?? ""
      return this.$t(`organization_role.${getOrganizationRoleKey(user.role)}`)
    },
    // Enter in the search field invites the typed address when offered.
    submitSearch() {
      if (this.inviteOffered) this.invite(this.searchText.trim())
    },
  },
}
</script>

<style scoped>
.m-share__search input {
  width: 100%;
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-share__section {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-2);
}

.m-share__default {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-space-3);
  min-height: var(--m-tap);
}

.m-share__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}
</style>
