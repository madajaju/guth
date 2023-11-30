const fs = require('fs');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;


const SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
];

module.exports = {
    friendlyName: 'publishArtifact',
    description: 'Upload a video  to youtube channel.',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        artifact: {
            description: 'Artifact to upload to youtube.',
            type: 'ref',
            required: true,
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let artifact = inputs.artifact;
        if (typeof artifact === 'string') {
            artifact = Artifact.find(artifact);
        }
        let data = {
            title: inputs.title,
            summary: inputs.summary,
            tags: inputs.tags,
            name: inputs.name
        }
        console.log("Upload to Youtube:", data);
        let oauthclient = authorize(obj)
        AEvent.emit("upload.started", {message:`Started Uploading Youtube Video, ${artifact.name}`});
        let uploadedURL = await uploadVideo(artifact, data, oauthclient);
        AEvent.emit("upload.completed", {message:`Started Uploading Youtube Video, ${artifact.name}`});
        inputs.url = uploadedURL;
        return new Asset(inputs);
    }
};

async function uploadVideo(artifact, data, oauthclient) {
    try {
        const video = {
            snippet: {
                title: data.title,
                description: data.summary,
                tags: data.tags,
                categoryId: 28,
                defaultLanguage: 'en',
                defaultAudioLanguage: 'en',
            },
            status: {
                privacyStatus: 'public',
                selfDeclaredMadeForKids: false
            }
        }
        const media = {
            body: fs.createReadStream(artifact.url)
        }
        const youtube = google.youtube('v3');
        const response = await youtube.videos.insert({
            auth: oauthclient,
            part: 'snippet,status',
            requestBody: video,
            media: media
        });

        const videoID = response.data.id;
        return `https://youtu.be/${videoID}`;
    } catch (e) {
        AEvent.emit("upload.error", {message:"Error Uploading:" + e});
        console.error("Youtube Stats error:", e);
        console.error("parameters being passed:", data);
    }
}

const authorize = (channel) => {
    const clientSecret = channel.creds.client_secret;
    const clientId = channel.creds.client_id;
    const redirectUrl = channel.creds.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    oauth2Client.credentials = channel.creds.tokens;
    return oauth2Client;
};
