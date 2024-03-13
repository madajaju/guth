const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const AEvent = require('ailtire/src/Server/AEvent');
const AService = require('ailtire/src/Server/AService');

module.exports = {
    friendlyName: 'render',
    description: 'Render Template',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        episode: {
            description: 'ID of the episode to publish',
            type: 'string', // string|boolean|number|json
            required: true
        },
        id: {
            description: 'Channels to publish to. Comma Separated list',
            type: 'string',
            required: true,
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
        let episode = Episode.find(inputs.episode);
        let podcast = episode.owner;
        let mapping = Mapping.find(inputs.id);
        let langid = inputs.lang || 'en';
        if(!langid) {
            if(!podcast.lang && !podcast.lang.hasOwnProperty(langid)) {
                langid = 'en';
            }
        }
        let lang = { id: 'en', name:'English'};
        let asset = {};
        if(inputs.asset) {
            asset = Asset.find(inputs.asset);
        }
        if(podcast.lang) {
            lang = podcast.lang[langid];
            if(!lang) {
                lang = podcast.lang.en
            }
        }
        let summary = episode.summary;
        if(asset && asset.summary) {
            summary = asset.summary;
        }

        let objects = {
            episode: episode,
            summary: summary,
            asset: asset,
            lang: lang,
            podcast: episode.owner,
            askAI: _askAI,
            path: path,
            fs: fs
        }
        retval = {};
        for (let i in mapping.templates) {
            let template = mapping.templates[i];
            try {
                retval[template.name] = await ejs.render(template.script, objects, {async: true});
            }
            catch(e) {
                console.error("Error rendering page:", template.name);
                console.error(e);
            }
        }
        env.res.json({results: retval});
    }
};

const _askAI = async (prompt) => {
    AEvent.emit('translation.start', {message: prompt});
    const completion = await global.openai.chat.completions.create({
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
    return completion.choices[0].message.content;
}
