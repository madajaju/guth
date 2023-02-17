module.exports = {
    friendlyName: 'createWorkflow',
    description: 'Create Workflow to Podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: 'Podcast Name',
            type: 'string',
            required: true
        },
        name: {
            description: 'Name of the workflow',
            type: 'string',
            required: true
        },
        file: {
            description: 'File name of the Workflow',
            type: 'file',
            required: false
        },
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
        let args = env.req.body;
        let podcast = Podcast.find(args.podcast);
        if(!podcast) {
            if(env.res) {
                env.res.json('Podcast Not Found:' + args.podcast);
            }
            return;
        }
        let workflow = new BusinessFlow({name: args.name, file: args.file});
        podcast.blueprint.addToWorkflows(workflow);
        if(env.res)  {
            env.res.json({results: {id: workflow.id, name: workflow.name}});
        }
        return;
    }
};
