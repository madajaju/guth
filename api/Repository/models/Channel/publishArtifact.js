const path = require('path');
const AClass = require('ailtire/src/Server/AClass');

module.exports = {
    friendlyName: 'publishArtifact',
    description: 'Publish Artifact on the Channel',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        artifact: {
            description: 'Artifact to publish on the Channel',
            type: 'ref', // string|boolean|number|json
            required: true
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
        let asset = new Asset({name:inputs.artifact.name, artifact: inputs.artifact});
        asset.channel = obj;
        inputs.artifact.addToAssets(asset);
        // Add the asset to the channel.
        obj.addToAssets(asset);

        return asset;
    }
};
