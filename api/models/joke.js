const mongoose = require('mongoose');

const jokeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: {type: String, required: true},
});

module.exports = mongoose.model('Joke', jokeSchema);