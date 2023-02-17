const path = require('path');

module.exports = {
    friendlyName: 'schedule',
    description: 'Schedule an Episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'ID of the episode to publish',
            type: 'string', // string|boolean|number|json
            required: true
        },
        date: {
            description: 'Date to schedule the episode',
            type: 'string',
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
        // inputs contains the obj for the this method.
        let episode = Episode.find(inputs.id);
        if(!episode) {
            env.res.json({error: "Episode Not Found:"+ inputs.id});
            env.res.end("Done");
            return;
        }
        episode.schedule({date: inputs.date});

        env.res.json({request: 'Episode Scheduled!'});
        return;
    }
};
