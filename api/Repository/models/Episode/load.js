const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'load',
    description: 'Description of the action',
    static: true, // True is for Class methods. False is for object based.
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
        if (inputs.file) {
            retval = load(inputs.file);
        } else {
            retval = load(inputs);
        }
        if (inputs.state) {
            retval.forceState(inputs.state);
            retval._state = inputs.state;
        }
        return retval;
    }
};

function load(inputs) {
    let state = inputs.state || 'Created';
    let obj = new Episode({name: inputs.name, state: state});
    obj.title = inputs.title;
    obj.summary = inputs.summary;
    obj.number = inputs.number;
    obj.meta = inputs.meta;
    obj.notes = inputs.notes;
    obj.createdDate = inputs.createdDate || new Date();
    obj.saveFile = inputs.saveFile;
    obj.tagline = inputs.tagline;
    obj.thumbnail = inputs.thumbnail;
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
    for (let aname in inputs.artifacts) {
        let artifact = inputs.artifacts[aname];
        obj.addToArtifacts({
            name: aname,
            url: artifact.url,
            artType: artifact.type,
            ext: artifact.ext,
            summary: artifact.summary,
            title: artifact.title
        });
    }
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

    for (let aname in inputs.assets) {
        let asset = inputs.assets[aname];
        asset.name = aname;
        asset.episode = obj;
        obj.addToAssets(asset);
    }

    for (let pname in inputs.posts) {
        let post = inputs.posts[pname];
        let postObj = obj.addToPosts({
            name: pname,
            text: post.text,
            createDate: post.createDate,
            postedDate: post.postedDate,
            scheduledDate: post.scheduledDate,
            asset: post.asset,
            episode: obj,
            channel: post.channel,
            state: post._state || "Created",
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
    return obj;
}
