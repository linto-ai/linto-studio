<template>
  <div class="kpi-export-dropdown">
    <Popover v-model="isOpen">
      <template #trigger>
        <Button
          icon="download-simple"
          variant="secondary"
          :loading="exporting">
          {{ $t("session_kpi.export.button") }}
        </Button>
      </template>
      <template #content>
        <div class="kpi-export-dropdown__menu">
          <button
            class="kpi-export-dropdown__item"
            @click="handleExport('json')"
            :disabled="exporting">
            <PhIcon name="brackets-curly" />
            <span>JSON</span>
          </button>
          <button
            class="kpi-export-dropdown__item"
            @click="handleExport('csv')"
            :disabled="exporting">
            <PhIcon name="file-csv" />
            <span>CSV</span>
          </button>
          <button
            class="kpi-export-dropdown__item"
            @click="handleExport('xls')"
            :disabled="exporting">
            <PhIcon name="file-xls" />
            <span>Excel (XLSX)</span>
          </button>
        </div>
      </template>
    </Popover>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import Button from "@/components/atoms/Button.vue"
import Popover from "@/components/atoms/Popover.vue"
import PhIcon from "@/components/atoms/PhIcon.vue"
import { exportKpiSessions } from "@/api/kpi"

export default {
  name: "KpiExportDropdown",
  components: { Button, Popover, PhIcon },
  props: {
    organizationId: {
      type: String,
      default: null,
    },
    startDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isOpen: false,
      exporting: false,
    }
  },
  methods: {
    ...mapActions("system", ["showSuccess", "showError"]),
    async handleExport(format) {
      this.exporting = true
      this.isOpen = false

      try {
        const blob = await exportKpiSessions(format, {
          organizationId: this.organizationId,
          startDate: this.startDate,
          endDate: this.endDate,
        })

        if (!blob) {
          this.showError(this.$t("session_kpi.export.error"))
          return
        }

        // Create download link
        const dateStr = new Date().toISOString().split("T")[0]
        const extension = format === "xls" ? "xlsx" : format
        const filename = `kpi-sessions-${dateStr}.${extension}`

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        this.showSuccess(this.$t("session_kpi.export.success"))
      } catch (error) {
        console.error("Export error:", error)
        this.showError(this.$t("session_kpi.export.error"))
      } finally {
        this.exporting = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.kpi-export-dropdown {
  &__menu {
    display: flex;
    flex-direction: column;
    min-width: 160px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: 0.875rem;
    color: var(--color-text-primary);
    transition: background-color 0.15s ease;
    width: 100%;

    &:hover:not(:disabled) {
      background-color: var(--color-background-secondary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ph-icon {
      font-size: 1.125rem;
      color: var(--color-text-secondary);
    }
  }
}
</style>
