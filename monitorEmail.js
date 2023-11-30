const Imap = require('imap');
const simpleParser = require('mailparser').simpleParser;
const axios = require('axios');
// const { ClientCredentialAuthProvider } = require('@microsoft/microsoft-graph-client/authProviders');

let oauthConfig = {
    grant_type: 'client_credentials',
    client_id: '356e2003-ee16-4028-b712-bd82c7fe544e',
    client_secret: 'cb7c27b3-77c7-4480-87d4-bca126ff29dc',
    secret_value: '2H38Q~9PKCU2bIRM7izE-ELSa7f8bPhcThweXaaz',
    token_end_point: 'https://login.microsoftonline.com/88a6815b-8308-4e4e-ad60-47d086028098/oauth2/v2.0/token',
    resource: 'https://graph.microsoft.com'
}

async function getUserDetails() {
    try {
        let results = await axios.post(oauthConfig.token_end_point, new URLSearchParams({
            grant_type: oauthConfig.grant_type,
            client_id: oauthConfig.client_id,
            client_secret: oauthConfig.secret_value,
            scope: 'https://graph.microsoft.com/.default'
        }));
        let parsedBody = results.data;
        let aToken = parsedBody.access_token;
        let me = await axios.get('https://graph.microsoft.com/v1.0/users', {
            headers: {
                Authorization: `Bearer ${aToken}`
            },
        });
        /* let response = await axios.get('https://graph.microsoft.com/v1.0/users/e32e3ae3-e580-47ad-89db-ee7d2cf6c25c/messages', {
            headers: {
                Authorization: `Bearer ${aToken}`
            },
            params: {
                $top: 10,
            }
        });

         */
        let response = await axios.get('https://graph.microsoft.com/v1.0/users/e32e3ae3-e580-47ad-89db-ee7d2cf6c25c/drive/root:/Podcasts/EDT/2023/EDT-157/Production/thumbnail.png', {
            headers: {
                Authorization: `Bearer ${aToken}`
            },
        });
        console.log(response.data.id);
        let response2 = await axios.get('https://graph.microsoft.com/v1.0/users/e32e3ae3-e580-47ad-89db-ee7d2cf6c25c/drive/root:/Podcasts/EDT/2023/EDT-157/Production/thumbnail.png:/createLink', {
            headers: {
                Authorization: `Bearer ${aToken}`
            },
            params: {
                type: 'view',
                scope: 'anonymous'
            }
        });
        console.log(response.data.value);
    } catch (e) {
        console.error(e);
    }
}

(async () => {
    try {
        const text = await getUserDetails();
        console.log(text);
    } catch (e) {
// Deal with the fact the chain failed
    }
// `text` is not available here
})();


/* const oauth2 = XOAuth2.createXOAuth2Generator({
user: 'edt@pulsipher.org',
clientId: '887621111838-fkel5reectmsgi8r1hl1apd6bbg8ul3c.apps.googleusercontent.com',
clientSecret: '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',
refreshToken: '1//04uWxvgyp-vTOCgYIARAAGAQSNwF-L9Irq2jPCAchixg9tCGLU29y2_CdGrV7VDkSfnojysN3G3_SQWkX0RBJtvLCOk-YCtSOnwc',
});
const oauth365 = XOAUTH2.createXOAuth2Generations({
user: 'darren@pulsipher.org',
});

// IMAP configuration
const imapConfig = {
user: 'edt@pulsipher.org',
//xoauth2: oauth2,
password: 'july2711',
host: 'imap.gmail.com',
port: 993, // IMAPS port
tls: true,
tlsOptions: { rejectUnauthorized: false }
};

const imap = new Imap(imapConfig);

function openInbox(cb) {
imap.openBox('INBOX', true, cb);
}

imap.once('ready', () => {
openInbox((err, box) => {
if (err) throw err;

// Search for all unseen emails
imap.search(['UNSEEN'], (err, results) => {
    if (err) throw err;

    const fetch = imap.fetch(results, { bodies: '' });

    fetch.on('message', (msg, seqno) => {
        msg.on('body', (stream, info) => {
            simpleParser(stream, (err,mail) => {
                console.log(mail.subject);
            })
        });
    });

    fetch.once('end', () => {
        console.log('All messages retrieved');
        imap.end();
    });
});
});
});

imap.once('error', err => {
console.error(err);
});

imap.once('end', () => {
console.log('Connection ended');
});

imap.connect();

*/
