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
        name: {
            description: "Name of the asset",
            type: 'string',
            required: false
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
        let name = inputs.name || inputs.artifact.name;
        let asset = new Asset({episode: inputs.episode, name:name, artifact: inputs.artifact});
        asset.channel = obj;
        for(let i in inputs) {
            if(typeof inputs[i] === 'string') {
                asset[i] = inputs[i];
            }
        }
        return asset;
    }
};
