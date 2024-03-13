const path = require('path');
const AClass = require('ailtire/src/Server/AClass');

module.exports = {
    friendlyName: 'promoteAsset',
    description: 'Promote Asset on the Channel',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        asset: {
            description: 'Promote Asset on the Channel',
            type: 'ref', // string|boolean|number|json
            required: true
        },
        body: {
            description: 'Text of the post for the promotion of the asset',
            type: 'string',
            required: false,
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
        let body = inputs.body;
        if(inputs.asset) {
            let post = new Post({
                channel: obj,
                text: body,
                name: 'Post: ' + inputs.asset.name,
                asset: inputs.asset,
                episode: inputs.episode
            });
            obj.addToPosts(post);
            if (inputs.asset) {
                inputs.asset.addToPosts(post);
            }
            if (inputs.episode) {
                post.episode.addToPosts(post);
                post.episode.saveMe();
            }
        }
        return {redirect: obj.url, message:"Cut and paste into Window"};
    }
};
