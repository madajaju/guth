
class Mapping {
    static definition = {
        name: 'Mapping',
        description: 'Mapping of Guth resource attributes to channel promotion attributes.',
        unique: (obj) => { return obj.id; },
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the Mapping',
            },
        },
        associations: {
            parent: {
                type: 'BluePrint',
                cardinality: 1,
                composition: false,
                owner: false
            },
            channels: {
                type: 'Channel',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            templates: {
                type: 'Template',
                cardinality: 'n',
                composition: true,
                owner: true
            }
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

module.exports = Mapping;

