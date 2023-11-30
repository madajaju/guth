const path = require('path');

module.exports = {
    friendlyName: 'gatherStats',
    description: 'Gather Stats for the episode from the primary sources',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let stats = {};
        for(let i in obj.assets) {
            let asset = obj.assets[i];
            stats[asset.name] = await asset.gatherStats();
        }
        for(let i in obj.posts) {
            let post = obj.posts[i];
            stats[post.name] = await post.gatherStats();
        }
        obj.saveMe();
        return stats;
    }
};
