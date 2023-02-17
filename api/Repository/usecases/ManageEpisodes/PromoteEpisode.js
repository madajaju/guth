module.exports = {
    name: 'Promote Episode',
    description: 'Promote Episode is the description',
    method: "data/create",
    actors: {
        'Actor': 'uses',
    },
    steps: [
        { action: 'podcast/create', parameters: {name:'EDT', file:'./templates/podcast.yml'}},
        { action: 'podcast/create', parameters: {name:'RSD1', file:'./templates/podcast.yml'}},
        { action: 'episode/create', parameters: {name:'RSD1-A1', file:'./templates/episode.yml'}},
        { action: 'episode/create', parameters: {name:'EDT-1', file:'./templates/episode.yml'}},
        { action: 'episode/create', parameters: {name:'RSD1-A2', file:'./templates/episode.yml'}},
        { action: 'episode/create', parameters: {name:'RSD1-A3', file:'./templates/episode.yml'}},
        { action: 'episode/create', parameters: {name:'RSD1-A4', file:'./templates/episode.yml'}},
        { action: 'podcast/addepisodes', parameters: { name: 'RSD1', items:'RSD1-A1'}},
        { action: 'podcast/addepisodes', parameters: { name: 'RSD1', items:'RSD1-A2,RSD1-A3,RSD1-A4'}},
        { action: 'podcast/addepisodes', parameters: { name: 'EDT', items:'EDT-1'}},
        { action: 'episode/publish', parameters: { id:'RSD1-A1'}},
        { action: 'episode/promote', parameters: { id:'RSD1-A1'}},
        { action: 'episode/promote', parameters: { id:'EDT-1'}},
    ]
};

