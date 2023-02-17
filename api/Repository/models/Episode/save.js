const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'save',
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
        if(inputs.name) {
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
        }
        obj.addToGuests(person);
        person.addToEpisodes(obj);
    }
/*
    for(let aname in inputs.assets) {
       let asset = inputs.assets[aname];
       asset.name = aname;
       asset.episode = obj;
       obj.addToAssets(asset);
    }
*/
    // AEvent.emit('episode.updated', {obj: obj.toJSON});
    if(obj.saveFile) {
        let afile = path.resolve(obj.saveFile);
        let tempObj = obj.getJSON();

        let estring = "module.exports = " + JSON.stringify(tempObj, null, 2) +';';
        fs.writeFileSync(afile, estring);
    }
}
