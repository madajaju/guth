const fbSDK = require("facebook-nodejs-business-sdk");
const fs =  require("fs");
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const {execSync} = require('child_process');
const bizSdk = require("facebook-nodejs-business-sdk");

module.exports = {
    friendlyName: 'generatePost',
    description: 'Generate Post on the channel, for facebook',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        post: {
            description: 'Post to be Posting',
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

    fn: async function (inputs, env) {
        let post = inputs.post;
        if (typeof post === 'string') {
            post = Post.find(post);
        }

        let asset = post.asset;
        let artifact = asset.artifact;
        let afile = artifact.url;
        let extFile = path.extname(afile);
        let url = "";
        let episode = artifact.episode;
        let episodePhoto = undefined;
        let thumbnailArtifact = episode.artifacts[artifact.episode.thumbnail];
        if(thumbnailArtifact) {
            episodePhoto = thumbnailArtifact.remoteURL;
            if(!episodePhoto) {
                // Load it to the blob store.
                await AService.call("channel/azure/upload", {channel: 'azure', artifact:thumbnailArtifact});
                episodePhoto = thumbnailArtifact.remoteURL;
            }
        }
        if (!episodePhoto) {
            let tartifact = episode.artifacts[`en/${artifact.episode.thumbnail}`];
            if(tartifact) {
                episodePhoto = tartifact.remoteURL;
                if(!episodePhoto) {
                    // Load it to the blob store.
                    await AService.call("channel/azure/upload", {channel: 'azure', artifact:tartifact});
                    episodePhoto = tartifact.remoteURL;
                }
            }
        }
        if(artifact.artType.name === 'video' || extFile === '.mp4') {
            post.photo = await Post.getCoverImage(artifact);
            post.video = await Post.limitDuration(artifact, 60);
        } else if(artifact.artType.name === 'image') {
            post.photo = Post.convertImage(artifact);
        } else {
            post.photo = episodePhoto;
        }
        return url;
    }
};
