const path = require('path');
const fs = require('fs');
const FileSystem = require('ailtire/src/Persist/YAMLFileSystem');

module.exports = {
    friendlyName: 'createEpisode',
    description: 'Create and Episode',
    inputs: {
        name: {
            description: 'Name of the Episode',
            type: 'string',
            required: false
        },
        title: {
            description: 'Title of the Episode',
            type: 'string',
            required: false
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
        let podcast = obj;
        // Create episode
        try {
            let numOfEpisodes = podcast.episodes.length;
            let episode = new Episode({name: `${podcast.name}-${++numOfEpisodes}`, title: inputs.title, owner: podcast})

            // Create Directory hiearchy
            let dpath = path.resolve(`${ailtire.config.repoDir}/${podcast.name}`);
            let apath = path.resolve(`${dpath}/${episode.name}`);
            episode.repo = apath;
            fs.mkdirSync(apath, {recursive:true});
            fs.mkdirSync(`${apath}/Video`, {recursive:true});

            // Copy artifacts into the directory.
            fs.copyFileSync(dpath +'/Base/Base.prproj', `${apath}/Video/Base.prproj`);
            fs.copyFileSync(dpath +'/Base/Short.prproj', `${apath}/Video/Short.prproj`);
        }
        catch(e) {
            console.error(e);
        }

        return podcast;
    }
};

