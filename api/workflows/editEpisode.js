module.exports = {
    name: "Edit Episode",
    description: "Edit Episode allows the Author to edit the Episode before publishing",
    activities: {
        // Each activity should map to a use case, scenario, or another workflow.
        // This is the initial activity in the workflow. Everything starts here
        Init: {
            description: "Episode has been Created and now is in the Edit State",
            actor: 'Author', // This could be an actor or package.
            parameters: ["episode"],
            next: {
                "Check For Audio Artifact": {
                },
            },
        },
        "Check For Audio Artifact": {
            description: "Check for an '*.mp3' an artifact for each language",
            parameters: ["episode", "language"],
            package: "Repository",
            next: {
                "Create Audio and Video": {
                    parameters: [ 'episode', "language" ],
                    condition: {
                        test: 'Audio Artifact?',
                        value: 'true',
                    }
                },
                "Check For Audio Artifact": {
                    parameters: [ 'episode', 'language'],
                    condition: {
                        test: "Audio Artifact?",
                        value: 'false',
                    }
                }
            }
        },
        "Create Audio and Video": {
            description: "Create the Audio and Video using the Base.prproj file.",
            parameters: [ 'episode', 'language' ],
            package: "Repository",
            next: {
                "Create Captions": {
                    parameters: [ 'episode', 'language']
                }
            }
        },
        "Create Captions": {
            description: "Create Captions for the episode",
            parameters: [ 'episode', 'language'],
            package: 'Repository',
            next: {
                "Fix Captions": { }
            }
        },
        "Fix Captions": {
            description: "Fix the Captions so they match the episode.md file for the language.",
            package: 'Repository',
            parameters: [ 'episode', 'language'],
            next: {
                "Generate Artifacts": {

                }
            }
        },
        "Generate Artifacts": {
            description: "Generate the artifacts (Video and audio) for the episode and language.",
            package: "Repository",
            parameters: [ 'episode', 'language'],
        },
    }
}
