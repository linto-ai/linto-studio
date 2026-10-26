<template>
  <div class="m-page">
    <PageHeader title="Components" />
    <main class="m-page__content">
      <section class="flex col gap-small">
        <h2 class="m-section-title">Button - variants</h2>
        <div class="flex wrap gap-small">
          <Button
            v-for="variant in variants"
            :key="variant"
            :variant="variant"
            icon="users"
            :label="variant" />
        </div>
      </section>

      <section class="flex col gap-small">
        <h2 class="m-section-title">Button - destructive intent</h2>
        <div class="flex wrap gap-small">
          <Button
            v-for="variant in variants"
            :key="variant"
            :variant="variant"
            intent="destructive"
            icon="trash"
            :label="variant" />
        </div>
      </section>

      <section class="flex col gap-small">
        <h2 class="m-section-title">Button - sizes</h2>
        <div class="flex wrap align-center gap-small">
          <Button
            v-for="size in sizes"
            :key="size"
            variant="primary"
            :size="size"
            icon="microphone"
            :label="size" />
        </div>
      </section>

      <section class="flex col gap-small">
        <h2 class="m-section-title">Button - icon only</h2>
        <div class="flex wrap align-center gap-small">
          <Button
            v-for="variant in variants"
            :key="variant"
            :variant="variant"
            icon="gear"
            :aria-label="variant" />
          <Button
            v-for="size in sizes"
            :key="size"
            variant="secondary"
            :size="size"
            icon="plus"
            :aria-label="size" />
        </div>
      </section>

      <section class="flex col gap-small">
        <h2 class="m-section-title">Button - states</h2>
        <div class="flex wrap gap-small">
          <Button
            variant="primary"
            icon-right="caret-right"
            label="Icon right" />
          <Button variant="primary" loading label="Loading" />
          <Button variant="secondary" loading label="Loading" />
          <Button variant="primary" disabled label="Disabled" />
          <Button variant="secondary" disabled label="Disabled" />
          <Button disabled label="Disabled" />
          <Button variant="primary" hovered label="Hovered" />
          <Button hovered label="Hovered" />
        </div>
      </section>

      <section class="flex col gap-small">
        <h2 class="m-section-title">Button - block and multiline</h2>
        <Button
          variant="primary"
          size="lg"
          block
          icon="broadcast"
          label="Block, lg" />
        <Button variant="secondary" size="lg" block label="Block secondary" />
        <div class="m-components__narrow">
          <Button
            variant="secondary"
            multiline
            label="A multiline label long enough to wrap on two lines" />
        </div>
        <div class="m-components__narrow">
          <Button
            variant="secondary"
            label="A single line label too long for its button" />
        </div>
      </section>

      <section class="flex col gap-small">
        <h2 class="m-section-title">Button - as a link</h2>
        <div class="flex wrap gap-small">
          <Button
            variant="secondary"
            href="#"
            icon="arrow-square-out"
            label="href" />
          <Button variant="secondary" :to="{ name: 'home' }" label="to" />
          <Button
            variant="secondary"
            :to="{ name: 'home' }"
            disabled
            label="to, disabled" />
        </div>

        <h2 class="m-section-title">Button - as a label (htmlFor)</h2>
        <div class="flex wrap gap-small">
          <input id="m-components-file" type="file" class="hidden" />
          <Button
            variant="secondary"
            html-for="m-components-file"
            icon="upload-simple"
            label="Choose a file" />
          <Button
            variant="secondary"
            html-for="m-components-file"
            disabled
            label="Disabled" />
        </div>
      </section>

      <section class="flex col gap-small">
        <h2 class="m-section-title">NotificationBanner - variants</h2>
        <NotificationBanner
          v-for="banner in notificationBanners"
          :key="banner.variant"
          :variant="banner.variant"
          :icon="banner.icon">
          {{ banner.variant }}: a message for the user
        </NotificationBanner>
      </section>

      <section class="flex col gap-small">
        <h2 class="m-section-title">
          NotificationBanner - align start, actions
        </h2>
        <NotificationBanner variant="warning" icon="warning" align="start">
          A longer message, aligned at the start, that wraps on several lines
          next to its action.
          <template #actions>
            <Button variant="secondary" size="sm" icon="plus" label="Action" />
          </template>
        </NotificationBanner>
        <NotificationBanner variant="error" icon="warning-circle" align="start">
          A message without action, aligned at the start.
        </NotificationBanner>
      </section>
    </main>
  </div>
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import PageHeader from "@/mobile/components/PageHeader.vue"

const VARIANTS = [
  "primary",
  "secondary",
  "tertiary",
  "text",
  "transparent",
  "link",
]
const SIZES = ["xs", "sm", "md", "lg", "xl"]
const NOTIFICATION_BANNERS = [
  { variant: "info", icon: "info" },
  { variant: "warning", icon: "warning" },
  { variant: "success", icon: "check-circle" },
  { variant: "error", icon: "warning-circle" },
  { variant: "neutral", icon: "lightbulb" },
]

// Catalogue of the shared components in their mobile look, to check them by
// eye (the classic app has the same page at /components).
export default {
  name: "MobileComponents",
  components: { NotificationBanner, PageHeader },
  data() {
    return {
      variants: VARIANTS,
      sizes: SIZES,
      notificationBanners: NOTIFICATION_BANNERS,
    }
  },
}
</script>

<style scoped>
.m-components__narrow {
  width: 220px;
}
</style>
