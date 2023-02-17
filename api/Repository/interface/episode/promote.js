const path = require('path');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote Episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'ID of the episode to promote',
            type: 'string', // string|boolean|number|json
            required: true
        },
        channels: {
            description: 'Channels to promote to. Comma Separated list',
            type: 'string',
            required: true
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
        // inputs contains the obj for the this method.
        env.res.end("Done");
    }
};
