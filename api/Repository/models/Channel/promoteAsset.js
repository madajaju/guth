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
        text: {
            description: 'Text of the post for the promotion of the asset',
            type: 'string',
            required: false,
        },
        date: {
            description: 'Date to publish the artifact, if not supplied, publish now',
            type: 'string', // string|boolean|number|json
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
        let text = inputs.text || "Post:" + inputs.asset.name;
        let post = new Post({text: text, name:'Post:' + inputs.asset.name, asset: inputs.asset});
        obj.addToPosts(post);
        inputs.asset.addToPosts(post);
        return post;
    }
};
