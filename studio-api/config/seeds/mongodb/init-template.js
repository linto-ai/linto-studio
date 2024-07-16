conn = new Mongo();
db = conn.getDB('${DB_NAME_MONGO}')

try {
    db.createUser({
        user: '${DB_USER_MONGO}',
        pwd: '${DB_PASS_MONGO}',
        roles: [{
            role: "readWrite",
            db: '${DB_NAME_MONGO}'
        }]
    })
} catch (error) {
    if (error.message === "couldn't add user: User \"${DB_USER_MONGO}@${DB_NAME_MONGO}\" already exists") {
        print('Skip user creation, user alraedy created')
    } else {
        throw (error)
    }
}

//this an example of the acousticModel collection information
db.createCollection("conversations")
db.createCollection("organizations")
db.createCollection("users")
db.createCollection("logs")