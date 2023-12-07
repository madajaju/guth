const axios = require('axios');

module.exports = {
    friendlyName: 'getShareLink',
    description: 'Get Share Link For filename',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        filename: {
            description: 'Filename of the file to get the shared link',
            type: 'string',
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
        let filename = inputs.filename.replace("C:\\Users\\darre\\OneDrive - Pulsipher Family\\", "").replaceAll(/\\/g,'/');
        let atoken = await _getToken(obj.creds);
        let response = await axios.get(`https://graph.microsoft.com/v1.0/users/e32e3ae3-e580-47ad-89db-ee7d2cf6c25c/drive/root:/${filename}`, {
            headers: {
                Authorization: `Bearer ${atoken}`
            },
        });
        return response.data["@microsoft.graph.downloadUrl"];
    }
};

const _getToken = async (creds) => {
   let res = await axios.post(creds.token_end_point, new URLSearchParams({
        grant_type: creds.grant_type,
        client_id: creds.client_id,
        client_secret: creds.secret_value,
        scope: 'https://graph.microsoft.com/.default'
    }));
    return res.data.access_token;
};
