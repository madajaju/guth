const path = require('path');
const fs = require("fs");

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
        let podcast = Podcast.find(inputs.podcast);
        let successful = 0;
        let failed = 0;
        let waiting = 0;
        let episodes = podcast.episodes;
        for(let i in episodes) {
           let posts = episodes[i].posts;
           let now = new Date();
           for(let j in posts) {
               let post = posts[j];
               if(post.state === "Scheduled") {
                   let sdate = new Date(post.scheduledDate);
                   if(sdate < now) {
                       let channel = post.channel;
                       if(channel) {
                           console.log("Submitting Post to ", channel.name);
                           let channelType = channel.type.toLowerCase();
                           let postInfo = await AService.call(`channel/${channelType}/promote`, {
                               post: post.id,
                               channel: channel.id
                           });
                           if (postInfo) {
                               successful++;
                               post.sid = postInfo;
                               post.post({postedDate: now});
                           } else {
                               post.failed({message: "Could not Post!"});
                               console.log("Post Failed:", post.id, post.channel.name);
                               failed++;
                           }
                       } else {
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
        console.log("Posts Successful:", successful);
        console.log("Posts Failed:", failed);
        console.log("Posts Waiting:", waiting);
        return {successful: successful, failed: failed};
    }
};
