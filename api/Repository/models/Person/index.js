
class Person {
    static definition = {
        name: 'Person',
        description: 'Person on the podcast.',
        unique: (obj) => { return obj.name; },
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the person'
            },
            email: {
                type: 'string',
                description: "Email address",
            },
            notes: {
                type: 'string',
                description: "Notes about the person",
            }
        },
        associations: {
            socials: {
                type: 'SocialHandle',
                cardinality: 'n',
                composition: true,
                owner: true,
                via: 'owner'
            },
            episodes: {
                type: 'Episode',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            podcast: {
                type: 'Podcast',
                cardinality: 1,
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
                    '': `color:#cccccc; transparent:true, opacity:0.90;`,
                    'Selected': `color:#ffff00; transparent:true, opacity:0.90;`,
                    'Targeted': `color:#00ff00; transparent:true, opacity:0.90;`,
                    'Sourced': `color:#ff0000; transparent:true, opacity:0.90;`
                };
                let retval = "";
                for(let i in materials) {
                    retval += `<a-entity id="Person3D${i}">` +
                        `<a-sphere radius="5" material="${materials[i]}" ></a-sphere>` +
                        `<a-cone radius-bottom="5" radius-top="2" height="15" position="0 -10 0" material="${materials[i]}" ></a-cone>` +
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

module.exports = Person;

