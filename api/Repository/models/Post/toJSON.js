const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'toJSON',
    description: 'Convert to a JSON',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },

    exits: {
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let tempObj = { state: obj.state };
        for(let aname in obj._attributes) {
            let attr = obj._attributes[aname];
            tempObj[aname] = attr;
        }
        for(let aname in obj._associations) {
            let assoc = obj._associations[aname];
            if(assoc.id) {
                tempObj[aname] = assoc.id;
            }
        }
        return tempObj;
    }
}

