const path = require('path');
const fs = require('fs');

module.exports = {
    friendlyName: 'getImage',
    description: 'Get the People that match',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        encode: {
            description: "Encoding to return the image. base64 is the only option. If it is not specified then the file name is returned.",
            type: 'string',
            required: false,
        }
    },

    exits: {
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let podcast = obj.podcast;
        let edir = path.resolve(podcast.baseDirectory);
        let gpath = path.resolve(`${edir}/guests/${obj.name.replace(/\s/g,'-').replace(/\./g,'-')}`);
        let retval ="";
        if(obj.thumbnail) {
               retval = path.resolve(`${gpath}/${obj.thumbnail}`);
        }
        if(inputs?.encode) {
            if(fs.existsSync(retval)) {
                let imageString = fs.readFileSync(retval, inputs.encode);
                let ext = path.extname(retval).replace('.', '');
                retval = `data:image/${ext};${inputs.encode},${imageString}`;
            } else {
                retval ='';
            }
        }
        return retval;
    }
};
