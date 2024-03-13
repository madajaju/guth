const Action = require('ailtire/src/Server/Action');
const Generator = require('ailtire/src/Documentation/Generator');
const AEvent = require('ailtire/src/Server/AEvent');
const AService = require('ailtire/src/Server/AService');
const {jsPDF} = require("jspdf");
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
        blueprint: {
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
        let filename = inputs.file;
        let retval = null;
        let tempwf = require(filename);
        tempwf.name = name;
        global.topPackage.workflows[tempwf.name] = tempwf;
        tempwf.pkg = global.topPackage.shortname;
        if (!global.hasOwnProperty('workflows')) {
            global.workflows = {};
        }
        if (!global.workflows.hasOwnProperty(tempwf.name)) {
            global.workflows[tempwf.name] = tempwf;
        } else {
            console.error("Workflow already defined:", tempwf.name);
        }
        let wfInputs = undefined;
        if (tempwf.activities && tempwf.activities.Init) {
            wfInputs = tempwf.activities.Init.inputs;
        } else {
            console.error("Missing Init activity.", tempwf.name);
        }
        retval = new BusinessFlow({
            name: tempwf.name,
            path: tempwf.name,
            inputs: wfInputs,
            description: tempwf.description
        });
        inputs.blueprint.addToWorkflows(retval);

        return retval;
    }
};
