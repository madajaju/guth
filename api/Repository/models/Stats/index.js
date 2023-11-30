
class Stats {
    static definition = {
        name: 'Stats',
        description: 'Statistics gathered for elements in the solution',
        attributes: {
            date: {
                type: 'string',
                description: 'Date the statistic is collected',
            },
            values: {
                type: 'json',
                description: 'name value pairs for the statistics collected. Stats for the Date collected.'
            },
            totals: {
                type: 'json',
                description: 'name value pairs for the statistics collected. Cummulative.'
            }
        },
        associations: {
        },
    }
}

module.exports = Stats;

