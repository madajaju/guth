const { TwitterApi } = require('twitter-api-v2');

module.exports = {
    friendlyName: 'getStats',
    description: 'Gather Stats for a twitter post',
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
        let stats = await getStats(obj.creds);
        return [{totals:stats}];
    }
};

async function getStats(creds){
    /*
    const twit = new TwitterApi( {
        appKey: creds.api_key,
        appSecret: creds.api_key_secret,
        accessSecret: creds.access_token_secret,
        accessToken: creds.access_token
    });
    let userID = await twit.v2.me();
    let twits = await twit.v2.userTimeline(userID);

     */
    // console.log("Twits:", twits);
}
