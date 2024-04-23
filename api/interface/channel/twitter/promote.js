const fs = require("fs");
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const {execSync} = require('child_process');
const {TwitterApi} = require('twitter-api-v2');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote an asset on the channel, for twitter',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        channel: {
            description: 'ID of the workflow',
            type: 'string',
            required: true,
        },
        post: {
            description: 'Post to promote',
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
        let channel = inputs.channel;
        if (typeof channel === 'string') {
            channel = Channel.find(channel);
        }
        let asset = post.asset;
        let episodePhoto = post.episode.thumbnail;
        let episodeFile = path.dirname(post.episode.saveFile) + '/Production/' + episodePhoto;
        if(!fs.existsSync(episodeFile)) {
            episodeFile = path.resolve(path.dirname(post.episode.saveFile) + '/Production/en/' + episodePhoto);
        }

        let creds = channel.creds;
        let url = "";
        let text = post.text || asset.summary;
        text = text.substring(0,180) + '... ';
        if(!asset) {
            let file = convertImage(episodeFile);
            if(file) {
                url = await submitPhoto(text, file, creds);
            } else {
                url = await submitTweet(text,creds);
            }
            return url;
        }
        text += asset.url;
        let artifact = asset.artifact;
        if(!artifact) { return null; }
        let afile = artifact.url;
        let extFile = path.extname(afile);
        try {
            if (extFile === '.mp4') {
                let photo = getCoverImage(artifact.url);
                // url = await submitVideo(text, photo, artifact.url, creds);
                url = await submitPhoto(text, photo, creds);
            } else if (artifact.artType === 'image') {
                let file = convertImage(artifact.url);
                if (file) {
                    url = await submitPhoto(text, file, creds);
                } else {
                    url = await submitTweet(text, creds);
                }
            } else {
                let file = convertImage(episodeFile);
                if (file) {
                    url = await submitPhoto(text, file, creds);
                } else {
                    url = await submitTweet(text, creds);
                }
            }
            return url;
        } catch(e) {
            post.failed({message:e });
            throw new Error("Post Failed");
        }
    }
};

function getCoverImage(video) {
    let file = video.replace('.mp4', '-mp4.jpg');
    if(!fs.existsSync(file)) {
        let command = `ffmpeg -y -ss 3 -i "${video}" -frames:v 1 "${file}"`;
        try {
            console.log(command);
            execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
            return file;
        } catch (e) {
            console.error("Could not convert video", command);
            throw new Error("Could not conver video." + e);
        }
    } else {
        return file;
    }
}

function convertImage(image) {
    let extName = path.extname(image);
    if (extName === '.jpg' || extName === 'jpeg') {
        return image;
    } else {
        let file = image.replace(extName, '.jpg');
        let command = `ffmpeg -y -i "${image}" "${file}"`;
        try {
            console.log(command);
            execSync(command,{ stdio: 'ignore' }); // stdio: 'inherit' will display stdout/stderr in
            return file;
        } catch(e) {
            console.log("Could not convert image:", command) ;
            throw new Error("Could not convert image." + e);
        }
    }
}
async function submitTweet(text, creds) {
    try {
        const client = new TwitterApi({
            appKey: creds.api_key,
            appSecret: creds.api_key_secret,
            accessSecret: creds.access_token_secret,
            accessToken: creds.access_token
        });
        let response = await client.v2.tweet({text: text});
        return response.data.id;
    } catch (e) {
        console.error(e);
        throw new Error("Could not submit tweet." + e);
    }
}
async function submitPhoto(text, image, creds) {
    try {
        const client = new TwitterApi({
            appKey: creds.api_key,
            appSecret: creds.api_key_secret,
            accessSecret: creds.access_token_secret,
            accessToken: creds.access_token
        });
        const appOnlyClientFromConsumer = await client.appLogin();
        let user = await client.currentUser();

        let imageRep = await client.v1.uploadMedia(image);
        let response = await client.v2.tweet({text: text, media: {media_ids: [imageRep]}});
        return response.data.id;
    } catch (e) {
        console.error(e);
        throw new Error("Could not submit photo." + e);
    }
}

async function submitVideo(text, video, photo, creds) {
    try {
        // const client = new TwitterApi({clientId: creds.clientId, clientSecret: creds.clientSecret});
        const client = new TwitterApi({
            appKey: creds.api_key,
            appSecret: creds.api_key_secret,
            accessSecret: creds.access_token_secret,
            accessToken: creds.access_token
        });
        // const client = new TwitterApi(creds.bearerToken);
        const rwClient = client.readWrite;
        let videoRep = await client.v1.uploadMedia(video, {type: 'longmp4'});
        let response = await client.v2.tweet({text: text, media: {media_ids: [videoRep]}});
        return response.data.id;
    } catch (e) {
        console.error(e);
        throw new Error("Could not submit video." + e);
    }
}
