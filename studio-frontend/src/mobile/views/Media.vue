<template>
  <div class="m-page">
    <PageHeader
      :title="
        currentFolder ? currentFolder.name : $t('mobile.home.media_title')
      "
      :back-to="parentRoute">
      <template #actions>
        <IconButton
          icon="folder-open"
          :label="$t('mobile.media.folders')"
          @click="folderSheetOpen = true" />
      </template>
    </PageHeader>
    <main class="m-page__content m-media-page">
      <MediaFilters
        :status="status"
        :query="query"
        @search="searchMedias"
        @change-status="status = $event" />

      <FolderBreadcrumb
        v-if="!query && folderPath.length > 0"
        :path="folderPath"
        :current-id="folderId" />

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

    <FolderSheet
      v-model="folderSheetOpen"
      :folders="subfolders"
      :current-id="folderId"
      :parent="parentFolder"
      @select="goToFolder" />
    <MediaActionsSheet
      v-model="actionsOpen"
      :media="selected"
      :shareable="selectedShareable"
      @open="openMedia"
      @export="exportSelected"
      @share="openShare"
      @remove="removeMedia" />
    <ShareSheet
      v-model="shareOpen"
      :media="selected"
      :organization-id="organizationId" />
  </div>
</template>

<script>
import PageHeader from "@/mobile/components/PageHeader.vue"
import MediaFilters from "@/mobile/components/media/MediaFilters.vue"
import MediaItem from "@/mobile/components/media/MediaItem.vue"
import MediaActionsSheet from "@/mobile/components/media/MediaActionsSheet.vue"
import ShareSheet from "@/mobile/components/media/ShareSheet.vue"
import IconButton from "@/mobile/components/IconButton.vue"
import FolderSheet from "@/mobile/components/media/FolderSheet.vue"
import FolderBreadcrumb from "@/mobile/components/media/FolderBreadcrumb.vue"
import { mediaListMixin } from "@/mobile/mixins/mediaList.js"
import { folderNavigationMixin } from "@/mobile/mixins/folderNavigation.js"
import { transcriptShareMixin } from "@/mobile/mixins/transcriptShare.js"
import { currentUserMixin } from "@/mobile/mixins/currentUser.js"
import { canShareConversation } from "@/mobile/tools/canShareConversation.js"
import { MEDIA_STATUS_FILTERS } from "@/mobile/const/mediaStatusFilters.js"

export default {
  name: "MobileMedia",
  components: {
    PageHeader,
    MediaFilters,
    MediaItem,
    MediaActionsSheet,
    ShareSheet,
    IconButton,
    FolderSheet,
    FolderBreadcrumb,
  },
  mixins: [
    mediaListMixin,
    folderNavigationMixin,
    transcriptShareMixin,
    currentUserMixin,
  ],
  data() {
    return {
      actionsOpen: false,
      shareOpen: false,
      selected: null,
      folderSheetOpen: false,
    }
  },
  computed: {
    selectedShareable() {
      return canShareConversation(
        this.selected,
        this.userId,
        this.organizationRole,
      )
    },
  },
  created() {
    const wanted = this.$route.query.status
    if (MEDIA_STATUS_FILTERS.some((filter) => filter.value === wanted)) {
      this.status = wanted
    }
  },
  methods: {
    goToFolder(folderId) {
      this.folderSheetOpen = false
      const target = folderId
        ? { name: "media", params: { folderId } }
        : { name: "media" }
      if (this.$route.params.folderId !== folderId) this.$router.push(target)
    },
    openMedia(media) {
      this.actionsOpen = false
      if (media.jobs?.transcription?.state !== "done") {
        this.selected = media
        this.actionsOpen = true
        return
      }
      this.$router.push({
        name: "conversation",
        params: { conversationId: media._id },
      })
    },
    openActions(media) {
      this.selected = media
      this.actionsOpen = true
    },
    openShare() {
      this.actionsOpen = false
      this.shareOpen = true
    },
    exportSelected(request) {
      this.actionsOpen = false
      this.shareTranscript(request)
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
