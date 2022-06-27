require(`${process.cwd()}/config`)

function getMongoUri() {
  let urlMongo = 'mongodb://'

  if (process.env.DB_REQUIRE_LOGIN === "true")
    urlMongo += process.env.DB_USER + ':' + process.env.DB_PASS + '@'
  urlMongo += process.env.DB_HOST + ':' + process.env.DB_PORT + '/'
  if (process.env.DB_REQUIRE_LOGIN === "true")
    urlMongo += '?authSource=' + process.env.DB_NAME

  return urlMongo
}

function mockUser() {
  return {
    email: 'john.doe@linagora.com',
    firstname: 'john',
    lastname: 'doe',
    img: 'pictures/default.jpg',
    password: 'test'
  }
}

function mockOrganization() {
  return {
    name: mockUser().email,
    users: [],
    description: "Organization for " + mockUser().email,
    type: "public",
    personal: true
  }
}


module.exports = { getMongoUri, mockUser, mockOrganization }