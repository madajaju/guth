const path = require('path');
const fs = require('fs');
const generator = require('ailtire/src/Documentation/Generator.js');

module.exports = {
    friendlyName: 'generatePDF',
    description: 'Generate PDF for an episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: "ID of the episode",
            type: 'string',
            required: true
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (inputs, env) {
        let episode = Episode.find({number: inputs.id});
        if(!episode) {
            console.error("Could not find the episode:", inputs.id);
            env.res.json({status:"error"});
            return;
        }
        let podcast = episode.owner;
        let edir = path.dirname(episode.saveFile);
        let output = path.resolve(`${edir}/Production`);
        let source = path.resolve(`${podcast.baseDirectory}/templates`);
        _generatePDF(episode, output, source);
        env.res.json({status: "Complete"});
    }
};

const _generatePDF = (episode, output, source) => {

    let apath = path.resolve(`${output}/episode.md`);
    if (fs.existsSync(apath)) {
        episode.content = "";
        let lines = fs.readFileSync(apath).toString('utf-8').split('\n');
        lines.forEach((line) => {
            const regx = new RegExp('^#');
            if (regx.test(line)) {
                let hnumber = (line.match(/\#/g) || []).length;
                episode.content += `<h${hnumber}>${line.replaceAll(/\#/g,'')}</h${hnumber}>\n`;
            } else {
                if(line.length >0) {
                    episode.content += `<p>${line}</p>\n`;
                }
            }
        });
    } else {
        episode.content = "";
    }
    // YoutubeTag of the video.
    // Get the asset video and get the url.
    // Now strip off the last part.
    episode.youtubeURL = episode.assets['video'].url;
    episode.soundcloudURL = episode.assets['audio'].url;
    // Guests
    let guests = [];
    for (let i in episode.guests) {
        guests.push(episode.guests[i].name);
    }
    let tags = [];
    for (let i in episode.tags) {
        tags.push(episode.tags[i].name);
    }
    // set the thumbnailPath so it can be copied to the destination directory.
    let thumbnail = episode.thumbnail || "TBD";
    let files = {
        context: {
            episode: episode,
            guests: guests,
            tags: tags,
            thumbnail: thumbnail,
            episodeName: "edt-" + episode.number,
        },
        targets: {
            'episode.html': {template: `${source}/episode.ejs`},
            'IntelLogo.png': {copy: `${source}/IntelLogo.png`},
            'IntelLogoElectric.png': {copy: `${source}/IntelLogoElectric.png`},
        }
    }
    // set the thumbnailPath so it can be copied to the destination directory.
    generator.process(files, output);
}
