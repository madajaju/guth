const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'saveMe',
    description: 'Save an Episode',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        let episode = obj;
        if(!episode) {
            console.error("Episode not found:", inputs.id);
            if(env.res) {
                env.res.status(404);
            }
            return;
        }
        if(!inputs) {
            inputs= {};
        }
        if(inputs && inputs.name) {
            obj.name = inputs.name;
        }

        _save(episode, inputs);
        return episode;
    }
};

function _save(obj, inputs) {
    obj.title = inputs.title || obj.title || "Title";
    obj.summary = inputs.summary || obj.summary || "Summary";
    obj.meta = inputs.meta || obj.meta || "Meta";
    obj.notes = inputs.notes || obj.notes || "Notes";
    obj.createdDate = inputs.createdDate || obj.createdDate || new Date();
    obj._state = inputs.state || obj._state;
    obj.number = inputs.number || obj.number;
    obj.pillars = inputs.pillars;
    obj.dimensions = inputs.dimensions;
    obj.releaseDate = inputs.releaseDate || obj.releaseDate || "";
    obj.scheduledDate = inputs.scheduledDate || obj.scheduledDate || "";
    if(obj.releaseDate.length > 0) {
        obj.releaseDate = new Date(obj.releaseDate);
    }
    for(let i in inputs.tags) {
        let tname = inputs.tags[i];
        if(typeof tname === 'object') {
            tagName = tname._name.replace(/\s/g,'').replace(/\-/g,'');
             let tag = Tag.find({id:tagName}); // Tags are unique by name.
            if(!tag) {
                tag = new Tag({id: tagName});
            }
            tag.addToEpisodes(obj);
            obj.addToTags(tag);
        }
    }
    for(let i in inputs.guests) {
        // Need to check for an object instead of a name. If tne object is there
        // then check the id. Grab the inputs.guests[i].text
        let pname = inputs.guests[i];
        if (typeof pname === 'object') {
            pname = pname._name;
        }
        let person = Person.find({name: pname});
        if (!person) {
            person = new Person({name: pname});
            person.podcast = obj.owner;
            person.save();
        }
        obj.addToGuests(person);
        person.addToEpisodes(obj);
    }

    if(inputs.script && inputs.script.length > 0) {
        // Store this in the episode.md file in the root directory.
        let edir = path.dirname(obj.saveFile);
        fs.writeFileSync(edir + '/episode.md', inputs.script);
    }
    if(obj.saveFile) {
        let afile = path.resolve(obj.saveFile);
        let tempObj = obj.getJSON();

        let estring = "module.exports = " + JSON.stringify(tempObj, null, 2) +';';
        fs.writeFileSync(afile, estring);

        // Now store the stats file for the episode.
        // Traverse through the assets and posts to get the stats and put them in a file.
        let tempStat = {};
        for(let i in obj.assets) {
            let asset = obj.assets[i];
            tempStat[asset.name] = [];
            for(let j in asset.stats) {
                let stat = asset.stats[j];
                tempStat[asset.name].push( {date: stat.date, values: stat.values, totals: stat.totals});
            }
        }
        for(let i in obj.posts) {
            let post = obj.posts[i];
            tempStat[post.id] = [];
            for(let j in post.stats) {
                let stat = post.stats[j];
                tempStat[post.id].push( {date: stat.date, values: stat.values, totals: stat.totals});
            }
        }
        let sfile = path.resolve(obj.saveFile.replace(".episode.js", ".stats.js"));
        let sstring = "module.exports = " + JSON.stringify(tempStat, null, 2 ) + ";";
        fs.writeFileSync(sfile, sstring)
    }
}
