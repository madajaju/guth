module.exports = {
    friendlyName: 'createWorkflow',
    description: 'Create Workflow to Podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        workflow: {
            description: 'Workflow of the mapping',
            type: 'string',
            required: true
        },
        name: {
            description: 'Name of the mapping',
            type: 'string',
            required: true
        },
        template: {
            description: 'File name of the template for the mapping',
            type: 'file',
            required: false
        },
        inputs: {
            description: 'Inputs of the mapping target:artifact',
            type: 'json',
            required: false
        },
        output: {
            description: 'Output of the mapping name: myName, type: AssetType',
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
        // inputs contains the obj for the this method.
        let args = inputs.req.body;
        let workflow = BusinessFlow.find(args.workflow);
        if(!workflow) {
            if(inputs.res) {
                inputs.res.json('Workflow Not Found:' + args.workflow);
            }
            return;
        }
        let mapping = new Mapping({
            name: args.name,
            outputType: args.output.type,
            outputName: args.output.name,
            file: args.template,
            inputs: args.inputs
        });
        workflow.addToMappings(mapping);

        if(inputs.res)  {
            inputs.res.json({results: {id: workflow.id, name: workflow.name}});
        }
        return;
    }
};
