db.users.insert(
    {
        _id: ObjectId('5e98264fde0d300cacd60300'),
        email: 'pop@example.com',
        passwordHash: '018841a4fc779ac3b05ce6667af53529469c2cd8',
        salt: '9NWwUvDorjPo',
        convoAccess: {
            '5e9d6376c8ffff536c0a2b8d': 'owner',
            '5ea6c62d0ec5ef410876d829': 'owner'
        }
    }
)
db.users.insert(
    {
        _id: ObjectId('5e9da277e06ccb1bfc6086a7'),
        email: 'ono@example.com',
        passwordHash: 'a3fe169b8b62c9220602cf04f70a77b99cf6540b',
        salt: 'vwDZ8cZVx1OX',
        convoAccess: {
            '5e9d6376c8ffff536c0a2b8d': 'readwrite',
            '5ea6c62d0ec5ef410876d829': 'readwrite'
        }
    }
)