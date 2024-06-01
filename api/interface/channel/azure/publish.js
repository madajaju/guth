const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const fs = require('fs');
const AEvent = require("ailtire/src/Server/AEvent");

module.exports = {
    friendlyName: 'publish',
    description: 'Publish an episode',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        episode: {
            description: 'Episode to Publish',
            type: 'ref',
            required: false
        },
        channel: {
            description: 'Episode to Publish',
            type: 'ref',
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

        let episode = inputs.episode;
        if(typeof episode === "string") {
            episode = Episode.find(inputs.episode);
            if(!episode) {
                throw new Error("Episode not found!");
            }
        }
        let channel = inputs.channel;
        if(typeof channel === 'string') {
            channel = Channel.find(inputs.channel);
            if(!channel) {
                throw new Error("Channel not Found!");
            }
        }
        let data = await _processEpisode(episode,channel);
        console.log(data);
    }
};

async function _processEpisode(episode,channel) {
    const account = channel.creds.id;
    const accountKey = channel.creds.key;
    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
        const containerName = channel.container;
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Iterate over all of the artifacts and make sure they are in the local filesystem and then publish them to
        // the blog storage
        AEvent.emit("episode.publish", {message: "Started"});
        for(let i in episode.artifacts) {
            let artifact = episode.artifacts[i];
            let lfile = artifact.url;
            AEvent.emit("episode.uploading", {message: artifact.name});
            if(fs.existsSync(lfile)) {
                const blobName = `${episode.name}/${artifact.name}`;
                const blobClient = containerClient.getBlockBlobClient(blobName);
                const uploadBlobResponse = await blobClient.uploadFile(lfile);
                artifact.remoteURL = `${channel.creds.url}/${containerName}/${blobName}`;
                episode.saveMe();
            }
        }
        AEvent.emit("episode.published", {message: "Finished"});
   } catch(e) {
        console.error(e);
   }
}
