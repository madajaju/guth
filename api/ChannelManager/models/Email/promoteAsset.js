const nodemailer = require('nodemailer');

module.exports = {
    friendlyName: 'promoteAsset',
    description: 'Promote Asset on the Email Channel',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        asset: {
            description: 'Promote Asset on the Channel',
            type: 'ref', // string|boolean|number|json
            required: true
        },
        to: {
            description: 'The person the email is being sent to.',
            type: 'string',
            required: true,
            limit: '90'
        },
        subject: {
            description: 'The person the email is being sent to.',
            type: 'string',
            required: true,
            limit: '90'
        },
        body: {
            description: 'Text of the post for the promotion of the asset',
            type: 'string',
            required: true,
            limit: "2048"
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
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: obj.user,
                pass: obj.pass
            }
        });
        let body = inputs.body;
        const mailOptions = {
            from: obj.user,
            to: inputs.to,
            subject: inputs.subject,
            html: inputs.body
        }
        await _sendMail(transporter, mailOptions);
        let post = new Post({channel: obj, text: body, name: 'Email Promote', asset: inputs.asset, episode: inputs.episode});
        obj.addToPosts(post);
        if(inputs.asset) {
            inputs.asset.addToPosts(post);
        }
        if(inputs.episode) {
            inputs.episode.addToPosts(post);
            inputs.episode.saveMe();
        }
        return {message:"Email Sent to " + inputs.to};
    }
};

async function _sendMail(transporter, mailOptions)
{
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("error is " + error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}
