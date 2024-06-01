const {IgApiClient} = require("instagram-private-api");
const fs = require("fs");
const path = require('path');
const {execSync} = require('child_process');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote an asset on the channel, for instagram',
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
        // inputs contains the obj for the this method.
        let post = inputs.post;
        if (typeof post === 'string') {
            post = Post.find(post);
        }
        let channel = post.channel;
        if (!channel) {
            throw new Error("Channel Not defined for instagram");
        }
        let asset = post.asset;
        if (!asset) {
            throw new Error("Asset Not defined for instagram");
        }
        let artifact = asset.artifact;
        if (!artifact) {
            throw new Error("Artifact Not defined for instagram");
        }
        let afile = artifact.url;
        let extFile = path.extname(afile);
        let url = "";
        let episodePhoto = artifact.episode.thumbnail;
        let episodeFile = path.resolve(path.dirname(post.episode.saveFile) + '/Production/' + episodePhoto);
        if (!fs.existsSync(episodeFile)) {
            episodeFile = path.resolve(path.dirname(post.episode.saveFile) + '/Production/en/' + episodePhoto);
        }
        try {
            let text = post.text || asset.summary;
            if (extFile === '.mp4') {
                let photo = getCoverImage(artifact.url);
                url = await submitVideo(text, artifact.url, photo, channel.creds.username, channel.creds.password);
            } else if (artifact.artType === 'image') {
                let file = convertImage(artifact.url);
                if (file) {
                    url = await submitPhoto(text, file, channel.creds.username, channel.creds.password);
                } else {
                    throw new Error("File not converted for instagram");
                }
            } else {
                let file = convertImage(episodeFile);
                url = await submitPhoto(text, file, channel.creds.username, channel.creds.password);
            }
            return url;
        } catch (e) {
            post.failed({message: e});
            throw new Error("Post Failed." + e);
        }
    }
};

function getCoverImage(video) {
    let file = video.replace('.mp4', '-mp4.jpg');
    if (!fs.existsSync(file)) {
        let command = `ffmpeg -y -ss 15 -i "${video}" -frames:v 1 "${file}"`;
        try {
            console.log(command);
            execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
            return file;
        } catch (e) {
            console.log("Could not convert video to image:", video);
            throw new Error("Could not convert video to image");
        }
    } else {
        return file;
    }
}

function convertImage(image) {
    let extName = path.extname(image);
    let file = image.replace(extName, '1080x1080.jpg');
    if (!fs.existsSync(file)) {
        let command = `ffmpeg -y -i "${image}" -vf scale="'if(gt(iw,ih),-1,1080):if(gt(iw,ih),1080,-1)', crop=1080:1080:exact=1" "${file}"`;
        try {
            console.log(command);
            execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
            return file;
        } catch (e) {
            console.error("Could not convert: ", image);
            throw new Error("Could not convert image");
        }
    } else {
        return file;
    }
}

async function submitPhoto(text, image, username, password) {
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
    } catch (e) {
        console.error("Could not submit Photo", e);
        throw new Error("Could not submit Photo " + e);
    }
}

async function submitVideo(text, video, photo, username, password) {
    try {
        if (fs.statSync(video).size / (1024 * 1024) < 100) {
            const ig = new IgApiClient();
            ig.state.generateDevice(username);
            await ig.account.login(username, password);
            const videoBuffer = fs.readFileSync(video);
            // Make sure it is smaller than 100 MB.
            const photoBuffer = fs.readFileSync(photo);
            let response = await ig.publish.video({
                video: videoBuffer,
                coverImage: photoBuffer,
                caption: text
            });
            return `https://www.instagram.com/p/${response.media.code}/`;
        } else {
            return submitPhoto(text, photo, username, password);
        }

    } catch (e) {
        console.log(e);
        throw new Error("Could not submit Video:" + e);
    }
}
