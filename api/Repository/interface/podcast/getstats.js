const path = require('path');

module.exports = {
    friendlyName: 'getstats',
    description: 'Get Stats of the podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'ID of the podcast to promote',
            type: 'string', // string|boolean|number|json
            required: true
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
        let podcast = Podcast.find(inputs.id);
        let stats = {totals:{}, episodes:{}};
        if(podcast) {
            for(let i in podcast.episodes) {
                let episode = podcast.episodes[i];
                stats.episodes[episode.name] = episode.getStats();
                for(let name in stats.episodes[episode.name]) {
                    if(!stats.totals.hasOwnProperty(name)) {
                        stats.totals[name] = 0;
                    }
                    stats.totals[name] += stats.episodes[episode.name];
                }
            }
        }
        if(env.res) {
            env.res.json(stats);
        }
        return stats;
    }
};
