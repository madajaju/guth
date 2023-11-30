module.exports = {
    name: "Publish Episode",
    description: "Publish Episode to youtube and transistor for each language episode",
    activities: {
        // Each activity should map to a use case, scenario, or another workflow.
        // This is the initial activity in the workflow. Everything starts here
        Init: {
            description: "Initial state for the workflow",
            actor: 'Actor', // This could be an actor or package.
            parameters: ['episode', 'language'],
            next: {
                "Create Assets": { },
            },
        },
        "Create Assets": {
            description: "Create Assets",
            parameters: ['episode', 'language'],
            package: "ChannelManager",
            next: {
                "Publish Artifact On Transistor": {
                    parameters: [ 'episode', 'language', 'audio']
                },
                "Publish Artifact On YouTube": {
                    parameters: [ 'episode', 'language', 'video']
                },
            }
        },
        "Publish Artifact On Transistor": {
            description: "Publish Artifact on Transistor based on the language",
            parameters: ['episode', 'language'],
            next: {
                'Publish Blog': { }
            }
        },
        "Publish Artifact On YouTube": {
            description: "Publish Artifact on YouTube based on the language",
            parameters: ['episode', 'language'],
            next: {
                'Publish Blog': { }
            }
        },
        "Publish Blog": {
            description: "Publish the Blog for the language",
            parameters: ['episode', 'language']
        }
    }
}
