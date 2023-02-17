const path = require('path');
// const FileSystem = require('ailtire/src/Persist/YAMLFileSystem');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote Episode',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        tags: {
            description: 'Tags of episodes to promote.',
            type: 'string',
            required: false
        },
        products: {
            description: 'Products of episodes to promote',
            type: 'string',
            required: false
        },
        solutions: {
            description: 'Solutions of episodes to promote',
            type: 'string',
            required: false
        },
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let podcast = obj;
        let episodes = {};
        if(inputs.tags) {
            let tags = Tag.match({regex: inputs.tags});
            // Now iterate over the tags and get the episodes that are part of this podcast.
            for(let i in tags) {
                let tag = tags[i];
                for(let j in tag.episodes) {
                    let episode = tag.episodes[j];
                    if(episode.owner === podcast) {
                        episodes[episode.id] = episode;
                    }
                }
            }
        }
        if(inputs.products) {
            let products = Product.match({regex: inputs.products});
            // Now iterate over the tags and get the episodes that are part of this podcast.
            for(let i in products) {
                let product = products[i];
                for(let j in product.episodes) {
                    let episode = product.episodes[j];
                    if(episode.owner === podcast) {
                        episodes[episode.id] = episode;
                    }
                }
            }
        }
        if(inputs.solutions) {
            let solutions = Solution.match({regex: inputs.solutions});
            // Now iterate over the tags and get the episodes that are part of this podcast.
            for(let i in solutions) {
                let solution = solutions[i];
                for(let j in solution.episodes) {
                    let episode = solution.episodes[j];
                    if(episode.owner === podcast) {
                        episodes[episode.id] = episode;
                    }
                }
            }
        }
        let posts = [];
        let text = inputs.text;
        for(let ename in episodes) {
            let episode = episodes[ename];
            posts.push(episode.promote({text: text}));
        }
       // FileSystem.save([podcast]);
        return posts.flat();
    }
};
