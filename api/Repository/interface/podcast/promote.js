const path = require('path');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote Podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'ID of the podcast to promote',
            type: 'string', // string|boolean|number|json
            required: true
        },
        solutions: {
            description: 'Solutions to promote',
            type: 'string', // string|boolean|number|json
            required: false
        },
        products: {
            description: 'Products to promote',
            type: 'string', // string|boolean|number|json
            required: false
        },
        tags: {
            description: 'Tags to promote',
            type: 'string', // string|boolean|number|json
            required: false
        },
        date: {
            description: 'Date to post the promotion',
            type: 'string', // string|boolean|number|json
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

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        env.res.end("Done");
    }
};
