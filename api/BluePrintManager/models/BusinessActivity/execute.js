module.exports = {
    friendlyName: 'executeWorkflow',
    description: 'Execute a workflow in the blueprint',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
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
        return obj.fn(inputs);
    }
};
