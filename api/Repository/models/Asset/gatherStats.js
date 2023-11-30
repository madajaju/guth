const path = require('path');

module.exports = {
    friendlyName: 'gatherStats',
    description: 'Gather Stats of an Asset',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (obj, inputs, env) {
        let retval = obj.stats;
        let map = {};
        let foundToday = false;
        let now = new Date();
        for(let i in retval) {
            let sdate = new Date(date);
            if(sdate.getFullYear() === now.getFullYear() &&
                sdate.getMonth() === now.getMonth() &&
                sdate.getDate() === now.getDate() ) {
                foundToday = true;
            }
            map[retval[i].date] = retval[i];
        }

        if(!foundToday && obj.channel) {
            let stats = await obj.channel.getStats({asset: obj});
            if(stats) {
                for (let i in stats) {
                    let stat = stats[i];
                    if (!map.hasOwnProperty(stat.date)) {
                        let statObj = obj.addToStats(stat);
                        map[stat.date] = statObj;
                    }
                    // Do nothing right now. Maybe compare and select the larger value.
                    for (let j in stat.values) {
                        let value = stats.values[j];

                    }
                    for (let j in stat.totals) {
                        let total = stat.totals[j];
                    }
                }
            }
        }
        return obj.stats;
    }
};
