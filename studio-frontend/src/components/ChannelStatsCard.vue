<template>
  <div
    class="channel-stats-card"
    role="region"
    :aria-label="$t('session_stats_modal.channels.title') + ': ' + channelName">
    <div class="channel-stats-card__header">
      <div class="channel-stats-card__title-row">
        <ph-icon name="broadcast" size="md" class="channel-stats-card__icon" />
        <span class="channel-stats-card__name">{{ channelName }}</span>
        <Chip
          v-if="channel.hasDiarization"
          size="small"
          primary
          class="channel-stats-card__Chip"
          :value="$t('session_stats_modal.channels.diarization_enabled')" />
      </div>
      <div
        v-if="channel.languages && channel.languages.length"
        class="channel-stats-card__languages">
        <ph-icon name="translate" size="sm" />
        <span class="channel-stats-card__languages-list">
          {{ formattedLanguages }}
        </span>
      </div>
    </div>

    <div class="flex gap-small">
      <StatCard
        class="flex1"
        variant="secondary"
        icon="clock"
        :count="formattedDuration"
        :title="$t('session_stats_modal.channels.active_duration')" />
      <StatCard
        class="flex1"
        v-if="formattedStartTime"
        variant="secondary"
        icon="play"
        :count="formattedStartTime"
        :title="$t('session_stats_modal.channels.started_at')" />
      <StatCard
        class="flex1"
        v-if="formattedEndTime"
        variant="secondary"
        icon="stop"
        :count="formattedEndTime"
        :title="$t('session_stats_modal.channels.ended_at')" />
    </div>

    <TimelineSegmented
      v-if="hasTimelineData"
      class="channel-stats-card__timeline"
      :segments="timelineSegments"
      :label="$t('session_stats_modal.timeline.title')"
      :legend="timelineLegend"
      :aria-label="$t('session_stats_modal.timeline.active') + ': ' + timelinePercentage + '%'" />
  </div>
</template>

<script>
import Chip from "@/components/atoms/Chip.vue"
import StatCard from "@/components/StatCard.vue"
import TimelineSegmented from "@/components/atoms/TimelineSegmented.vue"
import { formatDuration, formatTime } from "@/tools/formatDuration"

