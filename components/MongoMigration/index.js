const Component = require(`../component.js`)
const debug = require('debug')(`linto:components:MongoMigration`)

const migration = require('./controllers/migration')
const MongoDriver = require(`${process.cwd()}/lib/mongodb/driver`)

let  migration_version = 1

class MongoMigration extends Component {
    constructor(app) {
        super(app)
        this.app = app
        this.id = this.constructor.name
        this.db = MongoDriver.constructor.db

        if(process.env.MONGO_MIGRATION_VERSION) {
            migration_version = process.env.MONGO_MIGRATION_VERSION
        }

        this.initVersion()

        return this.init()
    }


    async initVersion() {
        let version = await migration.checkVersion(this.db, migration_version)
        migration.migrationProcessing(this.db, version)

        return this
    }
}

module.exports = app => new MongoMigration(app)