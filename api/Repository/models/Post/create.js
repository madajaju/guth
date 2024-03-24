const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Create Post',
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

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        obj.name = inputs.name;
        if(inputs.file) {
            create(obj, inputs.file);
        } else {
            create(obj, inputs);
        }
        return obj;
    }
};

function create(obj, inputs) {
    obj.name = inputs.name || obj.name;
    obj.text = inputs.text || obj.text;
    obj.createdDate = inputs.createdDate || obj.createdDate || new Date();
    obj.scheduledDate = inputs.scheduledDate || obj.scheduledDate;
    obj.postedDate = inputs.postedDate || obj.postedDate;
    obj._state = inputs.state || "Created";
    obj.lang = inputs.lang || "en";
    if(inputs.asset) {
        if(typeof inputs.asset !== 'object') {
            obj.asset = Asset.find(inputs.asset);
        } else {
            obj.asset = inputs.asset;
        }
    }
    if(inputs.channel) {
        if(typeof inputs.channel !== 'object') {
            obj.channel = Channel.find(inputs.channel);
        } else {
            obj.channel = inputs.channel;
        }
    }
    if(inputs.episode) {
        if(typeof inputs.episode !== 'object') {
            obj.episode = Episode.find(inputs.episode);
        } else {
            obj.episode = inputs.episode;
        }
    }
    return obj;
}
