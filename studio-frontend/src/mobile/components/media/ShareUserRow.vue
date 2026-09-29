<template>
  <li class="m-share-user">
    <span class="m-share-user__avatar" aria-hidden="true">{{ initials }}</span>
    <span class="m-share-user__body">
      <span class="m-share-user__name">{{ name }}</span>
      <span v-if="hint" class="m-muted m-share-user__hint">{{ hint }}</span>
    </span>
    <ShareRightSelect
      :value="right"
      :label="$t('share_menu.column_right')"
      :disabled="locked || busy"
      @input="$emit('change', $event)" />
  </li>
</template>

<script>
import ShareRightSelect from "@/mobile/components/media/ShareRightSelect.vue"
import { userName } from "@/tools/userName"
import { computeInitials } from "@/mobile/tools/computeInitials.js"

// One person in the share sheet with the right the conversation grants
// them. `locked` rows (maintainers, administrators) cannot be changed.
export default {
  name: "ShareUserRow",
  components: { ShareRightSelect },
  props: {
    user: { type: Object, required: true },
    right: { type: Number, required: true },
    hint: { type: String, default: "" },
    locked: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
  },
  computed: {
    name() {
      return userName(this.user)
    },
    initials() {
      return computeInitials(this.name)
    },
  },
}
</script>

<style scoped>
.m-share-user {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 56px;
  padding: var(--m-space-2) var(--m-space-3);
}

.m-share-user__avatar {
  flex: none;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--m-radius-round);
  background: var(--m-primary-soft);
  color: var(--m-primary);
  font-size: var(--m-font-size-sm);
  font-weight: 600;
}

.m-share-user__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-share-user__name,
.m-share-user__hint {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-share-user__hint {
  font-size: var(--m-font-size-sm);
}
</style>
