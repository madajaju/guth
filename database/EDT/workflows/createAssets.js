const path = require('path');
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
            // Create standard artifacts
            episode.addToArtifacts({})
            episode.addToArtifacts({name: "VideoPrimary", url: "", artType: "Video"});
            episode.addToArtifacts({name: "VideoShort", url: "", artType: "Video"});
            episode.addToArtifacts({name: "Podcast", url: "", artType: "Audio"});
            episode.addToArtifacts({name: "Transcript", url: "", artType: "Blog"});
            episode.addToArtifacts({name: "PDF", url: "", artType: "Blog"});
            // Create Directory hiearchy
            // Copy artifacts into the directory.
        }
        catch(e) {
            console.error(e);
        }

        return podcast;
    }
};

