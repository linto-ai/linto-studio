import test from "ava"

import jsonSchemaToFields from "../jsonSchemaToFields.js"

test("jsonSchemaToFields", (t) => {
  const jsonSchema = {
    properties: {
      name: {
        title: "Name",
        title_en: "Name",
        title_fr: "Nom",
        type: "string",
      },
      age: { title: "Age", type: "number" },
    },
    required: ["name"],
  }

  const fields = jsonSchemaToFields(jsonSchema)

  t.deepEqual(fields, [
    {
      value: "",
      error: null,
      valid: false,
      loading: false,
      label: "Name",
      type: "text",
      required: true,
      key: "name",
    },
    {
      value: "",
      error: null,
      valid: false,
      loading: false,
      label: "Age",
      type: "number",
      required: false,
      key: "age",
    },
  ])
})

test("jsonSchemaToFields with lang", (t) => {
  const jsonSchema = {
    properties: {
      name: {
        title: "Name",
        title_en: "Name",
        title_fr: "Nom",
        type: "string",
      },
      age: { title: "Age", type: "number" },
    },
    required: ["name"],
  }

  const fields = jsonSchemaToFields(jsonSchema, "fr")

  t.deepEqual(fields, [
    {
      value: "",
      error: null,
      valid: false,
      loading: false,
      label: "Nom",
      type: "text",
      required: true,
      key: "name",
    },
    {
      value: "",
      error: null,
      valid: false,
      loading: false,
      label: "Age",
      type: "number",
      required: false,
      key: "age",
    },
  ])
})
