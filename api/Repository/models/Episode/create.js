const path = require('path');

module.exports = {
    friendlyName: 'create',
    description: 'Description of the action',
    static: true, // True is for Class methods. False is for object based.
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
        // inputs contains the obj for the this method.
        obj.name = inputs.name;
        if(inputs.file) {
            create(obj, inputs.file);
        } else {
            create(obj, inputs);
        }
        return obj;
    }
};

function create(obj, inputs) {
    obj.title = inputs.title;
    obj.summary = inputs.summary;
    obj.meta = inputs.meta;
    obj.notes = inputs.notes;
    obj.tagline = inputs.tagline;
    obj.releaseDate = inputs.releaseDate;
    obj.createdDate = new Date();
    obj._state = inputs.state;
    for(let i in inputs.tags) {
        let tname = inputs.tags[i];
        if(typeof tname === 'object') {
            tname = tname.text;
        }
        let tag = new Tag({name:tname}); // Tags are unique by name.
        tag.addToEpisodes(obj);
        obj.addToTags(tag);
    }
    for(let i in inputs.solutions ) {
        let sname = inputs.solutions[i];
        if(typeof sname === 'object') {
            sname = sname.text;
        }
        let solution = new Solution({name: sname});
        obj.addToSolutions(solution);
        solution.addToEpisodes(obj);
    }
    for(let i in inputs.products ) {
        let pname = inputs.products[i];
        if(typeof pname === 'object') {
            pname = pname.text;
        }
        let product = new Product({name: pname});
        obj.addToProducts(product);
        product.addToEpisodes(obj);
    }
    for(let aname in inputs.artifacts ) {
        let artifact = inputs.artifacts[aname];
        obj.addToArtifacts({name: aname, url: artifact.url, artType: artifact.type, ext: artifact.ext});
    }
    for(let i in inputs.guests) {
        // Need to check for an object instead of a name. If tne object is there
        // then check the id. Grab the inputs.guests[i].text
        let pname = inputs.guests[i];
        if (typeof pname === 'object') {
            pname = pname.text;
        }
        let person = Person.find({name: pname});
        if (!person) {
            person = new Person({name: pname});
        }
        obj.addToGuests(person);
        person.addToEpisodes(obj);
    }

    for(let aname in inputs.assets) {
       let asset = inputs.assets[aname];
       asset.name = aname;
       asset.episode = obj;
       obj.addToAssets(asset);
    }

}
