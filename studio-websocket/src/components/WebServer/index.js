import { createServer } from "http"
import { env } from "process"

import Component from "../component.js"
import llmJobController from "../Websocket/controllers/llmJobController.js"

export default class WebServer extends Component {
  constructor(app) {
    super(app)
    this.id = this.constructor.name
    this.app = app

    this.httpServer = createServer((req, res) => {
      // Handle internal broadcast endpoint for LLM job updates
      if (req.method === "POST" && req.url === "/internal/llm/broadcast") {
        this.handleLlmBroadcast(req, res)
        return
      }

      res.setHeader("Content-Type", "application/json")
      res.statusCode = 204
      res.end("")
      return
    })
    this.httpServer.listen(env.WEBSERVER_HTTP_PORT, "0.0.0.0")

    return
  }

  /**
   * Handle internal LLM job broadcast requests from studio-api
   * POST /internal/llm/broadcast
   * Body: { organizationId, conversationId?, jobId, status, progress, result, error, timestamp }
   * Note: conversationId is optional - will broadcast to org room only if missing
   */
  handleLlmBroadcast(req, res) {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk.toString()
    })

    req.on("end", () => {
      try {
        const update = JSON.parse(body)

        // Validate required fields - only jobId and organizationId are required
        if (!update.jobId || !update.organizationId) {
          res.statusCode = 400
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ error: "Missing organizationId or jobId" }))
          return
        }

        // Broadcast update to all subscribed clients
        if (this.app && this.app.io) {
          llmJobController.broadcastJobUpdate(this.app.io, update)
        }

        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ success: true }))
      } catch (error) {
        res.statusCode = 400
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ error: "Invalid JSON body" }))
      }
    })

    req.on("error", () => {
      res.statusCode = 500
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({ error: "Internal server error" }))
    })
  }
}
