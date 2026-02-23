<template>
  <linto-editor ref="editor" locale="fr" />
</template>
<script>
import { Fragment } from "vue-fragment"

import { sessionModelMixin } from "@/mixins/sessionModel.js"

export default {
  mixins: [sessionModelMixin],
  props: {
    session: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  beforeDestroy() {},
  computed: {},
  methods: {},
  components: {
    Fragment,
    SessionChannel,
    Loading,
    SessionChannelMicrophoneOffline,
    SessionChannelVisioOffline,
  },
}
</script>
