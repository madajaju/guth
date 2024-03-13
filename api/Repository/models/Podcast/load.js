const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'load',
    description: 'Load the Podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        directory : {
            description: 'Directory of the Podcast to load',
            type: 'string',
            required: true
        }

    },
    exits: {
    },
    fn: function (obj, inputs, env) {

        let retval = uploadPodcast(inputs.directory);
        return retval;
    }
};

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
    let apath = path.resolve(`${adir}/.guth.js`);
    if(!fs.existsSync(apath)) {
        console.error("Could not find the podcast file:", apath);
        return;
    }
    let podcast = require(apath);
    podcast.baseDirectory = baseDir;
    // Load Episodes
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
                    delete require.cache[require.resolve(efile)];
                    episode = require(efile);
                    episode.saveFile = efile;
                } else {
                    // create an Episode .episode.js file with all of the assets
                    episode = {
                        dirname: episodeDir,
                        summary: "",
                        artifacts: {},
                        assets: {},
                        episode: efile
                    }
                }
                // Check for number and title
                if (!episode.number) {
                    episode.number = '0'
                }

                if (!episode.title) {
                    episode.title = 'Work in Progress';
                }

                // Check if assets are there.
                if(!episode.state) {
                    episode.state = "Created";
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
                    if(fs.statSync(url).isDirectory()) {
                        // Traverse the directory.
                        _getArtifacts(file, `${episodeDir}/Production`, episode.artifacts);
                    } else {
                        // Do not change summary or title. Only update the physical things on the drive.
                        if(episode.artifacts && episode.artifacts.hasOwnProperty(file)) {
                            episode.artifacts[file].ext = etype;
                            episode.artifacts[file].type = ftype;
                            episode.artifacts[file].url = url;
                        } else {
                            console.log("Episode:", episode.number);
                            if(!episode.artifacts) {
                                episode.artifacts = {};
                            }
                            episode.artifacts[file] = {
                                ext: etype,
                                type: ftype,
                                url: url
                            };
                        }
                    }
                }
                let estring = "module.exports = " + JSON.stringify(episode, null, 2) +';';

                fs.writeFileSync(efile, estring);
                episode.saveFile = efile;
                podcast.episodes[files[j]] = episode;
            }
        }
    }
    updatePodcast(podcast);
    let retval = loadPodcast(podcast);
    return retval;

}

const updatePodcast = (podcast) => {
    for(let i in podcast.episodes) {
        let episode = podcast.episodes[i];
        // update tags
        if(!podcast.hasOwnProperty("tags")) { podcast.tags = {}; }
        for(let j in episode.tags) {
            let tagName = episode.tags[j].replace(/\s/g,'').replace(/\-/g,'')
            if(!podcast.tags.hasOwnProperty(tagName)) {
                podcast.tags[tagName] = {
                    name: tagName
                }
            }
        }
        // update channels
        for(let j in episode.assets) {
            let asset = episode.assets[j];
            if(!podcast.channels.hasOwnProperty(asset.channel)) {
                // console.log("Channel (", asset.channel, ") not found for episode: ", j);
            }
        }
    }
}
const loadPodcast = (podcast) => {
    let pObj = new Podcast({name: podcast.name});
    pObj.base = podcast.base;
    pObj.name = podcast.name;
    pObj.summary = podcast.summary;
    pObj.directories = podcast.directories;
    pObj.baseDirectory = podcast.baseDirectory;
    pObj.lang = podcast.lang;

    // Add Channels
    for(let cname in podcast.channels) {
        let channel = podcast.channels[cname];
        channel.name = cname;
        // Call the Channel Factory.
        let channelObj = Channel.factory(podcast.channels[cname]);
        pObj.addToChannels(channelObj);
        channelObj.podcast = pObj;
        let types = channel.types;
        for(let i in types) {
            let artTypeString = types[i].replaceAll(/\s/g,'');
            if(artTypeString.length > 0) {
                let artType = new ArtifactType({name: artTypeString});
                channelObj.addToTypes(artType);
            }
        }
    }
    // Add Guests
    let guestDir = podcast.baseDirectory + '/guests';
    let guests = fs.readdirSync(guestDir);
    for(let i in guests) {
        let guestDir = guests[i];
        let guest = Person.load({podcast: podcast, name: guestDir});
        pObj.addToGuests(guest);
    }

    // Add Tags
    for(let tname in podcast.tags) {
        let tag = podcast.tags[tname];
        let tagName = tname.replace(/\s/g,'').replace(/\-/g,'')
        tag.name = tagName;
        pObj.addToTags(tag);
    }
    // Add Episodes
    for(let ename in podcast.episodes) {
        let episode = podcast.episodes[ename];
        episode.name= ename;
        episode.owner = pObj;
        let eObj = Episode.load(episode);
        pObj.addToEpisodes(eObj);
    }
    pObj.blueprint = BluePrint.load({podcast:pObj});

    // Add Templates
    for(let mname in podcast.mappings) {
        let mapping = podcast.mappings[mname];
        let mObj = new Mapping({name:mapping.name, id:mapping.id});

        for (let i in mapping.channels) {
            let channel = Channel.find(mapping.channels[i]);
            if (channel) {
                mObj.addToChannels(channel);
            } else {
                console.warn("Channel ", channel, " not found for the template");
            }
        }
        for(let tname in mapping.templates) {
            let template = mapping.templates[tname];
            let sfile = podcast.baseDirectory + '/templates/' + template;
            let tObj = new Template({id: `${mapping.id}-${tname}`, name: tname, file: template});
            try {
                tObj.script = fs.readFileSync(sfile, 'utf-8');
            } catch (e) {
                console.error("Could not open template file:", sfile);
            }
            mObj.addToTemplates(tObj);
        }
        pObj.blueprint.addToMappings(mObj);
    }
    pObj.save();
    return pObj;
}

function _getArtifacts(file, base, artifacts) {
    let files = fs.readdirSync(`${base}/${file}`);
    files.forEach( (mfile) => {
        let etype = path.extname(mfile);
        let ftype = ftypeLookup[etype] || 'unknown';
        let url = path.resolve(`${base}/${file}/${mfile}`);
        // Only replace the things physically found in the directory.
        // Other things like summary and title leave alone.
        if(artifacts.hasOwnProperty(`${file}/${mfile}`)) {
            artifacts[`${file}/${mfile}`].ext = etype;
            artifacts[`${file}/${mfile}`].type = ftype;
            artifacts[`${file}/${mfile}`].url = url;
        } else {
            artifacts[`${file}/${mfile}`] = {
                ext: etype,
                type: ftype,
                url: url
            };
        }
    });
}
