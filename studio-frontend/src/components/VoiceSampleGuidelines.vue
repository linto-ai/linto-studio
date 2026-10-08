<template>
  <NotificationBanner variant="info" icon="info" align="start">
    <div class="voice-guidelines">
      <h5 class="voice-guidelines__title">
        {{ $t("speaker_diarization.guidelines_title") }}
      </h5>
      <ul class="voice-guidelines__list">
        <li
          v-for="(item, index) in $t('speaker_diarization.guidelines_items')"
          :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </NotificationBanner>
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

export default {
  name: "VoiceSampleGuidelines",
  components: { NotificationBanner },
}
</script>

<style lang="scss" scoped>
.voice-guidelines {
  font-size: 13px;

  &__title {
    margin: 0 0 0.5rem;
    font-size: 13px;
    font-weight: 600;
  }

  &__list {
    margin: 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
