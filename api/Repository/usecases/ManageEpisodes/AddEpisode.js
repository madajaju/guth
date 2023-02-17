module.exports = {
    name: 'Add Episode',
    description: 'Add Episode is the description',
    method: "episode/create",
    actors: {
        'Author': 'uses',
    },
    steps: [
        { action: 'episode/create', parameters: {name:'RSD-1', file:'./templates/episode1.yml'}},
    ]
};

