module.exports = {
    friendlyName: 'publishArtifact',
    description: 'Upload a video  to youtube channel.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        artifact: {
            description: 'Artifact to upload to youtube.',
            type: 'ref',
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

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the method.
        return "channel/youtube/publish";
    }
};
