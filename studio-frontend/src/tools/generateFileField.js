import EMPTY_FIELD from "@/const/emptyField"
import { testFile } from "@/tools/fields/testFile"
import { generateId } from "@/tools/generateId.js"

export function generateFileField(name, file, uploadType = "file") {
  return {
    ...EMPTY_FIELD,
    value: name,
    file: file,
    testField: testFile,
    id: generateId(),
    progress: 0,
    uploadType,
  }
}
