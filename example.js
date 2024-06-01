/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 * @flow
 */

'use strict';
const axios = require('axios');
const fs = require('fs');
const bizSdk = require('facebook-nodejs-business-sdk');
const PagePost = bizSdk.PagePost;
const Page = bizSdk.Page;
const Photo = bizSdk.Photo;
const app_id = "415088027998650";
const app_secret = "f14cb71aa65a02bb6edd909094765bc5";
// const access_token =
// "EAAF5hTZA1mboBOyIi2wks8zEZBeIEhjI5OsZCzs65TOADAaFUbZAnuBI1k8L52rD7TTl0wLgcKWpVD9jmUCAxibdZAGqZBeNLZABPiaDJRpYKAk8lLHj7Mojjs8nXqN6CxBCjyBBfXlDwnfRbhZCDp24toW17gPERLoKb67Mi4vSg8JtcDyLutmuZCZA6LEZAhewkcS14eZAtHs4xIOOeXrLW63nSTbiukvLBRTZBjY2l";
const access_token = "EAAF5hTZA1mboBO75QJwRI38trB2f0yZBrJItNBGInFtxE30xdSPU2XCy09L3c9gL5i82oHmoPyaITlB3Sr5nLK0hC4Pc1gJzPZAY4dXszUMFBdESrOlFFOPwmAD2jGnO4W0gzGb65jzMdFoOyYEiEpuUAjDl8H6YR5SYux3OHZAso3T4RkHirzGqZCB3EWbZCqvS0qo17KrDeK";
const id = "108059227469282";
const api = bizSdk.FacebookAdsApi.init(access_token);
const showDebugingInfo = true; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
    api.setDebug(true);
}

const logApiCallResult = (apiCallName, data) => {
    console.log(apiCallName);
    if (showDebugingInfo) {
        console.log("Data:");
        let message = JSON.stringify(data);
        console.log('Data:' + JSON.stringify(data));
    }
};


let fields, params;
fields = [];
params = {};
/* const sample_code = (new Page(id)).createFeed(
    fields,
    params
);
 */

/* let buffer = fs.readFileSync('./thumbnail.png','base64');
const photos = (new Page(id).createPhoto(
    [],
    { url: "https://www.embracingdigital.org/en/fish.jpg", 'published': 'false'}
));
/*
const sample_code = (new Page(id)).getFeed(
    [],
    {}
);
logApiCallResult('sample_code api call complete.', sample_code);
const sample_code = (new Page(id)).getFeed(
    [],
    {}
);

 */
// let stuff = logApiCallResult('photo upload api call complete.', photos);
// let otherStuff = logApiCallResult('sample_code api call complete.', sample_code);


async function main() {
    try {
        const photo = await new Page(id).createPhoto([],
            {url: "https://www.embracingdigital.org/en/fish.jpg", 'published': 'false'}
        );

        const video = await new Page(id).createVideo([],
            {
                title: "Short video",
                description: "Short video description",
                url: 'https://yolyguth.blob.core.windows.net/wtl/WTL-607/episode-cut60.mp4'
            }
        );

        /*const videoData = fs.readFileSync('./short1.mp4');
        const config = {
            method: 'post',
            url: `https://graph.facebook.com/v19.0/${id}/videos`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'multipart/form-data'
            },
            data: {
                title: 'Short1 Video',
                description: 'Short1 video Description',
                source: {
                    value: videoData,
                    options: {
                        filename: 'short1.mp4',
                        contentType: 'video/mp4'
                    }
                }
            },
        };
        let response = await axios(config);
        let video = response.data;*/
        const post = await new Page(id).createFeed([], {
            message: "Check out the latest video from Darren and Paige",
            attached_media: JSON.stringify([{media_fbid: photo.id},{media_fbid: video.id}])
        });
        console.log(post);
    } catch (e) {
        console.error(e);
    }
}

main();
