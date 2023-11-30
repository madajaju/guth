const ejs = require('ejs');
const fs = require('fs');
const AEvent = require('ailtire/src/Server/AEvent');

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
        episode: {
            description: 'Primary episode used for the asset.',
            type: 'string',
            required: true
        },
        lang: {
            description: 'Language used 2 letter abbv.',
            type: 'string',
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

    fn: async function (inputs, env) {
        // inputs contains the obj for the this method.
        let artifact = inputs.artifact;
        if (typeof artifact === 'string') {
            artifact = Artifact.find(inputs.artifact);
        }
        if (!artifact) {
            console.error("Artifact not found:", inputs.artifact);
        }
        let channel = inputs.channel;
        if (typeof channel === 'string') {
            channel = Channel.find(inputs.channel);
        }
        if (!channel) {
            console.error("Channel not found:", inputs.channel);
        }
        let episode = inputs.episode;
        if (typeof inputs.episode === 'string') {
            episode = Episode.find(inputs.episode);
        }

        let podcast = episode.owner;
        let mappingID = `${channel.name}Submit`;
        let mapping = Mapping.find(mappingID);
        if (!mapping) {
            mapping = Mapping.find('defaultSubmit');
        }
        // Render the fields from the asset renderer;
        let summary = episode.summary;
        if (artifact && artifact.summary) {
            summary = artifact.summary;
        }
        let title = episode.title;
        if (artifact && artifact.title) {
            summary = artifact.title;
        }
        // Handle the language settings and translations.
        let langid = inputs.lang || 'en';
        if (!langid) {
            if (!podcast.lang && !podcast.lang.hasOwnProperty(langid)) {
                langid = 'en';
            }
        }
        let lang = {id: 'en', name: 'English'};
        if (podcast.lang) {
            lang = podcast.lang[langid];
        }
        let asset = {};
        let objects = {
            episode: episode,
            artifact: artifact,
            title: title,
            summary: summary,
            lang: lang,
            podcast: episode.owner,
            askAI: _askAI,
            fs: fs
        }
        let retval = {};
        for (let i in mapping.templates) {
            let template = mapping.templates[i];
            try {
                retval[template.name] = await ejs.render(template.script, objects, {async: true});
            } catch (e) {
                console.error("Error rendering page:", template.name);
                console.error(e);
            }
        }
        if (env && env.res) {
            env.res.json({results: retval});
        }
        return retval;
    }
};

const _askAI = async (prompt) => {
    AEvent.emit('translation.start', {message: prompt});
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
    AEvent.emit('translation.complete', {message: prompt});
    return completion.data.choices[0].message.content;
}
