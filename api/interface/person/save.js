const path = require('path');

module.exports = {
    friendlyName: 'save',
    description: 'Save an Person',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'Id of the person',
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

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let person = null;
        if(inputs.id) {
            // episode = new Episode({id:inputs.id});
            person = Person.find(inputs.id);
        }
        if(!person) {
            person = Person.find(inputs.name);
        }
        if(person) {
            person.save(inputs);
            env.res.status(200);
            env.res.json({results:"Episode Saved!"});
        } else {
            if(env.res) {
                env.res.status(404);
                env.res.json({error:"Error Could not find the Episode!"});
            }
        }
    }
};
