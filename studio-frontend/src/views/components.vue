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
  </div>
</template>
<script>
import { bus } from "@/main.js"
import FormInput from "../components/molecules/FormInput.vue"
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
    }
  },
  mounted() {},
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
