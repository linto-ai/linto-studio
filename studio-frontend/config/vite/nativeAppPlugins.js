// Plugins of the native app build (vite.app.config.js).
import fs from "fs"
import path from "path"

// Capacitor loads index.html: the mobile entry page is renamed once written
// (Vite emits HTML pages after the other plugins' bundle hooks).
export function renameEntryPage({ from, to }) {
  let outDir = ""
  return {
    name: "linto-rename-entry-page",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    writeBundle() {
      fs.renameSync(path.join(outDir, from), path.join(outDir, to))
    },
  }
}

// Root-absolute paths to files of public/ ("/img/linto.svg",
// "/fonts/atkinson.css"…) quoted in a built file. Pure, so the copy step
// only decides what to do with them.
export function findPublicReferences(text) {
  const pattern =
    /["'(]\/((?:img|fonts)\/[\w\-./]+\.(?:svg|png|jpe?g|webp|ico|css|woff2?|ttf)|config\.js)["')]/g
  return [...text.matchAll(pattern)].map((match) => match[1])
}

// url(...) targets of a stylesheet, resolved against the stylesheet's own
// folder: the font files a font-face CSS loads.
export function findStylesheetUrls(css, stylesheetPath) {
  const folder = path.posix.dirname(stylesheetPath)
  return [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)]
    .map((match) => match[1])
    .filter((url) => !/^(data:|https?:|\/)/.test(url))
    .map((url) => path.posix.join(folder, url))
}

// The classic app's public/ folder is several megabytes the mobile front
// never uses: Vite's copy is turned off (copyPublicDir: false) and only the files
// the built mobile front refers to are copied, with the fonts their
// stylesheets load. A referenced file missing from public/ fails the build.
export function copyReferencedPublicFiles({ publicDir, alwaysCopy = [] }) {
  let outDir = ""
  return {
    name: "linto-copy-referenced-public-files",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    // Also called when the build fails: nothing to copy then.
    closeBundle(error) {
      if (error || !fs.existsSync(outDir)) return
      const wanted = new Set(alwaysCopy)
      for (const file of listFiles(outDir)) {
        if (/\.(html|js|css)$/.test(file)) {
          const text = fs.readFileSync(file, "utf8")
          findPublicReferences(text).forEach((ref) => wanted.add(ref))
        }
      }
      for (const ref of [...wanted]) {
        if (ref.endsWith(".css")) {
          const css = fs.readFileSync(path.join(publicDir, ref), "utf8")
          findStylesheetUrls(css, ref).forEach((url) => wanted.add(url))
        }
      }
      for (const ref of wanted) {
        copyPublicFile(publicDir, outDir, ref)
      }
    },
  }
}

function copyPublicFile(publicDir, outDir, ref) {
  const source = path.join(publicDir, ref)
  if (!fs.existsSync(source)) {
    throw new Error(
      `public file referenced by the mobile front is missing: ${ref}`,
    )
  }
  const target = path.join(outDir, ref)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target)
}

function listFiles(folder) {
  return fs
    .readdirSync(folder, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name))
}
