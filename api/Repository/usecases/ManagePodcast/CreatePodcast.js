module.exports = {
    name: 'Create Podcast',
    description: 'Create Podcast is the description',
    method: "podcast/create",
    actors: {
        'Actor': 'uses',
    },
    steps: [
        { action: 'podcast/create', parameters: {name:'EDT', file:'./templates/EDT-podcast.yml'}},
        { action: 'podcast/create', parameters: {name:'WTL', file:'./templates/WTL-podcast.yml'}},
        { action: 'podcast/create', parameters: {name:'GPHD', file:'./templates/GPHD-podcast.yml'}},
    ]
};

