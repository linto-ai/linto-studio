import test from "ava"
import { listOrphanAudioFiles } from "../listOrphanAudioFiles.js"

function recorderFile(name) {
  return { directory: "TEMPORARY", path: `CapacitorAudioRecorder/${name}` }
}

test("listOrphanAudioFiles() lists the files no recording points to", (t) => {
  const orphans = listOrphanAudioFiles({
    files: [
      { file: recorderFile("kept.aac"), mtime: 10 },
      { file: recorderFile("orphan.aac"), mtime: 10 },
    ],
    referencedFiles: [recorderFile("kept.aac"), null],
    modifiedBefore: 100,
  })
  t.deepEqual(
    orphans.map(({ file }) => file),
    [recorderFile("orphan.aac")],
  )
})

test("listOrphanAudioFiles() does not take a moved file for the recorder's", (t) => {
  const orphans = listOrphanAudioFiles({
    files: [{ file: recorderFile("same.aac"), mtime: 10 }],
    referencedFiles: [{ directory: "DATA", path: "recordings/same.aac" }],
    modifiedBefore: 100,
  })
  t.is(orphans.length, 1)
})

test("listOrphanAudioFiles() leaves a file modified since the load began", (t) => {
  const orphans = listOrphanAudioFiles({
    files: [{ file: recorderFile("starting.aac"), mtime: 150 }],
    referencedFiles: [],
    modifiedBefore: 100,
  })
  t.deepEqual(orphans, [])
})
