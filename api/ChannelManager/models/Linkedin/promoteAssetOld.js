const nodemailer = require('nodemailer');

module.exports = {
    friendlyName: 'promoteAssetOld',
    description: 'Promote Asset on the Email Channel',
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
        // Upload post to LinkedIn
        // First upload the image to LinkedIn
        // Then get the id of the uploaded image and use it in the post
        // Then create the post in LinkedIn
        // Use the LinkedIn API to create the post


        let post = new Post({channel: obj, text: text, asset: inputs.asset, episode: inputs.episode, lang: inputs.lang || "en"});

    /*    const postContent = {
            author:'urn:li:member:YOUR_MEMBER_ID',
            lifecycleState: 'PUBLISHED',
            specificContent: {`jj`
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: body
                    }
                }
            }
        }*/
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
}
