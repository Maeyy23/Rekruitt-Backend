const express = require("express");
const userControllers = require("../controllers/user.controllers");
const userValidation = require("../middlewares/validations/user.validations");
const authmiddleware = require("../middlewares/auth")
const router = express.Router();

router.post("/signup-applicant", userValidation, userControllers.signUpApplicantController);
router.post("/signup-recruiter", userValidation, userControllers.signUpRecruiterController);
router.post("/login", userControllers.loginController);
router.post("/forgot-password", userControllers.forgotPasswordController);
router.post("/reset-password", userControllers.resetPasswordController);

router.put("/profileUpdate", userControllers.recruiterProfileController);
router.put("/profileUpdate", userControllers.applicantProfileController);
router.post('/postJob', authmiddleware.authenticate, userControllers.postJob);
router.get('/searchJobs',authmiddleware.authenticate, userControllers.searchJob);
router.post('/applyJob',authmiddleware.authenticate, userControllers.applyJob);

module.exports = router;