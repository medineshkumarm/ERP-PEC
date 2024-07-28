const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    sender: {
        type: String,
    },
    notice: {
        type: String,
    },
    date: {
        type: Date,
    },
    document: {
        type: String, // Stores the file path or URL
        required: false, // Not required if no document is uploaded
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('notice', noticeSchema);

 
