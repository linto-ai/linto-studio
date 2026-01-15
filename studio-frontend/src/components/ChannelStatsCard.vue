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

    <div
      v-if="hasTimelineData"
      class="channel-stats-card__timeline"
      role="img"
      :aria-label="$t('session_stats_modal.timeline.title')">
      <div class="channel-stats-card__timeline-label">
        {{ $t("session_stats_modal.timeline.title") }}
      </div>
      <div class="channel-stats-card__timeline-bar" ref="timelineBar">
        <div
          class="channel-stats-card__timeline-segment channel-stats-card__timeline-segment--active"
          :style="timelineSegmentStyle"
          :aria-label="
            $t('session_stats_modal.timeline.active') +
            ': ' +
            timelinePercentage +
            '%'
          "></div>
      </div>
      <div class="channel-stats-card__timeline-legend">
        <div class="channel-stats-card__timeline-legend-item">
          <span
            class="channel-stats-card__timeline-legend-dot channel-stats-card__timeline-legend-dot--active"></span>
          {{ $t("session_stats_modal.timeline.active") }}
        </div>
        <div class="channel-stats-card__timeline-legend-item">
          <span
            class="channel-stats-card__timeline-legend-dot channel-stats-card__timeline-legend-dot--inactive"></span>
          {{ $t("session_stats_modal.timeline.inactive") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chip from "@/components/atoms/Chip.vue"
import StatCard from "@/components/StatCard.vue"
import { formatDuration, formatTime } from "@/tools/formatDuration"

export default {
  name: "ChannelStatsCard",
  components: {
    Chip,
    StatCard,
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
    formattedStartTime() {
      return formatTime(this.channel.mountedAt, this.$i18n.locale)
    },
    formattedEndTime() {
      return formatTime(this.channel.unmountedAt, this.$i18n.locale)
    },
    hasTimelineData() {
      return (
        this.sessionStart &&
        this.sessionEnd &&
        this.channel.mountedAt &&
        this.channel.unmountedAt
      )
    },
    sessionDuration() {
      if (!this.sessionStart || !this.sessionEnd) return 0
      const start = new Date(this.sessionStart).getTime()
      const end = new Date(this.sessionEnd).getTime()
      return end - start
    },
    timelineSegmentStyle() {
      if (!this.hasTimelineData || this.sessionDuration <= 0) {
        return { left: "0%", width: "100%" }
      }

      const sessionStartMs = new Date(this.sessionStart).getTime()
      const channelStartMs = new Date(this.channel.mountedAt).getTime()
      const channelEndMs = new Date(this.channel.unmountedAt).getTime()

      const startPercent = Math.max(
        0,
        ((channelStartMs - sessionStartMs) / this.sessionDuration) * 100,
      )
      const endPercent = Math.min(
        100,
        ((channelEndMs - sessionStartMs) / this.sessionDuration) * 100,
      )
      const widthPercent = Math.max(0, endPercent - startPercent)

      return {
        left: `${startPercent}%`,
        width: `${widthPercent}%`,
      }
    },
    timelinePercentage() {
      if (!this.hasTimelineData || this.sessionDuration <= 0) return 100
      const widthStr = this.timelineSegmentStyle.width
      return Math.round(parseFloat(widthStr) || 0)
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

.channel-stats-card__timeline-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.5rem;
}

.channel-stats-card__timeline-bar {
  position: relative;
  height: 8px;
  background: var(--neutral-20);
  border-radius: 4px;
  overflow: hidden;
}

.channel-stats-card__timeline-segment {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 4px;
  transition:
    width 0.3s ease,
    left 0.3s ease;

  &--active {
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--primary-hard, var(--primary-color))
    );
  }
}

.channel-stats-card__timeline-legend {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.channel-stats-card__timeline-legend-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.channel-stats-card__timeline-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &--active {
    background: var(--primary-color);
  }

  &--inactive {
    background: var(--neutral-20);
    border: 1px solid var(--neutral-30);
  }
}

@media (prefers-reduced-motion: reduce) {
  .channel-stats-card {
    transition: none;
  }

  .channel-stats-card__timeline-segment {
    transition: none;
  }
}

@media (max-width: 480px) {
  .channel-stats-card__stats {
    grid-template-columns: 1fr;
  }
}
</style>
