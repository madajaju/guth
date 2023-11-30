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
        let episode = Episode.find(inputs.id);
        let stats = await episode.getStats();
        let skeys = Object.keys(stats).sort();
        let retval = { totals:[], values:[]};
        for(let i in skeys) {
            retval.totals.push({date: skeys[i], totals: stats[skeys[i]].totals, values: stats[skeys[i]].values});
        }

        if(env.res) {
            env.res.json(retval);
        }
        return retval;
    }
};
