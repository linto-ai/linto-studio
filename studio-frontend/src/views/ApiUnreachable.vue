<template>
  <main
    class="api-unreachable flex col align-center justify-center flex1 center-text gap-medium">
    <PhIcon name="wifi-slash" size="xl" />
    <h1>{{ $t("global_error.api_unreachable.title", { name: appName }) }}</h1>
    <p class="api-unreachable__text">
      {{ $t("global_error.api_unreachable.text") }}
    </p>
    <Button
      variant="primary"
      icon="arrow-clockwise"
      :label="$t('global_error.api_unreachable.retry')"
      :loading="pending"
      @click="retry" />
    <details class="api-unreachable__details">
      <summary class="api-unreachable__details-summary">
        <PhIcon
          name="caret-right"
          size="xs"
          class="api-unreachable__details-caret" />
        <span>{{ $t("global_error.api_unreachable.details") }}</span>
      </summary>
      <dl class="api-unreachable__details-list">
        <dt>{{ $t("global_error.api_unreachable.api_address") }}</dt>
        <dd>
          <code class="api-unreachable__details-code">{{ apiUrl }}</code>
        </dd>
        <template v-if="failure">
          <dt>{{ $t("global_error.api_unreachable.failure_label") }}</dt>
          <dd>{{ failureText }}</dd>
        </template>
      </dl>
    </details>
  </main>
</template>

<script>
import { getEnv } from "@/tools/getEnv"

// Where both routers send any page while the API does not answer
// (apiStatus): same screen in the classic and the mobile app, which frames
// it (src/mobile/views/ApiUnreachable.vue). Layout from the shared
// utilities, Button and PhIcon styled by each app.
//
// Class contract of the technical details, styled by each app
// (style/components/api-unreachable.scss, mobile/style/api-unreachable.css):
// .api-unreachable__details (the <details>), __details-summary,
// __details-caret (turns when open), __details-list (<dl>), __details-code.
export default {
  name: "ApiUnreachable",
  data() {
    return {
      appName: getEnv("VUE_APP_NAME"),
      // As configured: the details must show a wrong address as it is.
      apiUrl: getEnv("VUE_APP_CONVO_API"),
      pending: false,
    }
  },
  computed: {
    // null when the page is opened directly, before any check.
    failure() {
      return this.$store.state.apiStatus.failure
    },
    failureText() {
      return this.$t(
        `global_error.api_unreachable.failure.${this.failure.reason}`,
        this.failure,
      )
    },
  },
  methods: {
    // Back to the page asked for: the router checks the API again. The
    // navigation promise settles early when the page redirects (to login,
    // to an organization…): the API status, set before any redirect back
    // here, tells whether it still does not answer.
    async retry() {
      this.pending = true
      await this.$router.replace(this.$route.query.page || "/").catch(() => {})
      this.pending = false
      if (this.$store.state.apiStatus.reachable !== true) {
        this.$store.dispatch(
          "system/showError",
          this.$t("global_error.api_unreachable.still", {
            name: this.appName,
          }),
        )
      }
    },
  },
}
</script>

<style scoped>
.api-unreachable__text,
.api-unreachable__details {
  max-width: 32rem;
}
</style>
