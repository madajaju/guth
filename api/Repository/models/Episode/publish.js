const path = require('path');

module.exports = {
    friendlyName: 'publish',
    description: 'Publish the Episode to the channels in the podcast or specific podcast.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'Episode to publish.',
            type: 'string', // string|boolean|number|json
            required: true,
        },
        channels: {
            description: 'Channels to publish assets comma separated',
            type: 'string', // string|boolean|number|json
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
        // inputs contains the obj for the this method.
        let episode = obj;
        let podcast = episode.owner;
        let date = new Date();
        if(inputs.date) {
           date = new Date(inputs.date);
        }
        episode.releaseDate = date;
        episode.state = "Published";
        episode.saveMe();
        return episode;
    }
};
