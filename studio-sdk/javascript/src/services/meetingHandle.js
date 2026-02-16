const POLLING_INTERVAL = 3000

export class MeetingHandle extends EventTarget {
  constructor(sessionId, channelId, bot, lintoInstance) {
    super()
    this.sessionId = sessionId
    this.channelId = channelId
    this.bot = bot
    this.lintoInstance = lintoInstance
    this._stopped = false
    this._connected = false
    this._pollTimeout = null

    this._startPolling()
  }

  _startPolling() {
    const poll = async () => {
      if (this._stopped) return
      try {
        const session = await this.lintoInstance.getSession(this.sessionId)
        const status = session?.status
        if (this._stopped) return // re-check after await

        if (status === "active" && !this._connected) {
          this._connected = true
          this.dispatchEvent(new CustomEvent("connected", { detail: session }))
        } else if (status === "terminated") {
          this.dispatchEvent(new CustomEvent("meeting_end", { detail: session }))
          this._cleanup()
          return // don't schedule next poll
        } else if (status === "errored") {
          this.dispatchEvent(new CustomEvent("error", { detail: session }))
          this._cleanup()
          return
        }
      } catch (err) {
        if (!this._stopped) {
          this.dispatchEvent(
            new CustomEvent("error", { detail: { error: err.message } })
          )
        }
      }
      if (!this._stopped) {
        this._pollTimeout = setTimeout(poll, POLLING_INTERVAL)
      }
    }
    this._pollTimeout = setTimeout(poll, POLLING_INTERVAL)
  }

  async stop({ force = false } = {}) {
    if (this._stopped) return
    this._stopped = true
    this._cleanup()
    return await this.lintoInstance.stopSession(this.sessionId, { force })
  }

  async stopAndSave({ name } = {}) {
    if (this._stopped) return
    this._stopped = true
    this._cleanup()
    return await this.lintoInstance.deleteSession(this.sessionId, { name })
  }

  _cleanup() {
    this._stopped = true
    if (this._pollTimeout) {
      clearTimeout(this._pollTimeout)
      this._pollTimeout = null
    }
  }
}
