import test from "ava"
import { listOrphanAudioFiles } from "../listOrphanAudioFiles.js"

const CACHE = "file:///data/user/0/app/cache/capacitor-audio-recorder"
const DATA = "file:///data/user/0/app/files/recordings"

test("listOrphanAudioFiles() lists the files no recording points to", (t) => {
  const orphans = listOrphanAudioFiles({
    files: [
      { uri: `${CACHE}/kept.aac`, mtime: 10 },
      { uri: `${CACHE}/orphan.aac`, mtime: 10 },
    ],
    referencedUris: [`${CACHE}/kept.aac`, null],
    modifiedBefore: 100,
  })
  t.deepEqual(
    orphans.map((file) => file.uri),
    [`${CACHE}/orphan.aac`],
  )
})

test("listOrphanAudioFiles() matches a file by its name", (t) => {
  const orphans = listOrphanAudioFiles({
    files: [{ uri: `${CACHE}/moved.aac`, mtime: 10 }],
    referencedUris: [`${DATA}/moved.aac`],
    modifiedBefore: 100,
  })
  t.deepEqual(orphans, [])
})

test("listOrphanAudioFiles() leaves a file modified since the load began", (t) => {
  const orphans = listOrphanAudioFiles({
    files: [{ uri: `${CACHE}/starting.aac`, mtime: 150 }],
    referencedUris: [],
    modifiedBefore: 100,
  })
  t.deepEqual(orphans, [])
})
