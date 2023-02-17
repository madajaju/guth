const path = require('path');

module.exports = {
    friendlyName: 'publish',
    description: 'Publish Episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'ID of the episode to publish',
            type: 'string', // string|boolean|number|json
            required: true
        },
        channels: {
            description: 'Channels to publish to. Comma Separated list',
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
        env.res.json(global.classes);
        env.res.end("Done");
    }
};
