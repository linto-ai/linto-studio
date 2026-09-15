<template>
  <div class="m-server-links">
    <p v-if="loading" class="m-muted">{{ $t("mobile.common.loading") }}</p>
    <template v-else>
      <ListRow
        v-if="conversation && transcriptReady"
        icon="text-align-left"
        :label="$t('mobile.library.open_transcript')"
        :to="{ name: 'conversation', params: { conversationId } }" />
      <ListRow
        v-else-if="conversation"
        icon="hourglass"
        :label="$t('mobile.library.transcript_processing')"
        :chevron="false"
        :to="{ name: 'media', query: { status: 'processing' } }" />
      <p v-else-if="missing" class="m-muted m-server-links__note">
        <PhIcon name="cloud-slash" size="sm" />
        {{ $t("mobile.library.transcript_missing") }}
      </p>
      <p v-else class="m-muted m-server-links__note">
        {{ $t("mobile.library.links_failed") }}
      </p>
      <ListRow
        v-for="document in readyDocuments"
        :key="document._id"
        icon="file-pdf"
        :label="documentLabel(document)"
        :hint="$t('mobile.library.share_document')"
        :chevron="false"
        @click="$emit('share-document', { conversation, document })" />
    </template>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import { loadRecordingLinks } from "@/mobile/services/library/loadRecordingLinks.js"

// The server side of a kept recording: its transcription and the documents
// generated on it. A conversation deleted on the server is said so; the
// local audio stays.
export default {
  name: "RecordingServerLinks",
  components: { PhIcon, ListRow },
  props: { conversationId: { type: String, required: true } },
  data() {
    return { loading: true, conversation: null, missing: false, documents: [] }
  },
  computed: {
    transcriptReady() {
      return this.conversation?.jobs?.transcription?.state === "done"
    },
    readyDocuments() {
      return this.documents.filter((document) => document.status === "complete")
    },
  },
  async created() {
    const links = await loadRecordingLinks(this.conversationId)
    this.conversation = links.conversation
    this.missing = links.missing
    this.documents = links.documents
    this.loading = false
  },
  methods: {
    documentLabel(document) {
      return document.flavorName || document.format
    },
  },
}
</script>

<style scoped>
.m-server-links {
  display: flex;
  flex-direction: column;
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}

.m-server-links__note {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  margin: 0;
  padding: var(--m-space-3);
}
</style>
