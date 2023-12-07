const path = require('path');
const fs = require("fs");

module.exports = {
    friendlyName: 'save',
    description: 'Save an episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        attr1: {
            description: 'Description for the parameter',
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
        let episode = null;
        if(inputs.id) {
            // episode = new Episode({id:inputs.id});
            episode = Episode.find(inputs.id);
        }
        if(!episode) {
            episode = Episode.find(inputs.name);
        }
        if(episode) {
            // Save the script as the episode.md file in the Production directory.
            if(inputs.script && inputs.script.length > 0) {
                let edir = path.dirname(episode.saveFile);
                fs.writeFileSync(edir + '/Production/episode.md', inputs.script);
            }
            console.log("Saving episode:", inputs);
            episode.saveMe(inputs);
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
