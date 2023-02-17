// workflow for createAssets EDT
//

// Create the Soundcloud Asset
// 1. submit to soundcloud episode.artifacts.Audio, episode.summary, episode.meta
// 2. submit to youtube Intel
// 3. submit to IntelBlog
//
let soundcloudSummary = episode.title + "\n\n";
soundcloudSummary = "Blog:" + episode.assets.IntelBlog.url + "\n";
soundcloudSummary = "Video:" + episode.assets.IntelYoutube.url;

for(let i in episode.tags) {
    soundcloudSummary += `#${episode.tags[i]} `;
}

let soundcloudTrack = {
        "track": {
            "title": episode.title,
            "description": soundcloudSummary,
            "tag_list": '"' + episode.tags.join('" "') + '"',
            "caption": episode.meta,
        }
    }
;

const path = require('path');
const render = require('ailtire/src/Documentation/Generator');

module.exports = {
    friendlyName: 'createEpisode',
    description: 'Create Episode directory and templates.',

    fn: function (episode) {
        let files = {
            context: {
                episode:episode,
            },
            targets: {
                ':episodeID:/episode.yml': { template: './template/episode.yml' },
                ':episodeID:/transcript.md' : { template: './template/episode.md' }
            },
        }
        // let episode = Episode.find(inputs.id);
        if(!episode) {
            env.res.json({error: "Episode Not Found:"+ inputs.id});
            env.res.end("Done");
            return;
        }
        episode.promote({channels: inputs.channels});

        env.res.json({request: 'Episode Published!'});
        env.res.end("Published");
        return;
    }
};

function generateAssets(files) {

}
