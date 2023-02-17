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
        if(!person) {
            console.error("Episode not found:", inputs.id);
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
    // The person is saved with the podcast.
    obj.podcast.save();
}
