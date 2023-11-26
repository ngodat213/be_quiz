const mongoose = require('mongoose');
// Models
const Vote = require('../models/vote');
const Joke = require('../models/joke');

exports.votes_get_all = (req, res, next) => {
    Vote.find()
    .select('joke selection _id')
    .populate('joke', 'text')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    joke: doc.joke,
                    selection: doc.selection,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/votes/' + doc._id,
                    }
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

exports.votes_create_vote = (req, res, next) => {
    Joke.findById(req.body.jokeId)
        .then(joke => {
            if(!joke)
                return res.status(404).json({
                    message: "Product not found",
                });

            const vote = new Vote({
                _id: new mongoose.Types.ObjectId(),
                joke: req.body.jokeId,
                selection: req.body.selection,
            });
            return vote.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Create vote successfully!",
                createOrder: {
                    _id: result._id,
                    note: result.joke,
                    selection: result.selection,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/votes/' + result._id,
                    }
                },
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.votes_get_vote = (req, res, next) => {
    Vote.findById(req.params.orderId)
    .select('joke selection _id')
    .populate('joke', 'text')
    .exec()
    .then(vote => {
        console.log("From database", vote);
        if(vote){
            res.status(200).json({
                vote: vote,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/votes/',
                }
            });
        }else{
            res.status(404).json({message: 'Order not found'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}