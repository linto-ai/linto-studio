<template>
  <article
    class="template-card"
    role="button"
    tabindex="0"
    :title="$t('publish.publication.preview_action')"
    @click="$emit('select', template)"
    @keydown.enter.prevent="$emit('select', template)"
    @keydown.space.prevent="$emit('select', template)">
    <div class="template-card__top">
      <PhIcon :name="icon" framed :frameColor="iconFrameColor" size="md" />
      <PhIcon name="eye" class="template-card__preview-hint" size="sm" />
    </div>

    <h4 class="template-card__name card-title">{{ displayName }}</h4>
    <p class="template-card__description">{{ displayDescription }}</p>

    <footer class="template-card__meta" @click.stop @keydown.stop>
      <span>{{ scopeLabel }}</span>
      <label
        v-if="canShare"
        class="template-card__share"
        :title="$t('publish.publication.share_with_organization_hint')">
        <SwitchInput
          :id="`share-${template.id}`"
          :value="isSharedWithOrganization"
          @input="handleShare" />
        <span>{{ $t("publish.publication.share_with_organization") }}</span>
      </label>
      <button
        v-if="canDelete"
        type="button"
        class="template-card__delete"
        :title="$t('publish.publication.delete_template')"
        @click="$emit('delete', template)">
        <PhIcon name="trash" size="xs" />
      </button>
    </footer>
  </article>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import SwitchInput from "@/components/atoms/SwitchInput.vue"
import { canDeletePublicationTemplate } from "@/tools/canDeletePublicationTemplate.js"
import { canSharePublicationTemplate } from "@/tools/canSharePublicationTemplate.js"
import { getTemplateDisplayName } from "@/tools/getTemplateDisplayName.js"

const DEFAULT_TEMPLATE_ICON = "file-text"

export default {
  name: "PublicationTemplateCard",
  components: { PhIcon, SwitchInput },
  props: {
    template: { type: Object, required: true },
    currentUserId: { type: String, default: null },
    // Maintainers and admins of the organization
    canManageOrganization: { type: Boolean, default: false },
  },
  computed: {
    displayName() {
      return (
        getTemplateDisplayName(this.template, this.$i18n.locale) ||
        this.$t("publish.publication.no_name")
      )
    },
    displayDescription() {
      const locale = this.$i18n.locale
      const localized = locale.startsWith("fr")
        ? this.template.description_fr || this.template.description_en
        : this.template.description_en || this.template.description_fr
      return localized || this.$t("publish.publication.no_description")
    },
    scope() {
      return this.template.scope || "user"
    },
    isSharedWithOrganization() {
      return this.scope === "organization"
    },
    // Picked by the admin in LLM Gateway, Phosphor name
    icon() {
      return this.template.icon || DEFAULT_TEMPLATE_ICON
    },
    iconFrameColor() {
      return this.scope === "system" ? "primary" : "neutral"
    },
    scopeLabel() {
      return this.$t(`publish.publication.scope_label.${this.scope}`)
    },
    canDelete() {
      return canDeletePublicationTemplate(
        this.template,
        this.currentUserId,
        this.canManageOrganization,
      )
    },
    canShare() {
      return canSharePublicationTemplate(
        this.template,
        this.currentUserId,
        this.canManageOrganization,
      )
    },
  },
  methods: {
    handleShare(shared) {
      this.$emit("share", { template: this.template, shared })
    },
  },
}
</script>

<style lang="scss" scoped>
// The whole card is the control (role=button); the footer stops propagation
// so its own controls (share switch, delete) do not toggle the selection.
.template-card {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);
  min-height: 11rem;
  padding: var(--medium-gap);
  background: var(--background-primary);
  border: var(--border-block);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;

  &:hover,
  &:focus-visible {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-block);
  }

  &:focus-visible {
    outline: none;
  }
}

// Eye shown on hover only: the card opens the preview
.template-card__preview-hint {
  color: var(--primary-color);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.template-card:hover .template-card__preview-hint,
.template-card:focus-visible .template-card__preview-hint {
  opacity: 1;
}

.template-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Typography comes from the shared .card-title class */
.template-card__name {
  margin: 0;
}

.template-card__description {
  flex: 1;
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.template-card__meta {
  display: flex;
  align-items: center;
  gap: var(--small-gap);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  cursor: default;

  & > :first-child {
    margin-right: auto;
  }
}

.template-card__share {
  display: flex;
  align-items: center;
  gap: var(--tiny-gap);
  cursor: pointer;
}

.template-card__delete {
  display: inline-flex;
  padding: 2px;
  border: none;
  background: none;
  border-radius: var(--border-radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transform: none;

  &:hover {
    color: var(--danger-color);
    background: var(--danger-soft);
    transform: none;
  }
}
</style>
