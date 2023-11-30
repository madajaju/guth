const path = require('path');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote Episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        episode: {
            description: 'ID of the episode to publish',
            type: 'string', // string|boolean|number|json
            required: true
        },
        channels: {
            description: 'Channels to publish to. Comma Separated list',
            type: 'ref',
            required: true,
            model: 'Channel',
            cardinality: 'n'
        }
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
        let episode = Episode.find(inputs.id);
        if(!episode) {
            env.res.json({error: "Episode Not Found:"+ inputs.id});
            env.res.end("Done");
            return;
        }
        episode.promote({channels: inputs.channels});

        env.res.json({request: 'Episode Published!'});
        env.res.end("Published");
        return;
    }
};
module.exports = {
    friendlyName: 'promote',
    description: 'Promote an Episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        episode: {
            type: "string",
            required: true,
            description: "ID of the episode",
        },
        channel: {
            type: 'string',
            required: true,
            description: "Name of the channel to promote on."
        },
        asset: {
            type: 'string',
            required: true,
            description: "ID of the asset."
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
        let args = inputs;
        for(let aname in env.req.body) {
            args[aname]= env.req.body[aname];
        }
        // let podcast = obj;
        let channel = Channel.find(args.channel);
        let asset = Asset.find(args.asset);
        channel.promoteAsset({
            asset: asset,
            text: args.text,
            to: args.to
        });
        return episode;
    }
};
