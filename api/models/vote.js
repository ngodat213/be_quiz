const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    joke: {type: mongoose.Schema.Types.ObjectId, ref: 'Joke', required: true},
    selection: {type: Boolean, required: true},
});

module.exports = mongoose.model('Vote', voteSchema);