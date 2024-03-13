
class Email {
    static definition = {
        extends: 'Channel',
        name: 'Email',
        description: 'Email Channel',
        attributes: {
            user: {
                type: 'string',
                description: 'User Login',
            },
            password: {
                type: 'string',
                description: 'User Credentials',
            },
            host: {
                type: 'string',
                description: 'host of the smpt server',
            },
            port: {
                type: 'string',
                description: 'port of the smpt server',
            },
            from: {
                type: 'string',
                description: 'default from email address',
            }

        },
        associations: {
        },
    }
}

module.exports = Email;

