module.exports = {
    friendlyName: 'promote',
    description: 'Promote episode or asset on a Channel',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        channel: {
            description: 'ID of the workflow',
            type: 'string',
            required: true,
        },
        episode: {
            description: 'Workflow of the mapping',
            type: 'string',
            required: false
        },
        asset: {
            description: 'Inputs of the mapping target:artifact',
            type: 'string',
            required: false
        },
        text: {
            description: "Text for the promotion",
            type: 'string',
            required: true
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
        let args = env.req.body;
        for(let i in inputs) {
            args[i] = inputs[i];
        }
        let channel = Channel.find(args.channel);
        if(!channel) {
            console.error("Channel not found!", args.channel);
            env.res.json({status:"Error", message:"Channel not found!"});
            return;
        }
        if(args.episode) {
            args.episode = Episode.find(args.episode);
        }
        if(args.asset) {
            args.asset = Asset.find(args.asset);
        }
        let results = channel.promoteAsset(args);
        if(env.res) {
            env.res.json(results);
        }
        return results;
    }
}
