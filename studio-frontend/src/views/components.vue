<template>
  <div class="main-container flex col gap-small">
    <h1>Linto components</h1>
    <div>
      <Button variant="primary" label="primary button" />
    </div>
    <div>
      <Button variant="secondary" label="secondary button" />
    </div>
    <div>
      <Button
        variant="primary"
        intent="destructive"
        label="destructive primary button" />
    </div>
    <div>
      <Button
        variant="secondary"
        intent="destructive"
        label="destructive secondary button" />
    </div>
    <div>
      <Button label="Download" icon="download" />
    </div>

    <h3>Avatar - content (src / icon / text / emoji / fallback slot)</h3>
    <div class="flex gap-small align-center">
      <Avatar src="/pictures/missing.jpg" text="?" />
      <Avatar icon="house" />
      <Avatar text="TD" />
      <Avatar emoji="1f600" />
      <Avatar><ph-icon name="star" /></Avatar>
    </div>
    <p class="components-hint">
      The first one points at a missing image on purpose — it falls back to
      the default avatar picture (AvatarImage's own error handling).
    </p>

    <h3>Avatar - tone (primary / soft / neutral)</h3>
    <div class="flex gap-small align-center">
      <Avatar icon="house" tone="primary" />
      <Avatar icon="house" tone="soft" />
      <Avatar icon="house" tone="neutral" />
    </div>
    <div class="flex gap-small align-center">
      <Avatar text="TD" tone="primary" />
      <Avatar text="TD" tone="soft" />
      <Avatar text="TD" tone="neutral" />
    </div>

    <h3>Avatar - size (xs / sm / md / lg / xl) and circle</h3>
    <div class="flex gap-small align-center">
      <Avatar icon="house" tone="soft" size="xs" />
      <Avatar icon="house" tone="soft" size="sm" />
      <Avatar icon="house" tone="soft" size="md" />
      <Avatar icon="house" tone="soft" size="lg" />
      <Avatar icon="house" tone="soft" size="xl" />
      <Avatar text="TD" tone="primary" size="xl" circle />
    </div>

    <h3>PhIcon - size="auto" inherits the ambient font-size</h3>
    <div class="flex gap-small align-center">
      <span style="font-size: 1rem">
        <ph-icon name="star" size="auto" />
      </span>
      <span style="font-size: 2rem">
        <ph-icon name="star" size="auto" />
      </span>
      <span style="font-size: 3rem">
        <ph-icon name="star" size="auto" />
      </span>
    </div>
    <p class="components-hint">
      No explicit size prop passed to any of the 3 icons above — each one
      follows the font-size of its own wrapper (1rem / 2rem / 3rem).
    </p>

    <FormInput :field="fieldInput" />
    <FormInput :field="fieldInputError" />
    <FormInput :field="fieldInputDisabled" disabled />
    <FormInput :field="fieldInputReadonly" readonly />
    <FormInput :field="dateTimeInput" />

    <h3>FormInput - leading icon (field.leadingIcon)</h3>
    <FormInput :field="fieldInputIcon" :inputFullWidth="true" />
    <FormInput :field="fieldInputIconError" :inputFullWidth="true" />
    <FormInput :field="fieldInputIconDisabled" disabled :inputFullWidth="true" />
    <DurationInput :field="fieldDuration" v-model="fieldDuration.value" />
    <PopoverList :items="popoverItems" v-model="popoverValue" class="relative">
      <!-- <template #trigger="{ open }">
        <Button variant="tertiary" size="sm"> {{ popoverValue }} </Button>
      </template> -->
    </PopoverList>
    <PopoverList
      :items="popoverItems"
      v-model="popoverMultiValue"
      selection
      multiple
      searchable
      :closeOnItemClick="false"
      class="relative">
      <template #trigger="{ open }">
        <Button :iconRight="open ? 'caret-up' : 'caret-down'">
          {{ popoverMultiValue.length }} fruits sélectionnés
        </Button>
      </template>
    </PopoverList>
    <PopoverList
      :items="popoverItems"
      v-model="popoverSearchValue"
      searchable
      aria-label="Rechercher un fruit"
      class="relative">
      <template #trigger="{ open }">
        <Button :iconRight="open ? 'caret-up' : 'caret-down'">
          Avec recherche: {{ popoverSearchValue || "Aucun" }}
        </Button>
      </template>
    </PopoverList>
    <OrgaRoleSelector v-model="role" />
    <OrgaRoleSelector v-model="role" readonly />
    <div class="flex col gap-tiny">
      <span>SegmentedControl - value: {{ segmentedValue }}</span>
      <SegmentedControl v-model="segmentedValue" :options="segmentedOptions" />
    </div>
    <div class="flex col gap-tiny">
      <span>OrganizationSelector - value: {{ organizationId }}</span>
      <OrganizationSelector
        v-model="organizationId"
        :pinnedItems="organizationPinnedItems"
        searchPlaceholder="Rechercher une organisation" />
    </div>
    <GenericTable
      :content="tableContent"
      :columns="tableColumns"
      sortListDirection="asc"
      sortListKey="name">
      <template #cell-role="{ value }">
        <OrgaRoleSelector v-model="value" readonly />
      </template>
      <template #cell-actions="{ value }">
        <Button label="a button" />
      </template>
    </GenericTable>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import FormInput from "../components/molecules/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import formatDateTimeToIso from "@/tools/date/formatDateTimeToIso"
import DurationInput from "@/components/molecules/DurationInput.vue"
import OrgaRoleSelector from "@/components/molecules/OrgaRoleSelector.vue"
import OrganizationSelector from "@/components/molecules/OrganizationSelector.vue"
import GenericTable from "@/components/molecules/GenericTable.vue"
import SegmentedControl from "@/components/molecules/SegmentedControl.vue"
export default {
  props: {},
  data() {
    return {
      fieldInput: {
        label: "Type your name",
        error: null,
      },
      fieldInputError: {
        label: "Type your name",
        error: "This field is required",
      },
      fieldInputDisabled: {
        label: "Type your name",
        error: null,
        value: "i'm disabled",
      },
      fieldInputReadonly: {
        label: "Type your name",
        error: null,
        value: "i'm read only",
      },
      fieldInputIcon: {
        ...EMPTY_FIELD,
        label: "Lien de la visioconférence",
        placeholder: "https://meet.jit.si/...",
        leadingIcon: "link",
      },
      fieldInputIconError: {
        ...EMPTY_FIELD,
        label: "Lien de la visioconférence",
        placeholder: "https://meet.jit.si/...",
        leadingIcon: "link",
        error: "Lien invalide",
      },
      fieldInputIconDisabled: {
        ...EMPTY_FIELD,
        label: "Lien de la visioconférence",
        value: "https://meet.jit.si/LinagoraWeeklySync",
        leadingIcon: "link",
      },
      dateTimeInput: {
        ...EMPTY_FIELD,
        value: formatDateTimeToIso(
          new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        ),
        label: "Une date dans le futur",
        type: "datetime-local",
        customParams: {
          min: formatDateTimeToIso(new Date()),
        },
      },
      fieldDuration: {
        label: "duration",
        value: "7d",
      },
      popoverItems: [
        {
          value: "select-value-1",
          text: "Pineapple",
          description: "Sweet and tangy tropical fruit",
        },
        {
          value: "select-value-2",
          text: "Orange",
          description: "Citrusy and refreshing",
        },
        {
          value: "select-value-3",
          text: "Apple",
          description: "Crisp and juicy fruit",
          icon: "apple-logo",
        },
        {
          value: "select-value-4",
          text: "Banana",
          description: "Yellow and soft fruit",
        },
      ],
      popoverValue: "select-value-1",
      popoverMultiValue: ["select-value-1", "select-value-3"],
      popoverSearchValue: null,
      organizationId: null,
      organizationPinnedItems: [
        {
          value: null,
          text: "Plateforme globale",
          icon: "globe-hemisphere-west",
        },
      ],
      role: 1,
      segmentedValue: "week",
      segmentedOptions: [
        { name: "day", label: "Jour" },
        { name: "week", label: "Semaine" },
        { name: "month", label: "Mois" },
      ],
      tableContent: [
        { _id: "1", name: "Alfred", role: 1 },
        { _id: "2", name: "Quentin", role: 2 },
      ],
      tableColumns: [
        { key: "name", label: "Nom", sortable: true, width: "1fr" },
        {
          key: "role",
          label: "Rôle",
          sortable: true,
          width: "1fr",
        },
        {
          key: "actions",
          width: "auto",
        },
      ],
    }
  },
  mounted() {},
  methods: {},
  components: {
    FormInput,
    DurationInput,
    OrgaRoleSelector,
    OrganizationSelector,
    GenericTable,
    SegmentedControl,
  },
}
</script>

<style lang="scss" scoped>
.main-container {
  background-color: var(--background-primary);
  width: 500px;
  margin: auto;
  padding: 50px;
  box-shadow: var(--shadow-5);
}

.components-hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
}
</style>
