const Component = require(`../component.js`)

const migration = require("./controllers/migration")
const MongoDriver = require(`${process.cwd()}/lib/mongodb/driver`)

let migration_version = 1

class MongoMigration extends Component {
  constructor(app) {
    super(app)
    this.app = app
    this.id = this.constructor.name

    if (process.env.DB_MIGRATION_TARGET) {
      migration_version = process.env.DB_MIGRATION_TARGET
    }

    return this.init()
  }

  async migrate() {
    await MongoDriver.constructor.ready()
    this.db = MongoDriver.constructor.db
    const version = await migration.checkVersion(this.db, migration_version)
    migration.migrationProcessing(this.db, version)
    return this
  }
}

module.exports = (app) => new MongoMigration(app)
