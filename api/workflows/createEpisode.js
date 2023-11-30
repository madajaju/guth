module.exports = {
    name: "Create An Episode",
    description: "This Creates and episode for EDTW",
    activities: {
        // Each activity should map to a use case, scenario, or another workflow.
        // This is the initial activity in the workflow. Everything starts here
        Init: {
            description: "The Episode is created",
            actor: 'Author', // This could be an actor or package.
            parameters:  [ "title", "releaseDate" ],
            next: {
                "Write Script": { },
                "Generate Logos": { },
            },
        },
        "Generate Logos": {
            description: "Generate the Logos for each laguage of the episode.",
            parameters: [ "episode" ],
        },
        "Write Script": {
            description: "Write the script for the episode based on none URLs and stories.",
            actor: 'Author',
            package: "Repository",
            next: {
                "Generate Script": {
                    parameters: [ "urls" ],
                }
            }
        },
        "Generate Script": {
            description: "Generate a script from nine URL chosen",
            parameters: [ "episode", "urls" ],
            pacakge: "ChannelManager",
            next: {
                "Check Script": {
                    parameters: [ "episode", "scriptFile" ],
                }
            }
        },
        "Check Script": {
            description: "Check the script for errors, Make changes if neccesary",
            parameters: [ "scriptFile" ],
            package: "Author",
            next: {
                "Write Script": {
                    parameters: [ "scriptFile" ],
                    condition: {
                         test: "User response",
                        value: "Edit"
                    }
                },
                "Translate Script": {
                    parameters: [ "episode", "scriptFile" ],
                    condition: {
                        test: "User response",
                        value: "Ok"
                    }
                }
            }
        },
        "Translate Script": {
            description: "Translate the script into all of the languages for the podcast",
            package: "ChannelManager",
            parameters: [ "episode" ],
            next: {
                "Send Email to Readers": {
                    parameters: [ "episode" ],
                }
            },
        },
        "Send Email to Readers": {
            description: "Send an email to the readers to let them know the episode is ready to be looked at and read",
            package: "ChannelManager",
        },
    }
}
