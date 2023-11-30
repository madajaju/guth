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
        releaseDate: {
            description: 'Date to release the Episode',
            type: 'string',
            required: false,
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (inputs, env) {
        // inputs contains the obj for the this method.
        let episode = Episode.find(inputs.id);

        if(!episode) {
            env.res.json({error: "Episode Not Found:"+ inputs.id});
            return;
        }

        let podcast = episode.owner;
        let workflows = podcast.blueprint.workflows;
        let workflow = null;
        for(let i in workflows) {
            if(workflows[i].name === 'episode/publish') {
                workflow = workflows[i];
            }
        }
        if(workflow) {
            await workflow.fn(inputs, env);
        }
        episode.state = "Published"
        episode.saveMe();

        env.res.json({request: 'Episode Published!'});
        return episode;
    }
};
