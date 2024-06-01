const path = require('path');
const fs = require('fs');
const {execSync} = require("child_process");

module.exports = {
    friendlyName: 'limitDuration',
    description: 'Limit the Duration of a video',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        artifact: {
            type: 'ref',
            description: "Artifact to convert",
        },
        duration: {
            type: 'string',
            description: "Duration to limit the video"
        }
    },

    exits: {
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let artifact = inputs.artifact;
        if (typeof artifact === 'string') {
            artifact = Artifact.find(artifact);
        }
        let duration = inputs.duration;

        if (_videoDuration(artifact.url) > duration) {
            let newFile = artifact.url.replace('\.mp4', `-cut${duration}.mp4`);
            if (!fs.existsSync(newFile)) {
                AEvent.emit('videolimmit.started', {message:`Cutting video ${video}`});
                let command = `ffmpeg -i "${artifact.url}" -vf trim=duration=${duration} "${newFile}"`;
                try {
                    console.log(command);
                    execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
                    let newName = path.basename(newFile);
                    let newArtifact = artifact.episode.addToArtifacts({name: newName, url: newFile, artType: 'Video'});
                    AEvent.emit('videolimmit.completed', {message:`Cutting video ${video}`});
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
