<template>
  <div class="turn-actions flex col gap-small justify-center" v-if="canEdit">
    <Button
      v-if="leftScreenId && rightScreenId"
      @click="() => $emit('merge', leftScreenId, rightScreenId)"
      icon="link"
      :title="$t('conversation.subtitles.merge_screens')"
      :aria-label="$t('conversation.subtitles.merge_screens')"></Button>
    <Button
      @click="() => $emit('add', leftScreenId, rightScreenId)"
      icon="plus"
      :title="$t('conversation.subtitles.add_screen')"
      :aria-label="$t('conversation.subtitles.add_screen')"></Button>
  </div>
</template>
<script>
export default {
  props: {
    leftScreenId: {
      type: String,
      requires: true,
    },
    rightScreenId: {
      type: String,
      requires: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["add", "merge"],
}
</script>
