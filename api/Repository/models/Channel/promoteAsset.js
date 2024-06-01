const path = require('path');
const AClass = require('ailtire/src/Server/AClass');

module.exports = {
    friendlyName: 'promoteAsset',
    description: 'Promote Asset on the Channel',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        asset: {
            description: 'Promote Asset on the Channel',
            type: 'ref', // string|boolean|number|json
            required: true
        },
        body: {
            description: 'Text of the post for the promotion of the asset',
            type: 'string',
            required: false,
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
        let body = inputs.body;
        let asset = inputs.asset;
        if(typeof asset === 'string') { asset = Asset.find(asset); }
        let episode = inputs.episode;
        if(typeof asset === 'string') { episode = Episode.find(episode)}
        let episodePhoto =null;
        let thumbnailArtifact = episode.artifacts[episode.thumbnail];
        if(thumbnailArtifact) {
            episodePhoto = thumbnailArtifact.url;
        }
        if(!episodePhoto)  {
            throw new Error(`Thumbnail is not set!! on ${episode.id} `);
        }
        let artifact = asset.artifact;
        let video = null;
        let photo = null;
        if(artifact.artType.name === 'video') {
            photo = Post.getCoverImage({artifact:artifact});
            video = Post.limitDuration({artifact:artifact, duration:60});
        } else if(artifact.artType.name === 'image') {
            photo = Post.convertImage({artifact:artifact});
        } else {
            photo = episodePhoto;
        }

        if(asset) {
            let post = new Post({
                channel: obj,
                text: body,
                name: 'Post: ' + inputs.asset.name,
                asset: inputs.asset,
                episode: inputs.episode,
                video: video,
                photo: photo,
                shareURL: asset.url,
            });
            obj.addToPosts(post);
            if (asset) {
                asset.addToPosts(post);
            }
            if (episode) {
                post.episode.addToPosts(post);
                post.episode.saveMe();
            }
        }
        return {redirect: obj.url, message:"Cut and paste into Window"};
    }
};
