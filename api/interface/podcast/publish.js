const path = require('path');
const fs = require('fs');
const generator = require('ailtire/src/Documentation/Generator.js');

module.exports = {
    friendlyName: 'publish',
    description: 'Publish the Podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: "ID of the podcast",
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

        let podcast = Podcast.find(inputs.id);

        if(podcast.workflows.publish) {
            podcast.workflows.publish.fn(inputs,env);
            console.log("Called");
            return;
        }

        let output = path.resolve(`${podcast.baseDirectory}/docs`);
        let source = path.resolve( `${podcast.baseDirectory}/templates`);
        _docDirectory(output, source);
        _episodes(podcast.episodes, output, source);
        _guests(podcast.guests, output, source);
        _tags(podcast.tags, output, source);
        env.res.json({status:"Complete"});
    }
};

const _docDirectory = (output, source) => {

    let files = {
        context: {},
        targets: {
            '.': {foldercopy: `${source}/docs`},
        }
    }
    generator.process(files, output);
}

const _episodes = (episodes, output, source) => {

    let outputpath = path.resolve(`${output}/episodes`);

    episodes.forEach((episode) => {
        if(episode.state === "Published") {
            // check that the episode.md file is there and read it into the content variable.
            let edir = path.dirname(episode.saveFile);
            let apath = path.resolve(`${edir}/Production/episode.md`);
            if (fs.existsSync(apath)) {
                episode.content = fs.readFileSync(apath).toString('utf-8');
            } else {
                episode.content = "";
            }
            // check the transcript file is there and read it into the transcript variable.
            apath = path.resolve(`${edir}/Production/episode.mp4.srt`);
            episode.transcript = "<p>";
            if (fs.existsSync(apath)) {
                episode.transcript = "<p>";
                let lines = fs.readFileSync(apath).toString('utf-8').split('\r\n');
                lines.forEach((line) => {
                    const regx = new RegExp('^[0-9]');
                    const regx2 = new RegExp('[A-Z]');
                    if (regx2.test(line[0])) {
                        episode.transcript += '</p>\n<p>';
                    }
                    if (!regx.test(line) && line.length > 0) {
                        episode.transcript += line;
                    }
                });
            }
            episode.transcript += "</p>";
            // YoutubeTag of the video.
            // Get the asset video and get the url.
            // Now strip off the last part.
            episode.youtubeTag = episode.assets['video'].url.split('/').pop();

            // set the thumbnailPath so it can be copied to the destination directory.
            let thumbnailPath = path.resolve(`${episode.dir}/Production/${episode.thumbnail}`);
            let thumbnail = episode.thumbnail || "TBD";
            let files = {
                context: {
                    episode: episode,
                    thumbnail: thumbnail,
                    episodeName: "edt-" + episode.number,
                },
                targets: {
                    ':episodeName:/episode.md': {template: `${source}/episode.emd`},
                }
            }
            // set the thumbnailPath so it can be copied to the destination directory.
            if (episode.thumbnail) {
                let tPath = path.resolve(`${edir}/Production/${episode.thumbnail}`);
                if (fs.existsSync(tPath)) {
                    files.targets[":episodeName:/:thumbnail:"] = {copy: tPath};
                }
            }
            generator.process(files, outputpath);
        }
    });
}

const _guests = (guests, output, source) => {
    let outputpath = path.resolve(`${output}/guests`);

    guests.forEach((guest) => {

        let files = {
            context: {
                guest: guest,
                guestName: guest.name.replace(/\s/g,'-')
            },
            targets: {
                ':guestName:.md': {template: `${source}/guest.emd`},
            }
        }
        generator.process(files, outputpath);
    });
}

const _tags = (tags, output, source) => {
    let outputpath = path.resolve(`${output}/tags`);

    tags.forEach((tag) => {

        let files = {
            context: {
                tag: tag,
                tagName: tag.name.replace(/\s/g,'')
            },
            targets: {
                ':tagName:.md': {template: `${source}/tag.emd`},
            }
        }
        generator.process(files, outputpath);
    });
}
