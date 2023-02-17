const path = require('path');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote Episode',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        channels: {
            description: 'Channels to promote to. Comma Separated list',
            type: 'string',
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
        let episode = obj;
        let podcast = episode.owner;
        let channels = podcast.channels;
        let date = new Date();
        let retval = [];
        if(inputs.date) {
            date = new Date(inputs.date);
        }
        if(inputs.channels) {
            for(let cname in channels) {
                if(inputs.channels.includes(cname)) {
                    let channel = channels[cname];
                    retval.push(_promoteToChannel(episode,channel));
                }
            }
        } else {
            for(let cname in channels) {
                let channel = channels[cname];
                retval.push(_promoteToChannel(episode, channel));
            }
        }
        if(env && env.res) {
            env.res.json(retval);
            env.res.end("Done");
        }
        return retval.flat();
    }
};

function _promoteToChannel(episode, channel) {
    // promote the assets from the episode.
    let date = new Date();
    let retval = [];
    for(let i in episode.assets) {
        let asset = episode.assets[i];
        let post = channel.promoteAsset({asset:asset, date: date});
        retval.push(post);
        episode.addToPosts(post);
    }
    return retval;
}
