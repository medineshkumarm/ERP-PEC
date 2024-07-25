const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: Number,
        unique: true,
    },
    studentName: {
        type: String,
        minLength: 3,
    },
    gender: {
        type: String,
    },
    year: {
        type: Number,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    parentName: {
        type: String,
        required: true,
        minLength: 3,
    },
    address: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
    },
    contactNumber: {
        type: String,
    },
    parentContactNumber: {
        type: String,
    },
    studentEmail: {
        type: String,
        unique: true,
        minLength: 4,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    studentDocs: {
        type: [String], // Array of document URLs or paths
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
});

module.exports = mongoose.model('student', studentSchema);
