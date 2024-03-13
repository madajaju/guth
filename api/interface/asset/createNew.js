module.exports = {
    friendlyName: 'createNew',
    description: 'Create New Asset from an Artifact',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        channel: {
            description: 'Channel the asset resides',
            type: 'string',
            required: true
        },
        artifact: {
            description: 'Primary artifact used for the asset.',
            type: 'string',
            required: true
        },
        name: {
            description: 'Name of the asset',
            type: 'string',
            required: true
        },
        url: {
            description: 'URL of where the asset lives',
            type: 'string',
            required: false
        },
        title: {
            description: 'title of the asset',
            type: 'string',
            required: false
        },
        episode: {
            description: 'Episode of the Asset',
            type: 'string',
            required: false
        },
        summary: {
            description: 'Summary of the Asset',
            type: 'string',
            required: false
        },
        artType: {
            description: 'Type of artifact and asset created',
            type: 'string',
            required: false
        },
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (inputs, env) {
        // inputs contains the obj for the this method.
        let args = inputs;
        let episode = Episode.find(args.episode);
        if(!episode) {
            console.error("Episode not found:", args.episode);
        } else { args.episode = episode; }
        let channel = Channel.find(args.channel);
        if(!channel) {
            console.error("Channel not found:", args.channel);
        } else { args.channel = channel; }
        let artifact = Artifact.find(args.artifact);
        if(!artifact) {
            console.error("Artifact not found:", args.channel);
        } else { args.artifact = artifact;}
        // Submit the artifact to the channel for publishing here.
        if(channel) {
            let service = channel.publishArtifact(args, env);
            let asset = await AService.call(service, args);
            artifact.addToAssets(asset);
            episode.saveMe();
            if(env && env.res) {
                env.res.json({message:"Created", status:"Completed", asset: asset.id});
            }
            return asset;
        } else {
            console.error("Error: No Channel", inputs);
            if(env && env.res) {
                env.res.json({message: "Error"});
            }
        }
    }
};
