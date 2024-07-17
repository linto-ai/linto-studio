const { Sequelize, DataTypes, Op } = require("sequelize")

require("../config.js")

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    logging: false,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
)

const TranscriberProfile = sequelize.define("transcriber_profile", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  config: {
    type: DataTypes.JSON,
    allowNull: true,
  },
})

const Session = sequelize.define("session", {
  id: {
    type: DataTypes.UUID,
    //defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM(
      "pending_creation",
      "ready",
      "active",
      "errored",
      "terminated",
    ),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  errored_on: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: true,
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  public: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
})

const Channel = sequelize.define("channel", {
  transcriber_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stream_endpoint: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stream_status: {
    type: DataTypes.ENUM("active", "inactive", "errored"),
    allowNull: true,
  },
  transcriber_status: {
    type: DataTypes.ENUM(
      "ready",
      "streaming",
      "closed",
      "errored",
      "initialized",
    ),
    allowNull: true,
  },
  closed_captions: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: true,
  },
  closed_caption_live_delivery: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  closed_captions_file_delivery: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

// Sync the models with the database

TranscriberProfile.hasMany(Channel)
Channel.belongsTo(TranscriberProfile)

Session.hasMany(Channel)
Channel.belongsTo(Session)

// Export the models
module.exports = {
  TranscriberProfile,
  Session,
  Channel,
  sequelize,
  Op,
}
