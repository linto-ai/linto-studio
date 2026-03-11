<template>
  <GenericTable
    :columns="columns"
    :content="transcriberProfilesList"
    :loading="loading"
    :sortListKey="sortListKey"
    :sortListDirection="sortListDirection"
    :selectable="true"
    :selectedRows="selectedIds"
    idKey="id"
    @list_sort_by="sortBy"
    @update:selectedRows="onSelectionChange">
    <template #header-organizationId>
      <span class="icon work" />
    </template>
    <template #cell-organizationId="{ element }">
      <span v-if="element.organizationId !== null" class="icon apply" />
      <span v-else class="icon close" />
    </template>
    <template #cell-config.name="{ element }">
      <span class="clickable" @click="onEdit(element.id)">{{ element.config.name }}</span>
    </template>
    <template #cell-config.description="{ element }">
      <span class="clickable" @click="onEdit(element.id)">{{ element.config.description }}</span>
    </template>
    <template #cell-config.languages.0.candidate="{ element }">
      <span class="clickable" @click="onEdit(element.id)">{{ formatLanguages(element) }}</span>
    </template>
    <template #cell-actions="{ element }">
      <Button
        @click="onEdit(element.id)"
        variant="secondary"
        icon="pencil"
        label="Edit" />
    </template>
  </GenericTable>
</template>
<script>
import GenericTable from "@/components/molecules/GenericTable.vue"

export default {
  props: {
    transcriberProfilesList: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    sortListKey: {
      type: String,
      required: false,
      default: "name",
    },
    sortListDirection: {
      type: String,
      required: false,
      default: "asc",
    },
  },
  computed: {
    columns() {
      return [
        { key: "organizationId", label: "", width: "auto" },
        { key: "config.name", label: this.$t("session.profile_selector.labels.name"), width: "1fr" },
        { key: "config.description", label: this.$t("session.profile_selector.labels.description"), width: "1fr" },
        { key: "config.languages.0.candidate", label: this.$t("session.profile_selector.labels.languages"), width: "1fr" },
        { key: "actions", label: "", width: "auto" },
      ]
    },
    selectedIds() {
      return this.value
    },
  },
  methods: {
    sortBy(event) {
      this.$emit("list_sort_by", event)
    },
    onEdit(profileId) {
      this.$emit("edit", profileId)
    },
    onSelectionChange(ids) {
      this.$emit("input", ids)
    },
    formatLanguages(profile) {
      const langs = profile.config.languages.map((lang) => lang.candidate)
      return langs.join(", ")
    },
  },
  components: {
    GenericTable,
  },
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
}
</style>
