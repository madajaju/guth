const path = require('path');
const fs = require('fs');
const {execSync} = require("child_process");

module.exports = {
    friendlyName: 'convertImage',
    description: 'Convert Image to be a jpg',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        artifact: {
            type: 'ref',
            description: "Artifact to convert",
        }
    },

    exits: {
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let artifact = inputs.artifact;
        if(typeof artifact === 'string') {
            artifact = Artifact.find(artifact);
        }
        let image = artifact;
        let extName = path.extname(image.url);
        if(extName === '.jpg' || extName === 'jpeg') {
            return image.url;
        } else {
            let file = image.url.replace(extName, '.jpg');
            if(!fs.existsSync(file)) {
                AEvent.emit('imageconvert.started', {message:`Converting Image for  ${file}`});
                let newName = image.name.replace(extName, ".jpg");
                let command = `ffmpeg -i ${image} ${file}`;
                execSync(command, {stdio: 'inherit'}); // stdio: 'inherit' will display stdout/stderr in
                let newArtifact = image.episode.addToArtifacts({name: newName, url: file, artType: 'Image'});
                AEvent.emit('imageconvert.completed', {message:`Converting Image for ${file}`});
                return newArtifact.url;
            }
            return file;
        }
    }
}

