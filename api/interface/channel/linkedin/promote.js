const fs = require("fs");
const path = require('path');
const axios = require('axios');
const {execSync} = require('child_process');
const {RestliClient} = require('linkedin-api-client');

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
        let asset = post.asset;
        if(!asset) {
            console.log("Asset not Found", post.id) ;
            return null;
        }
        let artifact = asset.artifact;
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

        if (extFile === '.mp4') {
            image = getCoverImage(artifact.url);
        } else if (artifact.artType === 'image') {
            image = convertImage(artifact.url);
        } else {
            image = convertImage(episodeFile);
        }
        // text = "@Embracing Digital Transformation\n" + text;
        // url = await submitText(text, channel.creds);
        // url = await submitArticle(text, asset.url, asset.title, asset.summary, channel.creds);
        if (extFile === '.mp4') {
            url = await submitVideo(text, asset.url, asset.title, asset.summary, afile, channel.creds);
        } else {
            url = await submitImage(text, asset.url, asset.title, asset.summary, image, channel.creds);
        }
        return url;
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
            console.error("Error calling:", command, e);
            return null;
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
            return null;
        }
    } else {
        return file;
    }
}

async function submitVideo(text, url, title, description, video, creds) {
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

        let data = fs.readFileSync(video);
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
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
        console.log(e);
    }

}
