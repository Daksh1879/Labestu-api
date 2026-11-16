const mongoose = require('mongoose');

const OfficerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
            password: {
            type: String,
            required: true,
            trim: true
        },
        role : {
            type: String,
            required: true,
            default: 'Inspector',
            enum:['Inspector','Reviewer']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Officer', OfficerSchema);