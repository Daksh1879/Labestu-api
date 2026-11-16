const mongoose = require('mongoose');
const ScanSchema = new mongoose.Schema(

    {
        category: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending'
        },

        createdBy:{
             type: mongoose.Schema.Types.ObjectId,
            ref: 'Officer',
            required: true

        },
       imagePath: {
    type: String,
    required: true
        },
        extractedText: {
    type: String,
    default: ''
},
extractedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
}
    },
    {
        timestamps: true
    }

)



module.exports = mongoose.model('Scan', ScanSchema);