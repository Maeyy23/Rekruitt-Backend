const express = require('express');
const userControllers = require('../controllers/user.controller');
const router = express.Router()

router.post('/signup/applicants', userControllers.signUpApplicantController);
router.post('/signup/recruiters', userControllers.signUpRecruiterController);
router.post('/login', userControllers.loginController);

module.exports = router;