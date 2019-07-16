const Component = require(`../component.js`)
const path = require("path")
const debug = require('debug')(`app:alphabetsoup`)

class AlphabetSoup extends Component {
    constructor(app) {
        super(app)
        this.id = this.constructor.name
        this.app = app
        return this.init()
    }

}

module.exports = app => new AlphabetSoup(app)