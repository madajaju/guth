const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Description of the action',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            description: 'Name of the person',
            type: 'string', // string|boolean|number|json
            required: false
        },
        email: {
            description: 'Email of the person',
            type: 'string', // string|boolean|number|json
            required: false
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
        // inputs contains the obj for the this method.
        if (inputs.file) {
            for (let stype in inputs.file.socails) {
                let sname = inputs.file.socails[stype];
                let sobj = new SocialHandle({name: sname, type: stype});
                obj.addToSocials(sobj);
            }
            if (inputs.file.name) {
                obj.name = inputs.file.name;
            }
            if (inputs.file.email) {
                obj.email = inputs.file.email;
            }
            if (inputs.file.notes) {
                obj.notes = inputs.file.notes;
            }
            if (inputs.file.bio) {
                obj.bio = inputs.file.bio;
            }
            if (inputs.file.thumbnail) {
                obj.thumbnail = inputs.file.thumbnail;
            }
        }
        if(inputs.name) {
            obj.name = inputs.name;
        }
        if(inputs.email) {
            obj.email = inputs.email;
        }
        if(inputs.bio) {
            obj.bio = inputs.bio;
        }
        if(inputs.thumbnail) {
            obj.thumbnail = inputs.thumbnail;
        }
        obj.name = obj.id;
        if(inputs.socials) {
            for(let stype in inputs.socials) {
                obj.addToSocials({name: inputs.socials[stype], stype:stype });
            }
        }
        return obj;
    }
};
