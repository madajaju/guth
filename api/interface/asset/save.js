const path = require('path');
const fs = require("fs");

module.exports = {
    friendlyName: 'save',
    description: 'Save an asset',
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
        let asset = null;
        if(inputs.id) {
            // asset = new Episode({id:inputs.id});
            asset = Asset.find(inputs.id);
        }
        if(!asset) {
            asset = Asset.find(inputs.name);
        }
        if(asset) {
            asset.url = inputs.url || asset.url;
            asset.name = inputs.name || asset.name;
            asset.title = inputs.title || asset.title;

            asset.artifact.episode.saveMe();
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
