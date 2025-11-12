// import browserEnv from "browser-env"

// browserEnv()

import { JSDOM } from "jsdom"

const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`)

global.window = dom.window
global.document = dom.window.document
