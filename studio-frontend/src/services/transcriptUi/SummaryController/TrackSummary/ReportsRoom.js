// Membership of the LLM room of a track: the job updates of its reports
// arrive through it. The membership does not survive a reconnection, and
// the updates sent meanwhile are lost: on every connect, the room is joined
// again and onReconnect resyncs the reports. Without a socket (not created
// yet), there is no live update, the reports still load.
export class ReportsRoom {
  constructor(
    socket,
    room,
    { onJobUpdate, onJobComplete, onJobError, onReconnect },
  ) {
    this.socket = socket
    this.room = room
    this.onJobUpdate = onJobUpdate
    this.onJobComplete = onJobComplete
    this.onJobError = onJobError
    this.onConnect = () => {
      this.join()
      onReconnect()
    }
    if (!socket) return
    socket.on("llm:job:update", onJobUpdate)
    socket.on("llm:job:complete", onJobComplete)
    socket.on("llm:job:error", onJobError)
    socket.on("connect", this.onConnect)
    this.join()
  }

  join() {
    this.socket.emit("llm:join", this.room)
  }

  destroy() {
    if (!this.socket) return
    this.socket.emit("llm:leave", this.room)
    this.socket.off("llm:job:update", this.onJobUpdate)
    this.socket.off("llm:job:complete", this.onJobComplete)
    this.socket.off("llm:job:error", this.onJobError)
    this.socket.off("connect", this.onConnect)
  }
}
