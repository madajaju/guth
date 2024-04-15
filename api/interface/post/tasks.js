const path = require('path');
const fs = require("fs");

module.exports = {
    friendlyName: 'submitScheduled',
    description: 'Submit all of the posts that are scheduled and the scheduled Date is past',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: "Podcast to schedule the posts",
            type: "string"
        }
    },

    exits: {
        json: (obj) => { return obj; },
    },

    fn: async function (inputs, env) {
        if(!global._tasks) {
            global._tasks = {};
        }
        return global._tasks;
    }
};
