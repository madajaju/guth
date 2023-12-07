
class Episode {
    static definition = {
        name: 'Episode',
        description: 'Episode of a podcast',
        unique: (obj) => { return obj.name; },
        attributes: {
            name: {
                type: 'string',
                limit: 50,
                description: 'Unique Name of the Episode'
            },
            number: {
                type: 'string',
                limit: 10,
                description: 'Episode Number'
            },
            title: {
                type: 'string',
                limit: 75,
                description: 'Title of the episode'
            },
            summary: {
                type: 'string',
                multiline: true,
                description: 'Summary of the episode'
            },
            tagline: {
                type: 'string',
                multiline: true,
                limit: 256,
                description: 'Summary of the episode'
            },
            notes: {
                type: 'string' ,
                multiline: true,
                description: "Episode Notes full MD"
            },
            meta: {
                type: 'string',
                multiline: true,
                limit: 125,
                description: 'Summary of the episode'
            },
            thumbnail: {
                type: 'string',
                description: "Thumbnail for the episode"
            },
            repo: {
                type: 'string',
                description: 'Directory of the repository of the Episode'
            },
            scheduledDate: {
                type: 'date',
                description: 'Scheduled Release Date',
            },
            createdDate: {
                type: 'date',
                description: 'Episode Created Date',
            },
            releaseDate: {
                type: 'date',
                description: 'Episode Release Date',
            },
            saveFile: {
                type: 'string',
                description: "Location of the episode on disk"
            }
        },
        associations: {
            tags: {
                type: 'Tag',
                unique: true,
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            guests: {
                type: 'Person',
                unique: true,
                cardinality: 'n',
                composition: false,
                owner: false,
            },
            artifacts: {
                type: 'Artifact',
                unique: true,
                cardinality: 'n',
                composition: true,
                owner: true,
                via: 'episode'
            },
            assets: {
                type: 'Asset',
                unique: true,
                cardinality: 'n',
                composition: true,
                owner: true,
            },
            posts: {
                type: 'Post',
                cardinality: 'n',
                composition: false,
                owner: true,
            },
            owner: {
                type: 'Podcast',
                cardinality: 1,
                composition: false,
                owner: false
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
                    retval += `<a-entity id="Episode3D${i}">` +
                        `<a-box width="30" height="30" depth="5" material="${materials[i]}" ></a-box>` +
                        `</a-entity>`;
                }
                return retval;
            }
        },
        statenet: {
            Init: {
                description: "Initial State",
                events: {
                    saveMe: {
                        Created: {}
                    },
                    cancel: {
                        Cancelled: {}
                    }
                }
            },
            Created: {
                description: "Created State",
                events: {
                    saveMe: {
                        Created: {}
                    },
                    schedule: {
                        Scheduled: {}
                    },
                   cancel: {
                        Cancelled: {}
                    }
                }
            },
            Backlog: {
                description: "Idea for episode",
                events: {
                    saveMe: {
                        Backlog: {}
                    },
                    schedule: {
                        Scheduled: { }
                    },
                    cancel: {
                        Cancelled: {}
                    }
                },
            },
            Scheduled: {
                description: "Episode is scheduled. This should create a directory for the episode.",
                events: {
                    record: {
                        Recorded: { }
                    },
                    cancel: {
                        Cancelled: {}
                    }
                },
                actions: {
                    entry: {
                        entry1: (obj) => {
                            // Create a directory for the episode if it does not already exist.
                            console.log("Create Directory");
                            // Set the date that the episode will be recorded and published.
                        }
                    }
                }
            },
            Recorded: {
                description: "Episode is Recorded. The episode is recorded and the raw video is placed in the" +
                    " directory.",
                events: {
                    edit: {
                        Edited: {
                        }
                    },
                },
            },
            Edited: {
                description: "Episode is Edited",
                events: {
                    write: {
                        Written: {
                        }
                    },
                },
            },
            Written: {
                description: "Episode is Written",
                events: {
                    publish: {
                        Published: {}
                    },
                }
            },
            Published: {
                description: "Episode is Published",
            },
            Cancelled: {
                description: "Episode is Cancelled",
            }
        }
    }
}

module.exports = Episode;

