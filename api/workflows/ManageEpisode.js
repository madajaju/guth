module.exports = {
    name: "Manage Episode",
    description: "Manage Episode throw the creation and publishing process",
    activities: {
        // Each activity should map to a use case, scenario, or another workflow.
        // This is the initial activity in the workflow. Everything starts here
        Init: {
            description: "This is the overall management process for an episode",
            actor: 'Author', // This could be an actor or package.
            next: {
                "Create Episode": { },
            },
        },
        "Create Episode": {
            description: "Create an Episode",
            parameters: [ "title", "releaseData" ],
            actor: 'Author',
            next: {
                "Edit Episode": { }
            }
        },
        "Edit Episode": {
            description: "Edit an Episode",
            parameters: ['episode'],
            actor: 'Author',
            next: {
                "Publish Episode": { }
            }
        },
        "Publish Episode": {
            description: "Publish an episode to all of the channels",
            parameters: [ 'episode'],
            actor: 'Author',
            next: {
                'Promote Episode': { }
            }
        },
        "Promote Episode": {
            description: "Promote Episode across multiple channels",
            parameters: [ 'episode'],
            actor: 'Author'
        }
    }
}
