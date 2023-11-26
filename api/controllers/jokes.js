const mongoose = require('mongoose');

const Joke = require('../models/joke');

exports.jokes_get_all = (req, res, next) => {
    Joke.find()
    .select('text _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            jokes: docs.map(doc => {
                return {
                    text: doc.text,
                    _id: doc._id,
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.jokes_create_joke = (req, res, next) => {
    const joke = new Joke({
        _id: new mongoose.Types.ObjectId(),
        text: req.body.text,
    });
    joke
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Create stored",
            createJoke: {
                text: result.text,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/jokes/' + result._id,
                }
            },
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

exports.jokes_get_joke = (req, res, next) => {
    const id = req.params.jokeId;
    Joke.findById(id)
    .select('text _id')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc){
            res.status(200).json({
                joke: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/jokes/',
                }
            });
        }else{
            res.status(404).json({message: 'No valid entry found for provided ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.jokes_delete_joke = (req, res, next) => {
    const id = req.params.jokeId;
    Joke.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product deleted",
            request: {
                type: "GET",
                url: 'http://localhost:3000/jokes/' + id,
                body: {joke: 'String'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}