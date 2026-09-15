<template>
  <li class="m-media">
    <button type="button" class="m-media__main" @click="$emit('open', media)">
      <span
        class="m-media__icon"
        :class="`m-media__icon--${kind.kind}`"
        :title="$t(`mobile.media.kind_${kind.kind}`)">
        <PhIcon :name="kind.icon" size="sm" />
      </span>
      <span class="m-media__body">
        <span class="m-media__name">{{ media.name }}</span>
        <span class="m-muted">{{ details }}</span>
      </span>
      <MediaStatusChip :media="media" />
    </button>
    <IconButton
      icon="dots-three-vertical"
      :label="$t('mobile.queue.actions')"
      @click="$emit('open-actions', media)" />
  </li>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import IconButton from "@/mobile/components/IconButton.vue"
import MediaStatusChip from "@/mobile/components/media/MediaStatusChip.vue"
import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"
import { formatMediaDate } from "@/mobile/tools/formatMediaDate.js"
import { describeMediaKind } from "@/mobile/tools/describeMediaKind.js"

export default {
  name: "MediaItem",
  components: { PhIcon, IconButton, MediaStatusChip },
  props: {
    media: { type: Object, required: true },
  },
  computed: {
    kind() {
      return describeMediaKind(this.media)
    },
    details() {
      const seconds = this.media.metadata?.audio?.duration
      const parts = []
      if (seconds) parts.push(formatDurationShort(seconds * 1000))
      const date = formatMediaDate(this.media.created, this.$i18n.locale)
      if (date) parts.push(date)
      return parts.join(" · ")
    },
  },
}
</script>

<style scoped>
.m-media {
  display: flex;
  align-items: center;
  gap: var(--m-space-1);
  padding-right: var(--m-space-2);
  border-bottom: 1px solid var(--m-divider);
}

.m-media:last-child {
  border-bottom: none;
}

.m-media__main {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 64px;
  padding: var(--m-space-2) 0 var(--m-space-2) var(--m-space-4);
  border: none;
  background: transparent;
  text-align: left;
  color: var(--m-text);
}

.m-media__main:active {
  background: var(--m-surface-muted);
}

.m-media__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--m-radius-sm);
  background: var(--m-surface-muted);
  color: var(--m-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.m-media__icon--live {
  background: var(--m-danger-soft);
  color: var(--m-danger);
}

.m-media__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-media__name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
