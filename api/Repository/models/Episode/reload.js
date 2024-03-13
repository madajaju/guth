const path = require('path');
const fs = require('fs');

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

module.exports = {
    friendlyName: 'reload',
    description: 'Reload the Episode',
    static: false, // True is for Class methods. False is for object based.
    inputs: {},

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let retval = null;

        if(obj.saveFile) {
            let args = require(obj.saveFile);
            _reload(obj, args);
            return obj;
        }
    }
};

function _reload(obj, inputs) {
    obj.title = inputs.title || obj.title;
    obj.summary = inputs.summary || obj.summary;
    obj.number = inputs.number || obj.number;
    obj.createdDate = inputs.createdDate || new Date();
    obj.saveFile = inputs.saveFile || obj.saveFile;
    obj.tagline = inputs.tagline || obj.tagLine;
    obj.thumbnail = inputs.thumbnail || obj.thumbnail;
    obj.releaseDate = inputs.releaseDate || "";
    obj.recordedDate = inputs.recordedDate || "";
    if (obj.releaseDate.length > 0) {
        obj.releaseDate = new Date(obj.releaseDate);
    }
    for (let i in inputs.tags) {
        let tname = inputs.tags[i];
        if (typeof tname === 'object') {
            tname = tname.text.replace(/\s/g, '').replace(/\-/g, '');
        } else {
            tname = tname.replace(/\s/g, '').replace(/\-/g, '');
        }
        tname = tname.toLowerCase();
        let tag = new Tag({name: tname}); // Tags are unique by name.
        tag.addToEpisodes(obj);
        obj.addToTags(tag);
    }
    let artifacts = {};
    // Check for the artifacts.
    // Get all the files in the production directory.
    let saveDir = path.dirname(obj.saveFile);
    let efiles = fs.readdirSync(saveDir + '/Production');
    for (let k in efiles) {
        let file = efiles[k];
        let etype = path.extname(file);
        let ftype = ftypeLookup[etype] || 'unknown';
        let url = path.resolve(`${saveDir}/Production/${file}`);
        if(fs.statSync(url).isDirectory()) {
            // Traverse the directory.
            _getArtifacts(file, `${saveDir}/Production`, artifacts);
        } else {
            // Do not change summary or title. Only update the physical things on the drive.
            if(artifacts && artifacts.hasOwnProperty(file)) {
                artifacts[file].ext = etype;
                artifacts[file].type = ftype;
                artifacts[file].url = url;
            } else {
                artifacts[file] = {
                    ext: etype,
                    type: ftype,
                    url: url
                };
            }
        }
    }
    for (let aname in artifacts) {
        let artifact = artifacts[aname];
        obj.addToArtifacts({
            name: aname,
            url: artifact.url,
            artType: artifact.type,
            ext: artifact.ext,
            summary: artifact.summary,
            title: artifact.title
        });
    }
    obj.guests = {};
    for (let i in inputs.guests) {
        // Need to check for an object instead of a name. If tne object is there
        // then check the id. Grab the inputs.guests[i].text
        let pname = inputs.guests[i];
        if (typeof pname === 'object') {
            pname = pname.text;
        }
        let person = Person.find({name: pname});
        if (!person) {
            console.error("Guest Not Found", pname, "for episode:", obj.number);
            person = new Person({name: pname});
            person.podcast = inputs.owner
            person.save();
            // person = Person.load({podcast: obj.owner, name: pname});
        } else {
            obj.addToGuests(person);
            person.addToEpisodes(obj);
        }
    }

    obj.assets = {};
    for (let aname in inputs.assets) {
        let asset = inputs.assets[aname];
        asset.name = aname;
        asset.episode = obj;
        obj.addToAssets(asset);
    }
    obj.posts = {};
    for (let pname in inputs.posts) {
        let post = inputs.posts[pname];
        obj.addToPosts({
            name: pname,
            text: post.text,
            createDate: post.createDate,
            postDate: post.postDate,
            asset: post.asset,
            episode: obj,
            channel: post.channel
        });
    }

    // Now load the stats
    let sfile = path.resolve(obj.saveFile.replace('.episode.js', '.stats.js'));
    if(fs.existsSync(sfile)) {
        let stats = require(sfile);
        for (let i in obj.assets) {
            let asset = obj.assets[i];
            if (stats.hasOwnProperty(asset.name)) {
                let astats = stats[asset.name];
                for (let j in astats) {
                    let stat = astats[j];
                    // Make sure everything is a number.
                    for(let i in stat.values) {
                        let value = +stat.values[i];
                        stat.values[i] = value;
                    }
                    for(let i in stat.totals) {
                        let value = +stat.totals[i];
                        stat.totals[i] = value;
                    }
                    asset.addToStats(stat);
                }
            }
        }
        for (let i in obj.posts) {
            let post = obj.posts[i];
            if (stats.hasOwnProperty(post.id)) {
                let pstats = stats[post.id];
                for (let j in pstats) {
                    let stat = pstats[j];
                    post.addToStats(stat);
                }
            }
        }
    }
    obj.saveMe();
    return obj;
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
