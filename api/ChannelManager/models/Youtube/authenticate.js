const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

module.exports = {
    friendlyName: 'authenticate',
    description: 'Authenticate Channel',
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

    fn: async function (obj, inputs, env) {
        const clientSecret = obj.creds.client_secret;
        const clientId = obj.creds.client_id;
        const redirectUrl = `http://localhost/web/channel/authenticate?id=${obj.id}`;
        const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        let code = inputs.code;
        let results = await oauth2Client.getToken(code);
        obj.creds.tokens = results.tokens;
        obj.authorized = true;
        obj.save();
    }
};
