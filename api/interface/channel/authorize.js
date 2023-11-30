module.exports = {
    friendlyName: 'authorize',
    description: 'Authorize the channel',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'ID of the Channel',
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

    fn: async function (inputs, env) {
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
        let results = channel.authorize();
        if(env.res) {
            env.res.json(results);
        }
        return results;
    }
}
