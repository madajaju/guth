const path = require('path');

module.exports = {
    friendlyName: 'match',
    description: 'Get all Prdocuts that match',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        regex: {
            description: 'Regular expression to match',
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

    fn: function (cls, inputs, env) {
        // inputs contains the obj for the this method.
        let regex = inputs.regex.replace(/,/g,'|');
        let re = new RegExp(regex);
        let retval = [];
        for(let name in global._instances.Product) {
            if(name.match(re)) {
               retval.push(global._instances.Product[name]);
            }
        }
        return retval;
    }
};
