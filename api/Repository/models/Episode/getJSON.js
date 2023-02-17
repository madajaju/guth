const path = require('path');

module.exports = {
    friendlyName: 'getJSON',
    description: 'Convert to a JSON',
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
        // inputs contains the obj for the this method.
        let tempObj = { state: obj.state };
        for(let aname in obj._attributes) {
            let attr = obj._attributes[aname];
            tempObj[aname] = attr;
        }
        // Guests
        tempObj.guests = [];
        for(let gname in obj.guests) {
            tempObj.guests.push(obj.guests[gname].name);
        }
        // Artifacts
        tempObj.artifacts = {};
        for(let aname in obj.artifacts) {
            let art = obj.artifacts[aname];
            tempObj.artifacts[aname] = {};
            for(let atname in art._attributes) {
                tempObj.artifacts[aname][atname]= art._attributes[atname];
            }
            tempObj.artifacts[aname].artType = art.artType.name;
        }
        // Assets
        tempObj.assets = {};
        for(let aname in obj.assets) {
            let asset = obj.assets[aname];
            tempObj.assets[aname] = {};
            for(let asname in asset._attributes) {
                tempObj.assets[aname][asname] = asset._attributes[asname];
            }

        }

        return tempObj;
    }
};

