class Channel {
    static definition = {
        name: 'Channel',
        unique: (obj) => {
            return obj.name;
        },
        description: 'This is the channel that assets are published or posts are created',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the channel',
            },
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
            types: {
                type: 'ArtifactType',
                cardinality: 'n',
                composition: false,
                owner: false
            },
            assets: {
                type: 'Asset',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            posts: {
                type: 'Post',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            mappings: {
                type: "Mapping",
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
        view: {
            color: "#cccccc",
            object2d: (options) => {
                // Triangle
                let material = {color: "#cccccc", border: "#000000"};
                if (options) {
                    material = options;
                }
                return `<circle cx="0" cy="0" r=10 style="fill:${material.color};stroke:${material.border};stroke-width:1" />`;
            },
            object3d: (options) => {

                let materials = {
                    '': `color:#cc8844; transparent:true, opacity:0.90;`,
                    'Selected': `color:#ffff00; transparent:true, opacity:0.90;`,
                    'Targeted': `color:#00ff00; transparent:true, opacity:0.90;`,
                    'Sourced': `color:#ff0000; transparent:true, opacity:0.90;`
                };
                let retval = "";
                for (let i in materials) {
                    retval += `<a-entity id="Channel3D${i}">` +
                        `<a-cylinder radius="10" height="20" material="${materials[i]}" ></a-cylinder>` +
                        `</a-entity>`;
                }
                return retval;
            }
        }
    }
}

module.exports = Channel;

