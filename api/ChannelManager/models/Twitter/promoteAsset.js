const nodemailer = require('nodemailer');

module.exports = {
    friendlyName: 'promoteAsset',
    description: 'Promote Asset on the Twitter Channel',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        episode: {
            description: 'Episode Promoted',
            type: 'ref', // string|boolean|number|json
            required: true
        },
        asset: {
            description: 'Promote Asset on the Channel',
            type: 'ref', // string|boolean|number|json
            required: true
        },
        text: {
            description: 'Text of the post for the promotion of the asset',
            type: 'string',
            required: true,
            limit: "2048"
        },
        lang: {
            description: "Language of the post",
            type: "string",
            required: false,
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {

        let text = inputs.text;
        let post = new Post({channel: obj, text: text, asset: inputs.asset, episode: inputs.episode, lang: inputs.lang || "en"});
        obj.addToPosts(post);
        if(inputs.asset) {
            inputs.asset.addToPosts(post);
        }
        if(inputs.episode){
            inputs.episode.addToPosts(post);
            inputs.episode.saveMe();
        }
        return post;
    }
};
