
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

module.exports = {
    friendlyName: 'authorize',
    description: 'Authorize Channel',
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
        return _authorize(obj);
    }
};


const SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
];

const _authorize = (channel) => {
    const clientSecret = channel.creds.client_secret;
    const clientId = channel.creds.client_id;
    const redirectUrl = `http://localhost/web/channel/authenticate?id=${channel.id}`;
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    let authUrl = _getNewToken(oauth2Client);
    return {url: authUrl};
};

const _getNewToken = (oauth2Client) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    return authUrl;
};

