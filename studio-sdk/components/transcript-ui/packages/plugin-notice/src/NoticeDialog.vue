<script setup lang="ts">
import { onMounted, onUpdated, useTemplateRef } from "vue"
import { Button, MarkdownView, ModalDialog } from "@linto-ai/transcript-ui-ui"
import { useCore } from "@linto-ai/transcript-ui-core"
import { useI18n } from "@linto-ai/transcript-ui-i18n"

const core = useCore()
const { t } = useI18n()

const contentRef = useTemplateRef<HTMLElement>("content")

// Layout mounts this component only while the notice is open.
onMounted(openLinksInNewTab)

// The rendered markdown is replaced whenever the content changes.
onUpdated(openLinksInNewTab)

// Following a link in place would navigate away from the host page, ending
// the session behind the dialog. Done on the rendered anchors rather than in
// the shared markdown renderer, which chat and summaries use too.
function openLinksInNewTab(): void {
  contentRef.value?.querySelectorAll("a[href]").forEach((link) => {
    link.setAttribute("target", "_blank")
    link.setAttribute("rel", "noopener noreferrer")
  })
}

function onClose(): void {
  core.notice?.close()
}
</script>

<template>
  <ModalDialog :title="t('notice.title')" @close="onClose">
    <div ref="content">
      <MarkdownView :source="core.notice?.content.value ?? ''" />
    </div>
    <template #actions>
      <Button variant="primary" type="submit">
        {{ t('modalDialog.close') }}
      </Button>
    </template>
  </ModalDialog>
</template>
