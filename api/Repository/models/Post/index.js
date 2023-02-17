
class Post {
    static definition = {
        name: 'Post',
        description: 'Post to promote the asset',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the post.',
            },
            text: {
                type: 'string',
                description: 'Text in the post, should include all of the text that is in the post including generated text',
            },
            createdDate: {
                type: 'number',
                description: 'Date the post was created',
            },
            postedDate: {
                type: 'number',
                description: 'Date the post was posted',
            }
        },
        associations: {
            asset: {
                type: 'Asset',
                cardinality: 1,
                composition: false,
                owner: false,
            },
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
                    '': `color:#cc00cc; transparent:true, opacity:0.90;`,
                    'Selected': `color:#ffff00; transparent:true, opacity:0.90;`,
                    'Targeted': `color:#00ff00; transparent:true, opacity:0.90;`,
                    'Sourced': `color:#ff0000; transparent:true, opacity:0.90;`
                };
                let retval = "";
                for(let i in materials) {
                    retval += `<a-entity id="Post3D${i}">` +
                        `<a-cone radius-bottom="5" height="20" material="${materials[i]}" ></a-cone>` +
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

module.exports = Post;

