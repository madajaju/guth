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

    fn: async function (inputs, env) {
        // inputs contains the obj for the this method.
        let podcast = Podcast.find(inputs.id);
        // Get twitter information
        let channel = Channel.find('twitter');
        let results = await channel.getStats();
        let stats = {totals: {}, episodes: {}};
        let total = podcast.episodes.length;
        AEvent.emit('getStats.inprogress', {message: `Started`});
        if(podcast) {
            for(let i in podcast.episodes) {
                let episode = podcast.episodes[i];
                stats.episodes[episode.name] = await episode.getStats();
                AEvent.emit('getStats.inprogress', {message: `${i/total * 100}%`});
                for(let mdate in stats.episodes[episode.name]) {
                    if(!stats.totals.hasOwnProperty(mdate)) {
                        stats.totals[mdate] = { totals:{}, values:{}};
                    }
                    let estat = stats.episodes[episode.name][mdate];
                    for(let name in estat.totals) {
                        if (!stats.totals[mdate].totals.hasOwnProperty(name)) {
                            stats.totals[mdate].totals[name] = 0;
                        }
                        if (!stats.totals[mdate].values.hasOwnProperty(name)) {
                            stats.totals[mdate].values[name] = 0;
                        }
                        stats.totals[mdate].values[name] += estat.values[name];
                        stats.totals[mdate].totals[name] += estat.totals[name];
                    }
                }
            }
        }
        AEvent.emit('getStats.completed', {message: `Completed`});
        let skeys = Object.keys(stats.totals).sort();
        let retval = { totals:[], values:[]};
        for(let i in skeys) {
            retval.totals.push({date: skeys[i], totals: stats.totals[skeys[i]].totals, values: stats.totals[skeys[i]].values});
        }

        if(env.res) {
            env.res.json(retval);
        }
        return retval;
    }
};
