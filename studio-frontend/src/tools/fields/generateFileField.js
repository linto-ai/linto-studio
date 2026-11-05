import EMPTY_FIELD from "@/const/emptyField"
import { testFile } from "@/tools/fields/testFile"
import { generateId } from "@/tools/generateId.js"

export function generateFileField(name, file) {
  return {
    ...EMPTY_FIELD,
    value: name,
    file: file,
    testField: testFile,
    id: generateId(),
  }
}
