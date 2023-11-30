const path = require('path');

module.exports = {
    friendlyName: 'update',
    description: 'Update an Episode',
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
        // inputs contains the obj for the this method.
        obj.name = inputs.name;

        _save(episode, inputs);
        return episode;
    }
};

function _save(obj, inputs) {
    obj.title = inputs.title;
    obj.summary = inputs.summary;
    obj.meta = inputs.meta;
    obj.notes = inputs.notes;
    obj.createdDate = new Date();
    obj._state = inputs.state;
    for(let i in inputs.tags) {
        let tname = inputs.tags[i];
        if(typeof tname === 'object') {
             let tag = Tag.find({id:tname._id}); // Tags are unique by name.
            if(!tag) {
                tag = new Tag({id: tname._name});
            }
            tag.addToEpisodes(obj);
            obj.addToTags(tag);
        }
    }
    /*
    for(let aname in inputs.artifacts ) {
        let artifact = inputs.artifacts[aname];
        obj.addToArtifacts({name: aname, url: artifact.url, artType: artifact.type});
    }
     */
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
            person.save();
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
}
