const path = require('path');
const fs = require('fs');
const {execSync} = require("child_process");
const AEvent = require('ailtire/src/Server/AEvent');

module.exports = {
    friendlyName: 'getCoverImage',
    description: 'Get Cover Image for the post',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
    },

    exits: {
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let artifact = inputs.artifact;
        if(typeof artifact === 'string') {
            artifact = Artifact.find(artifact);
        }
        let video = artifact.url;
        let newName = artifact.name.replace('.mp4','-mp4.jpg');
        let file = video.replace('.mp4', '-mp4.jpg');
        if(!fs.existsSync(file)) {
            AEvent.emit('videocut.started', {message:`Getting Cover Image for video ${video}`});
            let command = `ffmpeg -y -ss 15 -i "${video}" -frames:v 1 "${file}"`;
            execSync(command, {stdio: 'inherit'}); // stdio: 'inherit' will display stdout/stderr in
            // Create the new artifact and then publish it up to the blob storage.
            let newArtifact = artifact.episode.addToArtifacts({name: newName, url: file, artType: 'Image'});
            newArtifact.episode.saveMe();
            AEvent.emit('videocut.completed', {message:`Getting Cover Image for video ${video}`});
        }
        return file;
    }
}

