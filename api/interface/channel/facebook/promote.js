const fbSDK = require("facebook-nodejs-business-sdk");
const fs =  require("fs");
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const {execSync} = require('child_process');
const bizSdk = require("facebook-nodejs-business-sdk");

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
        let post = inputs.post;
        if (typeof post === 'string') {
            post = Post.find(post);
        }
        // Short circuit to throw exception.
       //  post.failed({message:"Facebook channel broken!"});
       //  throw new Error("Post Failed");

        let channel = post.channel;

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

        let text = post.text || asset.summary;
        if(artifact.artType.name === 'video' || extFile === '.mp4') {
            let photo = await getCoverImage(artifact);
            // Not Working url = await submitVideo(text, artifact, photo.remoteURL, channel.creds.pages.edt);
            url = await submitPhoto(text, photo.remoteURL, channel.creds.pages.edt);
        } else if(artifact.artType.name === 'image') {
            let file = convertImage(artifact);
            url = await submitPhoto(text, file.remoteURL, channel.creds.pages.edt);
        } else {
            url = await submitPhoto(text, episodePhoto, channel.creds.pages.edt);
        }
        return url;
    }
};

async function getCoverImage(artifact) {
    let video = artifact.url;
    let newName = artifact.name.replace('.mp4','-mp4.jpg');
    let file = video.replace('.mp4', '-mp4.jpg');
    let command = `ffmpeg -y -ss 3 -i "${video}" -frames:v 1 "${file}"`;
    execSync(command, {stdio: 'inherit'}); // stdio: 'inherit' will display stdout/stderr in
    // Create the new artifact and then publish it up to the blob storage.
    let newArtifact = artifact.episode.addToArtifacts({name:newName, url:file, artType:'Image'});
    await AService.call("channel/azure/upload", {channel: 'azure', artifact:newArtifact});
    newArtifact.episode.saveMe();
    return newArtifact;
}

async function convertImage(image) {
    let extName = path.extname(image.url);
    if(extName === '.jpg' || extName === 'jpeg') {
        return image;
    } else {
        let file = image.url.replace(extName, '.jpg');
        let newName = image.name.replace(extName, ".jpg");
        let command = `ffmpeg -i ${image} ${file}`;
        execSync(command, {stdio: 'inherit'}); // stdio: 'inherit' will display stdout/stderr in
        let newArtifact = image.episode.addToArtifacts({name:newName, url:file, artType:'Image'});
        await AService.call("channel/azure/upload", {channel: 'azure', artifact:newArtifact});
        return newArtifact;
    }
}

async function submitPhoto(text, image, page) {
    try {
        const api = fbSDK.FacebookAdsApi.init(page.token);
        const Page = fbSDK.Page;
        const newPage = new Page(page.id);
        const photo = await newPage.createPhoto([],
            {url: image, 'published': 'false'});
        const post = await newPage.createFeed([], {
            message: text,
            attached_media: JSON.stringify([{media_fbid: photo.id}])
        })
        return post.id;
    }
    catch(e) {
        console.log(e);
    }
}
async function submitVideo(text, video, photo, page) {

    // Not Working
    let newVideo = await _limitDuration(video, 60);

    try {
        const api = fbSDK.FacebookAdsApi.init(page.token);
        const PagePost = fbSDK.PagePost;
        const AdVideo = fbSDK.Video
        const fvideo = new Video(null, {} , page.id);
        fvideo.name = "";
        fvideo.description = text;
        fvideo.filepath = newVideo.url;
        let myVideo = await fvideo.create();
        const pagePost = new PagePost(null, page.id);
        pagePost.message = text;
        pagePost.attachments = {
            media: [{
                media_type: 'video',
                video_data: {
                    video: myVideo.id
                }
            }]
        }
        let myPost = await pagePost.create();
        return myPost.url;
    }
    catch(e) {
        console.log(e);
    }
}

async function _limitDuration(artifact, duration) {
    if(_videoDuration(artifact.url) > duration) {
        let newFile = artifact.url.replace('\.mp4', `-cut${duration}.mp4`);
        if(!fs.existsSync(newFile)) {
            let command = `ffmpeg -i "${artifact.url}" -vf trim=duration=${duration} "${newFile}"`;

            try {
                console.log(command);
                execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
                let newName = path.basename(newFile);
                let newArtifact = artifact.episode.addToArtifacts({name:newName, url:newFile, artType:'Video'});
                await AService.call("channel/azure/upload", {channel: 'azure', artifact:newArtifact});
                return newArtifact;
            } catch (e) {
                console.error(`could not run command ${command}`, e);
            }
        } else {
            let newName = path.basename(newFile);
            let newArtifact = artifact.episode.artifacts[newName];
            if(!newArtifact) {
                newArtifact = artifact.episode.addToArtifacts({name:newName, url:newFile, artType:'Video'});
                await AService.call("channel/azure/upload", {channel: 'azure', artifact:newArtifact});
                return newArtifact;
            } else if(!newArtifact.remoteURL) {
                await AService.call("channel/azure/upload", {channel: 'azure', artifact:newArtifact});
                return newArtifact;
            }
        }
    } else {
        if(!artifact.remoteURL) {
            await AService.call("channel/azure/upload", {channel: 'azure', artifact:artifact});
        }
        return artifact;
    }
}
function _videoDuration(file) {
    let command = `ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 "${file}"`;

    try {
        console.log(command);
        let output = execSync(command); // stdio: 'inherit' will display stdout/stderr in
        return parseFloat(output.toString());
    }
    catch(e) {
        console.error(`could not run command ${command}`, e);
    }
}
