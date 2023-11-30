
class Facebook {
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
        /*
        statenet: {
            Init: {
                description: "Initial State"
                events: {
                    create: {
                        StateName: { }
                    }
                }
            },
            StateName: {
                description: "My Description of the state",
                events: {
                    eventName: {
                        StateName: {
                            condition: function(obj) { ... },
                            action: function(obj) { ... },
                        }
                    },
                    eventName2 ...
                }
                actions: {
                    entry: { entry1: function(obj) { ... } },
                    exit: { exit1: function(obj): { ... } }
                }
            }
        }
        */
    }
}

module.exports = Facebook;

