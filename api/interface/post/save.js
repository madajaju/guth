const path = require('path');
const fs = require("fs");

module.exports = {
    friendlyName: 'save',
    description: 'Save a post',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let post = null;
        if(inputs.id) {
            // asset = new Episode({id:inputs.id});
            post = Post.find(inputs.id);
        }
        if(!post) {
            post = Post.find(inputs.name);
        }
        if(post) {
            post._state = inputs.status || post._state;
            post.name = inputs.name || post.name;
            post.lang= inputs.name || post.name;
            post.text = inputs.text || post.text;
            post.postedDate = new Date(inputs.postedDate) || post.postedDate;


            post.asset.artifact.episode.saveMe();
            env.res.status(200);
            env.res.json({results:"Episode Saved!"});
        } else {
            if(env.res) {
                env.res.status(404);
                env.res.json({error:"Error Could not find the Episode!"});
            }
        }
    }
};
