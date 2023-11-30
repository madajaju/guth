module.exports = {
    friendlyName: 'authorize',
    description: 'Authorize Channel',
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
        return {message:'Completed'};
    }
};
