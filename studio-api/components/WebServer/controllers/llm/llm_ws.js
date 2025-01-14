const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:controllers:llm:llm_ws`,
)
const WebSocket = require("ws")
const model = require(`${process.cwd()}/lib/mongodb/models`)

class WebSocketSingleton {
  constructor() {
    if (!WebSocketSingleton.instance) {
      this.socket = null
      this.watchingList = new Set() // To keep track of tasks that are already being watched
      WebSocketSingleton.instance = this
    }
    return WebSocketSingleton.instance
  }

  getSocket(url = process.env.LLM_GATEWAY_SERVICES_WS) {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket(url)

      this.socket.on("open", () => {
        debug("WebSocket connection established.")
      })

      this.socket.on("message", (message) => {
        this.handleMessage(message) // Handle message and update task ID
      })

      this.socket.on("close", () => {
        debug("WebSocket connection closed.")
        this.socket = null // Reset the socket on close
      })

      this.socket.on("error", (error) => {
        console.error("WebSocket error:", error)
      })
    }
    return this.socket
  }

  getSocketState() {
    // CONNECTING (0): The WebSocket connection is in the process of establishing.
    // OPEN (1): The WebSocket connection is established and ready to use.
    // CLOSING (2): The WebSocket connection is closing.
    // CLOSED (3): The WebSocket connection is closed.
    if (!this.socket) {
      return WebSocket.CLOSED // Return CLOSED state (3) if no socket exists
    }
    return this.socket.readyState
  }

  sendMessage(message) {
    const socket = this.getSocket() // Ensure the socket is initialized
    if (socket.readyState === WebSocket.OPEN) {
      const idsToAdd = message.filter(
        (taskId) => !this.watchingList.has(taskId),
      )
      if (idsToAdd.length > 0) {
        idsToAdd.forEach((taskId) => {
          this.watchingList.add(taskId)
          debug(`Task ID ${taskId} added to the watching list.`)
        })

        debug("Message sent:", idsToAdd)
        socket.send(JSON.stringify(idsToAdd))
      } else {
        debug("All task IDs are already in the watching list.")
      }
    } else {
      console.error(
        `Cannot send message. WebSocket is not open. Current state: ${socket.readyState}`,
      )
    }
  }

  // Handle WebSocket messages
  async handleMessage(message) {
    try {
      const parsedMessage = JSON.parse(message)
      if (parsedMessage.status === "alive") return
      debug("Receive message:", parsedMessage)

      const tasks = Array.isArray(parsedMessage)
        ? parsedMessage
        : [parsedMessage]

      for (const task of tasks) {
        const { task_id, status } = task
        const conv = await model.conversationExport.getByJobId(task_id)

        if (conv.length === 0) continue // It's an unknown task from studio
        this.updateStatus(conv[0], task)

        if (this.completedJob(status)) {
          this._handleCompletedJob(task_id) // Handle completed job
        } else {
          this._addToWatchingList(task_id) // Add to watching list if not already there
        }
      }

      if (this.watchingList.size === 0) {
        debug("No more tasks to watch. Closing WebSocket connection.")
        this.socket.close()
      }
    } catch (error) {
      console.error("Error handling message:", error)
    }
  }

  _addToWatchingList(taskId) {
    if (!taskId) return
    if (!this.watchingList.has(taskId)) {
      this.watchingList.add(taskId)
      debug(`Task ID ${taskId} added to the watching list.`)
    }
  }

  _handleCompletedJob(taskId) {
    this.watchingList.delete(taskId)
    debug(`Task ID ${taskId} removed from the watching list.`)
  }

  areJobsInWatchingList(jobIds) {
    return jobIds.every((jobId) => this.watchingList.has(jobId))
  }

  completedJob(status) {
    if (["complete", "error", "unknown"].includes(status)) return true
    return false
  }

  updateStatus(conversationExport, data) {
    let status = data.status
    conversationExport.status = status

    if (status === "complete" && data.message === "success") {
      conversationExport.data = data.summarization
      conversationExport.processing = data.progress || 100

      // we remove the task_id from the watching list
      this.watchingList.delete(data.task_id)
    } else if (status === "error" || status === "unknown") {
      conversationExport.data = data.error || data.message
    } else if (
      status === "queued" ||
      status === "processing" ||
      status === "started" ||
      status === "progress"
    ) {
      conversationExport.processing = data.progress
    }
    model.conversationExport.updateStatus(conversationExport)
  }
}

const singleton = new WebSocketSingleton()
module.exports = singleton
