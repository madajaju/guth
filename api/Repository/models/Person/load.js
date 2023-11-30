const path = require('path');
const fs = require('fs');
// const YAML = require('yaml');

module.exports = {
    friendlyName: 'load',
    description: 'Load the Person',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        podcast : {
            description: 'Podcast of the person to load',
            type: 'string',
            required: true
        },
        name: {
            description: 'Name of the person to load',
            type: 'string',
            required: true
        },
    },
    exits: {
    },
    fn: function (obj, inputs, env) {
        let personDirectory = "";
        if(inputs.podcast && inputs.name) {
            let dirname = inputs.podcast.baseDirectory;
            let name = inputs.name.replaceAll(/\s/g, '-');
            personDirectory = dirname + '/guests/' + name;
        }
        let retval = uploadGuest(personDirectory);
        return retval;
    }
};

const uploadGuest = (baseDir) => {
    let adir = path.resolve(baseDir);
    if(!fs.existsSync(adir)) {
        console.error("Person does not exist in the directory", baseDir);
        return;
    }
    let apath = path.resolve(`${adir}/index.js`);
    if(!fs.existsSync(apath)) {
        console.error("Could not find the guest file:", apath);
        return;
    }
    let person = require(apath);
    person.baseDirectory = baseDir;
    let retval = loadPerson(person);
    return retval;

}

const loadPerson = (person) => {
    let pObj = new Person({name: person.name});
    pObj.name = person.name;
    pObj.email = person.email;
    pObj.bio = person.bio;
    pObj.thumbnail = person.thumbnail;

    let bioFile = person.baseDirectory + '/'  + person.bio;
    if(!fs.existsSync(bioFile)) {
        fs.writeFileSync(bioFile, '');
    }
    pObj.bio = fs.readFileSync(bioFile,'utf-8');
    if(pObj.bio.length > 0) {
        console.log("Bio Found");
    }
    // Add Socials
    for(let sname in person.socials) {
        let soc = new SocialHandle({stype: sname, name: person.socials[sname]});
        pObj.addToSocials(soc);
    }
    return pObj;
}
