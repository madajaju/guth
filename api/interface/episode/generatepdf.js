const path = require('path');
const fs = require('fs');
const generator = require('ailtire/src/Documentation/Generator.js');
const pdf = require('html-pdf');
const puppeteer = require('puppeteer');
const AEvent = require("ailtire/src/Server/AEvent");

module.exports = {
    friendlyName: 'generatepdf',
    description: 'Generate PDF for an episode',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            description: "ID of the episode",
            type: 'string',
            required: true
        }
    },
    exits: {},

    fn: async function (inputs, env) {
        let episode = Episode.find(inputs.id);
        if (!episode) {
            console.error("Could not find the episode:", inputs.id);
            env.res.json({status: "error"});
            return;
        }
        if (env.res) {
            env.res.json("Completed");
        }
        return await generatePDF(episode);
    }
};

async function generatePDF(obj) {
    let episode = obj;
    let podcast = episode.owner;
    const edir = path.dirname(episode.saveFile);
    const output = path.resolve(`${edir}/Production`);
    const source = path.resolve(`${podcast.baseDirectory}/templates`);
    AEvent.emit('generatePDF.started', {message: `Starting PDF Generation`})
    if (podcast.lang) {
        let icount = 0;
        let total = Object.keys(podcast.lang).length;
        for (let i in podcast.lang) {
            await _generateHTML(episode, output + `/${i}`, source, podcast.lang[i]);
            await _generatePDF(output, output + `/${i}/episode.html`, output + `/${i}/episode.pdf`, episode.title);
            let md = episode.artifacts[`${i}/episode.md`];
            let summary = md?.summary || '';
            let title = md?.title || '';
            episode.addToArtifacts({
                name: `${i}/episode.pdf`,
                title: title,
                artType: 'pdf',
                url: `${output}/episode.pdf`,
                summary: summary
            });
            icount++;
            AEvent.emit('generatePDF.inprogress', {message: `Working ${i} - ${icount / total * 100}%`})
        }
    } else {
        _generateHTML(episode, output, source);
        await _generatePDF(output, output + "/episode.html", output + "/episode.pdf", episode.title);
        let md = episode.artifacts[`episode.md`];
        let summary = md?.summary || '';
        let title = md?.title || '';
        episode.addToArtifacts({
            title: title,
            name: `episode.pdf`,
            artType: 'pdf',
            url: `${output}/episode.pdf`,
            summary: summary
        });
    }
    episode.saveMe();
    AEvent.emit('generatePDF.completed', {message: `Done`})
    return output + "/episode.pdf";
}

const _generateHTML = async (episode, output, source, lang) => {

    let apath = path.resolve(`${output}/episode.md`);

    const regx = new RegExp('^#');
    const regxBullet = /^\*/;
    const regxURL = /\(http/;
    const regxImage = /!\[/;
    let content = "";

    if (fs.existsSync(apath)) {
        content = "<p>";
        let lines = fs.readFileSync(apath).toString('utf-8').split('\n');
        // Iterate over the lines

        lines.forEach((line) => {
            let bulletFlag = false;
            // This needs convert links to html on all data. Then feed it back into the line to be processed again.
            if (regxURL.test(line)) {
                let words = line.split('[');
                line = "";
                for (let i in words) {
                    let word = words[i];
                    if (word.includes(']')) {
                        // extract the text for the aref
                        let words2 = word.split('](');
                        // extract the url for the aref
                        if (words2[1]) {
                            let words3 = words2[1].split(')');
                            line += `<a href="${words3[0]}">${words2[0]}</a>`;
                            line += words3[1];
                        } else {
                            console.error("Problem with aref:", word);
                        }

                    } else {
                        line += word;
                    }
                }
            }
            if (regx.test(line)) { // Heading
                let hnumber = (line.match(/\#/g) || []).length;
                content += `</p><h${hnumber}>${line.replaceAll(/\#/g, '')}</h${hnumber}>\n<p>\n`;
            } else if (regxBullet.test(line)) { // Bullet List
                content += "<ul><li>" + line.replaceAll(/^\*/g, '') + '</li></ul>\n';
            } else if (regxImage.test(line)) { // Image
                let image = line.replaceAll(/.*\(/g, '');
                image = image.replaceAll(/\).*/g, '');
                let imageString = fs.readFileSync(`${output}/${image}`, 'base64');
                let ext = path.extname(image).replace('.', '');
                content += `<div><img alt="Image" src="data:image/${ext};base64,${imageString}" ></div>\n`;
            } else { // everything else
                if (line.length > 0) {
                    content += line;
                } else {
                    content += "</p>\n<p>";
                }
            }
        });
    } else {
        content = "";
    }
    // Guests
    let guests = [];
    for (let i in episode.guests) {
        guests.push(episode.guests[i].name);
    }
    let tags = [];
    for (let i in episode.tags) {
        tags.push(episode.tags[i].name);
    }
    // set the thumbnailPath so it can be copied to the destination directory.
    let thumbnail = "";
    if (lang) {
        thumbnail = `${output}/thumbnail.png`;
    } else {
        thumbnail = episode.thumbnail || "TBD";
    }
    let files = {
        context: {
            fs: fs,
            path: path,
            output: output,
            source: source,
            episode: episode,
            content: content,
            guests: guests,
            tags: tags,
            thumbnail: thumbnail,
            episodeName: episode.name,
            askAI: _askAI,
            lang: lang
        },
        targets: {
            'episode.html': {template: `${source}/episode.ejs`},
            'IntelLogo.png': {copy: `${source}/IntelLogo.png`},
            'IntelLogoElectric.png': {copy: `${source}/IntelLogoElectric.png`},
        }
    }
    // set the thumbnailPath so it can be copied to the destination directory.
    console.log("Generating Files:", files.targets, output);
    await generator.processAsync(files, output);
    return true;
}

const _generatePDF = async (dirname, input, output, title) => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    let htmlString = fs.readFileSync(input, 'utf-8');
    await page.setContent(htmlString, {waitUntil: 'domcontentloaded'});
    await page.pdf({
        path: output,
        format: 'Letter',
        printBackground: true,
        displayHeaderFooter: true,
        margin: {
            top: '0.5in',
            bottom: '0.5in',
            left: '0.5in',
            right: '0.5in',
        },
        headerTemplate: `<div></div>`,
        footerTemplate: `<div style="font-size:6pt;white-space:nowrap;margin-left:25px;width:100%; color: #0088aa;">
                            <i>${title}</i>
                            <span style="font-size: 6pt;display:inline-block;float:right;margin-right:25px;">
                                <span class="pageNumber"></span>/<span class="totalPages"></span>
                            </span>
                        </div>`
    });
    await browser.close();
}

const _askAI = async (prompt) => {
    AEvent.emit('translation.start', {message: prompt});
    const completion = await global.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: 'user',
                content: prompt,
                name: 'guth',
            }
        ]
    });
    AEvent.emit('translation.complete', {message: prompt});
    return completion.choices[0].message.content;
}
