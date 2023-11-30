const {google} = require('googleapis');

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
        let mDate = Date.now();
        if(asset.url) {
            let videoID = asset.url.split('/').pop();
            let stats = await getVideoStats(videoID, obj.creds.api_key);
            return [{date: mDate, totals: stats}];
        } else {
            return null;
        }
    }
};

async function getVideoStats(videoID, apikey){
    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: apikey,
        })
        const response = await youtube.videos.list({
            part: 'statistics',
            id: videoID
        });

        const video = response.data.items[0];
        if(video) {
            const statistics = video.statistics;
            for (let name in statistics) {
                statistics[name] = parseInt(statistics[name]);
            }
            return statistics;
        } else {
            console.log("Error looking for video:", videoID);
            return null;
        }
    }
    catch(e) {
        console.error("Youtube Stats error:", e);
    }
}
