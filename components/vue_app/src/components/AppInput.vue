<template>
  <div class="flex col">
    <span class="form__label">{{ label }} :</span>
    <input
      :type="type || 'text'"
      class="form__input"
      v-model="obj.value"
      :class="[obj.error !== null ? 'form__input--error' : '', obj.valid ? 'form__input--valid' : '']"
      @blur="exec(test)"
    />
    <span class="form__error-field">{{ obj.error }}</span>
  </div>
</template>
<script>
export default {
  props: ['label', 'obj', 'test'],
  data () {
    return {}
  },

  methods: {
    testEmail (obj) {
      this.$options.filters.testEmail(obj)
    },
    testName (obj) {
      this.$options.filters.testName(obj)
    },
    exec (functionName) {
      switch(functionName) {
        case 'testName':
          this.testName(this.obj)
          break
        case 'testEmail':
          this.testEmail(this.obj)
          break
        default:
          return
      }
    }
  }
}
</script>