export default {
  name: "ChannelStatsCard",
  components: {
    Chip,
    StatCard,
    TimelineSegmented,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
    sessionStart: {
      type: [String, Date],
      default: null,
    },
    sessionEnd: {
      type: [String, Date],
      default: null,
    },
  },
  computed: {
    channelName() {
      return (
        this.channel.name ||
        this.$t("session_stats_modal.channels.default_name", {
          id: this.channel.channelId?.slice(-6) || "?",
        })
      )
    },
    formattedDuration() {
      if (this.channel.activeDuration == null) {
        return "-"
      }
      return formatDuration(this.channel.activeDuration, { compact: true })
    },
    // Get first mount timestamp from array
    firstMountedAt() {
      const mounts = this.channel.mountedAt
      if (!mounts?.length) return null
      return mounts[0]
    },
    // Get last unmount timestamp from array
    lastUnmountedAt() {
      const unmounts = this.channel.unmountedAt
      if (!unmounts?.length) return null
      return unmounts[unmounts.length - 1]
    },
    formattedStartTime() {
      return formatTime(this.firstMountedAt, this.$i18n.locale)
    },
    formattedEndTime() {
      return formatTime(this.lastUnmountedAt, this.$i18n.locale)
    },
    hasTimelineData() {
      return (
        this.sessionStart &&
        this.sessionEnd &&
        this.firstMountedAt &&
        this.lastUnmountedAt
      )
    },
    sessionDuration() {
      if (!this.sessionStart || !this.sessionEnd) return 0
      const start = new Date(this.sessionStart).getTime()
      const end = new Date(this.sessionEnd).getTime()
      return end - start
    },
    timelinePercentage() {
      if (!this.hasTimelineData || this.sessionDuration <= 0) return 100
      // Use activeDuration which already accounts for all mount/unmount pairs
      const activeDurationMs = (this.channel.activeDuration || 0) * 1000
      return Math.round(Math.min(100, Math.max(0, (activeDurationMs / this.sessionDuration) * 100)))
    },
    timelineLegend() {
      return [
        { label: this.$t("session_stats_modal.timeline.active"), type: "active" },
        { label: this.$t("session_stats_modal.timeline.inactive"), type: "inactive" },
      ]
    },
    timelineSegments() {
      if (!this.hasTimelineData || this.sessionDuration <= 0) return []

      const sessionStartMs = new Date(this.sessionStart).getTime()
      const mounts = this.channel.mountedAt || []
      const unmounts = this.channel.unmountedAt || []
      const segments = []

      // Pair mounts with unmounts to create active segments
      const pairCount = Math.min(mounts.length, unmounts.length)
      const locale = this.$i18n?.locale || "en"

      for (let i = 0; i < pairCount; i++) {
        const mountDate = new Date(mounts[i])
        const unmountDate = new Date(unmounts[i])
        const mountMs = mountDate.getTime()
        const unmountMs = unmountDate.getTime()
        const durationSec = (unmountMs - mountMs) / 1000

        const left = ((mountMs - sessionStartMs) / this.sessionDuration) * 100
        const width = ((unmountMs - mountMs) / this.sessionDuration) * 100

        segments.push({
          active: true,
          left: Math.max(0, left),
          width: Math.min(100 - left, Math.max(0, width)),
          tooltip: {
            [this.$t("session_stats_modal.channels.started_at")]: formatTime(mountDate, locale),
            [this.$t("session_stats_modal.channels.ended_at")]: formatTime(unmountDate, locale),
            [this.$t("session_stats_modal.channels.active_duration")]: formatDuration(durationSec, { compact: true }),
          },
        })
      }

      return segments
    },
    formattedLanguages() {
      if (!this.channel.languages?.length) return ""
      const displayLocale = this.$i18n?.locale || "en"
      try {
        const displayNames = new Intl.DisplayNames([displayLocale], {
          type: "language",
        })
        return this.channel.languages
          .map((lang) => {
            const code = lang?.candidate || lang
            try {
              return displayNames.of(code) || code
            } catch {
              return code
            }
          })
          .join(", ")
      } catch {
        return this.channel.languages
          .map((lang) => lang?.candidate || lang)
          .join(", ")
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.channel-stats-card {
  background: var(--background-primary);
  border-radius: 8px;
  border: 1px solid var(--neutral-20);
  padding: var(--medium-gap, 1rem);
  box-shadow: var(--shadow-2, 0 1px 3px rgba(0, 0, 0, 0.1));
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-3, 0 4px 6px rgba(0, 0, 0, 0.1));
  }

  &:focus-within {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
}

.channel-stats-card__header {
  margin-bottom: var(--small-gap, 0.75rem);
}

.channel-stats-card__title-row {
  display: flex;
  align-items: center;
  gap: var(--small-gap, 0.5rem);
  flex-wrap: wrap;
}

.channel-stats-card__icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.channel-stats-card__name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-stats-card__Chip {
  flex-shrink: 0;
}

.channel-stats-card__languages {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.channel-stats-card__languages-list {
  color: var(--text-secondary);
}

.channel-stats-card__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--small-gap, 0.75rem);
  margin-bottom: var(--medium-gap, 1rem);
}

.channel-stats-card__timeline {
  margin-top: var(--small-gap, 0.75rem);
  padding-top: var(--small-gap, 0.75rem);
  border-top: 1px solid var(--neutral-10);
}

@media (prefers-reduced-motion: reduce) {
  .channel-stats-card {
    transition: none;
  }
}

@media (max-width: 480px) {
  .channel-stats-card__stats {
    grid-template-columns: 1fr;
  }
}
</style>
