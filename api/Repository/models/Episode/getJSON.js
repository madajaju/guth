const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'getJSON',
    description: 'Convert to a JSON',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let tempObj = { state: obj.state };
        for(let aname in obj._attributes) {
            let attr = obj._attributes[aname];
            tempObj[aname] = attr;
        }
        // Guests
        tempObj.guests = [];
        for(let gname in obj.guests) {
            tempObj.guests.push(obj.guests[gname].name);
        }
        // Artifacts
        tempObj.artifacts = {};
        for(let aname in obj.artifacts) {
            let art = obj.artifacts[aname];
            tempObj.artifacts[aname] = {};
            for(let atname in art._attributes) {
                tempObj.artifacts[aname][atname]= art._attributes[atname];
            }
            if(art.artType && typeof art.artType === 'object') {
                tempObj.artifacts[aname].artType = art.artType.name;
            }
        }
        // Tags
        tempObj.tags = []
        for(let tname in obj.tags) {
            let tag = obj.tags[tname];
            tempObj.tags.push(tag.name);
        }
        // Assets
        tempObj.assets = {};
        for(let aname in obj.assets) {
            let asset = obj.assets[aname];
            tempObj.assets[aname] = {};
            for (let asname in asset._attributes) {
                tempObj.assets[aname][asname] = asset._attributes[asname];
            }
            if (asset.channel && typeof asset.channel === 'object') {
                tempObj.assets[aname].channel = asset.channel.name;
            }
            if (asset.artifact && typeof asset.artifact === 'object') {
                tempObj.assets[aname].artifact = asset.artifact.name;
            }
        }
        tempObj.posts = {};
        for(let pname in obj.posts) {
            let post = obj.posts[pname];
            tempObj.posts[pname] = {};
            for (let asname in post._attributes) {
                tempObj.posts[pname][asname] = post._attributes[asname];
            }
            tempObj.posts[pname]._state = post.state;
            if(post.channel && typeof post.channel === 'object') {
                tempObj.posts[pname].channel = post.channel.id;
            }
            if(post.asset && typeof post.asset === 'object') {
                tempObj.posts[pname].asset = post.asset.id;
            }
        }
        return tempObj;
    }
}

