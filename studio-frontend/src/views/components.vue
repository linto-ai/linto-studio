<template>
  <div class="main-container flex col gap-small">
    <h1>Linto components</h1>
    <div class="flex gap-medium">
      <Button variant="primary" label="primary button" icon="users" />
      <Button variant="primary" size="sm" label="small" icon="users" />
    </div>
    <div>
      <Button variant="secondary" label="secondary button" icon="users" />
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

    <h3>Headings - h1 to h5</h3>
    <div class="flex col gap-tiny">
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
    </div>
    <p class="components-hint">
      h1-h4 have a real theme style (themes/LinTO-green/style/text.scss). h5 has
      none — plain browser default. In practice, h4 is rarely used as-is: see
      the 3 utility classes below, which is what most screens actually reach for
      on top of it.
    </p>

    <h3>h4 utility classes - .field-label / .card-title / .section-caption</h3>
    <div class="flex col gap-small">
      <h4 class="field-label">Field label (FormInput)</h4>
      <h4 class="card-title">Card title (template name, sub-section)</h4>
      <h4 class="section-caption">Section caption (muted, above a list)</h4>
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
      The first one points at a missing image on purpose — it falls back to the
      default avatar picture (AvatarImage's own error handling).
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

    <h3>Avatar - padded (room around the icon)</h3>
    <div class="flex gap-small align-center">
      <Avatar icon="microphone" size="md" circle />
      <Avatar icon="microphone" size="md" circle padded />
      <Avatar icon="microphone" size="xl" circle />
      <Avatar icon="microphone" size="xl" circle padded />
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

    <h3>PackOffer - a pack to buy (radio, v-model)</h3>
    <fieldset class="components-pack-row">
      <PackOffer
        v-for="pack in demoPackOffers"
        :key="pack.packKey"
        v-model="demoSelectedPackKey"
        name="demo-pack"
        :pack="pack" />
    </fieldset>
    <p class="components-hint">
      Chosen: {{ demoSelectedPackKey }}. The card rings itself from the radio it
      holds (:has(:checked)): click a card or use the arrow keys.
    </p>

    <h3>PackLot - a bought pack (in use / offered / files / spent)</h3>
    <div class="components-pack-row">
      <PackLot v-for="lot in demoPackLots" :key="lot.id" :lot="lot" />
    </div>

    <FormInput :field="fieldInput" />
    <FormInput :field="fieldInputError" />
    <FormInput :field="fieldInputDisabled" disabled />
    <FormInput :field="fieldInputReadonly" readonly />
    <FormInput :field="dateTimeInput" />

    <h3>FormInput - leading icon (field.leadingIcon)</h3>
    <FormInput :field="fieldInputIcon" :inputFullWidth="true" />
    <FormInput :field="fieldInputIconError" :inputFullWidth="true" />
    <FormInput
      :field="fieldInputIconDisabled"
      disabled
      :inputFullWidth="true" />
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
import PackLot from "@/components-cloud/PackLot.vue"
import PackOffer from "@/components-cloud/PackOffer.vue"
import { computePackGroups } from "@/tools/computePackGroups"
import { computePackLots } from "@/tools/computePackLots"

// Catalog-shaped packs and API-shaped lots, for the pack cards below
const DEMO_PACKS = [
  { packKey: "live_5h", kind: "live", minutes: 300, amountCents: 4500 },
  { packKey: "live_20h", kind: "live", minutes: 1200, amountCents: 16000 },
  { packKey: "live_50h", kind: "live", minutes: 3000, amountCents: 35000 },
  {
    packKey: "transcription_5h",
    kind: "transcription",
    minutes: 300,
    amountCents: 1000,
  },
].map((pack) => ({ ...pack, currency: "eur" }))
const DEMO_LOTS = [
  {
    _id: "in-use",
    kind: "live",
    source: "stripe",
    minutes: 1200,
    remaining: 740,
  },
  {
    _id: "offered",
    kind: "live",
    source: "welcome",
    minutes: 16,
    remaining: 16,
  },
  {
    _id: "files",
    kind: "transcription",
    source: "stripe",
    minutes: 300,
    remaining: 225,
  },
  { _id: "spent", kind: "live", source: "stripe", minutes: 300, remaining: 0 },
].map((lot) => ({
  ...lot,
  created: "2026-03-12T12:00:00Z",
  expiresAt: "2099-03-12T12:00:00Z",
}))
export default {
  props: {},
  data() {
    return {
      demoPackOffers: computePackGroups(DEMO_PACKS).flatMap(
        (group) => group.packs,
      ),
      demoSelectedPackKey: "live_5h",
      demoPackLots: computePackLots(DEMO_LOTS),
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
    PackLot,
    PackOffer,
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

.components-pack-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--medium-gap);
  margin: 0;
  padding: var(--tiny-gap);
  border: none;
}

.components-hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
}
</style>
