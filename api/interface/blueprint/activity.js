const OpenAI = require('openai');
const fs = require("fs");
// const async_hooks = require("node:async_hooks");

global.openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

module.exports = {
    friendlyName: 'activity',
    description: 'Run Activity to BluePrint',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: 'ID of the workflow',
            type: 'string',
            required: true,
        },
        path: {
            description: 'Workflow of the mapping',
            type: 'string',
            required: true
        },
        inputs: {
            description: 'Inputs of the mapping target:artifact',
            type: 'json',
            required: false
        },
    },

    exits: {
        success: {},
        json: {},
        notFound: {
        }
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        // timeoutHook.enable();
        let args = env.req.body;
        let activity =  BusinessActivity.find(args.id);
        let podcast = Podcast.find(args.pid);

        if(!activity) {
            if(inputs.res) {
                inputs.res.json('Activity Not Found:' + args.id);
            }
            return;
        }
        args.podcast = podcast;
        activity.fn(args, env);
        if(env.res)  {
            env.res.json({results: {id: activity.id, name: activity.name}});
        }
        return;
    }
}
