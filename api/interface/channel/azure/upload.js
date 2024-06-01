const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const fs = require('fs');
const AEvent = require("ailtire/src/Server/AEvent");

module.exports = {
    friendlyName: 'upload',
    description: 'Upload an artifact',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        artifcat: {
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

        let artifact = inputs.artifact;
        if(typeof artifact === "string") {
            artifact = Artifact.find(inputs.artifact);
            if(!artifact) {
                throw new Error("Artifact not found!");
            }
        }
        let channel = inputs.channel;
        if(typeof channel === 'string') {
            channel = Channel.find(inputs.channel);
            if(!channel) {
                throw new Error("Channel not Found!");
            }
        }
        let data = await _uploadArtifact(artifact,channel);
        console.log(data);
    }
};

async function _uploadArtifact(artifact,channel) {
    const account = channel.creds.id;
    const accountKey = channel.creds.key;
    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);
        const containerName = channel.container;
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Iterate over all of the artifacts and make sure they are in the local filesystem and then publish them to
        // the blog storage
        AEvent.emit("artifact.started", {message: "Started"});
        let episode = artifact.episode;
        let lfile = artifact.url;
        if(fs.existsSync(lfile)) {
                const blobName = `${episode.name}/${artifact.name}`;
                const blobClient = containerClient.getBlockBlobClient(blobName);
                const uploadBlobResponse = await blobClient.uploadFile(lfile);
                artifact.remoteURL = `${channel.creds.url}/${containerName}/${blobName}`;
                episode.saveMe();
            }
        AEvent.emit("artifact.completed", {message: "Finished"});
   } catch(e) {
        console.error(e);
   }
}
