class Podcast {
    static definition = {
        name: 'Podcast',
        description: 'Podcast, Videolog, blog, etc...',
        unique: (obj) => {
            return obj.name;
        },
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the Podcast',
            },
            title: {
                type: 'string',
                description: 'Title of the Podcast',
            },
            summary: {
                type: 'string',
                description: 'Summary of the Podcast',
            },
            baseDirectory: {
                type: 'string',
                description: 'Location of the artifacts being managed',
            },
            lang: {
                type: 'json',
                description: "Languages supported"
            }
        },
        associations: {
            episodes: {
                type: 'Episode',
                cardinality: 'n',
                composition: false,
                owner: true,
                via: 'owner',
            },
            channels: {
                type: 'Channel',
                cardinality: 'n',
                composition: false,
                owner: true,
                unique: true
            },
            blueprint: {
                type: 'BluePrint',
                cardinality: 1,
                composition: false,
                owner: true,
                via: "podcast",
            },
            guests: {
                type: 'Person',
                cardinality: 'n',
                composition: true,
                owner: true,
                via: "podcast"
            },
            tags: {
                type: 'Tag',
                cardinality: 'n',
                composition: false,
                owner: true
            }
        },
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
                    '': [`color:#88ff00; transparent:true, opacity:0.90;`, `color:#ff8800; transparent:true, opacity:0.90;`, `color:#8800ff; transparent:true, opacity:0.90;`, `color:#0088ff; transparent:true, opacity:0.90;`],
                    'Selected': [`color:#ffff00; transparent:true, opacity:0.90;`, `color:#ffff00; transparent:true, opacity:0.90;`, `color:#ffff00; transparent:true, opacity:0.90;`, `color:#ffff00; transparent:true, opacity:0.90;`],
                    'Targeted': [`color:#00ff00; transparent:true, opacity:0.90;`, `color:#00ff00; transparent:true, opacity:0.90;`, `color:#00ff00; transparent:true, opacity:0.90;`, `color:#00ff00; transparent:true, opacity:0.90;`],
                    'Sourced': [`color:#ff0000; transparent:true, opacity:0.90;`, `color:#ff0000; transparent:true, opacity:0.90;`, `color:#ff0000; transparent:true, opacity:0.90;`, `color:#ff0000; transparent:true, opacity:0.90;`]
                };
                let retval = "";
                for (let i in materials) {
                    let j = 0;
                    retval += `<a-entity id="Podcast3D${i}">` +
                        `<a-box width="20" height="20" depth="2" position="-4 0 -4" material="${materials[i][j++]}" > </a-box>` +
                        `<a-box width="20" height="20" depth="2" position="-2 3 0" material="${materials[i][j++]}" > </a-box>` +
                        `<a-box width="20" height="20" depth="2" position="0 6 4" material="${materials[i][j++]}" > </a-box>` +
                        `<a-box width="20" height="20" depth="2" position="2 9 8" material="${materials[i][j++]}" > </a-box>` +
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

module.exports = Podcast;

