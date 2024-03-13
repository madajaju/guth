
module.exports = {
    friendlyName: 'post',
    description: 'Post a Post',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        postedDate: {
            description: "Date the post was posted",
            type: "string"
        }
    },

    exits: {
        json: (obj) => { return obj.toJSON();},
    },

    fn: function (obj, inputs, env) {
        let now = new Date();
        obj.postedDate = inputs.postedDate || now;
        obj.episode.saveMe();
    }
};
