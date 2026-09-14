<template>
  <BottomSheet :value="value" :title="media ? media.name : ''" @input="close">
    <p v-if="media" class="m-muted">{{ details }}</p>
    <div class="m-media-actions__list">
      <ListRow
        v-if="isReady"
        icon="arrow-square-out"
        :label="$t('mobile.media.open_in_studio')"
        :chevron="false"
        @click="$emit('open', media)" />
      <ListRow
        v-if="!confirmingDelete"
        icon="trash"
        :label="$t('mobile.media.delete')"
        :chevron="false"
        danger
        @click="confirmingDelete = true" />
      <ListRow
        v-else
        icon="warning"
        :label="$t('mobile.media.delete_confirm')"
        :hint="$t('mobile.media.delete_hint')"
        :chevron="false"
        danger
        @click="$emit('remove', media)" />
    </div>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import { mediaProgressMixin } from "@/mixins/mediaProgress.js"
import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"
import { formatMediaDate } from "@/mobile/tools/formatMediaDate.js"

// Actions on one media. Deleting asks for a second tap on the same row
// instead of a separate dialog.
export default {
  name: "MediaActionsSheet",
  components: { BottomSheet, ListRow },
  mixins: [mediaProgressMixin],
  props: {
    value: { type: Boolean, default: false },
    media: { type: Object, default: null },
  },
  data() {
    return { confirmingDelete: false }
  },
  computed: {
    isReady() {
      return this.status === "done"
    },
    details() {
      const seconds = this.media.metadata?.audio?.duration
      const duration = seconds ? formatDurationShort(seconds * 1000) : ""
      const date = formatMediaDate(this.media.created, this.$i18n.locale)
      return [duration, date].filter(Boolean).join(" · ")
    },
  },
  methods: {
    close(open) {
      if (!open) this.confirmingDelete = false
      this.$emit("input", open)
    },
  },
}
</script>

<style scoped>
.m-media-actions__list {
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}
</style>
