module.exports = {
    friendlyName: 'promote',
    description: 'Promote episode or asset on a Channel',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'ID of the workflow',
            type: 'string',
            required: true,
        },
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
        let args = env.req.body;
        for(let i in inputs) {
            args[i] = inputs[i];
        }
        let channel = Channel.find(args.id);
        if(!channel) {
            console.error("Channel not found!", args.channel);
            env.res.json({status:"Error", message:"Channel not found!"});
            return;
        }
        let retval = channel.definition.methods.promoteAsset.inputs;
        env.res.json({results: retval});
        return;
    }
}
