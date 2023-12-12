import { createServer } from "http"
import { env } from "process"

import Component from "../component.js"

export default class WebServer extends Component {
  constructor(app) {
    super(app)
    this.id = this.constructor.name

    this.httpServer = createServer((req, res) => {
      res.setHeader("Content-Type", "application/json")
      res.statusCode = 204
      res.end("")
      return
    })
    this.httpServer.listen(env.WEBSERVER_HTTP_PORT, "0.0.0.0")

    return
  }
}
