<template>
  <div class="m-level" aria-hidden="true">
    <span
      v-for="(height, index) in bars"
      :key="index"
      class="m-level__bar"
      :style="{ height: `${height}px` }"></span>
  </div>
</template>

<script>
const BAR_COUNT = 20
const MAX_HEIGHT = 40
const MIN_HEIGHT = 6

// Quiet speech sits around 0.1 to 0.3 RMS: a log curve keeps it visible
// while a shout still tops out.
function perceivedLevel(level) {
  return Math.min(1, Math.log10(1 + 9 * Math.max(0, level)))
}

// A rolling history of the microphone level, newest on the right. Purely
// decorative: it reassures that the microphone hears something.
export default {
  name: "LevelMeter",
  props: {
    level: { type: Number, required: true },
  },
  data() {
    return { history: Array(BAR_COUNT).fill(0) }
  },
  computed: {
    bars() {
      return this.history.map(
        (value) =>
          MIN_HEIGHT +
          Math.round(perceivedLevel(value) * (MAX_HEIGHT - MIN_HEIGHT)),
      )
    },
  },
  watch: {
    level(value) {
      this.history = [...this.history.slice(1), value]
    },
  },
}
</script>

<style scoped>
.m-level {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 40px;
}

.m-level__bar {
  width: 6px;
  border-radius: 3px;
  background: var(--m-primary);
  transition: height 100ms linear;
}
</style>
