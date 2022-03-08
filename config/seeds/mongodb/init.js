conn = new Mongo();
db = conn.getDB('conversations')

try {
  db.createUser({
    user: 'root',
    pwd: 'example',
    roles: [
      {
        role: "readWrite",
        db: 'conversations'
      }
    ]
  })
} catch (error) {
  if (error.message === "couldn't add user: User \"root@conversations\" already exists") {
    print('Skip user creation, user alraedy created')
  } else {
    throw (error)
  }
}

//this an example of the acousticModel collection information
db.createCollection("conversations")
db.createCollection("users")
