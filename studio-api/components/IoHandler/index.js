const debug = require('debug')('delivery:socketio')
const path = require('path')
const { Component } = require("live-srt-lib");
const socketIO = require('socket.io');

class IoHandler extends Component {
    constructor(app) {
        super(app, "WebServer") // Relies on a WebServer component to be registrated
        this.id = this.constructor.name
        this.app = app
        this.rooms = {}

        this.io = socketIO(this.app.components["WebServer"].httpServer, {
            cors: {
                origin: process.env.WEBSERVER_HTTP_PORT,
                methods: ["GET", "POST"]
            }
        })


        this.io.on("connection", (socket) => {
            debug(`New client connected : ${socket.id}`)

            socket.on('join_room', (roomId) => {
                debug(`Client ${socket.id} joins room ${roomId}`)
                this.addSocketInRoom(roomId, socket)
            });

            socket.on('leave_room', (roomId) => {
                debug(`Client ${socket.id} leaves room ${roomId}`)
                this.removeSocketFromRoom(roomId, socket)
            });

            socket.on("disconnect", () => {
                debug(`Client ${socket.id} disconnected`)
                this.searchAndRemoveSocketFromRooms(socket)
            })
        })

        return this.init()
    }

    addSocketInRoom(roomId, socket) {
        socket.join(roomId)
        if (this.rooms.hasOwnProperty(roomId)) {
            this.rooms[roomId].add(socket.id)
            this.app.components['BrokerClient'].emit('join_room', roomId)
        }
        else {
            this.rooms[roomId] = new Set().add(socket.id)
            this.app.components['BrokerClient'].emit('join_room', roomId)
        }
    }

    searchAndRemoveSocketFromRooms(socket) {
        for (const [roomId, socketIds] of Object.entries(this.rooms)) {
            if (socketIds.has(socket.id)) {
                this.removeSocketFromRoom(roomId, socket)
            }
        }
    }

    removeSocketFromRoom(roomId, socket) {
        socket.leave(roomId);

        if (!this.rooms.hasOwnProperty(roomId)) {
            this.app.components['BrokerClient'].emit('leave_room', roomId)
            return
        }

        this.rooms[roomId].delete(socket.id)
        if (this.rooms[roomId].size == 0) {
            delete this.rooms[roomId]
            this.app.components['BrokerClient'].emit('leave_room', roomId)
        }
    }

    //broadcasts to connected sockets
    notify(roomId, action, transcription) {
        if (this.io.sockets.adapter.rooms.has(roomId)) {
            this.io.to(roomId).emit(action, transcription)
        }
    }

    brokerOk() {
        this.io.emit("broker_ok")
    }

    brokerKo() {
        this.io.emit("broker_ko")
    }
}

module.exports = (app) => new IoHandler(app)
