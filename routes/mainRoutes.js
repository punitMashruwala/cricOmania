const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();

router.get('/', controller.home);
router.get('/home', controller.home);
router.get('/contact', controller.contact);
router.get('/aboutus', controller.aboutUs);
router.get('/error', controller.error);


module.exports = router;