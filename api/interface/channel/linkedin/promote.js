const fs = require("fs");
const path = require('path');
const axios = require('axios');
const {execSync} = require('child_process');
const {RestliClient} = require('linkedin-api-client');

module.exports = {
    friendlyName: 'promote',
    description: 'Promote an asset on the channel, for LinkedIn',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        post: {
            description: 'Post to be Posting',
            type: 'string',
            required: false
        },
        channel: {
            description: "Cha"
        }
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
        let asset = post.asset;
        if(!asset) {
            console.log("Asset not Found", post.id) ;
            throw new Error("Asset not found for linkedin");
        }
        let artifact = asset.artifact;
        if(!artifact) {
            throw new Error("Artifact not found for linkedin");
        }

        let afile = artifact.url;
        let extFile = path.extname(afile);
        let url = "";
        let episodePhoto = artifact.episode.thumbnail;
        let image = null;

        let text = post.text || asset.summary;
        let episodeFile = path.resolve(path.dirname(post.episode.saveFile) + '/Production/' + episodePhoto);
        if (!fs.existsSync(episodeFile)) {
            episodeFile = path.resolve(path.dirname(post.episode.saveFile) + '/Production/en/' + episodePhoto);
        }
        try {
            if (artifact.artType === 'video' || extFile === '.mp4') {
                // image = getCoverImage(artifact.url);
                url = await submitVideo(text, artifact, asset.title, asset.summary, channel.creds);
            } else if (artifact.artType === 'image') {
                image = convertImage(artifact.url);
                url = await submitImage(text, asset.url, asset.title, asset.summary, image, channel.creds);
            } else {
                image = convertImage(episodeFile);
                url = await submitImage(text, asset.url, asset.title, asset.summary, image, channel.creds);
            }
            return url;
        } catch(e) {
            post.failed({message: e});
            throw new Error("Post Failed." + e);
        }
    }
};

function getCoverImage(video) {
    let file = video.replace('.mp4', '-mp4.jpg');
    if(!fs.existsSync(file)) {
        let command = `ffmpeg -y -ss 15 -i "${video}" -frames:v 1 "${file}"`;
        try {
            console.log(command);
            execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
            return file;
        } catch (e) {
            console.error("Error calling:", command, e);
            throw new Error("Could not get cover image." + e);
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
            console.error("Error calling:", command, e);
            throw new Error("Could not convert image." + e);
        }
    } else {
        return file;
    }
}

async function submitVideo(text, video, title, description, creds) {
    // get the duration of the video
    let url = _limitDuration(video, 60);
    const client = new RestliClient();
    client.setDebugParams({enabled: true});
    const accessToken = creds.access_token;
    // Register your image or video to be uploaded.
    try {
        let response = await client.action({
            resourcePath: '/assets',
            actionName: 'registerUpload',
            accessToken: creds.access_token,
            data: {
                "registerUploadRequest": {
                    "recipes": [
                        "urn:li:digitalmediaRecipe:feedshare-video"
                    ],
                    "owner": `urn:li:person:${creds.id}`,
                    "serviceRelationships": [
                        {
                            "relationshipType": "OWNER",
                            "identifier": "urn:li:userGeneratedContent"
                        }
                    ]
                }
            }
        });

        let data = fs.readFileSync(url);
        let uploadURL = response.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
        let imageURN = response.data.value.asset;
        response = await axios({
            method: 'put', // use put method for file uploads
            url: uploadURL,
            headers: {
                'Authorization': `Bearer ${accessToken}`, // replace 'redacted' with your actual token
                'Content-Type': 'application/octet-stream'
            },
            data: data
        });
        response = await client.create({
            resourcePath: '/ugcPosts',
            accessToken: accessToken,
            entity: {
                author: `urn:li:person:${creds.id}`,
                lifecycleState: 'PUBLISHED',
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": 'PUBLIC'
                },
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": text,
                        },
                        "shareMediaCategory": "IMAGE",
                        "media": [
                            {
                                "status": "READY",
                                "description": {
                                    "text": description,
                                },
                                "media": imageURN,
                                "title": {
                                    "text": title
                                }
                            }
                        ]
                    }
                },
            }
        });
        return response.data.id;
    } catch (e) {
        console.error(e.response.statusText);
        throw new Error("Could not submit video." + e.response.statusText);
    }
    // Upload your image or video to LinkedIn.
    // Create the image or video share.
    try {
        response = await client.create({
            resourcePath: '/ugcPosts',
            accessToken: accessToken,
            entity: {
                author: `urn:li:person:${creds.id}`,
                lifecycleState: 'PUBLISHED',
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": 'PUBLIC'
                },
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: text
                        },
                        shareMediaCategory: "ARTICLE",
                        media: [
                            {
                                "status": "READY",
                                "description": {
                                    "text": description
                                },
                                "originalUrl": url,
                                "title": {
                                    "text": title,
                                }
                            }
                        ]
                    }
                },
            }
        });
        return response.data.id;
    } catch (e) {
        console.error(e);
        throw new Error("Could not submit video." + e);
    }

}

