<template>
  <div class="transcript-panel flex col">
    <header class="transcript-panel__header">
      <PhIcon name="text-align-left" size="sm" />
      <span>{{ title || $t('publish.transcript_panel.title') }}</span>
    </header>
    <div class="transcript-panel__body">
      <div
        v-for="turn in filteredTurns"
        :key="turn.turn_id"
        class="transcript-panel__turn">
        <div class="transcript-panel__speaker">
          <span class="transcript-panel__speaker-name">{{ speakersMap[turn.speaker_id] || turn.speaker_id }}</span>
          <span class="transcript-panel__time">{{ formatTime(turn.stime) }}</span>
        </div>
        <p class="transcript-panel__text">{{ turn.segment }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { timeToHMS } from "@/tools/timeToHMS.js"
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "TranscriptPanel",
  components: { PhIcon },
  props: {
    turns: { type: Array, default: () => [] },
    speakers: { type: Array, default: () => [] },
    title: { type: String, default: "" },
  },
  computed: {
    speakersMap() {
      const map = {}
      for (const s of this.speakers) {
        map[s.speaker_id] = s.speaker_name
      }
      return map
    },
    filteredTurns() {
      return this.turns.filter((t) => t.words && t.words.length > 0)
    },
  },
  methods: {
    formatTime(stime) {
      return timeToHMS(stime, { stripHourZeros: true })
    },
  },
}
</script>

<style lang="scss" scoped>
.transcript-panel {
  height: 100%;
  overflow: hidden;
}

.transcript-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--neutral-20);
  flex-shrink: 0;
}

.transcript-panel__body {
  overflow-y: auto;
  padding: 16px;
  flex: 1;
}

.transcript-panel__turn {
  margin-bottom: 16px;
}

.transcript-panel__speaker {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.transcript-panel__speaker-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.transcript-panel__time {
  font-size: 0.75rem;
  color: var(--dark-70);
  font-style: italic;
}

.transcript-panel__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-primary);
  text-align: justify;
}
</style>
