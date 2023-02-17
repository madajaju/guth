const path = require('path');
const fs = require('fs');
module.exports = {
    friendlyName: 'promote',
    description: 'Promote Episode',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        date: {
            description: 'Date to schedule the podcast',
            type: 'string',
            required: true
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
        let episode = obj;
        episode.scheduledDate = new Date(inputs.date);
        // Get the year of the scheduled Date and create a directory with the name in that directory.
        let baseDir = episode.owner.baseDirectory
        let yearDir = baseDir + '/' + episode.scheduledDate.getFullYear();
        let episodeDir = path.resolve(yearDir + '/' + episode.name);
        try {
            fs.mkdirSync(episodeDir);
        }
        catch(e) {
            console.error(`Could not create directory ${episodeDir}, ` , e);
        }
    }
};
