const path = require('path');
const fs = require("fs");
const AService = require('ailtire/src/Server/AService');

module.exports = {
    friendlyName: 'submitScheduled',
    description: 'Submit all of the posts that are scheduled and the scheduled Date is past',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast: {
            description: "Podcast to schedule the posts",
            type: "string"
        }
    },

    exits: {
        json: (obj) => { return obj; },
    },

    fn: async function (inputs, env) {
        // inputs contains the obj for the this method.
        if(!global._tasks) { global._tasks = {}};
        let podcast = Podcast.find(inputs.podcast);
        let successful = 0;
        let failed = 0;
        let waiting = 0;
        let episodes = podcast.episodes;
        for(let i in episodes) {
            let episode = episodes[i];
            let posts = episodes[i].posts;
            for (let j in posts) {
                let post = posts[j];
                if(post.scheduledDate) {
                    global._tasks[episode.id + post.name] = {
                        scheduledDate: post.scheduledDate,
                        channel: post.channel?.name || "Default",
                        name: post.name,
                        state: post.state,
                        podcast: podcast.id,
                        episode: episode.id,
                        postedDate: post.postedDate,
                        message: post.message
                    };
                }
            }
        }
        for(let i in episodes) {
            let episode = episodes[i];
            let posts = episodes[i].posts;
            let now = new Date();
            for (let j in posts) {
                let post = posts[j];
               if(post.state === "Scheduled") {
                   let sdate = new Date(post.scheduledDate);
                   if(sdate < now) {
                       let channel = post.channel;
                       if(channel) {
                           try {
                               console.log("Submitting Post to ", channel.name);
                               let channelType = channel.type.toLowerCase();
                               // If the post is missing an asset then assign the thumbnail to the video to the asset.
                               let postInfo = await AService.call(`channel/${channelType}/promote`, {
                                   post: post,
                                   channel: channel.id
                               });
                               global._tasks[episode.id + post.name].postedDate = now;
                               if (postInfo) {
                                   successful++;
                                   global._tasks[episode.id + post.name].state = "Posted";
                                   post.sid = postInfo;
                                   post.post({postedDate: now});
                               } else {
                                   post.failed({message: "Could not Post!"});
                                   global._tasks[episode.id + post.name].state = "Failed";
                                   global._tasks[episode.id +  post.name].message = "Could not Post!";
                                   console.log("Post Failed:", post.name, post.channel.name);
                                   failed++;
                               }
                           }
                           catch(e) {
                               global._tasks[episode.id + post.name].state = "Failed";
                               global._tasks[episode.id + post.name].message = post.errorMessage;
                               console.log("Post Failed:", j, post.channel.name);
                               failed++;
                           }
                       } else {
                           global._tasks[episode.id + post.name].state = "Failed";
                           global._tasks[episode.id + post.name].message = "No Channel";
                           post.failed({message: "No Channel"});
                           console.log("Post does not have a channel!", post.id);
                           failed++;
                       }
                   } else {
                       waiting++;
                   }
               }
           }
        }
        console.error("Posts Successful:", successful);
        console.error("Posts Failed:", failed);
        console.error("Posts Waiting:", waiting);
        return {successful: successful, failed: failed};
    }
};
