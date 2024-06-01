
class Artifact {
    static definition = {
        name: 'Artifact',
        description: 'This is an artifact that is created for the episode',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the artifact',
                limit: 128,
            },
            url: {
                type: 'string',
                description: 'Location of the original artifact',
                limit: 512,
            },
            remoteURL: {
                type: 'string',
                description: 'Publicly accessible URL of the original artifact',
            },
            summary: {
                type: 'string',
                description: 'Summary of the artifact. Used in generated derived artifacts and assets.',
                limit: 1024,
            },
            ext: {
                type: 'string',
                description: 'Extension of the artifact',
                limit: 24,
            },
            title: {
                type: 'string',
                description: 'Title of the artifact',
                limit: 64,
            }
        },
        associations: {
            artType: {
                type: 'ArtifactType',
                description: 'Type of the artifact: document, video, picture, or audio',
                cardinality: 1,
                composition: false,
                owner: false
            },
            episode: {
                type: 'Episode',
                cardinality: 1,
                composition: false,
                owner: false,
            },
            assets: {
                type: 'Asset',
                cardinality: 'n',
                composition: false,
                owner: false,
                via: 'artifact'
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
                    '': `color:#00cccc; transparent:true, opacity:0.90;`,
                    'Selected': `color:#ffff00; transparent:true, opacity:0.90;`,
                    'Targeted': `color:#00ff00; transparent:true, opacity:0.90;`,
                    'Sourced': `color:#ff0000; transparent:true, opacity:0.90;`
                };
                let retval = "";
                for(let i in materials) {
                    retval += `<a-entity id="Artifact3D${i}">` +
                        `<a-sphere radius="10" material="${materials[i]}" ></a-sphere>` +
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

module.exports = Artifact;

