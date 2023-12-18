import EMPTY_FIELD from "@/const/emptyField"
import { testFile } from "@/tools/fields/testFile"

export function generateFileField(name, file) {
  return {
    ...EMPTY_FIELD,
    value: name,
    file: file,
    testField: testFile,
  }
}
