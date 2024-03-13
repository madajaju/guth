
class BusinessActivity {
    static definition = {
        name: 'BusinessActivity',
        description: 'These are activities that businesss flows can call on the run processes',
        attributes: {
            path: {
                type: 'string',
                description:"URL Path to the workflow",
            },
            name: {
                type: 'string',
                description: 'Name of the business flow',
            },
            file: {
                type: 'string',
                description: "File that represents the function. This is where it is stored.",
            },
            description: {
                type: 'string',
                description: 'Description of the business flow',
                multiline: true
            },
            inputs: {
                type: 'json',
                description: 'Parameters passed to the business flow'
            },
            fn: {
                type: 'ref',
                description: 'function to execute when the business flow is run'
            }
        },
        associations: {
            blueprint: {
                type: 'BluePrint',
                cardinality: 1,
            }
        },
    }
}

module.exports = BusinessActivity;

