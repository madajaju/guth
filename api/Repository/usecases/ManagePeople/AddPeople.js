module.exports = {
    name: 'Add People',
    description: 'Add People is the description',
    method: "people/list",
    actors: {
        'Author': 'uses',
    },
    steps: [
        { action: 'person/create', parameters: {firstname:'Steve', lastname:'Orrin', email: 'sorrin@intel.com'}},
        { action: 'person/create', parameters: {file:'./templates/person.yml'}},
    ]
};

