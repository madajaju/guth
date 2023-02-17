const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Create a SocialHandle',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            description: 'name of the handle',
            type: 'string', // string|boolean|number|json
            required: true
        },
        stype: {
            description: 'Channel of the social handle',
            type: 'string', // string|boolean|number|json
            required: true
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
        if(inputs.stype) {
            let channel = Channel.find(inputs.stype);
            if(channel) {
               obj.channel = channel;
            }
        }
        obj.name = inputs.name;
        obj.stype = inputs.stype;
        return obj;
    }
};
