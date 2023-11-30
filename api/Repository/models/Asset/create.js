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
        obj.cid = inputs.cid || obj.cid;
        let episode = inputs.episode || obj.episode;
        obj.summary = inputs.summary || "";
        obj.title = inputs.title || "";
        if(typeof episode === 'string') {
            obj.episode = Episode.find(episode);
        } else {
            obj.episode = inputs.episode;
        }

        if(inputs.channel) {
            if(inputs.channel) {
                if(typeof inputs.channel === 'string' ) {
                    let channelNormalized = inputs.channel.toLowerCase();
                    let channel = Channel.find(channelNormalized);
                    if (channel) {
                        obj.channel = channel;
                    } else {
                        console.log("Channel Missing:", inputs.channel);
                    }
                } else {
                    obj.channel = inputs.channel;
                }
            }
        }
        if(inputs.artifact) {
            for(let i in obj.episode.artifacts) {
                if(inputs.artifact === obj.episode.artifacts[i].name) {
                    let artifact = obj.episode.artifacts[i];
                    if(artifact) {
                        obj.artifact = artifact;
                        artifact.addToAssets(obj);
                    }
                }
            }
            if(!obj.artifact) {
                // console.error("Asset mapped to non-existent artifact:", inputs.artifact.id, obj.episode.number);
                if(inputs.artifact.id) {
                    obj.artifact = Artifact.find(inputs.artifact.id);
                    obj.artifact.addToAssets(obj);
                }
            }
        }
        // Add the asset to the episode.
        obj.episode.addToAssets(obj);

        return obj;
    }
};
