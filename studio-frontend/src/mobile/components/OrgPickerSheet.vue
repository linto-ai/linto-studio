<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.organization.choose')"
    @input="$emit('input', $event)">
    <ul class="m-org-list">
      <li v-for="org in organizations" :key="org._id" class="m-org-list__row">
        <button
          type="button"
          class="m-org-list__item"
          :class="{ 'm-org-list__item--current': org._id === currentId }"
          :aria-current="org._id === currentId ? 'true' : null"
          @click="$emit('select', org._id)">
          <span class="m-org-list__body">
            <span class="m-org-list__name">{{ org.displayName }}</span>
            <span class="m-org-list__role">{{
              $t(`organization_role.${roleKey(org.role)}`)
            }}</span>
          </span>
          <PhIcon
            v-if="org._id === currentId"
            name="check"
            size="md"
            weight="bold" />
        </button>
        <IconButton
          icon="star"
          :weight="org._id === favoriteId ? 'fill' : 'regular'"
          :label="
            $t(
              org._id === favoriteId
                ? 'mobile.organization.unset_favorite'
                : 'mobile.organization.set_favorite',
            )
          "
          class="m-org-list__star"
          :class="{ 'm-org-list__star--on': org._id === favoriteId }"
          @click="$emit('toggle-favorite', org._id)" />
      </li>
    </ul>
    <p class="m-muted m-org-list__hint">
      {{ $t("mobile.organization.favorite_hint") }}
    </p>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import IconButton from "@/mobile/components/IconButton.vue"
import { getOrganizationRoleKey } from "@/mobile/tools/getOrganizationRoleKey.js"

export default {
  name: "OrgPickerSheet",
  components: { BottomSheet, PhIcon, IconButton },
  props: {
    value: { type: Boolean, default: false },
    organizations: { type: Array, required: true },
    currentId: { type: String, default: "" },
    // The favorite organization opens by default (otherwise the personal
    // space does); the star toggles it.
    favoriteId: { type: String, default: null },
  },
  methods: {
    roleKey: getOrganizationRoleKey,
  },
}
</script>

<style scoped>
.m-org-list__row {
  display: flex;
  align-items: center;
}

.m-org-list__row .m-org-list__item {
  flex: 1;
  min-width: 0;
}

.m-org-list__star--on {
  color: var(--m-warning);
}

.m-org-list__hint {
  margin: var(--m-space-2) 0 0;
  font-size: var(--m-font-size-sm);
}

.m-org-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}

.m-org-list__item {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  width: 100%;
  min-height: 56px;
  padding: var(--m-space-2) var(--m-space-4);
  border: none;
  border-bottom: 1px solid var(--m-divider);
  background: transparent;
  text-align: left;
  color: var(--m-text);
}

.m-org-list__item--current {
  color: var(--m-primary);
}

.m-org-list__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-org-list__name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-org-list__role {
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}
</style>
