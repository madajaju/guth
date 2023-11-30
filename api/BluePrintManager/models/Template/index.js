
class Template {
    static definition = {
        name: 'Template',
        description: 'This is a template to be used to generate assets or promote episodes or assets.',
        unique: (obj) => { return obj.id; },
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the Template as derived from the filename',
            },
            script: {
                type: 'string',
                description: 'This is the ejs script that being used to generate assets.',
            },
            file: {
                type: 'string',
                description: 'This is the file with the ejs script',
            }
        },
        associations: {
            owner: {
                type: 'Mapping',
                cardinality: 1,
                composition: false,
                owner: false
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

module.exports = Template;

