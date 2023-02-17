class SocialHandle {
    static definition = {
        name: 'SocialHandle',
        description: 'Handle to a social network account',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the handle',
            },
            stype: {
                type: 'string',
                description: 'Type of the social network',
            }
        },
        associations: {
            channel: {
                type: 'Channel',
                cardinality: 1,
                composition: false,
                owner: false
            },
            owner: {
                type: 'Person',
                cardinality: 1,
                composition: false,
                owner: false,
            },
        },
        view: {
            color: "#ff44aa",
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
                    '': `color:#ff44aa; transparent:true, opacity:0.90;`,
                    'Selected': `color:#ffff00; transparent:true, opacity:0.90;`,
                    'Targeted': `color:#00ff00; transparent:true, opacity:0.90;`,
                    'Sourced': `color:#ff0000; transparent:true, opacity:0.90;`
                };
                let retval = "";
                for (let i in materials) {
                    retval += `<a-entity id="SocialHandle3D${i}">` +
                        `<a-icosahedron radius="5" material="${materials[i]}"></a-icosahedron>` +
                        `</a-entity>`;
                }
                return retval;
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

module.exports = SocialHandle;

