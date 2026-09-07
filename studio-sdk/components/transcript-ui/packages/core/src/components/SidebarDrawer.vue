<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "reka-ui"
import { X } from "lucide-vue-next"
import { useI18n } from "@linto-ai/transcript-ui-i18n"

const open = defineModel<boolean>("open", { required: true })
const { t } = useI18n()
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal disabled>
      <DialogOverlay class="transcript-ui-overlay" />
      <DialogContent class="transcript-ui-sidebar-drawer">
        <DialogTitle class="transcript-ui-sr-only">{{ t("sidebar.speakers") }}</DialogTitle>
        <DialogClose
          class="transcript-ui-sidebar-close"
          :aria-label="t('header.closeSidebar')">
          <X :size="20" />
        </DialogClose>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
