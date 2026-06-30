<template>
  <PopoverList
    :asyncSearch="searchOrganizations"
    :value="value"
    :selectedItems="selectedItems"
    :pinnedItems="pinnedItems"
    :searchPlaceholder="searchPlaceholder"
    selection
    :overlay="false"
    class="organization-selector"
    @input="$emit('input', $event)" />
</template>

<script>
import { apiGetAllOrganizations } from "@/api/admin.js"
import { apiGetOrganizationById } from "@/api/organisation.js"

export default {
  name: "OrganizationSelector",
  props: {
    /**
     * Selected organization id, or null for the "global" entry.
     */
    value: {
      type: String,
      default: null,
    },
    /**
     * Items pinned at the top of the list (e.g. a "platform global" entry with
     * value: null). Same shape as PopoverList items.
     */
    pinnedItems: {
      type: Array,
      default: () => [],
    },
    searchPlaceholder: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      // Cache of organization objects already known (from searches or hydration),
      // formatted as PopoverList items. Lets the trigger resolve the selected
      // name without reloading the whole list.
      knownItems: [],
    }
  },
  computed: {
    /**
     * Selected organization object, so PopoverList can render its name in the
     * default trigger before any search. Pinned entries (e.g. global) are
     * resolved by PopoverList itself.
     */
    selectedItems() {
      return this.knownItems.filter((item) => item.value === this.value)
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (value == null) return
        const known =
          this.pinnedItems.some((item) => item.value === value) ||
          this.knownItems.some((item) => item.value === value)
        if (!known) this.hydrate(value)
      },
    },
  },
  methods: {
    formatOrganization(organization) {
      return {
        value: organization._id,
        text: organization.name,
        icon: "buildings",
        iconWeight: "regular",
      }
    },
    cacheItems(items) {
      for (const item of items) {
        if (!this.knownItems.some((known) => known.value === item.value)) {
          this.knownItems.push(item)
        }
      }
    },
    async searchOrganizations(query) {
      const { list } = await apiGetAllOrganizations(
        0,
        { hidePersonal: true },
        query,
      )
      const items = (list ?? []).map((org) => this.formatOrganization(org))
      this.cacheItems(items)
      return items
    },
    /**
     * Resolve a single organization name from its id (edit mode, before the
     * user has searched anything).
     */
    async hydrate(id) {
      const organization = await apiGetOrganizationById(id)
      if (organization) this.cacheItems([this.formatOrganization(organization)])
    },
  },
}
</script>

<style lang="scss">
.organization-selector {
  display: inline-flex;
  max-width: 100%;
}
</style>
