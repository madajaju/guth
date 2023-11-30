module.exports = {
    friendlyName: 'getStats',
    description: 'Gather Stats for a youtube asset',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        asset: {
            description: 'Asset to get statistics',
            type: 'ref',
            required: true,
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (obj, inputs, env) {
        let stats = {};
        return stats;
    }
};
