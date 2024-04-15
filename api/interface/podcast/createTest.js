const path = require('path');
const AEvent = require("ailtire/src/Server/AEvent");

module.exports = {
    friendlyName: 'createTest',
    description: 'Description of the action',
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
        AEvent.emit("podcast.started", {message: "Started"});
        for(let i=0 ; i < 30; i++) {
            AEvent.emit("podcast.inprogress", {message: `Running ${i}`});
        }
        AEvent.emit("podcast.completed", {message: "Done"});
    }
};