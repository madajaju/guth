const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Create the Channel',
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
        // inputs contains the obj for the this method.
        for(let i in inputs) {
            obj[i] = inputs[i];
        }
        let blogtype = new ArtifactType({name:"Blog"});
        obj.addToTypes(blogtype);

        return obj;
    }
};
