// workflow for publish EDT

// generate all of the derived artifacts.
// Order of the artifacts matters because
// How do we handle assets that have dependencies on other assets. Like putting links between all of the assets in
// the summary when submitted.

// Create the IntelBlog Asset

// Create the Youtube Asset
// Create the Soundcloud Asset
// Create the LinkedinPDF Asset

// Create the Soundcloud Asset
// 1. submit to soundcloud episode.artifacts.Audio, episode.summary, episode.meta
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

