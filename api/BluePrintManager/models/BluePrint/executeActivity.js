module.exports = {
    friendlyName: 'executeActivity',
    description: 'Execute a activity in the blueprint',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        activity: {
            description: 'Name of the activity to execute',
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

    fn: async function (obj, inputs, env) {
        for (let i in obj.activities) {
            let activity = obj.activities[i];
            if (activity.name === inputs.activity) {
                let retval = await activity.fn(obj, inputs.parameters);
                console.log("Done Calling ExecuteActivity:", inputs.activity, retval);
                return retval;
            }
        }
        return;
    }
};
