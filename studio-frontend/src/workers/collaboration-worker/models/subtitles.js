import * as Y from "yjs"
import { v4 as uuidv4 } from "uuid"

export class Subtitle {
  constructor(subtitleObj) {
    this.ydoc = new Y.Doc()
    this.users = []
    this.undoManagers = new Map()
    this.obj = subtitleObj ? subtitleObj : {}

    this.watchProperties = [this.ydoc.getArray("screens")]

    this.observeChange()

    if (subtitleObj) {
      this.initYjsFromObj(subtitleObj)
    }
  }

  observeChange() {
    this.getYdoc()
      .getArray("screens")
      .observeDeep(() => {
        this.updateObj("screens", this.getScreens())
      })
  }

  updateObj(key, value) {
    this.obj[key] = value
  }

  initYjsFromObj(subtitleObj) {
    this.ydoc.transact(() => {
      this.initScreens(subtitleObj.screens)
    }, "websocket")
  }

  initScreens(screens) {
    for (const screen of screens) {
      this.ydoc.getArray("screens").push([Subtitle.formatScreen(screen)])
    }
  }

  getObj() {
    return this.obj
  }

  setObj(obj) {
    this.obj = obj
  }

  getYdoc() {
    return this.ydoc
  }

  getScreens() {
    return this.ydoc.getArray("screens").toJSON()
  }

  getScreen(index) {
    return this.ydoc.getArray("screens").get(index).toJSON()
  }

  applyBinaryDelta(binaryDelta, transactionName, undo = false) {
    if (undo) {
      this.createUndoManager(transactionName)
    }

    try {
      this.ydoc.transact(() => {
        Y.applyUpdate(this.ydoc, new Uint8Array(binaryDelta))
      }, transactionName)
    } catch (error) {
      console.error(error)
    }
  }

  createUndoManager(transactionName) {
    if (!this.undoManagers.get(transactionName)) {
      this.undoManagers.set(
        transactionName,
        new Y.UndoManager(this.watchProperties, {
          trackedOrigins: new Set([transactionName]),
        })
      )
    }

    return this.undoManagers.get(transactionName)
  }

  destroy() {
    this.ydoc.destroy()
  }

  static formatScreen(screen) {
    const ywords = Y.Array.from(screen.words)
    const ytext = Y.Array.from(screen.text)
    const yscreen = new Y.Map(Object.entries(screen))
    yscreen.set("words", ywords)
    yscreen.set("text", ytext)
    return yscreen
  }

  static mergeUpdates(deltas) {
    return Y.mergeUpdates(deltas)
  }
}
