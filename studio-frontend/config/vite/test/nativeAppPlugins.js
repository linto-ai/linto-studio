import test from "ava"
import {
  findPublicReferences,
  findStylesheetUrls,
} from "../nativeAppPlugins.js"

test("findPublicReferences() finds quoted public files", (t) => {
  const html = `<link rel="icon" href="/img/linto.svg" />
    <link href="/fonts/Noto_Sans/noto.css" rel="stylesheet" />
    <script src="/config.js"></script>`
  t.deepEqual(findPublicReferences(html), [
    "img/linto.svg",
    "fonts/Noto_Sans/noto.css",
    "config.js",
  ])
})

test("findPublicReferences() reads JS strings and CSS urls", (t) => {
  const code = `a="/img/pwa/icon-192.png";b='/img/logo-visio/jitsi.png';c=url(/img/x.webp)`
  t.deepEqual(findPublicReferences(code), [
    "img/pwa/icon-192.png",
    "img/logo-visio/jitsi.png",
    "img/x.webp",
  ])
})

test("findPublicReferences() ignores other paths", (t) => {
  t.deepEqual(
    findPublicReferences(`"/assets/main.js" "/api/users" "img/x.svg"`),
    [],
  )
})

test("findStylesheetUrls() resolves fonts next to their stylesheet", (t) => {
  const css = `src: url(NotoSans.woff2) format("woff2");
    src: url("data:font/woff2;base64,AAA");
    src: url('/fonts/abs.woff2');`
  t.deepEqual(findStylesheetUrls(css, "fonts/Noto_Sans/noto.css"), [
    "fonts/Noto_Sans/NotoSans.woff2",
  ])
})
