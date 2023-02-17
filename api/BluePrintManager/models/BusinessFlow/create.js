const path = require('path');
const fs = require('fs');
// const FileSystem = require('ailtire/src/Persist/YAMLFileSystem');

module.exports = {
    friendlyName: 'create',
    description: 'Create the business flow',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            description: 'Name of the Business Flow',
            type: 'string', // string|boolean|number|json
            required: true
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for this method.
        inputs.file
        obj.name = inputs.name;
        // FileSystem.save([obj]);
        let dirname = path.resolve(obj._attributes._persist.directory );
        let apath = path.resolve( obj._attributes._persist.directory + `/${obj.name}.js`);
        console.log(apath);
        fs.mkdirSync(dirname, {recursive: true});
        fs.writeFileSync(apath, inputs.file);
        let values = require(apath);
        console.log(values);
        obj.description = values.description;
        obj.inputs = values.inputs;
        obj.fn = values.fn;
        obj.exits = values.exits;
        obj.friendlyName = values.friendlyName;
        return obj;
    }
};
