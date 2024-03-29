
module.exports = {
    friendlyName: 'schedule',
    description: 'Schedule a Post',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        scheduledDate: {
            description: "Scheduled Date",
            type: 'string'
        }
    },

    exits: {
        json: (obj) => { return obj.toJSON();},
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        obj.scheduledDate = inputs.scheduledDate;
        obj.episode.saveMe();
    }
};
