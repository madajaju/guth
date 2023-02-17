module.exports = {
    friendlyName: 'runWorkflow',
    description: 'Run a Workflow of a Podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: 'Podcast Name',
            type: 'string',
            required: true
        },
        workflow: {
            description: 'Name of the workflow',
            type: 'ref',
            required: true,
            model: 'BusinessFlow'
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
        // inputs contains the obj for the this method.
        let args = inputs.req.body;
        let podcast = Podcast.find(args.podcast);
        let workflows = podcast.blueprint.workflows;
        let workflow = undefined;
        for(let wname in workflows) {
            if(workflows[wname].name === args.workflow) {
                workflow = workflows[wname];
                break;
            }
        }
        if(!workflow) {
            inputs.res.json({error: 'Workflow not found!'})
            return;
        }
        if(args.getParams) {
            inputs.res.json(workflow.inputs);
            return;
        }
        if(workflow) {
            workflow.fn(podcast, args);
        }
        inputs.res.json({ message: "Completed"});
        return;
    }
};
