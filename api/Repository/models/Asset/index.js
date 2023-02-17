
class Asset {
    static definition = {
        name: 'Asset',
        description: 'An asset is a published artifact.',
        attributes: {
            url: {
                type: 'string',
                description: 'URL of the published asset',
            },
            name: {
                type: 'string',
                description: 'Name of the asset',
            },
            title: {
                type: 'string',
                description: 'Title of the asset',
            }
        },
        associations: {
            channel: {
                type: 'Channel',
                cardinality: 1,
                composition: false,
                owner: false,
            },
            artifact: {
                type: 'Artifact',
                cardinality: 1,
                composition: false,
                owner: false,
            },
            posts: {
                type: 'Post',
                cardinality: 'n',
                composition: false,
                owner: false,
            }
        },
        view: {
            color: "#cccccc",
            object2d: (options) => {
                // Triangle
                let material = { color: "#cccccc", border:"#000000"};
                if(options) {
                    material = options;
                }
                return `<circle cx="0" cy="0" r=10 style="fill:${material.color};stroke:${material.border};stroke-width:1" />`;
            },
            object3d: (options) => {

                let materials = {
                    '': [`color:#00cccc; transparent:true, opacity:0.90;`, `color:#cc8844; transparent:true, opacity:0.90;`],
                    'Selected': [`color:#ffff00; transparent:true, opacity:0.90;`,`color:#ffff00; transparent:true, opacity:0.90;`],
                    'Targeted': [ `color:#00ff00; transparent:true, opacity:0.90;`,`color:#00ff00; transparent:true, opacity:0.90;`],
                    'Sourced': [ `color:#ff0000; transparent:true, opacity:0.90;`, `color:#ff0000; transparent:true, opacity:0.90;`]
                };
                let retval = "";
                for(let i in materials) {
                    let j = 0;
                    retval += `<a-entity id="Asset3D${i}">` +
                        `<a-sphere radius="5" material="${materials[i][j++]}" ></a-sphere>` +
                        `<a-cylinder radius="3.5" height="10" position="0 -5 0" material="${materials[i][j++]}" ></a-cylinderf>` +
                        `</a-entity>`;
                }
                return retval;
            }
        }
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

module.exports = Asset;

