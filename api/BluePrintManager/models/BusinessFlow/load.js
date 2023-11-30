const Action = require('ailtire/src/Server/Action');
const Generator = require('ailtire/src/Documentation/Generator');
const AEvent = require('ailtire/src/Server/AEvent');
const AService = require('ailtire/src/Server/AService');
const {jsPDF } = require("jspdf");
const sharp = require("sharp");
const ejs = require('ejs');

module.exports = {
    friendlyName: 'load',
    description: 'Load the business flow from the workflow directory',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        name: {
            description: 'Name of the Business Flow',
            type: 'string', // string|boolean|number|json
            required: true
        },
        file: {
            description: 'File containing the workflow',
            type: 'string',
            required: true,
        },
        blueprint : {
            description: 'Blueprint of the business flow',
            type: 'ref',
            required: true,
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for this method.
       global.Generator = Generator;
        global.AEvent = AEvent;
        global.AService = AService;
        global.ejs = ejs;
        global.jsPDF = jsPDF;
        global.sharp = sharp;
        let name = inputs.name;
        let retval = null;
        try {
            let tempwf = require(inputs.file);
            let path = `blueprint/workflow`;
            retval = new BusinessFlow({
                name: inputs.name,
                path: path,
                fn: tempwf.fn,
                inputs: tempwf.inputs,
                friendlyName: tempwf.friendlyName,
                exits: tempwf.exits,
                description: tempwf.description
            });
            inputs.blueprint.addToWorkflows(retval);
            // Now add this to the action list so it can be called via the REST interface.
            // It should follow the pattern /blueprint/${podcastName}/${name}
            Action.add(path, retval);
        }
        catch(e) {
            console.warn('Error loading workflow:', inputs.name, inputs. file);
            console.error(e);
        }
        return retval;
    }
};
