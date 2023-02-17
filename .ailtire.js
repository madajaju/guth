module.exports = {
    "host": "http://localhost/web", "actions": {
        "/cm/create": {
            "name": "/cm/create",
            "inputs": {
                "name": {"description": "Name of the Channel", "type": "string", "required": true},
                "type": {"description": "Type of the Channel", "type": "string", "required": true},
                "user": {"description": "User of the Channel", "type": "string", "required": false},
                "creds": {"description": "Credentials of the User on the Channel", "type": "string", "required": false}
            },
            "friendlyName": "create",
            "description": "Create a Channel"
        },
        "/podcast/publish": {
            "name": "/podcast/publish",
            "inputs": {"id": {"description": "ID for the podcast", "type": "string", "required": true}},
            "friendlyName": "publish",
            "description": "Publish the podcast"
        },
        "/cm/channel/list": {
            "name": "/cm/channel/list",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "list",
            "description": "Description of the action"
        },
        "/cm/data/govern": {
            "name": "/cm/data/govern",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "govern",
            "description": "Description of the action"
        },
        "/episode/generatePDF": {
            "name": "/episode/generatePDF",
            "inputs": {
                "id": {"description": "ID of the episode to publish", "type": "string", "required": true},
            },
            "friendlyName": "generatePDF",
            "description": "Generage PDF for the episode"
        },
        "/episode/promote": {
            "name": "/episode/promote",
            "inputs": {
                "id": {"description": "ID of the episode to publish", "type": "string", "required": true},
                "channels": {
                    "description": "Channels to publish to. Comma Separated list",
                    "type": "string",
                    "required": true
                }
            },
            "friendlyName": "promote",
            "description": "Promote Episode"
        },
        "/episode/publish": {
            "name": "/episode/publish",
            "inputs": {
                "id": {"description": "ID of the episode to publish", "type": "string", "required": true},
                "channels": {
                    "description": "Channels to publish to. Comma Separated list",
                    "type": "string",
                    "required": true
                }
            },
            "friendlyName": "publish",
            "description": "Publish Episode"
        },
        "/podcast/createEpisode": {
            "name": "/podcast/createEpisode",
            "inputs": {
                "podcast": {"description": "Podcast Name", "type": "string", "required": true},
                "title": {"description": "Title of the Episode", "type": "string", "required": true},
                "number": {"description": "Number of the Episode", "type": "string", "required": false},
            },
            "friendlyName": "createEpisode",
            "description": "Create Episode to Podcast"
        },
        "/podcast/createworkflow": {
            "name": "/podcast/createworkflow",
            "inputs": {
                "podcast": {"description": "Podcast Name", "type": "string", "required": true},
                "name": {"description": "Name of the workflow", "type": "string", "required": true},
                "file": {"description": "File name of the Workflow", "type": "file", "required": false}
            },
            "friendlyName": "createWorkflow",
            "description": "Create Workflow to Podcast"
        },
        "/podcast/promote": {
            "name": "/podcast/promote",
            "inputs": {
                "id": {"description": "ID of the podcast to promote", "type": "string", "required": true},
                "solutions": {"description": "Solutions to promote", "type": "string", "required": false},
                "products": {"description": "Products to promote", "type": "string", "required": false},
                "tags": {"description": "Tags to promote", "type": "string", "required": false},
                "date": {"description": "Date to post the promotion", "type": "string", "required": false}
            },
            "friendlyName": "promote",
            "description": "Promote Episode"
        },
        "/podcast/runworkflow": {
            "name": "/podcast/runworkflow",
            "inputs": {
                "podcast": {"description": "Podcast Name", "type": "string", "required": true},
                "workflow": {"description": "Name of the workflow", "type": "string", "required": true}
            },
            "friendlyName": "runWorkflow",
            "description": "Run a Workflow of a Podcast"
        },
        "/repo/data/create": {
            "name": "/repo/data/create",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "create",
            "description": "Description of the action"
        },
        "/repo/data/govern": {
            "name": "/repo/data/govern",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "govern",
            "description": "Description of the action"
        },
        "/repo/episode/create": {
            "name": "/repo/episode/create",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "create",
            "description": "Description of the action"
        },
        "/repo/episode/list": {
            "name": "/repo/episode/list",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "list",
            "description": "Description of the action"
        },
        "/repo/episode/promote": {
            "name": "/repo/episode/promote",
            "inputs": {
                "id": {"description": "ID of the episode to promote", "type": "string", "required": true},
                "channels": {
                    "description": "Channels to promote to. Comma Separated list",
                    "type": "string",
                    "required": true
                }
            },
            "friendlyName": "promote",
            "description": "Promote Episode"
        },
        "/repo/episode/publish": {
            "name": "/repo/episode/publish",
            "inputs": {
                "id": {"description": "ID of the episode to publish", "type": "string", "required": true},
                "channels": {
                    "description": "Channels to publish to. Comma Separated list",
                    "type": "string",
                    "required": true
                }
            },
            "friendlyName": "publish",
            "description": "Publish Episode"
        },
        "/repo/people/list": {
            "name": "/repo/people/list",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "list",
            "description": "Description of the action"
        },
        "/repo/podcast/create": {
            "name": "/repo/podcast/create",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "create",
            "description": "Description of the action"
        },
        "/repo/podcast/promote": {
            "name": "/repo/podcast/promote",
            "inputs": {
                "id": {"description": "ID of the podcast to promote", "type": "string", "required": true},
                "solutions": {"description": "Solutions to promote", "type": "string", "required": false},
                "products": {"description": "Products to promote", "type": "string", "required": false},
                "tags": {"description": "Tags to promote", "type": "string", "required": false},
                "date": {"description": "Date to post the promotion", "type": "string", "required": false}
            },
            "friendlyName": "promote",
            "description": "Promote Podcast"
        },
        "/repo/post/list": {
            "name": "/repo/post/list",
            "inputs": {"attr1": {"description": "Description for the parameter", "type": "string", "required": false}},
            "friendlyName": "list",
            "description": "Description of the action"
        },
        "/blueprint/new": {
            "name": "/blueprint/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/blueprint/create": {
            "name": "/blueprint/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/blueprint/list": {
            "name": "/blueprint/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/blueprint/destory": {
            "name": "/blueprint/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/blueprint/addworkflows": {
            "name": "/blueprint/addworkflows",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addWorkflows",
            "description": "Add items to the object"
        },
        "/blueprint": {
            "name": "/blueprint",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/blueprint/update": {
            "name": "/blueprint/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/businessflow/new": {
            "name": "/businessflow/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/businessflow/create": {
            "name": "/businessflow/create",
            "inputs": {
                "name": {"description": "Name of the Business Flow", "type": "string", "required": true},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/businessflow/list": {
            "name": "/businessflow/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/businessflow/destory": {
            "name": "/businessflow/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/businessflow": {
            "name": "/businessflow",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/businessflow/update": {
            "name": "/businessflow/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "file": {
                    "type": "string",
                    "description": "File that represents the function. This is where it is stored.",
                    "required": false
                },
                "description": {"type": "string", "description": "Description of the business flow", "required": false},
                "inputs": {"type": "json", "description": "Parameters passed to the business flow", "required": false},
                "fn": {
                    "type": "ref",
                    "description": "function to execute when the business flow is run",
                    "required": false
                },
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/mapping/new": {
            "name": "/mapping/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/mapping/create": {
            "name": "/mapping/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/mapping/list": {
            "name": "/mapping/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/mapping/destory": {
            "name": "/mapping/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/mapping/addinputs": {
            "name": "/mapping/addinputs",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addInputs",
            "description": "Add items to the object"
        },
        "/mapping": {
            "name": "/mapping",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/mapping/update": {
            "name": "/mapping/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "resourceType": {
                    "type": "string",
                    "description": "Name of the resource type that maps to the channel",
                    "required": false
                },
                "cardinality": {"type": "number", "description": "Number of assets in the mapping", "required": false},
                "template": {
                    "type": "string",
                    "description": "The template to be used for the generation",
                    "required": false
                },
                "output": {
                    "type": "string",
                    "description": "The output of the mapping generation. prodcast, episode, and index are variables available. For example SoundCloud_${episode.id}_${index}. index is available for any mapping with cardinality greater than 1",
                    "required": false
                },
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/facebook/new": {
            "name": "/facebook/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/facebook/create": {
            "name": "/facebook/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/facebook/list": {
            "name": "/facebook/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/facebook/destory": {
            "name": "/facebook/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/facebook/addtypes": {
            "name": "/facebook/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/facebook/addassets": {
            "name": "/facebook/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/facebook/addposts": {
            "name": "/facebook/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/facebook/addmappings": {
            "name": "/facebook/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/facebook": {
            "name": "/facebook",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/facebook/update": {
            "name": "/facebook/update",
            "inputs": {
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/intelblog/new": {
            "name": "/intelblog/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/intelblog/create": {
            "name": "/intelblog/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/intelblog/list": {
            "name": "/intelblog/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/intelblog/destory": {
            "name": "/intelblog/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/intelblog/addtypes": {
            "name": "/intelblog/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/intelblog/addassets": {
            "name": "/intelblog/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/intelblog/addposts": {
            "name": "/intelblog/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/intelblog/addmappings": {
            "name": "/intelblog/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/intelblog": {
            "name": "/intelblog",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/intelblog/update": {
            "name": "/intelblog/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/intelyoutube/new": {
            "name": "/intelyoutube/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/intelyoutube/create": {
            "name": "/intelyoutube/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/intelyoutube/list": {
            "name": "/intelyoutube/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/intelyoutube/destory": {
            "name": "/intelyoutube/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/intelyoutube/addtypes": {
            "name": "/intelyoutube/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/intelyoutube/addassets": {
            "name": "/intelyoutube/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/intelyoutube/addposts": {
            "name": "/intelyoutube/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/intelyoutube/addmappings": {
            "name": "/intelyoutube/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/intelyoutube": {
            "name": "/intelyoutube",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/intelyoutube/update": {
            "name": "/intelyoutube/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/linkedin/new": {
            "name": "/linkedin/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/linkedin/create": {
            "name": "/linkedin/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/linkedin/list": {
            "name": "/linkedin/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/linkedin/destory": {
            "name": "/linkedin/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/linkedin/addtypes": {
            "name": "/linkedin/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/linkedin/addassets": {
            "name": "/linkedin/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/linkedin/addposts": {
            "name": "/linkedin/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/linkedin/addmappings": {
            "name": "/linkedin/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/linkedin": {
            "name": "/linkedin",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/linkedin/update": {
            "name": "/linkedin/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/soundcloud/new": {
            "name": "/soundcloud/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/soundcloud/create": {
            "name": "/soundcloud/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/soundcloud/list": {
            "name": "/soundcloud/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/soundcloud/destory": {
            "name": "/soundcloud/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/soundcloud/addtypes": {
            "name": "/soundcloud/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/soundcloud/addassets": {
            "name": "/soundcloud/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/soundcloud/addposts": {
            "name": "/soundcloud/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/soundcloud/addmappings": {
            "name": "/soundcloud/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/soundcloud": {
            "name": "/soundcloud",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/soundcloud/update": {
            "name": "/soundcloud/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/transistor/new": {
            "name": "/transistor/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/transistor/create": {
            "name": "/transistor/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/transistor/list": {
            "name": "/transistor/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/transistor/destory": {
            "name": "/transistor/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/transistor/addtypes": {
            "name": "/transistor/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/transistor/addassets": {
            "name": "/transistor/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/transistor/addposts": {
            "name": "/transistor/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/transistor/addmappings": {
            "name": "/transistor/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/transistor": {
            "name": "/transistor",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/transistor/update": {
            "name": "/transistor/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/twitter/new": {
            "name": "/twitter/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/twitter/create": {
            "name": "/twitter/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/twitter/list": {
            "name": "/twitter/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/twitter/destory": {
            "name": "/twitter/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/twitter/addtypes": {
            "name": "/twitter/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/twitter/addassets": {
            "name": "/twitter/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/twitter/addposts": {
            "name": "/twitter/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/twitter/addmappings": {
            "name": "/twitter/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/twitter": {
            "name": "/twitter",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/twitter/update": {
            "name": "/twitter/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/wordpress/new": {
            "name": "/wordpress/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/wordpress/create": {
            "name": "/wordpress/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/wordpress/list": {
            "name": "/wordpress/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/wordpress/destory": {
            "name": "/wordpress/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/wordpress/addtypes": {
            "name": "/wordpress/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/wordpress/addassets": {
            "name": "/wordpress/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/wordpress/addposts": {
            "name": "/wordpress/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/wordpress/addmappings": {
            "name": "/wordpress/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/wordpress": {
            "name": "/wordpress",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/wordpress/update": {
            "name": "/wordpress/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/youtube/new": {
            "name": "/youtube/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/youtube/create": {
            "name": "/youtube/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/youtube/list": {
            "name": "/youtube/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/youtube/destory": {
            "name": "/youtube/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/youtube/addtypes": {
            "name": "/youtube/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/youtube/addassets": {
            "name": "/youtube/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/youtube/addposts": {
            "name": "/youtube/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/youtube/addmappings": {
            "name": "/youtube/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/youtube": {
            "name": "/youtube",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/youtube/update": {
            "name": "/youtube/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/artifact/new": {
            "name": "/artifact/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/artifact/create": {
            "name": "/artifact/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/artifact/list": {
            "name": "/artifact/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/artifact/destory": {
            "name": "/artifact/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/artifact/addassets": {
            "name": "/artifact/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/artifact": {
            "name": "/artifact",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/artifact/update": {
            "name": "/artifact/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "url": {"type": "string", "description": "Location of the original artifact", "required": false},
                "summary": {
                    "type": "string",
                    "description": "Summary of the artifact. Used in generated derived artifacts and assets.",
                    "required": false
                },
                "artType": {
                    "type": "object",
                    "description": "Type of the artifact: document, video, picture, or audio",
                    "required": false
                },
                "episode": {"type": "object", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/artifacttype/new": {
            "name": "/artifacttype/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/artifacttype/create": {
            "name": "/artifacttype/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/artifacttype/list": {
            "name": "/artifacttype/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/artifacttype/destory": {
            "name": "/artifacttype/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/artifacttype/addartifacts": {
            "name": "/artifacttype/addartifacts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addArtifacts",
            "description": "Add items to the object"
        },
        "/artifacttype/addepisodes": {
            "name": "/artifacttype/addepisodes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addEpisodes",
            "description": "Add items to the object"
        },
        "/artifacttype": {
            "name": "/artifacttype",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/artifacttype/update": {
            "name": "/artifacttype/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/asset/new": {
            "name": "/asset/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/asset/create": {
            "name": "/asset/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/asset/list": {
            "name": "/asset/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/asset/destory": {
            "name": "/asset/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/asset/addposts": {
            "name": "/asset/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/asset": {
            "name": "/asset",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/asset/update": {
            "name": "/asset/update",
            "inputs": {
                "url": {"type": "string", "description": "URL of the published asset", "required": false},
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "channel": {"type": "object", "required": false},
                "artifact": {"type": "object", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/channel/new": {
            "name": "/channel/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/channel/create": {
            "name": "/channel/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/channel/list": {
            "name": "/channel/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/channel/destory": {
            "name": "/channel/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/channel/addtypes": {
            "name": "/channel/addtypes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTypes",
            "description": "Add items to the object"
        },
        "/channel/addassets": {
            "name": "/channel/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/channel/addposts": {
            "name": "/channel/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/channel/addmappings": {
            "name": "/channel/addmappings",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addMappings",
            "description": "Add items to the object"
        },
        "/channel": {
            "name": "/channel",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/channel/update": {
            "name": "/channel/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "user": {"type": "string", "description": "User Login", "required": false},
                "creds": {"type": "string", "description": "User Credentials", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/derivedartifact/new": {
            "name": "/derivedartifact/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/derivedartifact/create": {
            "name": "/derivedartifact/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/derivedartifact/list": {
            "name": "/derivedartifact/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/derivedartifact/destory": {
            "name": "/derivedartifact/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/derivedartifact/addparents": {
            "name": "/derivedartifact/addparents",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addParents",
            "description": "Add items to the object"
        },
        "/derivedartifact/addassets": {
            "name": "/derivedartifact/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/derivedartifact": {
            "name": "/derivedartifact",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/derivedartifact/update": {
            "name": "/derivedartifact/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "url": {"type": "string", "description": "Location of the original artifact", "required": false},
                "summary": {
                    "type": "string",
                    "description": "Summary of the artifact. Used in generated derived artifacts and assets.",
                    "required": false
                },
                "artType": {
                    "type": "object",
                    "description": "Type of the artifact: document, video, picture, or audio",
                    "required": false
                },
                "episode": {"type": "object", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/episode/new": {
            "name": "/episode/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/episode/create": {
            "name": "/episode/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/episode/list": {
            "name": "/episode/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/episode/destory": {
            "name": "/episode/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/episode/addtags": {
            "name": "/episode/addtags",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addTags",
            "description": "Add items to the object"
        },
        "/episode/addsolutions": {
            "name": "/episode/addsolutions",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addSolutions",
            "description": "Add items to the object"
        },
        "/episode/addproducts": {
            "name": "/episode/addproducts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addProducts",
            "description": "Add items to the object"
        },
        "/episode/addpeople": {
            "name": "/episode/addpeople",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPeople",
            "description": "Add items to the object"
        },
        "/episode/addartifacts": {
            "name": "/episode/addartifacts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addArtifacts",
            "description": "Add items to the object"
        },
        "/episode/addassets": {
            "name": "/episode/addassets",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addAssets",
            "description": "Add items to the object"
        },
        "/episode/addposts": {
            "name": "/episode/addposts",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addPosts",
            "description": "Add items to the object"
        },
        "/episode": {
            "name": "/episode",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/episode/update": {
            "name": "/episode/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "title": {"type": "string", "description": "Title of the episode", "required": false},
                "summary": {"type": "string", "description": "Summary of the episode", "required": false},
                "notes": {"type": "string", "description": "Episode Notes full MD", "required": false},
                "meta": {"type": "string", "description": "Summary of the episode", "required": false},
                "owner": {"type": "object", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/person/new": {
            "name": "/person/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/person/create": {
            "name": "/person/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false},
                "firstname": {"description": "First name of the person", "type": "string", "required": false},
                "lastname": {"description": "Last name of the person", "type": "string", "required": false},
                "email": {"description": "Email of the person", "type": "string", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/person/list": {
            "name": "/person/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/person/destory": {
            "name": "/person/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/person/addsocials": {
            "name": "/person/addsocials",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addSocials",
            "description": "Add items to the object"
        },
        "/person/addepisodes": {
            "name": "/person/addepisodes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addEpisodes",
            "description": "Add items to the object"
        },
        "/person": {
            "name": "/person",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/person/update": {
            "name": "/person/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "firstname": {"type": "string", "description": "First Name of the person", "required": false},
                "lastname": {"type": "string", "description": "Last Name of the person", "required": false},
                "email": {"type": "string", "description": "Email address", "required": false},
                "notes": {"type": "string", "description": "Notes about the person", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/podcast/new": {
            "name": "/podcast/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/podcast/create": {
            "name": "/podcast/create",
            "inputs": {
                "name": {"description": "Name of the podcast", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false},
                "title": {"description": "Title of the podcast", "type": "string", "required": false},
                "summary": {"description": "Name of the podcast", "type": "string", "required": false}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/podcast/list": {
            "name": "/podcast/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/podcast/destory": {
            "name": "/podcast/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/podcast/addepisodes": {
            "name": "/podcast/addepisodes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addEpisodes",
            "description": "Add items to the object"
        },
        "/podcast/addchannels": {
            "name": "/podcast/addchannels",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addChannels",
            "description": "Add items to the object"
        },
        "/podcast": {
            "name": "/podcast",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/podcast/update": {
            "name": "/podcast/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "title": {"type": "string", "description": "Title of the Podcast", "required": false},
                "summary": {"type": "string", "description": "Summary of the Podcast", "required": false},
                "baseDirectory": {
                    "type": "string",
                    "description": "Location of the artifacts being managed",
                    "required": false
                },
                "blueprint": {"type": "object", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/post/new": {
            "name": "/post/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/post/create": {
            "name": "/post/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/post/list": {
            "name": "/post/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/post/destory": {
            "name": "/post/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/post": {"name": "/post", "inputs": {}, "friendlyName": "new", "description": "New called for web interface"},
        "/post/update": {
            "name": "/post/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "text": {
                    "type": "string",
                    "description": "Text in the post, should include all of the text that is in the post including generated text",
                    "required": false
                },
                "createdDate": {"type": "number", "description": "Date the post was created", "required": false},
                "postedDate": {"type": "number", "description": "Date the post was posted", "required": false},
                "asset": {"type": "object", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/product/new": {
            "name": "/product/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/product/create": {
            "name": "/product/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/product/list": {
            "name": "/product/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/product/destory": {
            "name": "/product/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/product/addepisodes": {
            "name": "/product/addepisodes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addEpisodes",
            "description": "Add items to the object"
        },
        "/product": {
            "name": "/product",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/product/update": {
            "name": "/product/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/socialhandle/new": {
            "name": "/socialhandle/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/socialhandle/create": {
            "name": "/socialhandle/create",
            "inputs": {
                "name": {"description": "name of the handle", "type": "string", "required": true},
                "file": {"description": "file with the definition", "type": "YAML", "required": false},
                "type": {"description": "Channel of the social handle", "type": "string", "required": true}
            },
            "friendlyName": "create",
            "description": "create entity"
        },
        "/socialhandle/list": {
            "name": "/socialhandle/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/socialhandle/destory": {
            "name": "/socialhandle/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/socialhandle": {
            "name": "/socialhandle",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/socialhandle/update": {
            "name": "/socialhandle/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "type": {"type": "string", "description": "Type of the social network", "required": false},
                "channel": {"type": "object", "required": false},
                "owner": {"type": "object", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/solution/new": {
            "name": "/solution/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/solution/create": {
            "name": "/solution/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/solution/list": {
            "name": "/solution/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/solution/destory": {
            "name": "/solution/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/solution/addepisodes": {
            "name": "/solution/addepisodes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addEpisodes",
            "description": "Add items to the object"
        },
        "/solution": {
            "name": "/solution",
            "inputs": {},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/solution/update": {
            "name": "/solution/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/tag/new": {
            "name": "/tag/new",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/tag/create": {
            "name": "/tag/create",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "file": {"description": "file with the definition", "type": "YAML", "required": false}
            },
            "friendlyName": "create",
            "description": "Create object of the class type"
        },
        "/tag/list": {
            "name": "/tag/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List of model objects"
        },
        "/tag/destory": {
            "name": "/tag/destory",
            "inputs": {"cls": {"description": "Class to use for the object new", "type": "string", "required": true}},
            "friendlyName": "new",
            "description": "New called for web interface"
        },
        "/tag/addepisodes": {
            "name": "/tag/addepisodes",
            "inputs": {
                "name": {"description": "Name of the object", "type": "string", "required": false},
                "items": {"description": "Name of the items to add", "type": "string", "required": false},
                "file": {"description": "file with the definition of the items", "type": "YAML", "required": false}
            },
            "friendlyName": "addEpisodes",
            "description": "Add items to the object"
        },
        "/tag": {"name": "/tag", "inputs": {}, "friendlyName": "new", "description": "New called for web interface"},
        "/tag/update": {
            "name": "/tag/update",
            "inputs": {
                "name": {"type": "string", "description": "Name of the item to update", "required": false},
                "id": {"type": "string", "description": "ID of the item to update", "required": false}
            },
            "friendlyName": "update",
            "description": "Update entity"
        },
        "/actor/get": {
            "name": "/actor/get",
            "inputs": {"id": {"description": "The id of the actor", "type": "string", "required": true}},
            "friendlyName": "get",
            "description": "Get an Actor"
        },
        "/actor/list": {"name": "/actor/list", "inputs": {}, "friendlyName": "list", "description": "List the Actors"},
        "/actor/show": {
            "name": "/actor/show",
            "inputs": {"name": {"description": "The scope name of the actor", "type": "string", "required": true}},
            "friendlyName": "show",
            "description": "Show the application"
        },
        "/app/show": {"name": "/app/show", "inputs": {}, "friendlyName": "show", "description": "Show the application"},
        "/deployment/get": {
            "name": "/deployment/get",
            "inputs": {},
            "friendlyName": "get",
            "description": "get a Deployment"
        },
        "/deployment/list": {
            "name": "/deployment/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List the Deployment"
        },
        "/environment/get": {
            "name": "/environment/get",
            "inputs": {},
            "friendlyName": "get",
            "description": "get an Environment"
        },
        "/environment/list": {
            "name": "/environment/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List the Deployment"
        },
        "/model/document": {
            "name": "/model/document",
            "inputs": {
                "scope": {
                    "description": "The scope of the Data Reference",
                    "type": "string",
                    "required": false
                }
            },
            "friendlyName": "document",
            "description": "Document the model"
        },
        "/model/get": {
            "name": "/model/get",
            "inputs": {"id": {"description": "The id of the model", "type": "string", "required": true}},
            "friendlyName": "get",
            "description": "Get a Model"
        },
        "/model/list": {"name": "/model/list", "inputs": {}, "friendlyName": "list", "description": "List the Models"},
        "/package/get": {
            "name": "/package/get",
            "inputs": {"id": {"description": "The name of the package", "type": "string", "required": true}},
            "friendlyName": "get",
            "description": "Get the Packages"
        },
        "/package/list": {
            "name": "/package/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List the Packages"
        },
        "/scenario/get": {
            "name": "/scenario/get",
            "inputs": {"id": {"description": "The name of the scenario", "type": "string", "required": true}},
            "friendlyName": "get",
            "description": "Get a Scenario in a UseCase"
        },
        "/scenario/instance": {
            "name": "/scenario/instance",
            "inputs": {"id": {"description": "The id of the scenario", "type": "string", "required": true}},
            "friendlyName": "launch",
            "description": "Launch a Scenario in a UseCase"
        },
        "/scenario/instances": {
            "name": "/scenario/instances",
            "inputs": {},
            "friendlyName": "launch",
            "description": "Launch a Scenario in a UseCase"
        },
        "/scenario/launch": {
            "name": "/scenario/launch",
            "inputs": {"id": {"description": "The id of the scenario", "type": "string", "required": true}},
            "friendlyName": "launch",
            "description": "Launch a Scenario in a UseCase"
        },
        "/usecase/get": {
            "name": "/usecase/get",
            "inputs": {"id": {"description": "The id of the usecase", "type": "string", "required": true}},
            "friendlyName": "get",
            "description": "Get a UseCase"
        },
        "/usecase/list": {
            "name": "/usecase/list",
            "inputs": {},
            "friendlyName": "list",
            "description": "List the Actors"
        },
        "guth/episode/promote": {
            "name": "guth/episode/promote",
            "inputs": {
                "id": {"description": "ID of the episode to publish", "type": "string", "required": true},
                "channels": {
                    "description": "Channels to publish to. Comma Separated list",
                    "type": "string",
                    "required": true
                }
            },
            "friendlyName": "promote",
            "description": "Promote Episode"
        },
        "guth/episode/publish": {
            "name": "guth/episode/publish",
            "inputs": {
                "id": {"description": "ID of the episode to publish", "type": "string", "required": true},
                "channels": {
                    "description": "Channels to publish to. Comma Separated list",
                    "type": "string",
                    "required": true
                }
            },
            "friendlyName": "publish",
            "description": "Publish Episode"
        },
        "guth/podcast/createworkflow": {
            "name": "guth/podcast/createworkflow",
            "inputs": {
                "podcast": {"description": "Podcast Name", "type": "string", "required": true},
                "name": {"description": "Name of the workflow", "type": "string", "required": true},
                "file": {"description": "File name of the Workflow", "type": "file", "required": false}
            },
            "friendlyName": "createWorkflow",
            "description": "Create Workflow to Podcast"
        },
        "guth/podcast/promote": {
            "name": "guth/podcast/promote",
            "inputs": {
                "id": {"description": "ID of the podcast to promote", "type": "string", "required": true},
                "solutions": {"description": "Solutions to promote", "type": "string", "required": false},
                "products": {"description": "Products to promote", "type": "string", "required": false},
                "tags": {"description": "Tags to promote", "type": "string", "required": false},
                "date": {"description": "Date to post the promotion", "type": "string", "required": false}
            },
            "friendlyName": "promote",
            "description": "Promote Episode"
        },
        "guth/podcast/runworkflow": {
            "name": "guth/podcast/runworkflow",
            "inputs": {
                "podcast": {"description": "Podcast Name", "type": "string", "required": true},
                "workflow": {"description": "Name of the workflow", "type": "string", "required": true}
            },
            "friendlyName": "runWorkflow",
            "description": "Run a Workflow of a Podcast"
        }
    }
}
