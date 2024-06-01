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
        },
        date: {
            description: "Date to retrieve information",
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
        let myDate = inputs.date || new Date();
        myDate = new Date(myDate);
        let beforeDate = new Date();
        let afterDate = new Date();
        beforeDate.setDate(myDate.getDate() - 45);
        afterDate.setDate(myDate.getDate() + 45);
        let retval = {};
        for(let i in global._tasks) {
            if(global._tasks[i].scheduledDate) {
                let sDate = new Date(global._tasks[i].scheduledDate);
                if (sDate > beforeDate && sDate < afterDate) {
                    retval[i] = global._tasks[i];
                }
            }
        }
        return retval;
    }
};
