const OpenAI = require('openai');
const fs = require("fs");
// const async_hooks = require("node:async_hooks");

global.openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});
/*
const writeSomething = (phase, more) => {
    fs.writeSync(
        1,
        `Phase: "${phase}", Exec. Id: ${async_hooks.executionAsyncId()}, Parent Id: ${async_hooks.triggerAsyncId()} ${
            more ? ", " + more : ""
        }\n`
    );
};

// Create and enable the hook
const timeoutHook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId) {
        writeSomething(
            "Init",
            `asyncId: ${asyncId}, type: "${type}", triggerAsyncId: ${triggerAsyncId}`
        );
    },
    before(asyncId) {
        writeSomething("Before", `asyncId: ${asyncId}`);
    },
    destroy(asyncId) {
        writeSomething("Destroy", `asyncId: ${asyncId}`);
    },
    after(asyncId) {
        writeSomething("After", `asyncId: ${asyncId}`);
    },
    promiseResolve(asyncId) {
        writeSomething("PromiseResolved", `asyncId: ${asyncId}`);
    },


});
*/

module.exports = {
    friendlyName: 'workflow',
    description: 'Run Workflow to BluePrint',
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
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        // timeoutHook.enable();
        let args = env.req.body;
        let workflow = BusinessFlow.find(args.id);
        let podcast = Podcast.find(args.pid);

        if(!workflow) {
            if(inputs.res) {
                inputs.res.json('Workflow Not Found:' + args.workflow);
            }
            return;
        }
        args.podcast = podcast;
        workflow.fn(args, env);
        if(env.res)  {
            env.res.json({results: {id: workflow.id, name: workflow.name}});
        }
        // timeoutHook.disable();
        return;
    }
}
