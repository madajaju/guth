const fs = require('fs');
// const path = require('path');
const axios = require("axios");
const base64 = require('base-64');


module.exports = {
    friendlyName: 'getsharelink',
    description: 'Get Share Link For filename',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        filename: {
            description: 'Filename of the file to get the shared link',
            type: 'string',
            required: true,
        },
        channel: {
            description: "Channel to get the shared link",
            type: "ref",
            required: true
        }
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (inputs, env) {
        // inputs contains the obj for the this method.
        let channel = inputs.channel;
        if(typeof channel === "string") {
            channel = Channel.find(channel);
        }
        try {
            let filename = inputs.filename.replace("C:\\Users\\darre\\OneDrive - Pulsipher Family\\", "").replaceAll(/\\/g, '/');
            let atoken = await _getToken(channel.creds);
            let response = await axios.get(`https://graph.microsoft.com/v1.0/users/e32e3ae3-e580-47ad-89db-ee7d2cf6c25c/drive/root:/${filename}`, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                },
            });
            let res2 = await axios.post(`https://graph.microsoft.com/v1.0/users/e32e3ae3-e580-47ad-89db-ee7d2cf6c25c/drive/items/${response.data.id}/createLink`, {
                    type: 'view',
                    scope: 'anonymous'
                },
                {
                    headers: {
                        Authorization: `Bearer ${atoken}`,
                    },
                }
            );
            const download1 = `${res2.data.link.webUrl}?download=1`;
            // const encodedUrl = base64.encode(`${res2.data.link.webUrl}?download=1`).replace(/=/g,
            // '').replace(/\//g, '_').replace(/\+/g, '-');
            // Create the direct download URL
            // const downloadUrl = `https://api.onedrive.com/v1.0/shares/u!${encodedUrl}/root/content`;
            return download1;
            // return response.data["@microsoft.graph.downloadUrl"];
        } catch(e) {
            console.error(e);
        }
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
