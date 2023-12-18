<template>
  <div class="subtitle-list-item flex flex1 align-center">
    <div class="subtitle-list-item__content flex1">
      <h3>
        <router-link
          :to="{
            name: 'conversations subtitle',
            params: {
              conversationId: conversation._id,
              subtitleId: version._id,
            },
          }">
          {{ version.version }}
        </router-link>
      </h3>
      <div class="flex gap-medium">
        <div class="small-labeled-value">
          <div class="small-labeled-value__label">
            {{ $t("conversation.subtitles.max_char_length_short") }}
          </div>
          <div class="small-labeled-value__value">
            {{ version.generate_settings.screenCharSize }}
          </div>
        </div>
        <div class="small-labeled-value">
          <div class="small-labeled-value__label">
            {{ $t("conversation.subtitles.max_lines_short") }}
          </div>
          <div class="small-labeled-value__value">
            {{ version.generate_settings.screenLines }}
          </div>
        </div>
      </div>
    </div>
    <div class="actions flex">
      <button
        class="btn transparent"
        v-if="canEdit"
        :title="$t('conversation.subtitles.copy_label')"
        @click="openCopyModal">
        <span class="icon copy subtitle-action"></span>
      </button>
      <button
        class="btn transparent"
        v-if="canEdit"
        :title="$t('conversation.subtitles.delete_label')"
        @click="openDeleteModal">
        <span class="icon trash subtitle-action"></span>
      </button>
    </div>

    <ModalCopySubtitles
      v-if="copy"
      @on-close="closeCopyModal"
      :defaultName="version.version + ' - copy'"
      :subtitleId="version._id"></ModalCopySubtitles>
    <ModalDeleteSubtitle
      v-if="deleteSub"
      @on-close="closeDeleteModal"
      :subtitleIds="[version._id]"></ModalDeleteSubtitle>
  </div>
</template>
<script>
import ModalCopySubtitles from "./ModalCopySubtitles.vue"
import ModalDeleteSubtitle from "./ModalDeleteSubtitle.vue"

export default {
  props: {
    conversation: {
      type: Object,
      required: true,
    },
    version: {
      type: Object,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      copy: false,
      deleteSub: false,
    }
  },
  methods: {
    openCopyModal() {
      this.copy = true
    },
    closeCopyModal() {
      this.copy = false
    },
    openDeleteModal() {
      this.deleteSub = true
    },
    closeDeleteModal() {
      this.deleteSub = false
    },
  },
  components: {
    ModalCopySubtitles,
    ModalDeleteSubtitle,
  },
}
</script>
