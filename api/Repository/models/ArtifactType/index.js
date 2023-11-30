
class ArtifactType {
    static definition = {
        name: 'ArtifactType',
        description: 'The Type of the Artifact',
        unique: (obj) => { return obj.name; },
        attributes: {
            name: {
                type: 'string',
                description: 'The Artifact Type',
                limit: 64
            }
        },
        associations: {
            artifacts: {
                type: 'Artifact',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            episodes: {
                type: 'Episode',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
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
            color: "#cc44dd",
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
                    '': `color:#cc44dd; transparent:true, opacity:0.90;`,
                    'Selected': `color:#ffff00; transparent:true, opacity:0.90;`,
                    'Targeted': `color:#00ff00; transparent:true, opacity:0.90;`,
                    'Sourced': `color:#ff0000; transparent:true, opacity:0.90;`
                };
                let retval = "";
                for(let i in materials) {
                    retval += `<a-entity id="ArtifactType3D${i}">` +
                        `<a-torus radius="8" radius-tubular="1" material="${materials[i]}"></a-torus>` +
                        `</a-entity>`;
                }
                return retval;
            }
        }
    }
}

module.exports = ArtifactType;

