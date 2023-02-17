const path = require('path');

module.exports = {
    friendlyName: 'createEpisode',
    description: 'Create and Episode',
    inputs: {
        episode: {
            description: 'Name of the Episode',
            type: 'string',
            required: false
        },
    },
    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        let podcast = obj;
        let mappings = this.mappings;
        let episode = Episode.find(inputs.episode);
        for(let mname in mappings) {
            let mapping = mappings[mname];
            mapping.generate({episode:episode});
        }

        return episode;
    }
};

