const path = require('path');
const AClass = require('ailtire/src/Server/AClass');

module.exports = {
    friendlyName: 'factory',
    description: 'Create a Channel with the factory',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            description: 'Name of the Channel',
            type: 'string', // string|boolean|number|json
            required: true
        },
        type: {
            description: 'Type of the Channel',
            type: 'string', // string|boolean|number|json
            required: true
        },
        user: {
            description: 'User of the Channel',
            type: 'string', // string|boolean|number|json
            required: false
        },
        creds: {
            description: 'Credentials of the User on the Channel',
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

    fn: function (cls, inputs, env) {
        // inputs contains the obj for the this method.

        let tcls = AClass.getClass(inputs.type);
        let obj;
        if(tcls) {
            obj = new tcls(inputs);
        }
        obj.type = inputs.type;
        return obj;
    }
};
