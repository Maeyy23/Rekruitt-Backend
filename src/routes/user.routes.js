const express = require("express");
const userControllers = require("../controllers/user.controller");
const router = express.Router();

router.post("/signup/applicants", userControllers.signUpApplicantController);
router.post("/signup/recruiters", userControllers.signUpRecruiterController);
router.post("/login", userControllers.loginController);
router.post("/forgot-password", userControllers.forgotPasswordController);
router.post("/reset-password", userControllers.resetPasswordController);
router.put("/update-profile", (req, res) => {
  res.send(userControllers.updateProfileController);
});
//,userControllers.updateProfileController);

module.exports = router;
