module.exports = {
    friendlyName: 'publish',
    description: 'Publish Episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        artType: {
            description: 'Artifact Type',
            type: 'string', // string|boolean|number|json
            required: true
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
        let channels = Channel._instances;
        let retval = [];
        for(let i in channels) {
            let channel = channels[i];
            let artTypes = channel.types;
            for(let j in artTypes) {
                let artType = artTypes[j];
                if(artType.name === inputs.artType) {
                    retval.push(channel);
                }
            }
        }
        env.res.json(retval);
    }
};
