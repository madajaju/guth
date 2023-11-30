const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'save',
    description: 'Save a Person',
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
        let person = obj;

        if(!inputs) {
            inputs = {};
        }
        if(!person) {
            console.error("Person not found:", inputs.id);
            if(env.res) {
                env.res.status(404);
            }
            return;
        }
        if(inputs.name) {
            obj.name = inputs.name;
        }

        _save(person, inputs);
        return person;
    }
};

function _save(obj, inputs) {
    obj.email = inputs.email || obj.email || "Email";
    obj.notes = inputs.notes || obj.notes || "Notes";
    obj.bio = inputs.bio || obj.bio || "TBD";
    obj.thumbnail = inputs.thumbnail || obj.thumbnail || "thumbail.jpg";
    let podcast = obj.podcast;
    if(podcast) {
        let gdir = podcast.baseDirectory + '/guests/' + obj.name.replace(/\s/g, '-').replace(/\./g, '')
        fs.mkdirSync(gdir, {recursive: true});
        let jobj = {}
        let bioText = obj.bio;
        obj.bio = "bio.md";
        for (let i in obj._attributes) {
            jobj[i] = obj._attributes[i];
        }
        jobj.socials = {};
        for (let i in obj.socials) {
            jobj.socials[i] = obj.socials._attributes;
        }
        let json = "module.exports = " + JSON.stringify(jobj);
        fs.writeFileSync(gdir + '/index.js', json);
        fs.writeFileSync(gdir + '/bio.md', bioText);
    }

}
