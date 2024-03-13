
class Instagram {
    static definition = {
        extends: 'Channel',
        name: 'Instagram',
        description: 'Instagram Channel',
        attributes: {
            user: {
                type: 'string',
                description: 'User Login',
            },
            creds: {
                type: 'string',
                description: 'User Credentials',
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

module.exports = Instagram;

