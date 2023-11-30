const axios = require('axios');

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
   /* let apiURL = 'https://api.linkedin.com/v2/me';

    const clientId = creds.client_id;
    const clientSecret = creds.client_secret;

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const headers = {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };


    try {
        const res = await axios.get(apiURL, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

    }
    */
}
