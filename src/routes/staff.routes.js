const staffController = require("../controllers/staff.controllers.js");
const express = require("express");
const router = express.Router();

router.post("/staff-signup", staffController.staffSignUpController);

module.exports = router;
