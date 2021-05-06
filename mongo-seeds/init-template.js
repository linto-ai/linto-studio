conn = new Mongo();
db = conn.getDB('${DB_NAME}')

db.createUser({
  user: '${DB_USER}',
  pwd:'${DB_PASS}',
  roles: [
      {
          role: "readWrite",
          db: '${DB_NAME}'
      }
  ]
})

//this an example of the acousticModel collection information
db.createCollection("conversations")
db.createCollection("users")
