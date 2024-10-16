const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }]
});

module.exports = mongoose.model('Student', studentSchema);