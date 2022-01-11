const express = require('express');
const controller = require('../controllers/connectionController');
const { isLoggedIn, isAuthor } = require("../middlewares/auth")
const { validateId } = require("../middlewares/validator");

const router = express.Router();

// create
router.get('/create', isLoggedIn, controller.new);

router.post('/', isLoggedIn, controller.create);

// fetch
router.get('/', controller.index);

router.get('/:id', validateId, controller.show);

// update
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

router.put('/:id', validateId, isLoggedIn, isAuthor, controller.update);

// delete
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);


module.exports = router;