<template>
  <div
    class="template-card"
    :class="{
      selected: isSelected,
      disabled: template.is_active === false,
      [`scope-${scopeClass}`]: true
    }"
    @click="handleClick">

    <!-- Document Preview Area -->
    <div class="template-preview" :class="`preview-${scopeClass}`">
      <div class="preview-document">
        <!-- Header with title -->
        <div class="preview-header" v-if="hasTitle">
          <div class="preview-title-bar"></div>
          <div class="preview-date" v-if="hasDate">
            <span class="date-icon">📅</span>
          </div>
        </div>

        <!-- Participants row -->
        <div class="preview-participants" v-if="hasParticipants">
          <span class="participant-dot"></span>
          <span class="participant-dot"></span>
          <span class="participant-dot"></span>
        </div>

        <!-- Content area -->
        <div class="preview-body">
          <!-- Summary/output as text lines -->
          <template v-if="hasSummary || hasOutput">
            <div class="preview-line full"></div>
            <div class="preview-line long"></div>
            <div class="preview-line medium"></div>
          </template>

          <!-- Key points / action items as bullets -->
          <div class="preview-bullets" v-if="hasKeyPoints || hasActionItems">
            <div class="preview-bullet-item">
              <span class="bullet"></span>
              <div class="preview-line medium"></div>
            </div>
            <div class="preview-bullet-item">
              <span class="bullet"></span>
              <div class="preview-line long"></div>
            </div>
            <div class="preview-bullet-item" v-if="hasActionItems">
              <span class="bullet action"></span>
              <div class="preview-line short"></div>
            </div>
          </div>

          <!-- Topics as tags -->
          <div class="preview-tags" v-if="hasTopics">
            <span class="preview-tag"></span>
            <span class="preview-tag"></span>
            <span class="preview-tag short"></span>
          </div>

          <!-- Fallback for basic templates -->
          <template v-if="isBasicTemplate">
            <div class="preview-line full"></div>
            <div class="preview-line full"></div>
            <div class="preview-line long"></div>
            <div class="preview-spacer"></div>
            <div class="preview-line full"></div>
            <div class="preview-line medium"></div>
          </template>
        </div>
      </div>

      <!-- Scope badge -->
      <div class="scope-badge" :class="`badge-${scopeClass}`">
        <span class="scope-icon">{{ scopeIcon }}</span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="template-content">
      <h4 class="template-name">{{ displayName }}</h4>
      <p class="template-description">{{ displayDescription }}</p>

      <!-- Footer -->
      <div class="template-footer">
        <span class="scope-label">{{ scopeLabel }}</span>
        <div class="template-actions">
          <button
            v-if="canDelete"
            class="delete-btn"
            @click.stop="handleDelete"
            :title="$t('publish.publication.delete_template') || 'Supprimer le modèle'">
            <span class="delete-icon">🗑️</span>
          </button>
          <span class="template-action">
            {{ $t("publish.publication.preview_action") || "Aperçu" }}
            <span class="action-arrow">→</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PublicationTemplateCard",
  props: {
    template: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    displayName() {
      const locale = this.$i18n.locale
      if (locale.startsWith("fr") && this.template.name_fr) {
        return this.template.name_fr
      }
      if (this.template.name_en) {
        return this.template.name_en
      }
      return this.template.name_fr || this.template.name || this.$t("publish.publication.no_name")
    },
    displayDescription() {
      const locale = this.$i18n.locale
      if (locale.startsWith("fr") && this.template.description_fr) {
        return this.template.description_fr
      }
      if (this.template.description_en) {
        return this.template.description_en
      }
      return this.template.description_fr || this.template.description || this.$t("publish.publication.no_description")
    },
    scopeClass() {
      const scope = (this.template.scope || "").toLowerCase()
      if (scope === "system") return "system"
      if (scope === "organization") return "org"
      return "user"
    },
    scopeIcon() {
      switch (this.scopeClass) {
        case "system": return "🌐"
        case "org": return "🏢"
        default: return "👤"
      }
    },
    scopeLabel() {
      const translationKey = `publish.publication.scope.${this.scopeClass}`
      const translated = this.$t(translationKey)
      if (translated === translationKey) {
        switch (this.scopeClass) {
          case "system": return "Modèle système"
          case "org": return "Organisation"
          default: return "Personnel"
        }
      }
      return translated
    },
    // Placeholder detection
    placeholders() {
      return this.template.placeholders || []
    },
    hasTitle() {
      return this.placeholders.some(p => p.toLowerCase().includes('title'))
    },
    hasDate() {
      return this.placeholders.some(p =>
        p.toLowerCase().includes('date') ||
        p.toLowerCase().includes('generated_at')
      )
    },
    hasParticipants() {
      return this.placeholders.some(p =>
        p.toLowerCase().includes('participant') ||
        p.toLowerCase().includes('speaker')
      )
    },
    hasSummary() {
      return this.placeholders.some(p => p.toLowerCase().includes('summary'))
    },
    hasOutput() {
      return this.placeholders.some(p => p.toLowerCase() === 'output')
    },
    hasKeyPoints() {
      return this.placeholders.some(p =>
        p.toLowerCase().includes('key_point') ||
        p.toLowerCase().includes('keypoint')
      )
    },
    hasActionItems() {
      return this.placeholders.some(p =>
        p.toLowerCase().includes('action') ||
        p.toLowerCase().includes('todo')
      )
    },
    hasTopics() {
      return this.placeholders.some(p => p.toLowerCase().includes('topic'))
    },
    isBasicTemplate() {
      // Template with minimal placeholders
      return this.placeholders.length <= 4 &&
             !this.hasKeyPoints &&
             !this.hasActionItems &&
             !this.hasTopics &&
             !this.hasParticipants
    },
    canDelete() {
      // Can only delete non-system templates
      return this.scopeClass !== "system"
    },
  },
  methods: {
    handleClick() {
      if (this.template.is_active !== false) {
        this.$emit("select", this.template)
      }
    },
    handleDelete() {
      this.$emit("delete", this.template)
    },
  },
}
</script>

