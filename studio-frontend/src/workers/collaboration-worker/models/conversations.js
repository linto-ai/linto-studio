import * as Y from "yjs"
import { v4 as uuidv4 } from "uuid"

export class Conversation {
  constructor(conversationObj) {
    this.ydoc = new Y.Doc()
    this.obj = conversationObj ? conversationObj : {}
    this.users = []
    this.undoManagers = new Map()

    this.watchProperties = [
      this.ydoc.getText("name"),
      this.ydoc.getText("description"),
      this.ydoc.getArray("speakers"),
      this.ydoc.getArray("text"),
      this.ydoc.getMap("organization"),
    ]

    this.observeChange()

    if (conversationObj) {
      this.initYjsFromObj(conversationObj)
    }
  }

  observeChange() {
    this.getYdoc()
      .getText("name")
      .observe(() => {
        this.updateObj("name", this.getConversationName())
      })

    this.getYdoc()
      .getText("description")
      .observe(() => {
        this.updateObj("description", this.getConversationDescription())
      })

    this.getYdoc()
      .getArray("speakers")
      .observeDeep(() => {
        this.updateObj("speakers", this.getSpeakers())
      })

    this.getYdoc()
      .getArray("text")
      .observeDeep(() => {
        this.updateObj("text", this.getConversationText())
      })

    this.getYdoc()
      .getMap("organization")
      .observeDeep(() => {
        this.updateObj("organization", this.getConversationOrga())
      })
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

  undo(transactionName) {
    this.undoManagers.get(transactionName).undo()
  }

  deleteUndoManager(transactionName) {
    const undoManager = this.undoManagers.get(transactionName)
    if (undoManager) {
      undoManager.stopCapturing()
      undoManager.clear()
      this.undoManagers.delete(transactionName)
    }
  }

  encodeStateVector() {
    return Y.encodeStateAsUpdate(this.ydoc)
  }

  updateObj(key, value) {
    this.obj[key] = value
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

  getConversationName() {
    return this.ydoc.getText("name").toString()
  }

  getConversationDescription() {
    return this.ydoc.getText("description").toString()
  }

  getConversationText() {
    return this.ydoc.getArray("text").toJSON()
  }

  getSpeakers() {
    return this.ydoc.getArray("speakers").toJSON()
  }

  getConversationOrga() {
    return this.ydoc.getMap("organization").toJSON()
  }

  initYjsFromObj(conversationObj) {
    this.ydoc.getText("name").insert(0, conversationObj.name)
    this.ydoc.getText("description").insert(0, conversationObj.description)

    this.initSpeakers(conversationObj.speakers)
    this.initText(conversationObj.text)
    this.initOrganization(conversationObj.organization)
  }

  initText(text) {
    for (const turn of text) {
      this.ydoc.getArray("text").push([Conversation.formatYturn(turn)])
    }
  }

  initSpeakers(speakers) {
    try {
      for (let spk of speakers) {
        let ySpk = { ...spk, speaker_name: new Y.Text() }
        ySpk.speaker_name.insert(0, spk.speaker_name)
        let yspeaker = new Y.Map(Object.entries(ySpk))
        this.ydoc.getArray("speakers").push([yspeaker])
      }
    } catch (error) {
      console.error(error)
    }
  }

  initOrganization(orga) {
    const yorga = this.ydoc.getMap("organization")
    yorga.set("organizationId", orga?.organizationId)
    yorga.set("membersRight", orga?.membersRight)
    yorga.set("customRights", orga?.customRights)
  }

  listUsers() {
    return this.users
  }

  getUserById(userId) {
    return this.users[userId]
  }

  addUser(userId) {
    this.users[userId] = new User(userId)
    return this.users[userId]
  }

  removeUser(userId) {
    this.users[userId] = null
  }

  destroy() {
    this.ydoc.destroy()
    delete this.obj
    this.obj = {}
  }

  updateUsers(userId, inputField) {
    this.users[userId].inputField = inputField
  }

  resetUsers(userId) {
    this.users[userId].inputField = null
  }

  getUsersList() {
    let usersList = []
    for (let userId in this.users) {
      usersList.push({
        userId: userId,
        inputField: this.users[userId].inputField,
      })
    }
    return usersList
  }

  static formatYturn(turnObj) {
    const ywords = Y.Array.from(turnObj.words)
    const ySegment = new Y.Text(turnObj.segment)
    const yturn = new Y.Map(Object.entries(turnObj))
    yturn.set("words", ywords)
    yturn.set("segment", ySegment)
    return yturn
  }

  static createSpeaker(name) {
    let yspeaker = new Y.Map()
    yspeaker.set("speaker_name", new Y.Text(name))
    yspeaker.set("speaker_id", uuidv4())
    return yspeaker
  }

  static mergeUpdates(deltas) {
    return Y.mergeUpdates(deltas)
  }
}

export class User {
  constructor(userId) {
    this.userId = userId
    this.inputField = null
  }
}
