
class Mapping {
    static definition = {
        name: 'Mapping',
        description: 'Mapping of Guth resource attributes to channel attributes.',
        unique: (obj) => { return obj.name; },
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the Mapping',
            },
            outputType: {
                type: 'string',
                description: 'Name of the resource type that maps to the channel',
            },
            file: {
                type: 'string',
                description: 'The template to be used for the generation',
            },
            outputName: {
                type: 'string',
                description: 'The output of the mapping generation. podcast, episode, and index are variables' +
                    ' available. For example SoundCloud_${episode.id}_${index}. index is available for any mapping' +
                    ' with cardinality greater than 1'
            },
            inputs: {
                type: 'json',
                description: 'inputs for the mapping. name:artifactName',
            }
        },
        associations: {
            parent: {
                type: 'BusinessFlow',
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

module.exports = Mapping;

