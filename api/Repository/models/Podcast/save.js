const path = require('path');
const fs = require('fs');
// const YAML = require('yaml');

module.exports = {
    friendlyName: 'save',
    description: 'Save the Podcast',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    exits: {
    },
    fn: function (obj, inputs, env) {
        // Save the podcast to the .guth.js file in the baseDirectory.

        let baseDir = obj.baseDirectory;
        _save(obj, baseDir);
        // First save the yaml file describing the podcast.
        /* let filename = path
        let dirName = global.ailtire.config.persist.basedir + '/' + obj.name;
        if(!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, {recursive: true});
        }
        let apath = path.resolve(dirName + '/podcast.yaml');
        let yamlString = YAML.stringify(obj._attributes);
        fs.writeFileSync(apath,  yamlString);
        */
        return obj;
    }
};
function _save(obj, baseDir) {
    let sobj = {
        directories: obj.directories,
        base: obj.base,
        name: obj.name,
        summary: obj.summary,
    }
    // Channels
    sobj.channels = {};
    for(let i in obj.channels) {
        let channel = obj.channels[i];
        sobj.channels[channel.id] = channel._attributes;
    }
    // Guests
    sobj.guests = {};
    for(let i in obj.guests) {
        let guest = obj.guests[i];
        let osocials = {};
        for(let j in guest.socials) {
            let social = guest.socials[j];
            osocials[social.stype]= social.name;
        }
        sobj.guests[guest.name] = {
            name: guest.name,
            email: guest.email,
            notes: guest.notes,
            socials: osocials
        }
    }
    // Blueprints
    sobj.blueprints = {};

    let afile = path.resolve(baseDir + '/.guth.js');

    let estring = "module.exports = " + JSON.stringify(sobj, null, 2) +';';
    fs.writeFileSync(afile, estring);
    return obj;
}