<style scoped>
.template-card {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
  min-height: 260px;
}

.template-card:hover {
  border-color: var(--primary-color, #2196f3);
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.15);
  transform: translateY(-2px);
}

.template-card.selected {
  border-color: var(--primary-color, #2196f3);
  border-width: 2px;
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.2);
}

.template-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.template-card.disabled:hover {
  border-color: var(--border-color, #e0e0e0);
  box-shadow: none;
  transform: none;
}

/* Preview Area */
.template-preview {
  position: relative;
  height: 130px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.template-preview.preview-system {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.template-preview.preview-org {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.template-preview.preview-user {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

/* Mini document */
.preview-document {
  width: 100px;
  height: 115px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
}

/* Header with title and date */
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
  min-height: 14px;
}

.preview-title-bar {
  flex: 1;
  height: 5px;
  background: #333;
  border-radius: 2px;
}

.preview-date {
  flex-shrink: 0;
}

.date-icon {
  font-size: 8px;
  opacity: 0.7;
}

/* Participants row */
.preview-participants {
  display: flex;
  gap: 3px;
  padding: 2px 0;
}

.participant-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.participant-dot:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.participant-dot:nth-child(3) {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

/* Body content */
.preview-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
}

.preview-line {
  height: 3px;
  background: #ddd;
  border-radius: 1px;
  flex-shrink: 0;
}

.preview-line.full { width: 100%; }
.preview-line.long { width: 85%; }
.preview-line.medium { width: 65%; }
.preview-line.short { width: 45%; }

.preview-spacer {
  height: 3px;
  flex-shrink: 0;
}

/* Bullet points */
.preview-bullets {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 2px;
}

.preview-bullet-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.bullet {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--primary-color, #2196f3);
  flex-shrink: 0;
}

.bullet.action {
  background: #4caf50;
  width: 5px;
  height: 5px;
  border-radius: 1px;
}

/* Topic tags */
.preview-tags {
  display: flex;
  gap: 3px;
  margin-top: auto;
  flex-wrap: wrap;
}

.preview-tag {
  height: 6px;
  width: 18px;
  background: var(--primary-light, #e3f2fd);
  border-radius: 3px;
}

.preview-tag.short {
  width: 12px;
}

/* Scope badge */
.scope-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.scope-icon {
  font-size: 14px;
  line-height: 1;
}

/* Card Content */
.template-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #333);
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.template-description {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary, #666);
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

/* Footer */
.template-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color, #e0e0e0);
  margin-top: auto;
}

.scope-label {
  font-size: 11px;
  color: var(--text-secondary, #888);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.template-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.delete-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
}

.template-card:hover .delete-btn {
  opacity: 0.6;
  transform: scale(1);
}

.delete-btn:hover {
  opacity: 1 !important;
  background: rgba(244, 67, 54, 0.1);
}

.delete-icon {
  font-size: 14px;
  line-height: 1;
}

.template-action {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary-color, #2196f3);
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.2s ease;
}

.template-card:hover .template-action {
  opacity: 1;
  transform: translateX(0);
}

.action-arrow {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.template-card:hover .action-arrow {
  transform: translateX(2px);
}
</style>
