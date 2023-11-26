const express = require('express');
const router = express.Router();

// Controllers
const JokeController = require('../controllers/jokes');

router.get('/', JokeController.jokes_get_all);

router.post('/', JokeController.jokes_create_joke);

router.get('/:jokeId', JokeController.jokes_get_joke);

router.delete('/:jokeId', JokeController.jokes_delete_joke);

module.exports = router;