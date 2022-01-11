const express = require('express');
const controller = require('../controllers/scheduleController');
const { isLoggedIn, isAuthor } = require("../middlewares/auth")
const { validateId, validateSchedule, validateRSVP, validateResult } = require("../middlewares/validator");

const router = express.Router();

// create
router.get('/create', isLoggedIn, controller.new);

router.post('/', isLoggedIn, validateSchedule, validateResult, controller.create);

// fetch
router.get('/', controller.index);

router.get('/:id', validateId, controller.show);

// update
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

router.put('/:id', validateId, isLoggedIn, isAuthor, validateSchedule, validateResult, controller.update);

// delete
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);


module.exports = router;