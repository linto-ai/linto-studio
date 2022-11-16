const Component = require(`../component.js`)
const debug = require('debug')(`linto:components:worcker-watcher`)
const lib = require('./controllers/lib/')

class WorkerWatcher extends Component {
    constructor(app) {
        super(app)
        this.app = app

        this.id = this.constructor.name
        this.servicesLoaded = {}

        this.discovery = lib.discovery.bind(this)

        return this.init()
    }

}

module.exports = app => new WorkerWatcher(app)