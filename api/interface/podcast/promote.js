const path = require('path');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote Episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: 'ID of the podcast to promote',
            type: 'string', // string|boolean|number|json
            required: true
        },
        solutions: {
            description: 'Solutions to promote',
            type: 'ref', // string|boolean|number|json
            required: false,
            cardinality: 'n',
            model: 'Solution'
        },
        products: {
            description: 'Products to promote',
            type: 'ref', // string|boolean|number|json
            required: false,
            cardinality: 'n',
            model: 'Product'
        },
        tags: {
            description: 'Tags to promote',
            type: 'ref', // string|boolean|number|json
            required: false,
            cardinality: 'n',
            model: 'Tag'

        },
        date: {
            description: 'Date to post the promotion',
            type: 'date', // string|boolean|number|json
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

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let podcast = Podcast.find(inputs.podcast);
        if (!podcast) {
            env.res.json({error: "Podcast Not Found:" + inputs.id});
            env.res.end("Done");
            return;
        }
        podcast.promote(inputs);

        env.res.json({request: 'Podcast Promoted!'});
        env.res.end("Promoted");
        return;
    }
};
