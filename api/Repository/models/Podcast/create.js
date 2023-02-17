const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Description of the action',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            description: 'Name of the podcast',
            type: 'string', // string|boolean|number|json
            required: false
        },
        title: {
            description: 'Title of the podcast',
            type: 'string', // string|boolean|number|json
            required: false
        },
        summary: {
            description: 'Name of the podcast',
            type: 'string', // string|boolean|number|json
            required: false
        },
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.

        if (inputs.file) {
           obj = _loadParameters(obj, inputs.file);
        }
        obj = _loadParameters(obj, inputs);
        obj.blueprint = new BluePrint({name: obj.name + ' Blueprint'});
        return obj;
    }
};

function _loadParameters(obj, params) {
    if (params.name) {
        obj.name = params.name;
    }
    if (params.title) {
        obj.title = params.title;
    }
    if (params.summary) {
        obj.summary = params.summary;
    }
    if (params.channels) {
        for (let cname in params.channels) {
            let channel = params.channels[cname];
            channel.name = cname;
            let cobj = Channel.factory(channel);
            obj.addToChannels(cobj);
        }
    }
    if (params.thumbnail) {
        obj.thumbnail = params.thumbnail
    }
    // obj.save();
    return obj;
}