async function submitArticle(text, url, title, description, creds) {
    const client = new RestliClient();
    client.setDebugParams({enabled: true});
    const accessToken = creds.access_token;
    try {
        response = await client.create({
            resourcePath: '/ugcPosts',
            accessToken: accessToken,
            entity: {
                author: `urn:li:person:${creds.id}`,
                lifecycleState: 'PUBLISHED',
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": 'PUBLIC'
                },
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: text
                        },
                        shareMediaCategory: "ARTICLE",
                        media: [
                            {
                                "status": "READY",
                                "description": {
                                    "text": description
                                },
                                "originalUrl": url,
                                "title": {
                                    "text": title,
                                }
                            }
                        ]
                    }
                },
            }
        });
        return response.data.id;
    } catch (e) {
        console.error(e);
        throw new Error("Could not submit article." + e);
    }

}

async function submitImage(text, url, title, description, image, creds) {
    const client = new RestliClient();
    client.setDebugParams({enabled: true});
    const accessToken = creds.access_token;
    // Register your image or video to be uploaded.
    try {
        let response = await client.action({
            resourcePath: '/assets',
            actionName: 'registerUpload',
            accessToken: creds.access_token,
            data: {
                "registerUploadRequest": {
                    "recipes": [
                        "urn:li:digitalmediaRecipe:feedshare-image"
                    ],
                    "owner": `urn:li:person:${creds.id}`,
                    "serviceRelationships": [
                        {
                            "relationshipType": "OWNER",
                            "identifier": "urn:li:userGeneratedContent"
                        }
                    ]
                }
            }
        });

        let data = fs.readFileSync(image);
        let uploadURL = response.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
        let imageURN = response.data.value.asset;
        response = await axios({
            method: 'put', // use put method for file uploads
            url: uploadURL,
            headers: {
                'Authorization': `Bearer ${accessToken}`, // replace 'redacted' with your actual token
                'Content-Type': 'application/octet-stream'
            },
            data: data
        });
        response = await client.create({
            resourcePath: '/ugcPosts',
            accessToken: accessToken,
            entity: {
                author: `urn:li:person:${creds.id}`,
                lifecycleState: 'PUBLISHED',
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": 'PUBLIC'
                },
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {
                            "text": text,
                        },
                        "shareMediaCategory": "IMAGE",
                        "media": [
                            {
                                "status": "READY",
                                "description": {
                                    "text": description,
                                },
                                "media": imageURN,
                                "title": {
                                    "text": title
                                }
                            }
                        ]
                    }
                },
            }
        });
        return response.data.id;
    } catch (e) {
        console.error(e);
        throw new Error("Could not submit image." + e);
    }
    // Upload your image or video to LinkedIn.
    // Create the image or video share.
    try {
        response = await client.create({
            resourcePath: '/ugcPosts',
            accessToken: accessToken,
            entity: {
                author: `urn:li:person:${creds.id}`,
                lifecycleState: 'PUBLISHED',
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": 'PUBLIC'
                },
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: text
                        },
                        shareMediaCategory: "ARTICLE",
                        media: [
                            {
                                "status": "READY",
                                "description": {
                                    "text": description
                                },
                                "originalUrl": url,
                                "title": {
                                    "text": title,
                                }
                            }
                        ]
                    }
                },
            }
        });
        return response.data.id;
    } catch (e) {
        console.error(e);
        throw new Error("Could not submit image." + e);
    }

}

async function submitText(text, creds) {
    const client = new RestliClient();
    client.setDebugParams({enabled: true});
    const accessToken = creds.access_token;
    try {
        response = await client.create({
            resourcePath: '/ugcPosts',
            accessToken: accessToken,
            entity: {
                author: `urn:li:person:${creds.id}`,
                lifecycleState: 'PUBLISHED',
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": 'PUBLIC'
                },
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: text
                        },
                        shareMediaCategory: "NONE"
                    }
                },
            }
        });
        return response.data.id;
    } catch (e) {
        console.error(e);
        throw new Error("Could not submit text:" + e);
    }

}

function _limitDuration(artifact, duration) {
    if(_videoDuration(artifact.url) > duration) {
        let newFile = artifact.url.replace('\.mp4', `-cut${duration}.mp4`);
        if(!fs.existsSync(newFile)) {
            let command = `ffmpeg -i "${artifact.url}" -vf trim=duration=${duration} "${newFile}"`;

            try {
                console.log(command);
                execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
                return newFile;
            } catch (e) {
                console.error(`could not run command ${command}`, e);
            }
        } else {
            return newFile;
        }
    } else {
        return artifact.url;
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
