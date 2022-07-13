conn = new Mongo();
db = conn.getDB('conversationLocal')

try {
    db.createUser({
        user: 'root',
        pwd: 'example',
        roles: [{
            role: "readWrite",
            db: 'conversationLocal'
        }]
    })
} catch (error) {
    if (error.message === "couldn't add user: User \"root@conversationLocal\" already exists") {
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