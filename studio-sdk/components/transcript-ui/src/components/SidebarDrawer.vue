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
import { useI18n } from "../i18n"

const open = defineModel<boolean>("open", { required: true })
const { t } = useI18n()
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal disabled>
      <DialogOverlay class="editor-overlay" />
      <DialogContent class="sidebar-drawer">
        <DialogTitle class="sr-only">{{ t("sidebar.speakers") }}</DialogTitle>
        <DialogClose
          class="sidebar-close"
          :aria-label="t('header.closeSidebar')">
          <X :size="20" />
        </DialogClose>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
