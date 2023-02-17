module.exports = {
    friendlyName: 'CreateEpisode',
    description: 'Create Episode for the Podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: 'Podcast Name',
            type: 'string',
            required: true
        },
        title: {
            description: 'Title of the Episode',
            type: 'string',
            required: true
        },
        number: {
            description: 'Number of the episode',
            type: "string",
            required: false,
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.'
        }
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let args = inputs;
        for(let aname in env.req.body) {
            args[aname]= env.req.body[aname];
        }
        let podcast = Podcast.find(args.podcast);
        if(!podcast) {
            if(env.res) {
                env.res.json('Podcast Not Found:' + args.podcast);
            }
            return;
        }
        // Check if there is a createEpisode workflow for this Podcast.
        // Load the workflows directory
        // Check if the workflow createEpisode exists and then run it.
        if(podcast.workflows.createEpisode) {
            podcast.workflows.createEpisode.fn(inputs);
            console.log("Called");
        }

        if(env.res) {
            env.res.json({ id: podcast.id});
        }
        return podcast;
    }
};
