const axios = require('axios');
const querystring = require("querystring");

module.exports = {
    friendlyName: 'getStats',
    description: 'Gather Stats for a youtube asset',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        asset: {
            description: 'Asset to get statistics',
            type: 'ref',
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

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let asset = inputs.asset;
        if(typeof asset === 'string') {
            asset = Asset.find(asset);
        }
        //let episodeID = asset.url.split('/').pop();
        let episodeID = asset.cid;
        let showID = obj.url.split('/').pop();
        if(episodeID) {
            let retval = await _getStats(showID, episodeID, obj.creds.api_key);
            return retval;
        } else {
            let episodeID = await _findEpisodeID(asset.url, obj.creds.api_key);
            asset.cid = episodeID;
            let retval = await _getStats(showID, episodeID, obj.creds.api_key)
            return retval;

        }
    }
};
async function _findEpisodeID(sharedURL, apikey) {
    let episodes = await axios({
        method: 'get',
        url: `https://api.transistor.fm/v1/episodes?pagination[per]=1000`,
        headers: {
            "x-api-key": apikey,
        },
    });
    // sort through the list and find the cid for the episode.
    for(let i in episodes.data.data) {
        let episode = episodes.data.data[i];
        if(episode.attributes.share_url === sharedURL) {
            return episode.id;
        }
    }
}
async function _getStats(showID, episodeID, apikey){
    try {
        let retval = [];
        let stats = await axios({
            method: 'get',
            url: `https://api.transistor.fm/v1/analytics/episodes/${episodeID}`,
            headers: {
                "x-api-key": apikey,
            },
        });

        let items = stats.data.data.attributes.downloads;

        for(let i in items) {
            let item = items[i];
            let [day, month, year] = item.date.split('-');
            let mDate = new Date(`${year}-${month}-${day}`);
            retval.push({date: mDate, values: {downloads: item.downloads}});
        }
        return retval;
    }
    catch(e) {
        console.error("Transistor Stats error:", e);
    }
}
