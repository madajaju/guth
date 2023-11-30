const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Description of the action',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {

        // Normalize the tags to lowercase no spaces
        if(inputs.name) {
            obj.name = inputs.name.replaceAll(/\s/g,'').toLowerCase();
            obj.id = inputs.name.replaceAll(/\s/g, '').toLowerCase();
        } else if(inputs.id) {
            obj.name = inputs.id.replaceAll(/\s/g, '').toLowerCase();
            obj.id = inputs.id.replaceAll(/\s/g, '').toLowerCase();
        }
        return obj;
    }
};
