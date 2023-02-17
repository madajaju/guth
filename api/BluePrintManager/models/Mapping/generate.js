const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
// const FileSystem = require('ailtire/src/Persist/YAMLFileSystem');

module.exports = {
    friendlyName: 'create',
    description: 'Create the business flow',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: 'Podcast to use the mapping on',
            type: 'ref', // string|boolean|number|json
            required: true
        },
        episode: {
            description: 'Podcast to use the mapping on',
            type: 'ref', // string|boolean|number|json
            required: true
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for this method.
        let episode = inputs.episode;
        let podcast = episode.owner;
        let context = {
            episode: episode,
            podcast: podcast,
        }
        for (let input in obj.inputs) {
            for (let aname in episode.artifacts) {
                if (episode.artifacts[aname].name === obj.inputs[input]) {
                    context[input] = episode.artifacts[aname];
                }
            }
        }
        try {
            let retval = ejs.render(obj.file, context);
            if (episode.repo) {
                let apath = path.resolve(`${episode.repo}/${obj.name}`);
                fs.writeFileSync(apath, retval);
                episode.addToArtifacts({name: obj.outputName, url: apath, artType: obj.outputType});
            }
        } catch (e) {
            console.error("Mapping Error for ", obj.name);
            console.error("Error parsing string:", e);
            console.error(obj.file);
        }

        return obj;
    }
};
