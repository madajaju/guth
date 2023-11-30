const fs = require('fs');
const program = require('commander');
const path = require('path');


require('dotenv').config();

// Check for node_modules directory. If it exists then continue. If not ask to run npm install.
if(!fs.existsSync('./node_modules')) {
    console.error('Error: you must run "npm install" first');
    return;
}
const server = require('ailtire');
let host = process.env.AITIRE_HOST || 'localhost'
let port = process.env.AITIRE_PORT || 3000
let urlPrefix = process.env.AITIRE_BASEURL || '/web'

program.command('index [options]', "start podcast manager")
    .option('--dir <string>', "Directory with the podcast definition")

let options = program.opts();

let config = {
    baseDir: '.',
    prefix: 'guth',
    routes: {},
    host: host,
    urlPrefix: urlPrefix,
    listenPort: port,
    post: (config) => {
        uploadPodcast(config.podcastDir);
    }
};
if(options.dir) {
    config.podcastDir = options.dir;
}
server.listen( config );

const ftypeLookup = {
    ".yaml": "info",
    ".js": "info",
    ".mp3": "audio",
    ".mp4": "video",
    ".srt": "captions",
    ".txt": "transcript",
    ".pdf": "pdf",
    ".docx": 'doc',
    ".md": 'doc',
    ".jepg": 'image',
    ".jpg": 'image',
    ".png": 'image',
    ".gif": 'image',
    "" : 'unknown',
};

const uploadPodcast = (baseDir) => {
    let adir = path.resolve(baseDir);
    if(!fs.existsSync(adir)) {
        console.error("Could not find the directory:", baseDir);
        return;
    }
    let apath = path.dirname(adir + '/.guth.js');
    if(!fs.existsSync(apath)) {
        console.error("Could not find the podcast file:", apath);
        return;
    }
    let podcast = require(apath);

    podcast.episodes = {};
    for (let i in podcast.directories) {
        let dirName = adir + '/' + podcast.directories[i];
        let files = fs.readdirSync(dirName);
        for (let j in files) {
            let episodeDir = path.resolve(dirName + '/' + files[j]);
            if (fs.existsSync(episodeDir + '/Production')) {
                let efile = episodeDir + '/.episode.js';
                let episode = {};
                if (fs.existsSync(efile)) {
                    episode = require(efile);
                    episode.saveFile = efile;
                } else {
                    // create an Episode .episode.js file with all of the assets
                    episode = {
                        dirname: episodeDir,
                        summary: "",
                        artifacts: {},
                        assets: {},
                        saveFile: efile
                    }
                }
                // Check for number and title
                if (!episode.number) {
                    episode.number = '0'
                }
                ;
                if (!episode.title) {
                    episode.title = 'Work in Progress'
                }
                ;
                // Check if assets are there.
                if (!episode.assets.video) {
                    episode.assets.video = {
                        url: 'url',
                        channel: "IntelYouTube",
                        title: 'Put the title Right Here',
                        artifact: 'episode.mp4'
                    }
                }
                ;
                if (!episode.assets.audio) {
                    episode.assets.audio = {
                        url: 'https://soundcloud.com/embracingdigital/edt0',
                        channel: "SoundCloud",
                        title: 'Put the title Right Here',
                        artifact: 'episode.mp3'
                    }
                }
                if (!episode.assets.intelBlog) {
                    episode.assets.intelBlog = {
                        url: 'https://www.intel.com/content/www/us/en/government/podcasts/embracing-digital-transformation-episode0.html',
                        channel: "IntelBlog",
                        title: 'Put the title Right Here',
                        artifact: 'episode.docx'
                    }
                }
                if (!episode.assets.blog) {
                    episode.assets.blog = {
                        url: 'https://embracingdigital.org/archives/0',
                        channel: "blog",
                        title: 'Put the title Right Here',
                        artifact: 'episode.md'
                    }
                }
                // Check if guests are there.
                if (!episode.guests) {
                    episode.guests = [
                        "Darren W Pulsipher",
                    ]
                }
                // Check for tags.
                if (!episode.tags) {
                    episode.tags = [
                        "EDT111",
                        "EmbracingDigital"
                    ]
                }
                // Check for the artifacts.
                // Get all of the files in the production directory.
                let efiles = fs.readdirSync(episodeDir + '/Production');
                for (let k in efiles) {
                    let file = efiles[k];
                    let etype = path.extname(file);
                    let ftype = ftypeLookup[etype] || 'unknown';
                    let url = path.resolve(`${episodeDir}/Production/${file}`);
                    episode.artifacts[file] = {
                        ext: etype,
                        type: ftype,
                        url: url,
                        summary: "",
                    }
                }
                if (!episode.artifacts.hasOwnProperty('episode.md')) {
                    mdfile = path.resolve(`${episodeDir}/Production/episode.md`);
                    episode.artifacts["episode.md"] = {
                        ext: '.md',
                        type: 'doc',
                        url: `${episodeDir}/Production/episode.md`,
                        summary: "",
                    }
                    fs.writeFileSync(mdfile, "# Title\n\n*Tagline*\nSummary here\n\n![episode" +
                        " image](./thumbnail.png)\n\nEpsiode Body here.\n\n## Media\n\n<video src='url'></video>");
                }
                let estring = "module.exports = " + JSON.stringify(episode, null, 2);
                +';'
                fs.writeFileSync(efile, estring);
                episode.saveFile = efile;
                podcast.episodes[files[j]] = episode;
            }
        }
    }
    updatePodcast(podcast);
}

function updatePodcast(podcast) {
    for(let i in podcast.episodes) {
        let episode = podcast.episodes[i];
        // update guests
        if(!podcast.hasOwnProperty("guests")) { podcast.guests = {}; }
        for(let j in episode.guests) {
            let guest = episode.guests[j];
            if(!podcast.guests.hasOwnProperty(guest)) {
                podcast.guests[guest] = {
                    name: guest,
                    email: 'tbd',
                    linkedin: 'tbd',
                    twitter: 'tbd',
                    salesforce: 'tbd'
                }
            }
        }
        // update tags
        if(!podcast.hasOwnProperty("tags")) { podcast.tags = {}; }
        for(let j in episode.tags) {
            if(!podcast.tags.hasOwnProperty(episode.tags[j])) {
                podcast.tags[episode.tags[j]] = {
                    name: episode.tags[j]
                }
            }
        }
        // update channels
        for(let j in episode.assets) {
            let asset = episode.assets[j];
            /*
            if(!podcast.channels.hasOwnProperty(asset.channel.toLowerCase())) {
                console.log("Channel (", asset.channel, ") not found for episode: ", j);
            }
             */
        }
    }
}
