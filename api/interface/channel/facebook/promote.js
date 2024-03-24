const { IgApiClient } = require("instagram-private-api");
const fs =  require("fs");
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const {execSync} = require('child_process');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote an asset on the channel, for facebook',
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
        return null;
        let post = inputs.post;
        if (typeof asset === 'string') {
            post = Post.find(post);
        }
        let channel = post.channel;
        let asset = post.asset;
        let odChannel = Channel.find("onedrive");
        let artifact = asset.artifact;
        let afile = artifact.url;
        let extFile = path.extname(afile);
        let url = "";
        let episodePhoto = artifact.episode.thumbnail;

        let text = post.text || asset.summary;
        if(extFile === '.mp4') {
            let photo = getCoverImage(artifact.url);
            url = await submitVideo(text, artifact.url, photo, channel.creds.username, channel.creds.password);
        } else {
            let file = convertImage(artifact.url);
            url = await submitPhoto(text, file, channel.creds.username, channel.creds.password);
        }
        return url;
    }
};

function getCoverImage(video) {
    let file = video.replace('.mp4', '-mp4.jpg');
    let command = `ffmpeg -ss 3 -i "${video}" -frames:v 1 "${file}"`;
    execSync(command, {stdio: 'inherit'}); // stdio: 'inherit' will display stdout/stderr in
    return file;
}

function convertImage(image) {
    let extName = path.extname(image);
    if(extName === '.jpg' || extName === 'jpeg') {
        return image;
    } else {
        let file = video.replace(extName, '.jpg');
        let command = `ffmpeg -i ${image} ${file}`;
        execSync(command, {stdio: 'inherit'}); // stdio: 'inherit' will display stdout/stderr in
        return file;
    }
}

async function submitPhoto(text, image, username, password)
{
    try {
        const ig = new IgApiClient();
        ig.state.generateDevice(username);
        await ig.account.login(username, password);
        const imageBuffer = fs.readFileSync(image);
        let response = await ig.publish.photo({
            file: imageBuffer,
            caption: text
        });
        return `https://www.instagram.com/p/${response.media.code}/`;
    }
    catch(e) {
        console.log(e);
    }
}
async function submitVideo(text, video, photo, username, password)
{
    try {
        const ig = new IgApiClient();
        ig.state.generateDevice(username);
        await ig.account.login(username, password);
        const videoBuffer = fs.readFileSync(video);
        const photoBuffer = fs.readFileSync(photo);
        let response = await ig.publish.video({
            video: videoBuffer,
            coverImage: photoBuffer,
            caption: text
        });
        return `https://www.instagram.com/p/${response.media.code}/`;
    }
    catch(e) {
        console.log(e);
    }
}
