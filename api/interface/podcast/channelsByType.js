module.exports = {
    friendlyName: 'channelsByType',
    description: 'Return the channels by the type of artifact',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: 'Podcast Name',
            type: 'string',
            required: true
        },
        artType: {
            description: 'Type of Artifact',
            type: 'string',
            required: true
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
        if (!podcast) {
            if (env.res) {
                env.res.json('Podcast Not Found:' + args.podcast);
            }
            return;
        }
        let retval = {};
        let channels = podcast.channels;
        for (let i in channels) {
            let channel = channels[i];
            let artTypes = channel.types;
            for (let j in artTypes) {
                let artType = artTypes[j];
                if (artType === args.artType || args.artType === 'all') {
                    retval[channel._attributes.name] = channel._attributes;
                }
            }
        }
        if (env.res) {
            env.res.json({results: {values: retval, number: retval.length}});
        }
        return;
    }
};
