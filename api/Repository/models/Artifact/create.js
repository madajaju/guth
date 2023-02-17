const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Create the artifact',
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
        obj.name = inputs.name || obj.name;
        obj.url = inputs.url || obj.url || "TBD";
        obj.ext = inputs.ext || undefined;
        if(inputs.artType) {
            let tobj = new ArtifactType({name: inputs.artType});
            obj.artType = tobj;
            tobj.addToArtifacts(obj);
        }
        if(inputs.episode) {
            let episode = Episode.find(inputs.episode)
            if(episode) {
                obj.episode = episode;
                episode.addToArtifacts(obj);
            }
        }
        if(inputs.file) {
            if(inputs.file.type) {
                let tobj = new ArtifactType({name: inputs.file.type});
                obj.artType = tobj;
                tobj.addToArtifacts(obj);
            }
            if(inputs.file.url) {
                obj.url = inputs.file.url;
            }
        }
        return obj;
    }
};
