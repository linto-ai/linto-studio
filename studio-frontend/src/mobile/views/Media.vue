<template>
  <div class="m-page">
    <PageHeader :title="$t('mobile.home.media_title')" />
    <main class="m-page__content m-media-page">
      <MediaFilters
        :status="status"
        :query="query"
        @search="searchMedias"
        @change-status="status = $event" />

      <p v-if="loading" class="m-muted m-media-page__state">
        {{ $t("mobile.common.loading") }}
      </p>
      <p v-else-if="medias.length === 0" class="m-muted m-media-page__state">
        {{ $t("mobile.media.empty") }}
      </p>
      <ul v-else class="m-media-page__list">
        <MediaItem
          v-for="media in medias"
          :key="media._id"
          :media="media"
          @open="openMedia"
          @open-actions="openActions" />
      </ul>

      <button
        v-if="hasMore && !loading"
        type="button"
        class="m-media-page__more"
        :disabled="loadingMore"
        @click="loadMore">
        {{
          loadingMore
            ? $t("mobile.common.loading")
            : $t("mobile.media.load_more")
        }}
      </button>
    </main>

    <MediaActionsSheet
      v-model="actionsOpen"
      :media="selected"
      @open="openMedia"
      @remove="removeMedia" />
  </div>
</template>

<script>
import PageHeader from "@/mobile/components/PageHeader.vue"
import MediaFilters from "@/mobile/components/media/MediaFilters.vue"
import MediaItem from "@/mobile/components/media/MediaItem.vue"
import MediaActionsSheet from "@/mobile/components/media/MediaActionsSheet.vue"
import { mediaListMixin } from "@/mobile/mixins/mediaList.js"
import { buildStudioConversationUrl } from "@/mobile/tools/buildStudioConversationUrl.js"
import { openInStudio } from "@/mobile/services/navigation/openInStudio.js"
import { MEDIA_STATUS_FILTERS } from "@/mobile/const/mediaStatusFilters.js"

export default {
  name: "MobileMedia",
  components: { PageHeader, MediaFilters, MediaItem, MediaActionsSheet },
  mixins: [mediaListMixin],
  data() {
    return { actionsOpen: false, selected: null }
  },
  created() {
    const wanted = this.$route.query.status
    if (MEDIA_STATUS_FILTERS.some((filter) => filter.value === wanted)) {
      this.status = wanted
    }
  },
  methods: {
    openMedia(media) {
      this.actionsOpen = false
      if (media.jobs?.transcription?.state !== "done") {
        this.selected = media
        this.actionsOpen = true
        return
      }
      openInStudio(buildStudioConversationUrl(this.organizationId, media._id))
    },
    openActions(media) {
      this.selected = media
      this.actionsOpen = true
    },
    async removeMedia(media) {
      this.actionsOpen = false
      await this.deleteMedia(media)
    },
  },
}
</script>

<style scoped>
.m-media-page {
  gap: var(--m-space-3);
}

.m-media-page__state {
  text-align: center;
  padding: var(--m-space-6) 0;
}

.m-media-page__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: var(--m-radius);
  background: var(--m-surface);
  box-shadow: var(--m-shadow-1);
  overflow: hidden;
}

.m-media-page__more {
  min-height: var(--m-tap);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
  font-weight: 600;
}
</style>
