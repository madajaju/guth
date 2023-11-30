const fs = require('fs');
// const path = require('path');
const axios = require("axios");


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
        let image = inputs.image.replaceAll(/\r\n/g,'');
        let data = {
            title: inputs.title,
            summary: inputs.summary,
            tags: inputs.tags,
            name: inputs.name,
            number: artifact.episode.number
        }
        AEvent.emit('upload.started', {message:`Starting Upload to Transistor, ${artifact.name}`});
        let tepisode = await _uploadAudio(obj, artifact, image, data);

        AEvent.emit('upload.completed', {message:`Starting Upload to Transistor, ${artifact.name}`});
        inputs.url = tepisode.attributes.share_url;
        inputs.cid = tepisode.id;
        return new Asset(inputs);
    }
};

const _uploadAudio = async (channel, artifact, image, data) => {
    AEvent.emit('upload.inprogress', {message:'Getting Show'});
    let res0 = await axios({
        method: 'get',
        url: `https://api.transistor.fm/v1/shows`,
        headers: {
            "x-api-key": channel.creds.api_key,
        },
    });
    let showID = "";
    for (let i in res0.data.data) {
        let item = res0.data.data[i];
        console.log(item.attributes.title);
        if (item.attributes.title.toLowerCase().replaceAll(/\s/g, '') === channel.title.toLowerCase().replaceAll(/\s/g, '')) {
            showID = item.id;
        }
    }
    let oneDriveChannel = OneDrive.find('onedrive');

    let image_url = await oneDriveChannel.getShareLink({filename:image});
    let audio_url = await _loadFile(channel, artifact.url, 'audio/mpeg');
    try {
        AEvent.emit('upload.inprogress', {message:'Creating Episode'});
        let requestData = {
            episode: {
                show_id: showID,
                title: data.title,
                description: data.summary,
                keywords: data.tags,
                number: data.number,
                audio_url: audio_url,
                image_url: image_url,
            }
        }
        let res3 = await axios({
            method: 'post',
            url: 'https://api.transistor.fm/v1/episodes',
            headers: {
                "x-api-key": channel.creds.api_key,
            },
            data: requestData
        });
        return res3.data.data;
    } catch (e) {
        console.error("Error UploadingAudio File:", e);
    }
};

const _loadFile = async (channel, filename, filetype) => {
    AEvent.emit('upload.inprogress', {message: `Preparing ${filename} File`});
   //  let fname = path.basename(filename);
    try {
        let response = await axios({
            method: 'get',
            url: `https://api.transistor.fm/v1/episodes/authorize_upload?filename=asset.mp3`,
            headers: {
                "x-api-key": channel.creds.api_key,
            },
        });

        AEvent.emit('upload.inprogress', {message: `Uploading ${filename} File`});
        let fileData = fs.readFileSync(filename);
        let uploadUrl = response.data.data.attributes.upload_url;
        let res2 = await axios({
            method: 'put',
            url: uploadUrl,
            headers: {"Content-Type": `${filetype}`},
            data: fileData
        });
        if(res2) {
            return response.data.data.attributes.audio_url;
        }
    }
    catch(e) {
        console.error("Could not LoadFile:", e);
    }
};
