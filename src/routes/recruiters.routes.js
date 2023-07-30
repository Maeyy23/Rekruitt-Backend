const express = require('express');
const recruiterController = require('../controllers/recruiters.controllers');
const router = express.Router();
const recruitersValidation = require('../middlewares/validations/recruiters.validations');


router.post('/createRecruiter', recruitersValidation, recruiterController.createRecruiter);
router.post('/login', recruiterController.login);
router.post('/forgot-password',  recruiterController.forgotPassword);
router.post('/reset-password', recruiterController.resetPassword);
router.post('/postJob',  recruiterController.postJob);


module.exports = router

