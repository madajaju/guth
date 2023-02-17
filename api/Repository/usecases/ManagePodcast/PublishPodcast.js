module.exports = {
    name: 'Publish Podcast',
    description: 'Publish Podcast is the description',
    method: "podcast/publish",
    actors: {
        'Actor': 'uses',
    },
    steps: [
        { action: 'podcast/publish', parameters: {id:'Embracing Digital Transformation'} }
    ]
};

