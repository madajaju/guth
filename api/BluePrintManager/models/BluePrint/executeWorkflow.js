module.exports = {
    friendlyName: 'executeWorkflow',
    description: 'Execute a workflow in the blueprint',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        workflow : {
            description: 'Name of the workflow to execute',
            type: 'string',
            required: true,
        },
        parameters: {
            description: 'JSON of arguments for the workflows.',
            type: 'json',
            required: false
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

        for(let i in obj.workflows) {
            let workflow = obj.workflows[i];
            if(workflow.name === inputs.workflow)  {
                return workflow.fn( obj, inputs.parameters);
            }
        }
        return;
    }
};
