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
    <FormInput :field="fieldInput" />
    <FormInput :field="fieldInputError" />
    <FormInput :field="fieldInputDisabled" disabled />
    <FormInput :field="fieldInputReadonly" readonly />
    <FormInput :field="dateTimeInput" />
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
          Avec recherche: {{ popoverSearchValue || 'Aucun' }}
        </Button>
      </template>
    </PopoverList>
    <OrgaRoleSelector v-model="role" />
    <OrgaRoleSelector v-model="role" readonly />
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
import GenericTable from "@/components/molecules/GenericTable.vue"
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
      role: 1,
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
    GenericTable,
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
</style>
