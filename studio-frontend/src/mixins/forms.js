export const formsMixin = {
  methods: {
    testFields(fieldsToTest = this.fields) {
      this.debug("testing fields %o", fieldsToTest)
      return fieldsToTest.every((fieldName) => {
        const res = this.testSingleField(this[fieldName])
        this.debug("field %s is valid: %s", fieldName, res)
        return res
      })
    },
    testSingleField(field) {
      if (typeof field === "object" && field.length !== undefined) {
        return field.every((field) => this.testSingleField(field))
      }

      // maybe check if testField is a function and display warning if not

      if (!field.testField) {
        return true
      }

      return field.testField(field, this.$i18n.t.bind(this.$i18n))
    },
  },
}
