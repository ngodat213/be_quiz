const express = require('express');
const router = express.Router();

// Controllers
const VoteController = require('../controllers/votes');

router.get('/',VoteController.votes_get_all);

router.post('/',VoteController.votes_create_vote);

router.get('/:voteId',VoteController.votes_get_vote);

module.exports = router;