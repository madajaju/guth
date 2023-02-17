
class BluePrint {
    static definition = {
        name: 'BluePrint',
        description: 'Description ' +
            'long description',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the Blueprint',
            }
        },
        associations: {
            workflows: {
                type: 'BusinessFlow',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
        },
    }
}

module.exports = BluePrint;

