const express = require('express');
const router = express.Router()
const applicantValidation = require('../middlewares/validations/applicant.validations');
const applicantController = require('../controllers/applicants.controllers');


router.post('/createApplicant', applicantValidation, applicantController.createApplicant);
router.post('/login', applicantController.login);

module.exports = router;
