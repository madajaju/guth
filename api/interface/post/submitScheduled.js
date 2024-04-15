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
           let posts = episodes[i].posts;
           let now = new Date();
           for(let j in posts) {
               let post = posts[j];
               global._tasks[post.id] = {
                   scheduledDate: post.scheduledDate,
                   channel: post.channel.name,
                   name: post.id,
                   state: post.state
               };
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
                           global._tasks[post.id].postDate = now;
                           if (postInfo) {
                               successful++;
                               global._tasks[post.id].state = "Posted";
                               post.sid = postInfo;
                               post.post({postedDate: now});
                           } else {
                               post.failed({message: "Could not Post!"});
                               global._tasks[post.id].state = "Failed";
                               global._tasks[post.id].message = "Could not Post!";
                               console.log("Post Failed:", post.id, post.channel.name);
                               failed++;
                           }
                       } else {
                           global._tasks[post.id].state = "Failed";
                           global._tasks[post.id].message = "No Channel";
                           post.failed({message: "No Channel"});
                           console.log("Post does not have a channel!", post.id);
                           failed++;
                       }
                   } else {
                       waiting++;
                   }
               } else {
                   global._tasks[post.id].postedDate = post.postedDate;
               }
           }
        }
        console.log("Posts Successful:", successful);
        console.log("Posts Failed:", failed);
        console.log("Posts Waiting:", waiting);
        return {successful: successful, failed: failed};
    }
};
