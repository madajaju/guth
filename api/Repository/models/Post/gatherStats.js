const path = require('path');

module.exports = {
    friendlyName: 'gatherStats',
    description: 'Gather Stats of a Post',
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
        let stats = {};
        if(obj.channel) {
            stats = await obj.channel.getStats({post: obj});
        }
        return stats;
    }
};
