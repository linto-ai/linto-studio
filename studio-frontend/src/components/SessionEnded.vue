<template>
  <div class="flex col flex1 align-center justify-center center-text">
    <h2>{{ $t("session.detail_page.session_ended_title") }}</h2>
    <p v-if="!isFromPublicLink">
      {{ $t("session.detail_page.session_ended_subtitle") }}
    </p>
    <Button
      v-if="!isFromPublicLink"
      :to="{ name: 'inbox', query: { organizationId: sessionOrganizationId } }"
      icon="gear"
      :label="$t('session.detail_page.session_ended_link_to_inbox')" />
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import { sessionModelMixin } from "@/mixins/sessionModel.js"

export default {
  mixins: [sessionModelMixin],
  props: {
    session: {
      type: Object,
      required: true,
    },
    isFromPublicLink: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment },
}
</script>
