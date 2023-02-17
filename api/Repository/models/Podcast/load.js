const path = require('path');
const fs = require('fs');
// const YAML = require('yaml');

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
        // First save the yaml file describing the podcast.
        /*
        let dirName = global.ailtire.config.persist.basedir + '/' + obj.name;
        if(!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, {recursive: true});
        }
        let apath = path.resolve(dirName + '/podcast.yaml');
        let yamlString = YAML.stringify(obj._attributes);
        obj._persist = { dirname: apath };
        fs.writeFileSync(apath,  yamlString);

         */
        return obj;
    }
};
