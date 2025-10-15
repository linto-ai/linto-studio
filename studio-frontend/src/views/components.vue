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
    <FormInput :field="fieldInput" />
    <FormInput :field="fieldInputError" />
    <FormInput :field="fieldInputDisabled" disabled />
    <FormInput :field="fieldInputReadonly" readonly />
    <FormInput :field="dateTimeInput" />

    <PopoverList :items="popoverItems" v-model="popoverValue" class="relative">
      <!-- <template #trigger="{ open }">
        <Button variant="tertiary" size="sm"> {{ popoverValue }} </Button>
      </template> -->
    </PopoverList>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import FormInput from "../components/molecules/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import formatDateTimeToIso from "@/tools/date/formatDateTimeToIso"

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
        },
        {
          value: "select-value-4",
          text: "Banana",
          description: "Yellow and soft fruit",
        },
      ],
      popoverValue: "select-value-1",
    }
  },
  mounted() {
    console.log(
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleString(),
    )
  },
  methods: {},
  components: {
    FormInput,
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
