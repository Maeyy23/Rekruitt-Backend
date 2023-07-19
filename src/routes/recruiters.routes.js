const express = require('express');
const recruiterController = require('../controllers/recruiters.controllers');
const router = express.Router();
const recruitersValidation = require('../middlewares/validations/recruiters.validations');


router.post('/createRecruiter', recruitersValidation, recruiterController.createRecruiter);
router.post('/login', recruiterController.login);

module.exports = router

