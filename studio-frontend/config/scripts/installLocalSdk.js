// Puts the worktree's own build of the editor into node_modules, in place of
// the published package — to try a transcript-ui change in the app without
// publishing it first.
//
// Copying the bundle is enough: @linto-ai/transcript-ui-webcomponent ships
// nothing but `dist`, declares no dependency, and its bundle has no bare
// import — Vue 3 and the rest are inlined at build time.
//
// The installed version is stamped as "-local" on purpose: `npm ls` then says
// out loud that this tree is not what package.json pins. It does NOT make the
// install reversible — npm goes by the lockfile and the presence of the
// directory, not by the version inside it, so neither `npm i` nor
// `npm i --force` puts the published package back. Only removing the package
// first does, which is what `npm run sdk:published` is for.
import {
  cpSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { execFileSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const frontend = path.resolve(here, "../..")
const sdk = path.resolve(frontend, "../studio-sdk/components/transcript-ui")
const source = path.join(sdk, "packages/webcomponent/dist")
const target = path.join(
  frontend,
  "node_modules/@linto-ai/transcript-ui-webcomponent",
)

function fail(message) {
  console.error(`[sdk:local] ${message}`)
  process.exit(1)
}

if (!existsSync(sdk)) fail(`no SDK checkout at ${sdk}`)
if (!existsSync(target))
  fail("the package is not installed — run `npm i` first")

console.log("[sdk:local] building the web component…")
execFileSync("bun", ["run", "build:wc"], { cwd: sdk, stdio: "inherit" })

if (!existsSync(source)) fail(`the build produced nothing at ${source}`)

cpSync(source, path.join(target, "dist"), { recursive: true })

const manifestPath = path.join(target, "package.json")
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
manifest.version = `${manifest.version.split("-")[0]}-local`
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

// Vite pre-bundles dependencies into node_modules/.vite and reuses that copy
// as long as the lockfile and the config are unchanged — which they are here,
// since only the file on disk moved. Without this the dev server keeps serving
// yesterday's editor and the change looks like it did not work.
rmSync(path.join(frontend, "node_modules/.vite"), {
  recursive: true,
  force: true,
})

console.log(
  `[sdk:local] installed as ${manifest.version}\n` +
    "[sdk:local] Vite's dependency cache was cleared — restart the dev server\n" +
    "[sdk:local] undo with: npm run sdk:published",
)
