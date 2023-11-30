const path = require('path');
const fs = require('fs');

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
        // Save the artTypes
        let types = [];
        let artTypes = channel.types;
        for(let i in artTypes) {
            if(typeof artTypes[i] === 'string'){
                types.push(artTypes[i]);
            } else if(artTypes[i].name.length > 0) {
                types.push(artTypes[i].name);
            }
       }
        sobj.channels[channel.id].types = types.filter((value, index, self) => self.indexOf(value) === index);
    }
    // Add mappings and templates
    sobj.mappings = {};
    for(let i in obj.blueprint.mappings) {
        let mapping = obj.blueprint.mappings[i];
        let channels = [];
        for (let k in mapping.channels) {
            channels.push(mapping.channels[k].id);
        }
        sobj.mappings[mapping.id] = {
           id: mapping.id,
           name: mapping.name,
            templates: {},
            channels: channels
        };
        for(let j in mapping.templates) {
            let template = mapping.templates[j];
            sobj.mappings[mapping.id].templates[template.name] = template.file;
        }
    }

    // Blueprints
    sobj.blueprints = {};
    sobj.lang = obj.lang;

    let afile = path.resolve(baseDir + '/.guth.js');

    let estring = "module.exports = " + JSON.stringify(sobj, null, 2) +';';
    fs.writeFileSync(afile, estring);
    return obj;
}
