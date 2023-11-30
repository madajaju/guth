const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const AEvent = require('ailtire/src/Server/AEvent');
// const FileSystem = require('ailtire/src/Persist/YAMLFileSystem');

module.exports = {
    friendlyName: 'generate',
    description: 'Generate artifact from the mapping',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: 'Podcast to use the mapping on',
            type: 'ref', // string|boolean|number|json
            required: true
        },
        episode: {
            description: 'Episode to use the mapping on',
            type: 'ref', // string|boolean|number|json
            required: true
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for this method.
        let episode = inputs.episode;
        let podcast = episode.owner;
        if(!podcast.lang) {
            podcast.lang = {id:'en'};
        }
        let context = {
            episode: episode,
            podcast: podcast,
            lang: podcast.lang,
            askAI: _askAI,
            fs: fs
        }
        for (let input in obj.inputs) {
            for (let aname in episode.artifacts) {
                if (episode.artifacts[aname].name === obj.inputs[input]) {
                    context[input] = episode.artifacts[aname];
                }
            }
        }
        try {
            let retval = ejs.render(obj.file, context, {async: true});
            if (episode.repo) {
                let apath = path.resolve(`${episode.repo}/${obj.name}`);
                fs.writeFileSync(apath, retval);
                episode.addToArtifacts({name: obj.outputName, url: apath, artType: obj.outputType});
            }
        } catch (e) {
            console.error("Mapping Error for ", obj.name);
            console.error("Error parsing string:", e);
            console.error(obj.file);
        }

        return obj;
    }
};

const _askAI = async (prompt) => {
    AEvent.emit('translation.start');
    const completion = await global.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
            {
                role: 'user',
                content: prompt,
                name: 'guth',
            }
        ]
    });
    AEvent.emit('translate.finished');
    return completion.data.choices[0].message.content;
}
