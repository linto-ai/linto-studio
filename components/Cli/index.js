const Component = require(`../component.js`)
const path = require("path")
const debug = require('debug')(`app:cli`)

class Cli extends Component {
    constructor(app) {
        super(app)
        this.id = this.constructor.name
        this.app = app
        return this.init()
    }
}

module.exports = app => new Cli(app)