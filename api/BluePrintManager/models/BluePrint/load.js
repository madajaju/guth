const fs = require("fs");
const path = require("path");

module.exports = {
    friendlyName: 'load',
    description: 'Load the Blue print for the podcast',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast : {
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
        let blueprint = new BluePrint({podcast: inputs.podcast});
        let wfFiles = fs.readdirSync(`${inputs.podcast.baseDirectory}/workflows`);
        _processWorkflowDirectory(blueprint, `${inputs.podcast.baseDirectory}/workflows`, '');

        return blueprint;
    }
};

function _processWorkflowDirectory(blueprint, mdir, prefix) {
    let wfFiles = fs.readdirSync(mdir);
    if(prefix.length > 0) {
        prefix += '/';
    }
    wfFiles.forEach((file) => {
        // Do not go into hidden directories or files.
        if(file[0] !== '.') {
            let wfile = path.resolve(`${mdir}/${file}`);
            if (fs.statSync(wfile).isDirectory()) {
                _processWorkflowDirectory(blueprint, wfile, file);
            } else if (fs.statSync(wfile).isFile()) {
                let wfName = prefix + path.parse(file).name;
                console.log("Workflow:", wfName);
                try {
                    /*
                    let wflowString = fs.readFileSync(wfile, 'utf-8');
                    let fn = eval(wflowString);
                    blueprint[wfName] = fn;
                     */
                    BusinessFlow.load({name:wfName, file:wfile, blueprint: blueprint});

                } catch (e) {
                    console.error("Cannot load workflow:", wfName, e);
                }
            }
        }
    });
}
