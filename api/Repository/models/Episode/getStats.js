const path = require('path');

module.exports = {
    friendlyName: 'getStats',
    description: 'Get Stats for the episode',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let stats = {};
        for(let i in obj.assets) {
            let asset = obj.assets[i];
            await asset.gatherStats();
            let tstats = asset.stats;
            let astats = {};
            for(let j in tstats) {
                let stat = tstats[j];
                let sdate = new Date(stat.date);
                sdateString = `${sdate.getFullYear()}-${sdate.getMonth() + 1}-${sdate.getDate()}`;
                astats[sdate.getTime()] = {date: sdateString, values: stat.values, totals: stat.totals };
            }
            let skeys = Object.keys(astats).sort();
            let previousStat = null;
            for(let j in skeys) {
                let stat = astats[skeys[j]];
                if(previousStat) {
                    if (stat.values && !stat.totals) {
                        stat.totals = {};
                        for (let name in stat.values) {
                            stat.totals[name] = previousStat.totals[name] + stat.values[name];
                        }
                    } else if (stat.totals && !stat.values) {
                        // Assign values to the totals.
                        stat.values = {};
                        for (let name in stat.totals) {
                            stat.values[name] = stat.totals[name] - previousStat.totals[name];
                        }
                    } else if(!stat.totals && !stat.values) {
                        stat.totals = {};
                        stat.values = {};
                    }
                    // Set the stat with all of the previous values if they are not set for total and 0 for values
                    for(let name in previousStat.totals) {
                        if(!stat.totals) {
                            stat.totals = {};
                        }
                        if(!stat.values) {
                            stat.values = {};
                        }
                        if(!stat.totals[name]) {
                            stat.totals[name] = previousStat.totals[name];
                        }
                        if(!stat.values[name]) {
                            stat.values[name] = 0;
                        }
                    }
                } else {
                    if(stat.values && !stat.totals) {
                        stat.totals = {};
                        // set the totals to the values;
                        for (let name in stat.values) {
                            stat.totals[name] = stat.values[name];
                        }
                        // Make sure everything is an int.
                        for(let name in stat.values) {
                            stat.values[name] = stat.values[name];
                        }
                        // Make sure everything is an int.
                        for(let name in stat.totals) {
                            stat.totals[name] = stat.totals[name];
                        }
                    } else if (stat.totals && !stat.values) {
                        stat.values = {};
                        // Set the values to the totals since there are no previous.
                        for(let name in stat.totals) {
                            stat.values[name] = stat.totals[name];
                        }
                        // Make sure everything is an int.
                        for(let name in stat.totals) {
                            stat.totals[name] = stat.totals[name];
                        }
                    } else if(!stat.totals && !stat.values) {
                        stat.totals = {};
                        stat.values = {};
                    }
                }
                previousStat = stat;
            }
            // Now take the asset stats and combine them with the episode stats.
            for(let aindex in astats) {
                let mdate = astats[aindex].date;
                if(!stats.hasOwnProperty(mdate)) {
                    stats[mdate] = {totals:{}, values:{}};
                }
                let astat = astats[aindex];
                for(let name in astat.values) {
                    if(!stats[mdate].totals.hasOwnProperty(name)) {
                       stats[mdate].totals[name] = 0;
                    }
                    stats[mdate].totals[name] += astat.totals[name];

                    if(!stats[mdate].values.hasOwnProperty(name)) {
                        stats[mdate].values[name] = 0;
                    }
                    stats[mdate].values[name] += astat.values[name];
                }
            }
        }
        obj.saveMe();
        return stats;
    }
};
