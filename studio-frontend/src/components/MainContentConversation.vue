<template>
  <V2Layout
    v-if="dataLoaded && status == 'done'"
    :breadcrumbItems="breadcrumbItems">
    <!-- <template v-slot:header-bar>
      <slot name="breadcrumb-actions"></slot>
    </template> -->
    <template v-slot:breadcrumb-actions>
      <slot name="breadcrumb-actions"></slot>
    </template>

    <template v-slot:sidebar>
      <div class="sidebar-divider"></div>
      <slot name="sidebar"></slot>
    </template>
    <slot></slot>
    <!-- <Modal></Modal> -->

    <Alert
      type="warning"
      visible
      :showCancel="false"
      :title="$t('conversation.websocket_error_title')"
      :message="$t('conversation.websocket_error_content')"
      :iconActionApply="null"
      v-if="websocketError"
      :closable="false"></Alert>
  </V2Layout>
  <div
    v-else-if="dataLoaded && status != 'done' && status != 'error'"
    class="flex flex1">
    <ConversationStatus :conversation="conversation"></ConversationStatus>
  </div>
  <div v-else-if="dataLoaded && status == 'error'" class="flex flex1">
    <conversationStatusError
      :conversation="conversation"></conversationStatusError>
  </div>
  <div v-else-if="!error" id="conversation-is-loading" class="flex flex1" s>
    <Loading :title="dataLoadedStatus"></Loading>
  </div>
  <div v-else class="flex flex1">
    <ErrorView></ErrorView>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"

import MainContent from "./MainContent.vue"
import ConversationStatus from "@/components/ConversationStatus.vue"
import ConversationStatusError from "@/components/ConversationStatusError.vue"
import Loading from "@/components/atoms/Loading.vue"
import ErrorView from "@/views/Error.vue"
import Modal from "@/components/Modal.vue"
import V2Layout from "@/layouts/v2-layout.vue"

export default {
  props: {
    status: {
      type: String,
      default: "loading",
    },
    dataLoaded: {
      type: Boolean,
      required: true,
    },
    dataLoadedStatus: {
      type: String,
      default: null,
    },
    error: {
      type: Boolean,
      required: true,
    },
    conversation: {
      type: Object,
      default: () => {},
    },
    sidebar: {
      type: Boolean,
      default: false,
    },
    organizationPage: {
      type: Boolean,
      default: false,
    },
    box: {
      type: Boolean,
      default: false,
    },
    breadcrumbItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      websocketError: false,
    }
  },
  mounted() {
    bus.$on("conversation_disconnected", () => {
      this.websocketError = true
    })
  },
  methods: {},
  components: {
    Fragment,
    MainContent,
    ConversationStatus,
    ConversationStatusError,
    Loading,
    ErrorView,
    Modal,
    V2Layout,
  },
}
</script>
