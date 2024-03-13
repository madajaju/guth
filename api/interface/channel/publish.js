module.exports = {
    friendlyName: 'publish',
    description: 'Publis the asset on the channel, generic',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            description: "Name of the asset",
            type: "string",
            required: true,
        },
        artifact: {
            description: 'Artifact to upload to youtube.',
            type: 'ref',
            required: true,
        },
        channel: {
            description: "Channel to publish the video",
            type: "ref",
            required: true,
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (inputs, env) {
        let name = inputs.name || inputs.artifact.name;
        let channel = Channel.find(inputs.channel);
        let asset = new Asset({episode: inputs.episode, name:name, artifact: inputs.artifact});
        asset.channel = channel;
        inputs.episode.addToAssets(asset);
        for(let i in inputs) {
            if(typeof inputs[i] === 'string') {
                asset[i] = inputs[i];
            }
        }
        return asset;
    }
};
