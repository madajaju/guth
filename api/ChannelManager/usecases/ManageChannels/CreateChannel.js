module.exports = {
    name: 'Create Channel',
    description: 'Create Channel is the description',
    method: "channel/list",
    actors: {
        'Author': 'uses',
    },
    steps: [
        { action: 'cm/create', parameters: {name:'channel1', type: 'Linkedin', file:'./templates/channel.yml'}},
        { action: 'cm/create', parameters: {name:'channel2', type: 'Facebook', file:'./templates/channel.yml'}},
        { action: 'cm/create', parameters: {name:'channel3', type: 'Youtube', file:'./templates/channel.yml'}},
        { action: 'cm/create', parameters: {name:'channel4', type: 'IntelYoutube', file:'./templates/channel.yml'}},
    ]
};

