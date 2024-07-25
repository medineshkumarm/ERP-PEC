const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    qualifications: {
        type: String,
    },
    designation: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    contactNumber: {
        type: String,
        maxLength: 10,
    },
    scopusLink: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please enter a valid URL'],
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
});

module.exports = mongoose.model('Faculty', facultySchema);
