const { IgApiClient } = require("instagram-private-api");
const fs =  require("fs");
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const {execSync} = require('child_process');
const nodemailer = require("nodemailer");

module.exports = {
    friendlyName: 'promote',
    description: 'Promote an asset on the channel, for email',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        post: {
            description: 'Post to be Posting',
            type: 'string',
            required: false
        },
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: async function (inputs, env) {
        let post = inputs.post;
        if (typeof post === 'string') {
            post = Post.find(post);
        }
        let channel = post.channel;
        let asset = post.asset;
        if(!asset) {
            console.log("Asset not Found", post.id) ;
            return null;
        }
        let subject = channel.owner.name;
        let artifact = asset.artifact;
        if(!artifact) { return null; }
        let afile = artifact.url;
        let extFile = path.extname(afile);
        let url = "";
        let episodePhoto = artifact.episode.thumbnail;
        let image = null;

        let text = post.text || asset.summary;
        let episodeFile = path.resolve(path.dirname(post.episode.saveFile) + '/Production/' + episodePhoto);
        if (!fs.existsSync(episodeFile)) {
            episodeFile = path.resolve(path.dirname(post.episode.saveFile) + '/Production/en/' + episodePhoto);
        }

        if (extFile === '.mp4') {
            image = getCoverImage(artifact.url);
        } else if (artifact.artType === 'image') {
            image = convertImage(artifact.url);
        } else {
            image = convertImage(episodeFile);
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: channel.user,
                pass: channel.pass
            }
        });
        let body = inputs.body;
        const mailOptions = {
            from: channel.user,
            to: "darren@pulsipher.org",
            subject: subject,
            html: text,
        }
        if(image) {
            let attachments = [];
            attachments.push( {
                filename: path.basename(image),
                path: path.resolve(image),
                cid: path.basename(image),
            })
            mailOptions.attachments = attachments;
        }
        await _sendMail(transporter, mailOptions);
        return "mailsent";
    }
};

async function _sendMail(transporter, mailOptions)
{
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("_sendMail Error is " + error);
                resolve(false); // or use rejcet(false) but then you will have to handle errors
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}
function getCoverImage(video) {
    let file = video.replace('.mp4', '-mp4.jpg');
    if(!fs.existsSync(file)) {
        let command = `ffmpeg -y -ss 3 -i "${video}" -frames:v 1 "${file}"`;
        try {
            console.log(command);
            execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
            return file;
        } catch (e) {
            console.error("Error calling:", command, e);
            return null;
        }
    } else {
        return file;
    }
}

function convertImage(image) {
    let extName = path.extname(image);
    let file = image.replace(extName, '1080x1080.jpg');
    if (!fs.existsSync(file)) {
        let command = `ffmpeg -y -i "${image}" -vf scale="'if(gt(iw,ih),-1,1080):if(gt(iw,ih),1080,-1)', crop=1080:1080:exact=1" "${file}"`;
        try {
            console.log(command);
            execSync(command, {stdio: 'ignore'}); // stdio: 'inherit' will display stdout/stderr in
            return file;
        } catch (e) {
            console.error("Error calling:", command, e);
            return null;
        }
    } else {
        return file;
    }
}
