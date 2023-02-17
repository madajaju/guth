module.exports = {
    name: 'Promote Podcast',
    description: 'Promote Podcast is the description',
    method: "post/list",
    actors: {
        'Author': 'uses',
    },
    steps: [
        { action: 'podcast/create', parameters: {name:'EDT', file:'./templates/podcast.yml'}},
        { action: 'podcast/create', parameters: {name:'RSD2', file:'./templates/podcast.yml'}},
        { action: 'episode/create', parameters: {name:'RSD2-A1', file:'./templates/episode.yml'}},
        { action: 'episode/create', parameters: {name:'RSD2-A2', file:'./templates/episode2.yml'}},
        { action: 'episode/create', parameters: {name:'RSD2-A3', file:'./templates/episode3.yml'}},
        { action: 'episode/create', parameters: {name:'EDT-1', file:'./templates/episode.yml'}},
        { action: 'podcast/addepisodes', parameters: { name: 'RSD2', items:'RSD2-A1'}},
        { action: 'podcast/addepisodes', parameters: { name: 'RSD2', items:'RSD2-A2'}},
        { action: 'podcast/addepisodes', parameters: { name: 'RSD2', items:'RSD2-A3'}},
        { action: 'podcast/addepisodes', parameters: { name: 'EDT', items:'EDT-1'}},
        { action: 'episode/publish', parameters: { id:'RSD2-A1'}},
        { action: 'podcast/promote', parameters: { id: 'RSD2', tags:'Cloud,Security'}},
        { action: 'podcast/promote', parameters: { id: 'RSD2', products:'Xeon,Optane'}},
        { action: 'podcast/promote', parameters: { id: 'RSD2', solutions:'VAST'}},
        { action: 'podcast/promote', parameters: { id: 'EDT', solutions:'VAST'}}
    ]
};

