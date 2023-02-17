const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Create the asset',
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
        obj.name = inputs.name || obj.name;
        obj.url = inputs.url || obj.url;
        obj.title = inputs.title || obj.title;
        obj.episode = inputs.episode || obj.episode;

        if(inputs.channel) {
            let channel = Channel.find(inputs.channel);
            if(channel) {
                obj.channel = channel;
            }
        }
        if(inputs.artifact) {
            for(let i in inputs.episode.artifacts) {
                if(inputs.artifact === inputs.episode.artifacts[i].name) {
                    let artifact = inputs.episode.artifacts[i];
                    if(artifact) {
                        obj.artifact = artifact;
                        artifact.addToAssets(obj);
                    }
                }
            }
            if(!obj.artifact) {
                console.error("Asset mapped to non-existent artifact:", inputs.artifact, obj.episode.number);
            }
        }
        return obj;
    }
};
