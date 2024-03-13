module.exports = {
    friendlyName: 'create',
    description: 'Create the Facebook Channel',
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
        let videotype = new ArtifactType({name:"Video"});
        obj.addToTypes(posttype);
        obj.addToTypes(videotype);
        obj.authorized = true;
        return obj;
    }
};
