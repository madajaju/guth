const path = require('path');

module.exports = {
    friendlyName: 'publish',
    description: 'Publish Episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        episode: {
            description: 'ID of the episode to publish',
            type: 'string', // string|boolean|number|json
            required: true
        },
        channels: {
            description: 'Channels to publish to. Comma Separated list',
            type: 'ref',
            required: true,
            model: 'Channel',
            cardinality: 'n'
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
        let episode = Episode.find(inputs.id);
        if(!episode) {
            env.res.json({error: "Episode Not Found:"+ inputs.id});
            env.res.end("Done");
            return;
        }
        episode.publish({channels: inputs.channels});

        env.res.json({request: 'Episode Published!'});
        env.res.end("Published");
        return;
    }
};
