module.exports = {
    name: "Create An Episode for EDTW",
    description: "This Creates and episode for EDTW",
    activities: {
        // Each activity should map to a use case, scenario, or another workflow.
        // This is the initial activity in the workflow. Everything starts here
        Init: {
            description: "The Episode is created",
            actor: 'Author', // This could be an actor or package.
            inputs: {
                title: {
                    description: "Name of the Episode",
                    type: 'string',
                    required: true,
                },
                summary: {
                    description: "Summary of the episode.",
                    type: 'string',
                    required: true,
                },
                script: {
                    description: "This is the md formated script for the episode.",
                    type: 'string',
                    required: true,
                },
            },
            outputs: {
                episode: {
                    description: "Episode created from the inputs.",
                    type: 'Episode',
                }
            },
            next: {
                "generateLogo": {
                    args: {
                        episode: (activity) => { return activity.outputs.episode; }
                    }
                },
            },
        },
        "generateLogo": {
            description: "Generate the Logos for each laguage of the episode.",
            package: "Repository",
            inputs: {
                episode: {
                    description: "The episode to generate the logos",
                    type: 'Episode',
                    required: true
                }
            },
            outputs: {
                episode: {
                    description: "The episode with the upaded logos for each language",
                    type: "Episode"
                }
            },
            next: {
                "translateEpisode": {
                    args: {
                        episode: (activity) => { return activity.outputs.episode; }
                    }
                }
            }
        },
        "translateEpisode": {
            description: "Translate the episode into the different languages",
            package: "Repository",
            inputs: {
                episode: {
                    description: "The episode to generate the logos",
                    type: 'Episode',
                    required: true
                }
            },
            outputs: {
                episode: {
                    description: "The episode with the updated scripts for the different languages",
                    type: "Episode"
                }
            },
            next: {
                "generateVoices": {
                    args: {
                        episode: (activity) => { return activity.outputs.episode; }
                    }
                }
            }
        },
        "generateVoices": {
            inputs: {
                episode: {
                    description: "The episode to Generate the voices",
                    type: 'Episode',
                    required: true
                }
            },
            outputs: {
                episode: {
                    description: "The episode with the updated scripts for the different languages",
                    type: "Episode"
                }
            },
            next: {
                "editVoices": {
                    args: {
                        episode: (activity) => { return activity.outputs.episode; }
                    }
                }
            }
        },
        "editVoices": {
            inputs: {
                episode: {
                    description: "Edit the voices for each of the languages",
                    type: 'Episode',
                    required: true
                }
            },
            outputs: {
                episode: {
                    description: "Episode that the audio was edited.",
                    type: "Episode"
                },
                artifacts: {
                    description: "Artifacts that are created from the editing the voices. These are wav files.",
                    type: "json"
                }
            },
            next: {
                "editVoices": {
                    args: {
                        episode: (activity) => { return activity.outputs.episode; }
                    }
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
