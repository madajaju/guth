const path = require('path');
const fs = require('fs');
const generator = require('ailtire/src/Documentation/Generator.js');
const pdf = require('html-pdf');
const puppeteer = require('puppeteer');

module.exports = {
    friendlyName: 'generatepdf',
    description: 'Generate PDF for an episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: "ID of the episode",
            type: 'string',
            required: true
        }
    },

    exits: {

    },

    fn: async function (inputs, env) {
        let episode = Episode.find(inputs.id);
        if (!episode) {
            console.error("Could not find the episode:", inputs.id);
            env.res.json({status: "error"});
            return;
        }
        if(env.res) {
            env.res.json("Completed");
        }
        return episode.generatepdf();
    }
};
