<template>
  <Modal
    v-model="isOpen"
    :title="modalTitle"
    :loading="loading"
    :withActionApply="false"
    :textActionCancel="$t('modal.close')"
    :iconActionCancel="'x'"
    customModalClass="modal-session-template-info"
    size="lg">
    <template #header-actions v-if="template">
      <Chip
        :value="
          $t(
            `session.settings_page.visibility_${template.visibility}_label`,
          )
        " />
    </template>

    <template #content>
      <div v-if="error" class="error-field">
        {{ $t("session.template_info.error_not_found") }}
      </div>

      <div v-else-if="template" class="flex col">
        <section>
          <h3>{{ $t("session.template_info.behavior_title") }}</h3>
          <div class="behavior-grid">
            <label class="behavior-item">
              <Checkbox
                disabled
                :value="!!template.autoStart"
                :id="`tpl-${template.id}-autoStart`" />
              {{ $t("session.settings_page.autoStart_label") }}
            </label>
            <label class="behavior-item">
              <Checkbox
                disabled
                :value="!!template.autoEnd"
                :id="`tpl-${template.id}-autoEnd`" />
              {{ $t("session.create_page.auto_stop_label") }}
            </label>
          </div>
        </section>

        <section v-if="userMetadata.length">
          <h3>{{ $t("session.settings_page.metadata.title") }}</h3>
          <MetadataList :field="{ value: userMetadata }" />
        </section>

        <section>
          <h3>
            {{
              $t("session.template_info.channels_title", {
                count: channelRows.length,
              })
            }}
          </h3>
          <SessionChannelsTable
            v-if="channelRows.length"
            from="templateInfo"
            :channelsList="channelRows" />
          <p v-else class="empty">
            {{ $t("session.channels_list.empty") }}
          </p>
        </section>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import SessionChannelsTable from "@/components/SessionChannelsTable.vue"
import MetadataList from "@/components/MetadataList.vue"
import {
  apiGetSessionTemplate,
  apiGetTranscriberProfilesByOrganization,
} from "@/api/session.js"

export default {
  name: "ModalSessionTemplateInfo",
  components: { Modal, SessionChannelsTable, MetadataList },
  props: {
    value: { type: Boolean, required: true },
    templateId: { type: [String, Number], required: true },
    organizationId: { type: String, required: true },
  },
  data() {
    return {
      template: null,
      transcriberProfiles: [],
      loading: false,
      error: false,
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit("input", v)
      },
    },
    modalTitle() {
      if (this.template?.name) {
        return this.$t("session.template_info.title_with_name", {
          name: this.template.name,
        })
      }
      return this.$t("session.template_info.title")
    },
    userMetadata() {
      return Object.entries(this.template?.meta ?? {}).filter(
        ([k]) => !k.startsWith("@"),
      )
    },
    channelRows() {
      const profileById = new Map(
        this.transcriberProfiles.map((p) => [p.id, p]),
      )
      return (this.template?.channelTemplates ?? []).map((c, i) => {
        const profile = profileById.get(c.transcriberProfileId)
        return {
          id: c.id ?? `tpl-channel-${i}`,
          name: c.name,
          translations: c.translations ?? [],
          diarization: !!c.diarization,
          keepAudio: !!c.keepAudio,
          profileName:
            profile?.config?.name ?? `#${c.transcriberProfileId}`,
          type: profile?.config?.type ?? "",
          languages: (profile?.config?.languages ?? []).map(
            (l) => l.candidate,
          ),
        }
      })
    },
  },
  watch: {
    value(open) {
      if (open) this.fetchIfNeeded()
    },
    templateId() {
      this.template = null
      this.error = false
      if (this.value) this.fetchIfNeeded()
    },
  },
  methods: {
    async fetchIfNeeded() {
      if (this.template || this.loading) return
      this.loading = true
      this.error = false
      try {
        const [tplRes, profiles] = await Promise.all([
          apiGetSessionTemplate(this.organizationId, this.templateId),
          apiGetTranscriberProfilesByOrganization(this.organizationId),
        ])
        if (tplRes?.status === "error" || !tplRes?.data) {
          this.error = true
        } else {
          this.template = tplRes.data
          this.transcriberProfiles = profiles ?? []
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.behavior-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
}

.behavior-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
}

.empty {
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
}
</style>

<style lang="scss">
.modal-session-template-info {
  .modal-body {
    background: var(--neutral-05);
  }
}
</style>
