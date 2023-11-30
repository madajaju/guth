require('dotenv').config();

const {Configuration, OpenAIApi} = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY
});
global.openai = new OpenAIApi(configuration);


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
        let args = env.req.body;
        let workflow = BusinessFlow.find(args.id);
        let podcast = Podcast.find(args.pid);

        if(!workflow) {
            if(inputs.res) {
                inputs.res.json('Workflow Not Found:' + args.workflow);
            }
            return;
        }
        workflow.fn(podcast, args, env);
        if(env.res)  {
            env.res.json({results: {id: workflow.id, name: workflow.name}});
        }
        return;
    }
}
