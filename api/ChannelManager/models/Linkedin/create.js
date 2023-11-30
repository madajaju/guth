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
        let posttype = new ArtifactType({name:"Post"});
        obj.addToTypes(posttype);
        let videotype = new ArtifactType({name:"Video"});
        obj.addToTypes(videotype);
        let blogtype = new ArtifactType({name:"Blog"});
        obj.addToTypes(blogtype);
        let arttype = new ArtifactType({name:"Article"});
        obj.addToTypes(arttype);
        let sdtype = new ArtifactType({name:"Slidedeck"});
        obj.addToTypes(sdtype);

        obj.authorized = false;
        return obj;
    }
};
