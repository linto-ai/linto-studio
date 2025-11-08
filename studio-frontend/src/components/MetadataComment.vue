<template>
  <section class="flex col gap-small small-padding-bottom">
    <h4 class="flex align-center">
      <span class="flex1">{{
        $t("conversation.highlight_toolbox.comment")
      }}</span>
      <button class="transparent" @click="deleteMetadata">
        <span class="icon trash" />
      </button>
    </h4>
    <div>{{ metadata.value.content }}</div>
  </section>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    metadata: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    deleteMetadata() {},
  },
}
</script>
