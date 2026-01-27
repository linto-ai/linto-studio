<template>
  <PopoverList
    :items="exportItems"
    @click="onItemClick"
    color="neutral"
    class="kpi-export-dropdown">
    <template #trigger>
      <Button
        icon="download-simple"
        variant="secondary"
        :loading="exporting">
        {{ $t("session_kpi.export.button") }}
      </Button>
    </template>
  </PopoverList>
</template>

<script>
import { mapActions } from "vuex"
import Button from "@/components/atoms/Button.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import { exportKpiSessions } from "@/api/kpi"

export default {
  name: "KpiExportDropdown",
  components: { Button, PopoverList },
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
      exporting: false,
    }
  },
  computed: {
    exportItems() {
      return [
        { id: "json", name: "JSON", icon: "brackets-curly" },
        { id: "csv", name: "CSV", icon: "file-csv" },
        { id: "xls", name: "Excel (XLSX)", icon: "file-xls" },
      ]
    },
  },
  methods: {
    ...mapActions("system", ["showSuccess", "showError"]),
    onItemClick(item) {
      if (!this.exporting) {
        this.handleExport(item.id)
      }
    },
    async handleExport(format) {
      this.exporting = true

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
  display: inline-flex;
}
</style>
