const express = require('express');
const controller = require('../controllers/rsvpController');
const { isLoggedIn, isCreator, isRsvpCreator } = require("../middlewares/auth")
const { validateId, validateRSVP, validateResult } = require("../middlewares/validator");

const router = express.Router();

router.put('/:id/edit', validateId, validateRSVP, validateResult, isLoggedIn, isCreator, controller.rsvpUpdate);

router.delete('/:id/delete', validateId, isLoggedIn, isRsvpCreator, controller.rsvpDelete);


module.exports = router;