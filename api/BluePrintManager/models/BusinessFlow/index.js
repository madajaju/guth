
class BusinessFlow {
    static definition = {
        name: 'BusinessFlow',
        description: 'Business Flow is a workflow that runs when called.',
        attributes: {
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
            mappings: {
                type: 'Mapping',
                cardinality: 'n',
                composition: false,
                owner: true,
                via: 'parent'
            },
        },
    }
}

module.exports = BusinessFlow;

