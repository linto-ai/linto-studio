<template>
    <div class="flex col transcriber-profile-editor">
        <Tabs :tabs="tabs" v-model="selectedTab"></Tabs>
        <TranscriberProfileEditorPlain v-if="selectedTab === 'plain'" v-model="l_transcriberProfile" class="flex1"/>
        
    </div>
</template>
<script>

import { bus } from "@/main.js"
import Tabs from "@/components/Tabs.vue"
import TranscriberProfileEditorPlain from "@/components/TranscriberProfileEditorPlain.vue"
export default {
  props: {
    transcriberProfile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
        tabs: [{
          name: "plain",
          label: "Plain text",
        }, {
          name: "form",
          label: "Form",
        }],
        selectedTab: "plain",
    }
    
  },
  mounted() {
  },
  computed: {
    l_transcriberProfile: {
      get() {
        return this.transcriberProfile
      },
      set(value) {
        this.$emit("update:transcriberProfile", value)
      },
    },
  },
  methods: {},
  components: {
    Tabs,
    TranscriberProfileEditorPlain
  },
}
</script>