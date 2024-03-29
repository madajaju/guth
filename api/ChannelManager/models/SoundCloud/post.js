const path = require('path');

module.exports = {
    friendlyName: 'post',
    description: 'Post to the Channel',
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
        let posttype = new ArtifactType({name:"Post"});
        obj.addToTypes(posttype);
        let pctype = new ArtifactType({name:"Podcast"});
        obj.addToTypes(pctype);

        return obj;
    }
};
