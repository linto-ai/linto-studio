const debug = require('debug')('app:socketio')
const path = require('path')
const Component = require(`../component.js`)

class IoHandler extends Component {
    constructor(app) {
        super(app, "WebServer", "AlphabetSoup") // Relies on a WebServer component to be registrated
        this.id = this.constructor.name
        this.app = app
        //Adds socket.io
        this.io = require('socket.io').listen(this.app.components["WebServer"].httpServer)

        //http AND io uses same session middleware
        this.io.use((socket, next) => {
            if (socket) {
                this.app.components["WebServer"].session(socket.request, socket.request.res, next)
            }
        })
        return this.init()
    }

    //broadcasts to connected sockets
    notify(msgType, payload) {
        this.io.emit(msgType, payload)
    }
}

module.exports = (app) => new IoHandler(app)