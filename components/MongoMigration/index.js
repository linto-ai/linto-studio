const Component = require(`../component.js`)
const debug = require('debug')(`linto:components:MongoMigration`)

const migration = require('./controllers/migration')
const MongoDriver = require(`${process.cwd()}/lib/mongodb/driver`)


class MongoMigration extends Component {
    constructor(app) {
        super(app)
        this.app = app
        this.id = this.constructor.name
        this.db = MongoDriver.constructor.db

        this.initVersion()

        return this.init()
    }


    async initVersion() {
        let version = await migration.checkVersion(this.db, 1)
        migration.migrationProcessing(this.db, version)

        return this
    }
}

module.exports = app => new MongoMigration(app)