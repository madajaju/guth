const fs =  require("fs");
const path = require('path');
const {execSync} = require('child_process');

module.exports = {
    friendlyName: 'publish',
    description: 'Publish an episode',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        episode: {
            description: 'Episode to Publish',
            type: 'ref',
            required: false
        },
        channel: {
            description: 'Episode to Publish',
            type: 'ref',
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

        let episode = inputs.episode;
        if(typeof episode === "string") {
            episode = Episode.find(inputs.episode);
            if(!episode) {
                throw new Error("Episode not found!");
            }
        }
        let channel = inputs.channel;
        if(typeof channel === 'string') {
            channel = Channel.find(inputs.channel);
            if(!channel) {
                throw new Error("Channel not Found!");
            }
        }
        let data = await _processEpisode(episode,channel);
        console.log(data);
    }
};

async function _processEpisode(episode,channel) {
    // Get the Production folder.
    let productionDir = path.dirname(episode.saveFile) + '/Production';
    const tagName = episode.id;
    const relesaeNotes = `Release notes for episode ${episode.id}`;
    const repoUrl = channel.release + '.git';
    const token = channel.creds.token;
    const title = episode.title;

    const gitCommands = [
        `git init`,
        `git remote add origin ${repoUrl}`,
        `git add .`,
        `git commit -m "${title}`,
        `git tag -a ${tagName} -m "Verision ${tagName}"`,
        `git push -u origin ${tagName}`
    ];
    for(const command of gitCommands) {
        console.log("#", command);
        execSync(command,{cwd: productionDir, stdio:'inherit'});
    }

    // Now for a release on the server.
   try {
        const apiUrl = `${repoUrl}/releases`;
        const data = {
            tag_name: tagName,
            name: title,
            body: relesaeNotes
        };
        const response = await axios.post(apiUrl, data, {
           headers: {
               'Authorization': `token ${token}`,
               'Content-Type': 'application/json'
           }
       });
        const releaseData = response.data;
        return releaseData;
   } catch(e) {
        console.error(e);
   }
}
